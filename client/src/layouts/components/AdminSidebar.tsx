import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Users,
  UserPlus,
  Settings,
  Shield,
  LogOut,
  ChevronUp,
  User2,
  Database,
  Activity,
  Package,
  Heart,
  ShoppingCart,
  FileText,
  Bell,
  CreditCard,
} from 'lucide-react';
import { useStaffCount } from '@/hooks/useStaffCount';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const AdminSidebar = () => {
  const location = useLocation();
  const { totalCount: staffCount, loading: staffLoading } = useStaffCount();

  const navigationGroups = [
    {
      label: 'Dashboard',
      items: [
        { name: 'Overview', href: '/admin', icon: BarChart3 },
        { name: 'Analytics', href: '/admin/analytics', icon: Activity },
        { name: 'Reports', href: '/admin/reports', icon: FileText },
      ],
    },
    {
      label: 'User Management',
      items: [
        {
          name: 'All Users',
          href: '/admin/users',
          icon: Users,
          badge: '2.8k',
        },
        {
          name: 'Staff Management',
          href: '/admin/staff',
          icon: UserPlus,
          badge: staffLoading ? '...' : staffCount > 999 ? '999+' : staffCount.toString(),
        },
        { name: 'Roles & Permissions', href: '/admin/roles', icon: Shield },
      ],
    },
    {
      label: 'Business Overview',
      items: [
        { name: 'Products', href: '/admin/products', icon: Package },
        { name: 'Pets', href: '/admin/pets', icon: Heart },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
        { name: 'Payments', href: '/admin/payments', icon: CreditCard },
      ],
    },
    {
      label: 'System',
      items: [
        { name: 'Settings', href: '/admin/settings', icon: Settings },
        { name: 'Database', href: '/admin/database', icon: Database },
        { name: 'Notifications', href: '/admin/notifications', icon: Bell },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-red-100">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-red-600 text-white">
                  <Shield className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Admin Portal</span>
                  <span className="text-muted-foreground truncate text-xs">
                    System Control
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navigationGroups.map((group, groupIndex) => (
          <SidebarGroup key={groupIndex}>
            <SidebarGroupLabel className="text-red-600">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;

                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.name}
                        className={
                          isActive
                            ? 'border border-red-600 bg-red-50 text-red-700'
                            : ''
                        }
                      >
                        <Link
                          to={item.href}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="size-4 shrink-0" />
                            <span>{item.name}</span>
                          </div>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className="bg-red-100 text-xs text-red-700"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/avatars/admin-avatar.png" alt="Admin" />
                    <AvatarFallback className="rounded-lg bg-red-100 text-red-600">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      Administrator
                    </span>
                    <span className="text-muted-foreground truncate text-xs">
                      admin@monito.com
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="right"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link to="/staff">
                    <Users className="mr-2 size-4" />
                    Switch to Staff Portal
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User2 className="mr-2 size-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 size-4" />
                  Admin Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 size-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AdminSidebar;
