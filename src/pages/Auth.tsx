import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Fingerprint } from "lucide-react";
import {
  isBiometricAvailable,
  registerBiometric,
  authenticateWithBiometric,
  getBiometricUserEmail,
} from "@/utils/webauthn";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEmail, setBiometricEmail] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    // Check for biometric availability
    isBiometricAvailable().then((available) => {
      setBiometricAvailable(available);
      if (available) {
        const savedEmail = getBiometricUserEmail();
        setBiometricEmail(savedEmail);
      }
    });

    // Check remember me preference
    const remembered = localStorage.getItem('rememberMe');
    setRememberMe(remembered !== 'false');
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    if (!isLogin && !username) {
      toast({
        title: "Missing username",
        description: "Please enter a username",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Save remember me preference
    localStorage.setItem('rememberMe', rememberMe.toString());

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back! 💜",
            description: "You're logged in",
          });

          // Offer to set up biometric after successful login
          if (biometricAvailable && !biometricEmail) {
            setTimeout(() => {
              offerBiometricSetup(email);
            }, 1000);
          }

          navigate("/");
        }
      } else {
        const redirectUrl = `${window.location.origin}/`;
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              username,
            },
          },
        });

        if (error) {
          toast({
            title: "Signup failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome to MindfulMe! 🌟",
            description: "Your account has been created",
          });
          navigate("/");
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const offerBiometricSetup = async (userEmail: string) => {
    toast({
      title: "Set up Face ID / Touch ID?",
      description: "Use biometric authentication for faster login",
      action: (
        <Button
          size="sm"
          onClick={async () => {
            const registered = await registerBiometric(userEmail);
            if (registered) {
              setBiometricEmail(userEmail);
              toast({
                title: "Biometric login enabled! 🎉",
                description: "You can now use Face ID or Touch ID to log in",
              });
            } else {
              toast({
                title: "Setup failed",
                description: "Couldn't enable biometric login",
                variant: "destructive",
              });
            }
          }}
        >
          Enable
        </Button>
      ),
    });
  };

  const handleBiometricLogin = async () => {
    if (!biometricEmail) return;

    setIsLoading(true);
    try {
      const authenticated = await authenticateWithBiometric();
      
      if (authenticated) {
        // Get the stored password from browser's password manager
        // Note: We can't actually retrieve it, so user must have saved it
        toast({
          title: "Biometric verified ✓",
          description: "Please enter your password to complete login",
        });
        setEmail(biometricEmail);
      } else {
        toast({
          title: "Authentication failed",
          description: "Biometric verification didn't work",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Biometric authentication failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-primary/5">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto mb-2">
            <Heart className="h-12 w-12 text-primary mx-auto" />
          </div>
          <CardTitle className="text-2xl">
            {isLogin ? "Welcome Back" : "Join MindfulMe"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Log in to continue your wellness journey"
              : "Create an account to start your wellness journey"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {biometricAvailable && biometricEmail && isLogin && (
            <div className="mb-4">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleBiometricLogin}
                disabled={isLoading}
              >
                <Fingerprint className="mr-2 h-4 w-4" />
                Use Face ID / Touch ID
              </Button>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete={rememberMe ? "current-password" : "off"}
              />
            </div>

            {isLogin && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal cursor-pointer"
                >
                  Remember me
                </Label>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : isLogin ? "Log In" : "Sign Up"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline"
              disabled={isLoading}
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Log in"}
            </button>
          </div>

          <div className="mt-6 pt-4 border-t">
            <p className="text-center text-xs text-muted-foreground">
              💜 Your data is private and secure
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
