"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSave = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-[#1E293B] border border-[#2D3748]">
          <TabsTrigger value="profile" className="data-[state=active]:bg-[#2D3748]">
            Profile
          </TabsTrigger>
          <TabsTrigger value="account" className="data-[state=active]:bg-[#2D3748]">
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-[#2D3748]">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="wallet" className="data-[state=active]:bg-[#2D3748]">
            Wallet
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card className="bg-[#1E293B] border-[#2D3748]">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription className="text-gray-400">
                Update your profile information and how others see you on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-blue-600">JD</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="border-[#2D3748] hover:bg-[#2D3748]">
                    Change Avatar
                  </Button>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        defaultValue="John"
                        className="bg-[#0F172A] border-[#2D3748] focus-visible:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        defaultValue="Doe"
                        className="bg-[#0F172A] border-[#2D3748] focus-visible:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      rows={3}
                      className="w-full rounded-md bg-[#0F172A] border border-[#2D3748] p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue="Web3 enthusiast and blockchain developer."
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-[#2D3748] pt-4">
              <Button onClick={handleSave} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="mt-6 space-y-6">
          <Card className="bg-[#1E293B] border-[#2D3748]">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your account details and security preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="john@example.com"
                    className="bg-[#0F172A] border-[#2D3748] focus-visible:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                    className="bg-[#0F172A] border-[#2D3748] focus-visible:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      className="bg-[#0F172A] border-[#2D3748] focus-visible:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      className="bg-[#0F172A] border-[#2D3748] focus-visible:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-[#2D3748]" />

              <div>
                <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable 2FA</p>
                    <p className="text-sm text-gray-400">Add an extra layer of security to your account.</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-[#2D3748] pt-4">
              <Button onClick={handleSave} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card className="bg-[#1E293B] border-[#2D3748]">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription className="text-gray-400">
                Control how and when you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Course Updates</p>
                    <p className="text-sm text-gray-400">Receive notifications about course updates and new content.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator className="bg-[#2D3748]" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Certificates</p>
                    <p className="text-sm text-gray-400">Get notified when you earn a new certificate.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator className="bg-[#2D3748]" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Instructor Messages</p>
                    <p className="text-sm text-gray-400">Receive notifications when instructors send you messages.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator className="bg-[#2D3748]" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-gray-400">Receive promotional emails and special offers.</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-[#2D3748] pt-4">
              <Button onClick={handleSave} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="wallet" className="mt-6 space-y-6">
          <Card className="bg-[#1E293B] border-[#2D3748]">
            <CardHeader>
              <CardTitle>Wallet Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your connected wallets and blockchain preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-[#0F172A] rounded-lg border border-[#2D3748]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Connected Wallet</p>
                    <p className="text-sm text-gray-400 mt-1">0x1234...5678</p>
                  </div>
                  <Button variant="outline" className="border-[#2D3748] hover:bg-[#2D3748]">
                    Disconnect
                  </Button>
                </div>
              </div>

              <Separator className="bg-[#2D3748]" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Preferred Network</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#0F172A] rounded-lg border border-blue-600 flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center mb-2">
                      <span className="font-bold">ETH</span>
                    </div>
                    <p className="font-medium">Ethereum</p>
                    <p className="text-xs text-gray-400 mt-1">Mainnet</p>
                  </div>
                  <div className="p-4 bg-[#0F172A] rounded-lg border border-[#2D3748] flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-[#2D3748] flex items-center justify-center mb-2">
                      <span className="font-bold">POL</span>
                    </div>
                    <p className="font-medium">Polygon</p>
                    <p className="text-xs text-gray-400 mt-1">Mainnet</p>
                  </div>
                  <div className="p-4 bg-[#0F172A] rounded-lg border border-[#2D3748] flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-[#2D3748] flex items-center justify-center mb-2">
                      <span className="font-bold">BSC</span>
                    </div>
                    <p className="font-medium">Binance Smart Chain</p>
                    <p className="text-xs text-gray-400 mt-1">Mainnet</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-[#2D3748] pt-4">
              <Button onClick={handleSave} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

