import React, { useState } from "react"
import { Outlet, NavLink } from "react-router-dom"
import { Menu, Inbox, Calendar, Search, Plus, Bell } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev)

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      {/* Top Navigation Bar */}
      <header className="flex h-12 items-center justify-between border-b px-4 shrink-0 bg-primary/5">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          <div className="relative hidden sm:flex items-center">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search"
              className="h-8 w-64 pl-9 rounded-md bg-background/50 border-none focus-visible:ring-1 focus-visible:ring-primary/30 shadow-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bell className="h-5 w-5 text-muted-foreground" />
          </Button>
          <div className="h-8 w-8 rounded-full bg-muted overflow-hidden flex items-center justify-center text-xs font-medium cursor-pointer">
            US
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
            ${isSidebarOpen ? "w-64" : "w-0"}
            transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0 bg-muted/30 border-r
          `}
        >
          <div className="h-full w-64 overflow-y-auto p-2 py-4 flex flex-col gap-1">
            <nav className="flex flex-col gap-1">
              <NavLink
                to="/app/inbox"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground/80"
                  }`
                }
              >
                <Inbox className="h-4 w-4 text-blue-500" />
                Inbox
              </NavLink>
              <NavLink
                to="/app/today"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground/80"
                  }`
                }
              >
                <Calendar className="h-4 w-4 text-green-500" />
                Today
              </NavLink>
              <NavLink
                to="/app/upcoming"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground/80"
                  }`
                }
              >
                <Calendar className="h-4 w-4 text-purple-500" />
                Upcoming
              </NavLink>
            </nav>

            <div className="mt-8">
              <div className="px-3 text-xs font-semibold text-muted-foreground mb-2 flex items-center justify-between group cursor-pointer hover:text-foreground">
                <span>Projects</span>
                <Plus className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <nav className="flex flex-col gap-1">
                {/* Example Projects */}
                <NavLink
                  to="/app/projects/1"
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                      isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-foreground/80"
                    }`
                  }
                >
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Personal
                </NavLink>
                <NavLink
                  to="/app/projects/2"
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                      isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-foreground/80"
                    }`
                  }
                >
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  Work
                </NavLink>
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-background flex justify-center">
            <div className="w-full max-w-4xl p-6 lg:p-8">
                <Outlet />
            </div>
        </main>
      </div>
    </div>
  )
}
