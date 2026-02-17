import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  BarChart3,
  Palette,
  Loader2,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSettings, updateSettings, uploadImage, type Settings } from "@/lib/api";

const AdminSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: getSettings,
  });

  const updateM = useMutation({
    mutationFn: (data: Settings) => updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      toast.success("Settings saved!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleToggle = (key: string) => {
    const current = settings?.[key] === "true";
    updateM.mutate({ [key]: String(!current) });
  };

  // Track edit mode per field
  const [editingField, setEditingField] = useState<string | null>(null);

  const handleSave = (key: string, value?: string) => {
    const val = value !== undefined ? value : (document.getElementById(key) as HTMLInputElement).value;
    updateM.mutate({ [key]: val }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
        toast.success("Settings saved!");
        setEditingField(null); // lock the field after save
      },
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  const textFields = [
    { key: "siteName", label: "Site Name", placeholder: "LearnFlow" },
    { key: "siteDescription", label: "Site Description", placeholder: "Learn anything visually" },
  ];

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 mb-1">
            <SettingsIcon className="w-6 h-6 text-primary" />
            <h1 className="font-display text-2xl md:text-3xl font-bold">Settings</h1>
          </div>
          <p className="text-muted-foreground text-sm">Configure your platform settings</p>
        </div>

        <div className="space-y-6">
          {/* General */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-primary" />
                General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Logo Upload */}
              <div>
                <label className="text-sm font-medium mb-1 block">Site Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-secondary/50 flex items-center justify-center overflow-hidden border border-border">
                    {settings?.siteLogo ? (
                      <img src={settings.siteLogo} alt="Site Logo" className="w-full h-full object-contain" />
                    ) : (
                      <SettingsIcon className="w-8 h-8 text-muted-foreground/50" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const { url } = await uploadImage(file);
                            handleSave("siteLogo", url);
                          } catch (err: any) {
                            toast.error(err.message || "Failed to upload logo");
                          }
                        }
                      }}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended size: 64x64px. PNG or JPG.
                    </p>
                  </div>
                </div>
              </div>

              {textFields.map(({ key, label, placeholder }) => {
                const isEditing = editingField === key;
                return (
                  <div key={key}>
                    <label className="text-sm font-medium mb-1 block">{label}</label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue={settings?.[key] || ""}
                        id={key}
                        placeholder={placeholder}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted/50 cursor-not-allowed" : ""}
                      />
                      {isEditing ? (
                        <Button
                          variant="default"
                          onClick={() => handleSave(key)}
                          disabled={updateM.isPending}
                        >
                          Save
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => setEditingField(key)}
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Toggleable settings */}
          {[
            { key: "enableNotifications", label: "Notifications", desc: "Enable email and push notifications", icon: Bell },
            { key: "enableAnalytics", label: "Analytics", desc: "Track page views and user interactions", icon: BarChart3 },
            { key: "maintenanceMode", label: "Maintenance Mode", desc: "Show maintenance page to visitors", icon: Shield },
            { key: "darkModeDefault", label: "Default Dark Mode", desc: "Use dark mode as the default theme", icon: Palette },
          ].map(({ key, label, desc, icon: Icon }) => (
            <Card key={key}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground mr-2">
                    {settings?.[key] === "true" ? "Enabled" : "Disabled"}
                  </span>
                  <Switch
                    checked={settings?.[key] === "true"}
                    onCheckedChange={() => handleToggle(key)}
                    disabled={updateM.isPending}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminSettings;
