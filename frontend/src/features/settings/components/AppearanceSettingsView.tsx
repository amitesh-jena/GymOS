import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Sun, Moon, Droplets, Monitor } from 'lucide-react';
import { cn } from '@/utils/cn';

export const AppearanceSettingsView = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'light', label: 'Light', description: 'Clean and bright default theme', icon: Sun },
    { id: 'dark', label: 'Dark', description: 'Easy on the eyes in low light', icon: Moon },
    {
      id: 'tinted',
      label: 'Tinted',
      description: 'Subtle brand-colored background',
      icon: Droplets,
    },
    {
      id: 'monochrome',
      label: 'Monochrome',
      description: 'High contrast grey-scale',
      icon: Monitor,
    },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Appearance</h2>
        <p className="text-muted-foreground">Customize how GymOS looks on your device.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Theme Selection</CardTitle>
          <CardDescription>
            Choose your preferred interface theme. This setting is saved per device.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {themes.map((t) => {
              const Icon = t.icon;
              const isActive = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={cn(
                    'relative flex items-start gap-4 p-4 rounded-lg border-2 text-left transition-all',
                    isActive
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  )}
                  aria-pressed={isActive}
                >
                  <Icon
                    className={cn(
                      'w-6 h-6 mt-0.5',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                  <div>
                    <Label className="text-base font-semibold cursor-pointer">{t.label}</Label>
                    <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
