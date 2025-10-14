export interface NotificationSettings {
  enabled: boolean;
  frequency: 'low' | 'medium' | 'high'; // low=2/day, medium=4/day, high=6/day
  quietHoursStart: string; // HH:MM format
  quietHoursEnd: string; // HH:MM format
}

const defaultSettings: NotificationSettings = {
  enabled: true,
  frequency: 'medium',
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00'
};

export const getNotificationSettings = (): NotificationSettings => {
  const saved = localStorage.getItem('notificationSettings');
  return saved ? JSON.parse(saved) : defaultSettings;
};

export const saveNotificationSettings = (settings: NotificationSettings) => {
  localStorage.setItem('notificationSettings', JSON.stringify(settings));
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

const isQuietHours = (settings: NotificationSettings): boolean => {
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  const start = settings.quietHoursStart;
  const end = settings.quietHoursEnd;

  // Handle quiet hours that span midnight
  if (start > end) {
    return currentTime >= start || currentTime < end;
  }
  
  return currentTime >= start && currentTime < end;
};

const checkInMessages = [
  {
    title: "💜 How are you doing?",
    body: "Take a moment for a quick check-in. Your feelings matter."
  },
  {
    title: "🌟 Time for self-care",
    body: "Check in with yourself. How's your mood right now?"
  },
  {
    title: "✨ Checking in",
    body: "Let's see how you're feeling. A quick check-in helps track your progress."
  },
  {
    title: "💭 Moment of mindfulness",
    body: "Pause and check in. How are you really doing today?"
  },
  {
    title: "🫂 You matter",
    body: "Take a breath and check in with yourself. We're here for you."
  },
  {
    title: "🌈 Check-in reminder",
    body: "How's your day going? Let's do a quick mood check."
  }
];

export const showCheckInNotification = () => {
  const settings = getNotificationSettings();
  
  if (!settings.enabled || isQuietHours(settings)) {
    return;
  }

  if (Notification.permission === 'granted') {
    const message = checkInMessages[Math.floor(Math.random() * checkInMessages.length)];
    
    const notification = new Notification(message.title, {
      body: message.body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'check-in-reminder',
      requireInteraction: false,
      silent: false
    });

    notification.onclick = () => {
      window.focus();
      window.location.href = '/check-in';
      notification.close();
    };
  }
};

export const getNotificationIntervals = (frequency: 'low' | 'medium' | 'high'): number => {
  // Return interval in milliseconds
  const intervals = {
    low: 6 * 60 * 60 * 1000, // 6 hours = 2-3 times per day
    medium: 4 * 60 * 60 * 1000, // 4 hours = 4-5 times per day
    high: 2.5 * 60 * 60 * 1000 // 2.5 hours = 6-8 times per day
  };
  
  return intervals[frequency];
};

export const scheduleNextNotification = () => {
  const settings = getNotificationSettings();
  
  if (!settings.enabled) {
    return;
  }

  const interval = getNotificationIntervals(settings.frequency);
  
  // Clear any existing scheduled notification
  const existingTimeout = localStorage.getItem('notificationTimeout');
  if (existingTimeout) {
    clearTimeout(parseInt(existingTimeout));
  }

  // Schedule next notification
  const timeoutId = setTimeout(() => {
    showCheckInNotification();
    scheduleNextNotification(); // Schedule the next one
  }, interval);

  localStorage.setItem('notificationTimeout', timeoutId.toString());
};

export const initializeNotifications = async () => {
  const settings = getNotificationSettings();
  
  if (settings.enabled) {
    const hasPermission = await requestNotificationPermission();
    if (hasPermission) {
      scheduleNextNotification();
    }
  }
};
