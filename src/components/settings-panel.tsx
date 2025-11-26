
"use client";

import type { SettingsType } from "@/app/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetHeader, SheetTitle, SheetDescription, SheetContent } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { fonts } from "@/lib/fonts";
import { getTimezoneInfo } from "@/lib/timezone-details";
import { Trash2, Palette, Image as ImageIcon, Text, X, TimerOff, Building2, LayoutGrid, Layout, Upload } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useState, useMemo } from "react";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SettingsType;
  onSettingsChange: Dispatch<SetStateAction<SettingsType>>;
  allTimezones: string[];
}

const colorSwatches = ['#D4A274', '#C0C0C0', '#FFFFFF', '#FFD700', '#87CEEB'];
const COMPANY_NAME_MAX_LENGTH = 30;

export function SettingsPanel({ isOpen, onClose, settings, onSettingsChange, allTimezones }: SettingsPanelProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

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
      onSettingsChange(s => ({ ...s, locations: [...s.locations, newLocation] }));
      setSearchTerm(''); // Reset search after selection
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
    onSettingsChange(s => {
        const newLocations = s.locations.filter(loc => loc !== locationToRemove);
        return { ...s, locations: newLocations };
    });
  };

  const handleImageUpload = (field: 'wallpaper' | 'companyLogo') => (event: React.ChangeEvent<HTMLInputElement>) => {
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
        onSettingsChange(s => ({ ...s, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
        toast({
            variant: "destructive",
            title: "Invalid File Type",
            description: "Please upload a PNG or JPG image.",
        });
    }
    // Reset file input
    event.target.value = '';
  };

  const availableTimezones = useMemo(() => {
    const filtered = allTimezones.filter(tz => !settings.locations.includes(tz));
    if (!searchTerm) return filtered;
    return filtered.filter(tz => tz.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [settings.locations, searchTerm, allTimezones]);


  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-[320px] sm:w-[400px] bg-background/95 backdrop-blur-sm">
            <SheetHeader>
                <SheetTitle>Settings</SheetTitle>
                <SheetDescription>Customize your countdown experience.</SheetDescription>
            </SheetHeader>
            <Separator className="my-4" />
            <ScrollArea className="h-[calc(100%-80px)] pr-4">
                <div className="space-y-6">

                <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2"><Building2 className="h-5 w-5"/> Branding</h3>
                    <div className="space-y-4">
                    <div>
                        <Label>Company Name</Label>
                        <Input
                            value={settings.companyName}
                            onChange={(e) => {
                                if (e.target.value.length <= COMPANY_NAME_MAX_LENGTH) {
                                    onSettingsChange(s => ({...s, companyName: e.target.value}));
                                }
                            }}
                            placeholder="Your Company Name"
                            maxLength={COMPANY_NAME_MAX_LENGTH}
                        />
                        <p className="text-xs text-muted-foreground mt-1">{settings.companyName.length} / {COMPANY_NAME_MAX_LENGTH}</p>
                    </div>
                    <div>
                        <Label>Company Logo</Label>
                        <Label htmlFor="logo-upload" className="mt-1 group flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium rounded-md border border-input bg-transparent hover:bg-accent hover:text-accent-foreground cursor-pointer">
                            <Upload className="mr-2 h-4 w-4" />
                            <span>Upload Logo</span>
                        </Label>
                        <Input id="logo-upload" type="file" accept="image/png, image/jpeg" className="sr-only" onChange={handleImageUpload('companyLogo')} />
                        {settings.companyLogo && (
                             <div className="mt-2 relative w-fit mx-auto">
                                <Image src={settings.companyLogo} alt="Company Logo Preview" width={80} height={80} className="rounded-md object-contain border bg-secondary" />
                                <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => onSettingsChange(s => ({...s, companyLogo: null}))}>
                                    <X className="h-4 w-4"/>
                                </Button>
                            </div>
                        )}
                    </div>
                    </div>
                </div>

                <Separator />

                <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2"><Layout className="h-5 w-5"/> Display Mode</h3>
                    <RadioGroup
                        value={settings.displayMode}
                        onValueChange={(value: 'single' | 'multi') => onSettingsChange(s => ({...s, displayMode: value}))}
                        className="grid grid-cols-2 gap-4"
                    >
                        <div>
                            <RadioGroupItem value="single" id="single" className="peer sr-only" />
                            <Label htmlFor="single" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            <Layout className="mb-3 h-6 w-6" />
                            Single View
                            </Label>
                        </div>

                        <div>
                            <RadioGroupItem value="multi" id="multi" className="peer sr-only" />
                            <Label htmlFor="multi" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            <LayoutGrid className="mb-3 h-6 w-6" />
                            Multi View
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
                
                <Separator />
                
                <div>
                    <h3 className="text-lg font-medium mb-3">Locations</h3>
                    <div className="space-y-2">
                        {settings.locations.map(loc => {
                            const info = getTimezoneInfo(loc);
                            return (
                                <div key={loc} className="flex items-center justify-between bg-secondary p-2 rounded-md">
                                    <div className="flex items-center gap-2 truncate">
                                        {info.flag && <Image src={info.flag} alt="" width={20} height={15} className="rounded-sm" />}
                                        <div className="flex flex-col">
                                            <span className="text-sm truncate">{loc.replace(/_/g, ' ')}</span>
                                            <span className="text-xs text-muted-foreground">{info.gmt}</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => handleRemoveLocation(loc)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-3">
                        <Select onValueChange={handleAddLocation}>
                            <SelectTrigger className="flex-grow">
                                <SelectValue placeholder="Add a new location..." />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="p-2">
                                    <Input 
                                        placeholder="Search timezones..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full"
                                        onClick={(e) => e.stopPropagation()} // prevent select from closing
                                    />
                                </div>
                                <ScrollArea className="h-64">
                                {availableTimezones.map(tz => {
                                    const info = getTimezoneInfo(tz);
                                    return (
                                        <SelectItem key={tz} value={tz}>
                                            <div className="flex items-center gap-2">
                                                {info.flag && <Image src={info.flag} alt="" width={20} height={15} className="rounded-sm" />}
                                                <div className="flex flex-col">
                                                    <span>{tz.replace(/_/g, ' ')}</span>
                                                    <span className="text-xs text-muted-foreground">{info.gmt}</span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    )
                                })}
                                </ScrollArea>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                
                <Separator />
                
                <div className={settings.displayMode === 'multi' ? 'opacity-50 pointer-events-none' : ''}>
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2"><Text className="h-5 w-5"/> Title</h3>
                    <Input
                        value={settings.title}
                        onChange={(e) => onSettingsChange(s => ({...s, title: e.target.value}))}
                        placeholder="Countdown Title"
                        disabled={settings.displayMode === 'multi'}
                    />
                    {settings.displayMode === 'multi' && <p className="text-xs text-muted-foreground mt-1">Custom title is disabled in Multi View</p>}
                </div>

                <Separator />

                <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2"><Palette className="h-5 w-5"/> Appearance</h3>
                    <div className="space-y-4">
                    <div>
                        <Label>Font Style</Label>
                        <Select value={settings.fontClass} onValueChange={(value) => onSettingsChange(s => ({...s, fontClass: value}))}>
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
                            onValueChange={(value) => onSettingsChange(s => ({ ...s, fontSize: value[0] }))}
                            min={24}
                            max={200}
                            step={1}
                            className="mt-2"
                        />
                        {settings.displayMode === 'multi' && <p className="text-xs text-muted-foreground mt-1">Font size is auto-adjusted in Multi View</p>}
                    </div>
                    <div>
                        <Label>Font Color</Label>
                        <div className="flex gap-2 mt-2">
                            {colorSwatches.map(color => (
                                <button 
                                    key={color} 
                                    onClick={() => onSettingsChange(s => ({...s, fontColor: color}))}
                                    className="h-8 w-8 rounded-full border-2 transition-all"
                                    style={{ backgroundColor: color, borderColor: settings.fontColor === color ? 'hsl(var(--ring))' : 'transparent' }}
                                />
                            ))}
                            <Input type="color" value={settings.fontColor} onChange={(e) => onSettingsChange(s => ({...s, fontColor: e.target.value}))} className="h-8 w-10 p-1"/>
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
                            onCheckedChange={(checked) => onSettingsChange(s => ({...s, stopOnZero: checked}))}
                        />
                    </div>
                </div>

                <Separator />
                
                <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2"><ImageIcon className="h-5 w-5"/> Wallpaper</h3>
                    <div className="space-y-3">
                        <Label htmlFor="wallpaper-upload" className="group flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium rounded-md border border-input bg-transparent hover:bg-accent hover:text-accent-foreground cursor-pointer">
                           <Upload className="mr-2 h-4 w-4" />
                           <span>Upload Wallpaper</span>
                        </Label>
                        <Input id="wallpaper-upload" type="file" accept="image/png, image/jpeg" className="sr-only" onChange={handleImageUpload('wallpaper')} />

                        {settings.wallpaper && (
                            <div className="mt-2 relative w-fit mx-auto">
                                <Image src={settings.wallpaper} alt="Wallpaper Preview" width={160} height={90} className="rounded-md object-cover border bg-secondary" />
                                <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => onSettingsChange(s => ({...s, wallpaper: null}))}>
                                    <X className="h-4 w-4"/>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                </div>
            </ScrollArea>
        </SheetContent>
    </Sheet>
  );
}

    