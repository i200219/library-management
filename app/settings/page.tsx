"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

// Define supported languages
const supportedLocales = ['en', 'fr'] as const;
type SupportedLocale = typeof supportedLocales[number];

interface Settings {
  language: SupportedLocale;
  theme: string;
  notifications: {
    email: boolean;
    push: boolean;
  };
  accessibility: {
    fontSize: string;
    highContrast: boolean;
  };
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  
  // Get current locale from URL
  const currentLocale = pathname.split('/')[1] as SupportedLocale || 'en';
  const [settings, setSettings] = useState<Settings>({
    language: currentLocale,
    theme: theme || "dark",
    notifications: {
      email: true,
      push: true,
    },
    accessibility: {
      fontSize: "medium",
      highContrast: false,
    },
  });

  useEffect(() => {
    // Load user settings from storage
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings({
        ...parsedSettings,
        language: currentLocale // Ensure language matches current route
      });
    }
  }, [currentLocale]);

  const saveSettings = () => {
    localStorage.setItem("userSettings", JSON.stringify(settings));
    // Also update theme if changed
    if (settings.theme !== theme) {
      setTheme(settings.theme);
    }
    // Update language if changed
    if (settings.language !== currentLocale) {
      // Remove current locale prefix if exists
      const pathWithoutLocale = pathname.replace(`/${currentLocale}/`, '/');
      // Add new locale prefix
      const newPath = `/${settings.language}${pathWithoutLocale}`;
      router.push(newPath);
    }
  };

  return (
    <div className="min-h-screen bg-dark-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bebas-neue text-white mb-4">
            Settings
          </h1>
          <p className="text-light-100 max-w-2xl mx-auto">
            Customize your library experience
          </p>
        </div>

        <div className="space-y-8">
          {/* Language Settings */}
          <div className="bg-dark-300/80 backdrop-blur-md rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Language</h2>
            <div className="space-y-4">
              {supportedLocales.map((locale) => (
                <div key={locale} className="flex items-center gap-4">
                  <input
                    type="radio"
                    id={`lang-${locale}`}
                    name="language"
                    value={locale}
                    checked={settings.language === locale}
                    onChange={(e) => 
                      setSettings(prev => ({ ...prev, language: e.target.value as SupportedLocale }))
                    }
                    className="text-primary"
                  />
                  <label htmlFor={`lang-${locale}`} className="text-light-100">
                    {locale === 'en' ? 'English' : 'Français'}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Theme Settings */}
          <div className="bg-dark-300/80 backdrop-blur-md rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Theme</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  id="light"
                  name="theme"
                  value="light"
                  checked={settings.theme === "light"}
                  onChange={(e) => 
                    setSettings(prev => ({ ...prev, theme: e.target.value }))
                  }
                  className="text-primary"
                />
                <label htmlFor="light" className="text-light-100">Light Mode</label>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  id="dark"
                  name="theme"
                  value="dark"
                  checked={settings.theme === "dark"}
                  onChange={(e) => 
                    setSettings(prev => ({ ...prev, theme: e.target.value }))
                  }
                  className="text-primary"
                />
                <label htmlFor="dark" className="text-light-100">Dark Mode</label>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  id="system"
                  name="theme"
                  value="system"
                  checked={settings.theme === "system"}
                  onChange={(e) => 
                    setSettings(prev => ({ ...prev, theme: e.target.value }))
                  }
                  className="text-primary"
                />
                <label htmlFor="system" className="text-light-100">System Theme</label>
              </div>
            </div>
          </div>

          {/* Accessibility Settings */}
          <div className="bg-dark-300/80 backdrop-blur-md rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Accessibility</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="fontSize" className="block text-light-100 mb-2">
                  Font Size
                </label>
                <select
                  id="fontSize"
                  value={settings.accessibility.fontSize}
                  onChange={(e) => 
                    setSettings(prev => ({ ...prev, accessibility: { ...prev.accessibility, fontSize: e.target.value } }))
                  }
                  className="w-full px-4 py-2 bg-dark-200 text-light-100 rounded-lg"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id="highContrast"
                  checked={settings.accessibility.highContrast}
                  onChange={(e) => 
                    setSettings(prev => ({ ...prev, accessibility: { ...prev.accessibility, highContrast: e.target.checked } }))
                  }
                  className="text-primary"
                />
                <label htmlFor="highContrast" className="text-light-100">
                  High Contrast Mode
                </label>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-dark-300/80 backdrop-blur-md rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id="emailNotif"
                  checked={settings.notifications.email}
                  onChange={(e) => 
                    setSettings(prev => ({ ...prev, notifications: { ...prev.notifications, email: e.target.checked } }))
                  }
                  className="text-primary"
                />
                <label htmlFor="emailNotif" className="text-light-100">
                  Email Notifications
                </label>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id="pushNotif"
                  checked={settings.notifications.push}
                  onChange={(e) => 
                    setSettings(prev => ({ ...prev, notifications: { ...prev.notifications, push: e.target.checked } }))
                  }
                  className="text-primary"
                />
                <label htmlFor="pushNotif" className="text-light-100">
                  Push Notifications
                </label>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          {session?.user && (
            <div className="bg-dark-300/80 backdrop-blur-md rounded-2xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">Account</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-light-100">Username:</span>
                  <span className="font-medium text-white">{session.user.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-light-100">Email:</span>
                  <span className="font-medium text-white">{session.user.email}</span>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={saveSettings}
            className="w-full px-6 py-3 bg-primary text-dark-100 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
