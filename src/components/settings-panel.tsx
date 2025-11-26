
"use client";

import type { SettingsType } from "@/app/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { fonts } from "@/lib/fonts";
import { timezones } from "@/lib/timezones";
import { Trash2, Palette, Image as ImageIcon, Text, Type, X, TimerOff } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";

interface SettingsPanelProps {
  settings: SettingsType;
  setSettings: Dispatch<SetStateAction<SettingsType>>;
}

const colorSwatches = ['#D4A274', '#C0C0C0', '#FFFFFF', '#FFD700', '#87CEEB'];

export function SettingsPanel({ settings, setSettings }: SettingsPanelProps) {
  const { toast } = useToast();

  const handleAddLocation = (newLocation: string) => {
    if (newLocation && !settings.locations.includes(newLocation)) {
      if (settings.locations.length >= 5) {
        toast({
            variant: "destructive",
            title: "Location Limit Reached",
            description: "You can add a maximum of 5 locations. Please remove one to add another.",
        });
        return;
      }
      setSettings(s => ({ ...s, locations: [...s.locations, newLocation] }));
    }
  };

  const handleRemoveLocation = (locationToRemove: string) => {
    if (settings.locations.length <= 1) {
        toast({
            variant: "destructive",
            title: "Cannot Remove",
            description: "You must have at least one location.",
        });
        return;
    }
    setSettings(s => {
        const newLocations = s.locations.filter(loc => loc !== locationToRemove);
        const newCurrentLocation = s.currentLocation === locationToRemove ? newLocations[0] : s.currentLocation;
        return { ...s, locations: newLocations, currentLocation: newCurrentLocation };
    });
  };

  const handleWallpaperUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast({
                variant: "destructive",
                title: "Image Too Large",
                description: "Please upload an image smaller than 5MB.",
            });
            return;
        }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings(s => ({ ...s, wallpaper: reader.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
        toast({
            variant: "destructive",
            title: "Invalid File Type",
            description: "Please upload a PNG or JPG image.",
        });
    }
  };

  return (
    <>
      <SheetHeader>
        <SheetTitle>Settings</SheetTitle>
        <SheetDescription>Customize your countdown experience.</SheetDescription>
      </SheetHeader>
      <Separator className="my-4" />
      <ScrollArea className="h-[calc(100%-80px)] pr-4">
        <div className="space-y-6">
          
          <div>
            <h3 className="text-lg font-medium mb-3">Locations</h3>
            <div className="space-y-2">
                {settings.locations.map(loc => (
                    <div key={loc} className="flex items-center justify-between bg-secondary p-2 rounded-md">
                        <span className="text-sm truncate">{loc.replace('_', ' ')}</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRemoveLocation(loc)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
            <div className="flex gap-2 mt-3">
                <Select onValueChange={handleAddLocation}>
                    <SelectTrigger className="flex-grow">
                        <SelectValue placeholder="Add a new location..." />
                    </SelectTrigger>
                    <SelectContent>
                        {timezones.filter(tz => !settings.locations.includes(tz)).map(tz => (
                            <SelectItem key={tz} value={tz}>{tz.replace('_', ' ')}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2"><Text className="h-5 w-5"/> Title</h3>
             <Input
                value={settings.title}
                onChange={(e) => setSettings(s => ({...s, title: e.target.value}))}
                placeholder="Countdown Title"
             />
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2"><Palette className="h-5 w-5"/> Appearance</h3>
            <div className="space-y-4">
              <div>
                <Label>Font Style</Label>
                <Select value={settings.fontClass} onValueChange={(value) => setSettings(s => ({...s, fontClass: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a font" />
                  </SelectTrigger>
                  <SelectContent>
                    {fonts.map(font => (
                      <SelectItem key={font.name} value={font.className}>{font.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                 <div className="flex justify-between items-center">
                    <Label>Font Size</Label>
                    <span className="text-sm text-muted-foreground">{settings.fontSize}px</span>
                 </div>
                 <Slider
                    value={[settings.fontSize]}
                    onValueChange={(value) => setSettings(s => ({ ...s, fontSize: value[0] }))}
                    min={24}
                    max={200}
                    step={1}
                    className="mt-2"
                />
              </div>
              <div>
                <Label>Font Color</Label>
                <div className="flex gap-2 mt-2">
                    {colorSwatches.map(color => (
                        <button 
                            key={color} 
                            onClick={() => setSettings(s => ({...s, fontColor: color}))}
                            className="h-8 w-8 rounded-full border-2 transition-all"
                            style={{ backgroundColor: color, borderColor: settings.fontColor === color ? 'hsl(var(--ring))' : 'transparent' }}
                        />
                    ))}
                    <Input type="color" value={settings.fontColor} onChange={(e) => setSettings(s => ({...s, fontColor: e.target.value}))} className="h-8 w-10 p-1"/>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2"><TimerOff className="h-5 w-5"/> Behavior</h3>
            <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                    <Label>Stop timer on New Year</Label>
                    <p className="text-xs text-muted-foreground">
                        Show "Happy New Year" instead of counting up.
                    </p>
                </div>
                <Switch
                    checked={settings.stopOnZero}
                    onCheckedChange={(checked) => setSettings(s => ({...s, stopOnZero: checked}))}
                />
            </div>
          </div>

          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2"><ImageIcon className="h-5 w-5"/> Custom Wallpaper</h3>
            <div className="space-y-3">
                <Label htmlFor="wallpaper-upload" className="block cursor-pointer text-center p-4 border-2 border-dashed rounded-lg hover:bg-accent">
                    Click to upload a PNG/JPG
                </Label>
                <Input id="wallpaper-upload" type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleWallpaperUpload} />
                {settings.wallpaper && (
                     <Button variant="outline" className="w-full" onClick={() => setSettings(s => ({...s, wallpaper: null}))}>
                        <X className="mr-2 h-4 w-4"/> Remove Wallpaper
                    </Button>
                )}
            </div>
          </div>

        </div>
      </ScrollArea>
    </>
  );
}
