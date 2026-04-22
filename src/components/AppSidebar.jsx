import { useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';

export default function AppSidebar() {
  const navigate = useNavigate();
  const mode = localStorage.getItem('mode');

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarContent>

        {/* MAIN */}
        <SidebarGroup>

          {/* 🔥 GRADIENT TITLE */}
          <SidebarGroupLabel className="text-base font-semibold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent tracking-wide">
            Your Space
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>

              <SidebarMenuItem>
                <SidebarMenuButton
                  className="text-base font-medium hover:scale-[1.02] transition-all"
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  className="text-base font-medium hover:scale-[1.02] transition-all"
                  onClick={() => navigate('/about')}
                >
                  About
                </SidebarMenuButton>
              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter>
        {mode === 'online' && (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="text-base font-medium text-red-400 hover:text-red-500 transition-all"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/';
                }}
              >
                Logout
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}