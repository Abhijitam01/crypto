/**
 * Sidebar Component
 *
 * This client component renders the main navigation sidebar for the application.
 * It provides access to all major sections of the platform.
 *
 * Features:
 * - Collapsible sidebar with toggle
 * - Responsive design (mobile drawer, desktop sidebar)
 * - Active link highlighting
 * - Nested navigation groups
 * - User role-based menu items
 */

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Home,
  Award,
  Settings,
  Menu,
  ChevronDown,
  User,
  GraduationCap,
  Compass,
  Users,
  FileText,
  HelpCircle,
  Zap,
  Wallet,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useAuth } from "@/lib/auth-service"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>("dashboard")
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  // Update active section based on pathname
  useEffect(() => {
    if (pathname.startsWith("/dashboard")) setOpenSection("dashboard")
    else if (pathname.startsWith("/courses")) setOpenSection("courses")
    else if (pathname.startsWith("/certificates")) setOpenSection("certificates")
    else if (pathname.startsWith("/teach")) setOpenSection("teach")
    else if (pathname.startsWith("/profile")) setOpenSection("profile")
    else if (pathname.startsWith("/settings")) setOpenSection("settings")
  }, [pathname])

  const mainNavItems = [
    {
      name: "Dashboard",
      section: "dashboard",
      icon: Home,
      href: "/dashboard",
      subitems: [],
    },
    {
      name: "Explore",
      section: "courses",
      icon: Compass,
      href: "/courses",
      subitems: [
        { name: "All Courses", href: "/courses" },
        { name: "My Learning", href: "/courses/my-learning" },
        { name: "Learning Paths", href: "/courses/paths" },
        { name: "Saved Courses", href: "/courses/saved" },
      ],
    },
    {
      name: "Certificates",
      section: "certificates",
      icon: Award,
      href: "/certificates",
      subitems: [],
    },
    {
      name: "Community",
      section: "community",
      icon: Users,
      href: "/community",
      subitems: [
        { name: "Forums", href: "/community/forums" },
        { name: "Events", href: "/community/events" },
        { name: "Leaderboard", href: "/community/leaderboard" },
      ],
    },
    {
      name: "Resources",
      section: "resources",
      icon: FileText,
      href: "/resources",
      subitems: [
        { name: "Documentation", href: "/resources/docs" },
        { name: "Tutorials", href: "/resources/tutorials" },
        { name: "Blog", href: "/blog" },
      ],
    },
  ]

  // Instructor-specific navigation items
  const instructorNavItems = [
    {
      name: "Teach",
      section: "teach",
      icon: GraduationCap,
      href: "/teach",
      subitems: [
        { name: "Dashboard", href: "/teach" },
        { name: "My Courses", href: "/teach/courses" },
        { name: "Create Course", href: "/teach/courses/new" },
        { name: "Analytics", href: "/teach/analytics" },
        { name: "Earnings", href: "/teach/earnings" },
      ],
    },
  ]

  const secondaryNavItems = [
    { name: "Profile", section: "profile", href: "/profile", icon: User },
    { name: "Wallet", section: "wallet", href: "/wallet", icon: Wallet },
    { name: "Settings", section: "settings", href: "/settings", icon: Settings },
    { name: "Help & Support", section: "help", href: "/help", icon: HelpCircle },
  ]

  // Combine navigation items based on user role
  const navItems = [...mainNavItems, ...(user?.role === "instructor" ? instructorNavItems : [])]

  // Mobile sidebar
  const MobileSidebar = () => (
    <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-400 hover:text-white hover:bg-[#1E293B] fixed bottom-4 right-4 z-40 bg-gray-800 shadow-lg"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-[#0A101F] border-r border-[#1E293B] w-64">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-[#1E293B]">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Learn-to-Earn
              </span>
            </Link>
          </div>
          <ScrollArea className="flex-1 py-2">
            <nav className="flex flex-col gap-1 px-2">
              {navItems.map((item) => (
                <div key={item.name}>
                  {item.subitems.length > 0 ? (
                    <Collapsible
                      open={openSection === item.section}
                      onOpenChange={(open) => {
                        if (open) setOpenSection(item.section)
                        else if (openSection === item.section) setOpenSection(null)
                      }}
                      className="w-full"
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start text-white hover:bg-[#1E293B] h-10",
                            openSection === item.section ? "bg-[#1E293B]" : "",
                          )}
                        >
                          <item.icon className="h-5 w-5 mr-2" />
                          <span className="flex-1 text-left">{item.name}</span>
                          <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-9 pr-2">
                        {item.subitems.map((subitem) => (
                          <Link key={subitem.href} href={subitem.href} onClick={() => setIsMobileOpen(false)}>
                            <span
                              className={cn(
                                "flex items-center text-sm py-2 px-2 rounded-md hover:bg-[#1E293B] transition-colors",
                                pathname === subitem.href ? "text-blue-400" : "text-gray-400",
                              )}
                            >
                              {subitem.name}
                            </span>
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <Link href={item.href} onClick={() => setIsMobileOpen(false)}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-white hover:bg-[#1E293B] h-10",
                          pathname === item.href ? "bg-[#1E293B]" : "",
                        )}
                      >
                        <item.icon className="h-5 w-5 mr-2" />
                        <span>{item.name}</span>
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            <div className="mt-6 px-2">
              <div className="text-xs font-semibold text-gray-400 px-3 mb-2">ACCOUNT</div>
              <nav className="flex flex-col gap-1">
                {secondaryNavItems.map((item) => (
                  <Link key={item.name} href={item.href} onClick={() => setIsMobileOpen(false)}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-white hover:bg-[#1E293B] h-10",
                        pathname === item.href ? "bg-[#1E293B]" : "",
                      )}
                    >
                      <item.icon className="h-5 w-5 mr-2" />
                      <span>{item.name}</span>
                    </Button>
                  </Link>
                ))}
              </nav>
            </div>
          </ScrollArea>

          {!user?.role || user.role !== "instructor" ? (
            <div className="p-4 border-t border-[#1E293B]">
              <Link href="/teach/onboarding" onClick={() => setIsMobileOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Zap className="h-4 w-4 mr-2" />
                  Become an Instructor
                </Button>
              </Link>
            </div>
          ) : (
            <div className="p-4 border-t border-[#1E293B]">
              <div className="bg-[#1E293B] rounded-lg p-3 text-center">
                <p className="text-sm text-gray-400">Instructor Earnings</p>
                <p className="text-xl font-bold">$1,245.00</p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )

  // Desktop sidebar
  return (
    <>
      <MobileSidebar />

      <div
        className={cn(
          "bg-[#0A101F] text-white hidden md:flex flex-col border-r border-[#1E293B] transition-all duration-300 h-screen sticky top-0",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#1E293B]">
          {!collapsed && (
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Learn-to-Earn
              </span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn("text-white hover:bg-[#1E293B]", collapsed ? "mx-auto" : "ml-auto")}
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="flex flex-col gap-1 px-2">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.subitems.length > 0 ? (
                  <Collapsible
                    open={openSection === item.section && !collapsed}
                    onOpenChange={(open) => {
                      if (open) setOpenSection(item.section)
                      else if (openSection === item.section) setOpenSection(null)
                    }}
                    className="w-full"
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-white hover:bg-[#1E293B] h-10",
                          openSection === item.section ? "bg-[#1E293B]" : "",
                        )}
                      >
                        <item.icon className="h-5 w-5 mr-2" />
                        {!collapsed && (
                          <>
                            <span className="flex-1 text-left">{item.name}</span>
                            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                          </>
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    {!collapsed && (
                      <CollapsibleContent className="pl-9 pr-2">
                        {item.subitems.map((subitem) => (
                          <Link key={subitem.href} href={subitem.href}>
                            <span
                              className={cn(
                                "flex items-center text-sm py-2 px-2 rounded-md hover:bg-[#1E293B] transition-colors",
                                pathname === subitem.href ? "text-blue-400" : "text-gray-400",
                              )}
                            >
                              {subitem.name}
                            </span>
                          </Link>
                        ))}
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                ) : (
                  <Link href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-white hover:bg-[#1E293B] h-10",
                        pathname === item.href ? "bg-[#1E293B]" : "",
                      )}
                    >
                      <item.icon className="h-5 w-5 mr-2" />
                      {!collapsed && <span>{item.name}</span>}
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="mt-6 px-2">
            {!collapsed && <div className="text-xs font-semibold text-gray-400 px-3 mb-2">ACCOUNT</div>}
            <nav className="flex flex-col gap-1">
              {secondaryNavItems.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-white hover:bg-[#1E293B] h-10",
                      pathname === item.href ? "bg-[#1E293B]" : "",
                    )}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {!collapsed && <span>{item.name}</span>}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
        </ScrollArea>

        {(!collapsed && !user?.role) || (user?.role !== "instructor" && !collapsed) ? (
          <div className="p-4 border-t border-[#1E293B]">
            <Link href="/teach/onboarding">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Zap className="h-4 w-4 mr-2" />
                Become an Instructor
              </Button>
            </Link>
          </div>
        ) : user?.role === "instructor" && !collapsed ? (
          <div className="p-4 border-t border-[#1E293B]">
            <div className="bg-[#1E293B] rounded-lg p-3 text-center">
              <p className="text-sm text-gray-400">Instructor Earnings</p>
              <p className="text-xl font-bold">$1,245.00</p>
            </div>
          </div>
        ) : null}
      </div>
    </>
  )
}

