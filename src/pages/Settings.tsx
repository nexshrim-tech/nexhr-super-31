
import React, { useState } from 'react';
import { Layout } from "@/components/ui/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, User, Bell, Lock, Database, Globe, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ProfileSettings from "@/components/settings/ProfileSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import SystemSettings from "@/components/settings/SystemSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import PermissionSettings from "@/components/settings/PermissionSettings";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user } = useAuth();
  const { toast } = useToast();

  return (
    <Layout>
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="flex items-center mb-6">
          <SettingsIcon className="mr-2 h-6 w-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        
        <Separator className="mb-6" />
        
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="md:w-64 h-fit">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <TabsList className="grid grid-cols-1 h-auto bg-transparent w-full">
                <TabsTrigger
                  value="profile"
                  className={`justify-start px-4 py-3 ${activeTab === "profile" ? "bg-accent" : ""}`}
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className={`justify-start px-4 py-3 ${activeTab === "notifications" ? "bg-accent" : ""}`}
                  onClick={() => setActiveTab("notifications")}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className={`justify-start px-4 py-3 ${activeTab === "security" ? "bg-accent" : ""}`}
                  onClick={() => setActiveTab("security")}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger
                  value="system"
                  className={`justify-start px-4 py-3 ${activeTab === "system" ? "bg-accent" : ""}`}
                  onClick={() => setActiveTab("system")}
                >
                  <Database className="h-4 w-4 mr-2" />
                  System
                </TabsTrigger>
                <TabsTrigger
                  value="appearance"
                  className={`justify-start px-4 py-3 ${activeTab === "appearance" ? "bg-accent" : ""}`}
                  onClick={() => setActiveTab("appearance")}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger
                  value="permissions"
                  className={`justify-start px-4 py-3 ${activeTab === "permissions" ? "bg-accent" : ""}`}
                  onClick={() => setActiveTab("permissions")}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Permissions
                </TabsTrigger>
              </TabsList>
            </CardContent>
          </Card>
          
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="profile" className="mt-0">
                <ProfileSettings />
              </TabsContent>
              <TabsContent value="notifications" className="mt-0">
                <NotificationSettings />
              </TabsContent>
              <TabsContent value="security" className="mt-0">
                <SecuritySettings />
              </TabsContent>
              <TabsContent value="system" className="mt-0">
                <SystemSettings />
              </TabsContent>
              <TabsContent value="appearance" className="mt-0">
                <AppearanceSettings />
              </TabsContent>
              <TabsContent value="permissions" className="mt-0">
                <PermissionSettings />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
