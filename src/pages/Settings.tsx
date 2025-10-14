import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Bell, Clock, Moon, Sun, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import {
  getNotificationSettings,
  saveNotificationSettings,
  requestNotificationPermission,
  scheduleNextNotification,
  type NotificationSettings as NotificationSettingsType
} from "@/utils/notifications";

export default function Settings() {
  const [settings, setSettings] = useState<NotificationSettingsType>(getNotificationSettings());
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleToggleNotifications = async (enabled: boolean) => {
    if (enabled && notificationPermission !== 'granted') {
      const granted = await requestNotificationPermission();
      if (!granted) {
        toast.error("Please enable notifications in your browser settings");
        return;
      }
      setNotificationPermission('granted');
    }

    const newSettings = { ...settings, enabled };
    setSettings(newSettings);
    saveNotificationSettings(newSettings);
    
    if (enabled) {
      scheduleNextNotification();
      toast.success("Notifications enabled! You'll receive gentle reminders throughout the day");
    } else {
      toast.info("Notifications disabled");
    }
  };

  const handleFrequencyChange = (frequency: 'low' | 'medium' | 'high') => {
    const newSettings = { ...settings, frequency };
    setSettings(newSettings);
    saveNotificationSettings(newSettings);
    
    if (settings.enabled) {
      scheduleNextNotification();
    }

    const messages = {
      low: "You'll receive 2-3 check-in reminders per day",
      medium: "You'll receive 4-5 check-in reminders per day",
      high: "You'll receive 6-8 check-in reminders per day"
    };
    
    toast.success(messages[frequency]);
  };

  const handleQuietHoursChange = (field: 'quietHoursStart' | 'quietHoursEnd', value: string) => {
    const newSettings = { ...settings, [field]: value };
    setSettings(newSettings);
    saveNotificationSettings(newSettings);
    toast.success("Quiet hours updated");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Card>
        <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Settings</CardTitle>
          </div>
          <CardDescription>Customize your experience</CardDescription>
        </CardHeader>
      </Card>

      {/* Notification Settings */}
      <Card className="border-primary/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle>Check-In Notifications</CardTitle>
          </div>
          <CardDescription>
            Get gentle reminders to check in with yourself throughout the day
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="notifications" className="text-base font-medium">
                Enable Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive reminders to check your mood
              </p>
            </div>
            <Switch
              id="notifications"
              checked={settings.enabled}
              onCheckedChange={handleToggleNotifications}
            />
          </div>

          {settings.enabled && (
            <>
              {/* Frequency */}
              <div className="space-y-3">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Notification Frequency
                </Label>
                <div className="grid gap-3">
                  <Button
                    variant={settings.frequency === 'low' ? 'default' : 'outline'}
                    onClick={() => handleFrequencyChange('low')}
                    className="justify-start"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="text-left">
                        <div className="font-semibold">Low</div>
                        <div className="text-xs opacity-80">2-3 times per day</div>
                      </div>
                      {settings.frequency === 'low' && <Badge>Selected</Badge>}
                    </div>
                  </Button>

                  <Button
                    variant={settings.frequency === 'medium' ? 'default' : 'outline'}
                    onClick={() => handleFrequencyChange('medium')}
                    className="justify-start"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="text-left">
                        <div className="font-semibold">Medium (Recommended)</div>
                        <div className="text-xs opacity-80">4-5 times per day</div>
                      </div>
                      {settings.frequency === 'medium' && <Badge>Selected</Badge>}
                    </div>
                  </Button>

                  <Button
                    variant={settings.frequency === 'high' ? 'default' : 'outline'}
                    onClick={() => handleFrequencyChange('high')}
                    className="justify-start"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="text-left">
                        <div className="font-semibold">High</div>
                        <div className="text-xs opacity-80">6-8 times per day</div>
                      </div>
                      {settings.frequency === 'high' && <Badge>Selected</Badge>}
                    </div>
                  </Button>
                </div>
              </div>

              {/* Quiet Hours */}
              <div className="space-y-3">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  Quiet Hours
                </Label>
                <p className="text-sm text-muted-foreground">
                  No notifications during these hours
                </p>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="quietStart" className="text-sm flex items-center gap-2">
                      <Moon className="h-3 w-3" />
                      Start Time
                    </Label>
                    <input
                      id="quietStart"
                      type="time"
                      value={settings.quietHoursStart}
                      onChange={(e) => handleQuietHoursChange('quietHoursStart', e.target.value)}
                      className="w-full px-3 py-2 rounded-md border bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quietEnd" className="text-sm flex items-center gap-2">
                      <Sun className="h-3 w-3" />
                      End Time
                    </Label>
                    <input
                      id="quietEnd"
                      type="time"
                      value={settings.quietHoursEnd}
                      onChange={(e) => handleQuietHoursChange('quietHoursEnd', e.target.value)}
                      className="w-full px-3 py-2 rounded-md border bg-background"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {notificationPermission === 'denied' && (
            <Card className="bg-destructive/10 border-destructive/30">
              <CardContent className="pt-6">
                <p className="text-sm text-destructive">
                  Notifications are blocked. Please enable them in your browser settings to receive reminders.
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-3 text-center">🔒 Your Privacy</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• All your data is stored locally on your device</li>
            <li>• Notifications are handled by your browser, not our servers</li>
            <li>• We never see your journal entries or check-in data</li>
            <li>• You can clear your data anytime in your browser settings</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
