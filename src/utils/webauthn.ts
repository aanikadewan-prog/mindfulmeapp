// WebAuthn utilities for biometric authentication (Face ID, Touch ID, fingerprint)

export const isWebAuthnSupported = (): boolean => {
  return (
    window?.PublicKeyCredential !== undefined &&
    navigator?.credentials?.create !== undefined
  );
};

export const isBiometricAvailable = async (): Promise<boolean> => {
  if (!isWebAuthnSupported()) return false;
  
  try {
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return available;
  } catch {
    return false;
  }
};

export const registerBiometric = async (userEmail: string): Promise<string | null> => {
  try {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: {
          name: "MindfulMe",
          id: window.location.hostname,
        },
        user: {
          id: new TextEncoder().encode(userEmail),
          name: userEmail,
          displayName: userEmail.split('@')[0],
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" },  // ES256
          { alg: -257, type: "public-key" }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
        },
        timeout: 60000,
        attestation: "none",
      },
    }) as PublicKeyCredential;

    if (credential) {
      // Store credential ID for future use
      const credentialId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
      localStorage.setItem('biometric_credential_id', credentialId);
      localStorage.setItem('biometric_user_email', userEmail);
      return credentialId;
    }
    
    return null;
  } catch (error) {
    console.error('Biometric registration failed:', error);
    return null;
  }
};

export const authenticateWithBiometric = async (): Promise<boolean> => {
  try {
    const credentialId = localStorage.getItem('biometric_credential_id');
    if (!credentialId) return false;

    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const rawId = Uint8Array.from(atob(credentialId), c => c.charCodeAt(0));

    const credential = await navigator.credentials.get({
      publicKey: {
        challenge,
        allowCredentials: [{
          id: rawId,
          type: "public-key",
          transports: ["internal"],
        }],
        timeout: 60000,
        userVerification: "required",
      },
    });

    return credential !== null;
  } catch (error) {
    console.error('Biometric authentication failed:', error);
    return false;
  }
};

export const getBiometricUserEmail = (): string | null => {
  return localStorage.getItem('biometric_user_email');
};

export const clearBiometricData = (): void => {
  localStorage.removeItem('biometric_credential_id');
  localStorage.removeItem('biometric_user_email');
};
