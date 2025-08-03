"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Settings as SettingsIcon,
  Palette,
  Globe,
  Bell,
  Eye,
  User,
  Save,
  RotateCcw,
  Smartphone,
  Monitor,
  Sun,
  Moon
} from "lucide-react";
import "@/styles/settings.css";

// Define supported languages
const supportedLocales = ['en', 'fr'] as const;
type SupportedLocale = typeof supportedLocales[number];

interface Settings {
  language: SupportedLocale;
  theme: string;
  notifications: {
    email: boolean;
    push: boolean;
    bookReminders: boolean;
    systemUpdates: boolean;
  };
  accessibility: {
    fontSize: string;
    highContrast: boolean;
    reducedMotion: boolean;
  };
  privacy: {
    profileVisibility: boolean;
    activityTracking: boolean;
  };
}

const defaultSettings: Settings = {
  language: 'en',
  theme: "dark",
  notifications: {
    email: true,
    push: true,
    bookReminders: true,
    systemUpdates: false,
  },
  accessibility: {
    fontSize: "medium",
    highContrast: false,
    reducedMotion: false,
  },
  privacy: {
    profileVisibility: true,
    activityTracking: false,
  },
};

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { toast } = useToast();
  
  // Get current locale from URL
  const currentLocale = pathname.split('/')[1] as SupportedLocale || 'en';
  
  const [settings, setSettings] = useState<Settings>({
    ...defaultSettings,
    language: currentLocale,
    theme: theme || "dark",
  });
  
  const [originalSettings, setOriginalSettings] = useState<Settings>(settings);
  const [isLoading, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  useEffect(() => {
    // Load user settings from storage
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        const loadedSettings = {
          ...defaultSettings,
          ...parsedSettings,
          language: currentLocale // Ensure language matches current route
        };
        setSettings(loadedSettings);
        setOriginalSettings(loadedSettings);
      } catch (error) {
        console.error("Failed to parse saved settings:", error);
        toast({
          title: "Settings Error",
          description: "Failed to load saved settings. Using defaults.",
          variant: "destructive",
        });
      }
    }
  }, [currentLocale, toast]);

  useEffect(() => {
    // Check if settings have changed
    setHasChanges(JSON.stringify(settings) !== JSON.stringify(originalSettings));
  }, [settings, originalSettings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  const updateNestedSettings = (
    category: keyof Settings,
    updates: any
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] as any),
        ...updates
      }
    }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem("userSettings", JSON.stringify(settings));
      
      // Update theme if changed
      if (settings.theme !== theme) {
        setTheme(settings.theme);
      }
      
      // Update language if changed
      if (settings.language !== currentLocale) {
        const pathWithoutLocale = pathname.replace(`/${currentLocale}/`, '/');
        const newPath = `/${settings.language}${pathWithoutLocale}`;
        router.push(newPath);
      }
      
      setOriginalSettings(settings);
      
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast({
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = () => {
    setSettings({
      ...defaultSettings,
      language: currentLocale,
      theme: theme || "dark",
    });
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to defaults.",
    });
  };

  const discardChanges = () => {
    setSettings(originalSettings);
    toast({
      title: "Changes Discarded",
      description: "Your changes have been discarded.",
    });
  };

  const SettingsSection = ({
    icon: Icon,
    title,
    children
  }: {
    icon: React.ElementType,
    title: string,
    children: React.ReactNode
  }) => (
    <div className="settings-section">
      <div className="settings-section-header">
        <div className="settings-section-icon">
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        </div>
        <h2 className="settings-section-title">{title}</h2>
      </div>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );

  return (
    <div className={`settings-container ${isLoading ? 'settings-loading' : ''}`}>
      <div className="settings-content">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <SettingsIcon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bebas-neue text-white mb-2 sm:mb-4">
            Settings
          </h1>
          <p className="text-light-100 max-w-2xl mx-auto text-sm sm:text-base">
            Customize your library experience with personalized preferences
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* Language Settings */}
          <SettingsSection icon={Globe} title="Language & Region">
            <div className="space-y-1">
              {supportedLocales.map((locale) => (
                <div key={locale} className="settings-radio-container">
                  <div className="settings-radio-content">
                    <input
                      type="radio"
                      id={`lang-${locale}`}
                      name="language"
                      value={locale}
                      checked={settings.language === locale}
                      onChange={(e) =>
                        updateSettings({ language: e.target.value as SupportedLocale })
                      }
                      className="settings-radio-input"
                      disabled={isLoading}
                    />
                    <label htmlFor={`lang-${locale}`} className="settings-radio-label">
                      {locale === 'en' ? 'English' : 'Français'}
                    </label>
                  </div>
                  {locale === 'en' && (
                    <span className="settings-badge">
                      Default
                    </span>
                  )}
                </div>
              ))}
            </div>
          </SettingsSection>

          {/* Theme Settings */}
          <SettingsSection icon={Palette} title="Appearance">
            <div className="space-y-1">
              {[
                { value: "light", label: "Light Mode", icon: Sun },
                { value: "dark", label: "Dark Mode", icon: Moon },
                { value: "system", label: "System Theme", icon: Monitor }
              ].map(({ value, label, icon: ThemeIcon }) => (
                <div key={value} className="settings-radio-container">
                  <div className="settings-radio-content">
                    <input
                      type="radio"
                      id={value}
                      name="theme"
                      value={value}
                      checked={settings.theme === value}
                      onChange={(e) => updateSettings({ theme: e.target.value })}
                      className="settings-radio-input"
                      disabled={isLoading}
                    />
                    <ThemeIcon className="h-4 w-4 text-light-100" />
                    <label htmlFor={value} className="settings-radio-label">
                      {label}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </SettingsSection>

          {/* Accessibility Settings */}
          <SettingsSection icon={Eye} title="Accessibility">
            <div className="space-y-4">
              <div>
                <label htmlFor="fontSize" className="block text-sm sm:text-base text-light-100 mb-2">
                  Font Size
                </label>
                <select
                  id="fontSize"
                  value={settings.accessibility.fontSize}
                  onChange={(e) =>
                    updateNestedSettings('accessibility', { fontSize: e.target.value })
                  }
                  className="settings-select"
                  disabled={isLoading}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="extra-large">Extra Large</option>
                </select>
              </div>
              
              <Toggle
                id="highContrast"
                label="High Contrast Mode"
                description="Increase contrast for better visibility"
                checked={settings.accessibility.highContrast}
                onCheckedChange={(checked) =>
                  updateNestedSettings('accessibility', { highContrast: checked })
                }
                disabled={isLoading}
              />
              
              <Toggle
                id="reducedMotion"
                label="Reduce Motion"
                description="Minimize animations and transitions"
                checked={settings.accessibility.reducedMotion}
                onCheckedChange={(checked) =>
                  updateNestedSettings('accessibility', { reducedMotion: checked })
                }
                disabled={isLoading}
              />
            </div>
          </SettingsSection>

          {/* Notification Settings */}
          <SettingsSection icon={Bell} title="Notifications">
            <div className="space-y-1">
              <Toggle
                id="emailNotif"
                label="Email Notifications"
                description="Receive updates and reminders via email"
                checked={settings.notifications.email}
                onCheckedChange={(checked) =>
                  updateNestedSettings('notifications', { email: checked })
                }
                disabled={isLoading}
              />
              
              <Toggle
                id="pushNotif"
                label="Push Notifications"
                description="Get instant notifications on your device"
                checked={settings.notifications.push}
                onCheckedChange={(checked) =>
                  updateNestedSettings('notifications', { push: checked })
                }
                disabled={isLoading}
              />
              
              <Toggle
                id="bookReminders"
                label="Book Reminders"
                description="Reminders for due dates and reservations"
                checked={settings.notifications.bookReminders}
                onCheckedChange={(checked) =>
                  updateNestedSettings('notifications', { bookReminders: checked })
                }
                disabled={isLoading}
              />
              
              <Toggle
                id="systemUpdates"
                label="System Updates"
                description="Notifications about system maintenance and updates"
                checked={settings.notifications.systemUpdates}
                onCheckedChange={(checked) =>
                  updateNestedSettings('notifications', { systemUpdates: checked })
                }
                disabled={isLoading}
              />
            </div>
          </SettingsSection>

          {/* Privacy Settings */}
          <SettingsSection icon={User} title="Privacy">
            <div className="space-y-1">
              <Toggle
                id="profileVisibility"
                label="Profile Visibility"
                description="Allow others to see your reading activity"
                checked={settings.privacy.profileVisibility}
                onCheckedChange={(checked) =>
                  updateNestedSettings('privacy', { profileVisibility: checked })
                }
                disabled={isLoading}
              />
              
              <Toggle
                id="activityTracking"
                label="Activity Tracking"
                description="Help improve our services with usage analytics"
                checked={settings.privacy.activityTracking}
                onCheckedChange={(checked) =>
                  updateNestedSettings('privacy', { activityTracking: checked })
                }
                disabled={isLoading}
              />
            </div>
          </SettingsSection>

          {/* Account Settings */}
          {session?.user && (
            <SettingsSection icon={User} title="Account Information">
              <div className="space-y-1">
                <div className="settings-account-item">
                  <span className="settings-account-label">Username:</span>
                  <span className="settings-account-value">{session.user.name}</span>
                </div>
                <div className="settings-account-item">
                  <span className="settings-account-label">Email:</span>
                  <span className="settings-account-value">{session.user.email}</span>
                </div>
              </div>
            </SettingsSection>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <Button
              onClick={() => setShowSaveDialog(true)}
              disabled={!hasChanges || isLoading}
              className={`settings-button-primary ${isLoading ? 'settings-saving' : ''}`}
              size="lg"
            >
              <Save className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            
            {hasChanges && (
              <Button
                variant="outline"
                onClick={discardChanges}
                disabled={isLoading}
                className="settings-button-secondary"
                size="lg"
              >
                <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Discard Changes
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={() => setShowResetDialog(true)}
              disabled={isLoading}
              className="settings-button-secondary"
              size="lg"
            >
              <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        title="Save Settings"
        description="Are you sure you want to save these changes? Some changes may require a page refresh to take effect."
        confirmText="Save Changes"
        onConfirm={saveSettings}
      />

      <ConfirmationDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        title="Reset Settings"
        description="This will reset all settings to their default values. This action cannot be undone."
        confirmText="Reset Settings"
        onConfirm={resetSettings}
        variant="destructive"
      />
    </div>
  );
}
