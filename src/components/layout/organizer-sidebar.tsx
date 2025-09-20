import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Eye, 
  Users, 
  Award, 
  LogOut, 
  Wallet,
  Plus,
  BarChart3
} from 'lucide-react';
import { useWeb3 } from '@/contexts/Web3Context';

const menuItems = [
  {
    title: 'Create Event',
    url: '/organizer/create',
    icon: Plus,
  },
  {
    title: 'View Events',
    url: '/organizer/events',
    icon: Calendar,
  },
  {
    title: 'Attendance Table',
    url: '/organizer/attendance',
    icon: Users,
  },
  {
    title: 'Award Badges',
    url: '/organizer/badges',
    icon: Award,
  },
  {
    title: 'Analytics',
    url: '/organizer/analytics',
    icon: BarChart3,
  },
];

interface OrganizerSidebarProps {
  currentPath: string;
}

export const OrganizerSidebar: React.FC<OrganizerSidebarProps> = ({ currentPath }) => {
  const { account, disconnectWallet } = useWeb3();

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Event Organizer
            </h2>
            <p className="text-sm text-muted-foreground">Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border">
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
            <Wallet className="h-4 w-4 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Connected</p>
              <p className="text-sm font-mono truncate">
                {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not connected'}
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              Shardeum
            </Badge>
          </div>
          
          <Button
            onClick={disconnectWallet}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};