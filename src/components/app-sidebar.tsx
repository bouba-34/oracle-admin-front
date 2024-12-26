import {Home,HardDriveDownload,Navigation,  SquareActivity, Cable, ShieldCheck, Users } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/",
        icon: Home,
    },
    {
        title: "User Management",
        url: "users",
        icon: Users,
    },
    {
        title: "Backup and Restore",
        url: "backup-and-restore",
        icon: HardDriveDownload,
    },
    {
        title: "Security",
        url: "security",
        icon: ShieldCheck,
    },
    {
        title: "Performance Monitoring",
        url: "monitoring",
        icon: SquareActivity,
    },
    {
        title: "Performance Optimization",
        url: "optimization",
        icon: Cable,
    },
    {
        title: "High availability",
        url: "availability",
        icon: Navigation,
    },
]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    {/*<SidebarGroupLabel>Oracle Administration</SidebarGroupLabel>*/}
                    <SidebarHeader className="border-b px-6 py-4">
                        <h2 className="text-lg font-semibold">Oracle Administration</h2>
                    </SidebarHeader>
                    <SidebarGroupContent className="px-4 py-2">
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
