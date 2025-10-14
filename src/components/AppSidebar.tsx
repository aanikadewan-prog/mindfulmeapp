import { Home, BookOpen, TrendingUp, Sparkles, Heart, MessageCircle, LogOut, Settings, Trophy } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Journal", url: "/journal", icon: BookOpen },
  { title: "Vent Space", url: "/vent", icon: MessageCircle },
  { title: "Progress", url: "/progress", icon: TrendingUp },
  { title: "Activities", url: "/activities", icon: Sparkles },
  { title: "Rewards", url: "/rewards", icon: Trophy },
  { title: "Clean Counter", url: "/clean", icon: Heart },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "See you soon! 💜",
        description: "You've been logged out",
      });
      navigate("/auth");
    }
  };

  return (
    <Sidebar className={open ? "w-60" : "w-16"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-semibold text-lg mb-2 cursor-pointer hover:text-primary/80 transition-colors" onClick={() => navigate("/")}>
            {open && "MindfulMe"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground font-medium shadow-sm"
                            : "bg-sidebar-accent/50 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all bg-sidebar-accent/50 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full"
                  >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    {open && <span>Log Out</span>}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
