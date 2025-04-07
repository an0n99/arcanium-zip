"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { useThemeContext } from "@/components/theme-provider"
import { Moon, Sun, Palette, Save, RefreshCw, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"

export default function HomeownerSettingsPage() {
  const { theme, setTheme } = useTheme()
  const { isVividMode, toggleVividMode } = useThemeContext()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    })
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
        </div>

        <Tabs defaultValue="appearance">
          <TabsList className="mb-6">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
                <CardDescription>Customize how RenovateEase looks and feels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Color Theme</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      className="flex items-center gap-2"
                      onClick={() => setTheme("light")}
                    >
                      <Sun className="h-5 w-5" />
                      Light
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      className="flex items-center gap-2"
                      onClick={() => setTheme("dark")}
                    >
                      <Moon className="h-5 w-5" />
                      Dark
                    </Button>
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      className="flex items-center gap-2"
                      onClick={() => setTheme("system")}
                    >
                      <RefreshCw className="h-5 w-5" />
                      System
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Vivid Mode</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="vivid-mode">Enable Vivid Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Adds colorful gradients and liquid effects to your interface
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Palette className={`h-5 w-5 ${isVividMode ? "text-primary" : "text-muted-foreground"}`} />
                      <Switch id="vivid-mode" checked={isVividMode} onCheckedChange={toggleVividMode} />
                    </div>
                  </div>

                  {isVividMode && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="overflow-hidden">
                        <div className="h-24 gradient-bg"></div>
                        <CardContent className="p-4">
                          <p className="text-sm font-medium">Gradient 1</p>
                        </CardContent>
                      </Card>
                      <Card className="overflow-hidden">
                        <div className="h-24 sidebar-gradient"></div>
                        <CardContent className="p-4">
                          <p className="text-sm font-medium">Gradient 2</p>
                        </CardContent>
                      </Card>
                      <Card className="overflow-hidden">
                        <div className="h-24 button-gradient"></div>
                        <CardContent className="p-4">
                          <p className="text-sm font-medium">Gradient 3</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings} className="ml-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your personal information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <User className="h-12 w-12 rounded-full bg-muted p-2" />
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto">
                    Change Photo
                  </Button>
                </div>

                <Separator />

                <p className="text-sm text-muted-foreground">
                  Profile settings will be fully implemented in a future update.
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings} className="ml-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Control how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates about your projects via email</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive real-time updates on your device</p>
                  </div>
                  <Switch id="push-notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="contractor-messages">Contractor Messages</Label>
                    <p className="text-sm text-muted-foreground">Get notified when contractors send you messages</p>
                  </div>
                  <Switch id="contractor-messages" defaultChecked />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings} className="ml-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control your data and privacy preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Privacy settings will be implemented in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

