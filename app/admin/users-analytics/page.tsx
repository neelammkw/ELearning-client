"use client";
import AdminSidebar from "@/app/components/Admin/sidebar/AdminSideBar";
import AdminProtected from "@/app/hooks/adminProtected";
import Heading from "@/app/utils/Heading";
import React from "react";
import { useTheme } from "next-themes";
import DashboardHero from "@/app/components/Admin/DashboardHero";
import UsersAnalytics from "@/app/components/Admin/Analytics/UsersAnalytics";
import { Box, IconButton } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

const Page = () => {
  const { theme, setTheme } = useTheme();
  const currentTheme = theme === "dark" ? "dark" : "light";
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileOpen(false);
        setSidebarCollapsed(false);
      } else {
        setSidebarCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCollapseToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div
      className={`min-h-screen ${currentTheme === "dark" ? "bg-[#0F172A]" : "bg-[#F8FAFC]"}`}
    >
      <AdminProtected>
        <Heading
          title="ELearning - Admin"
          description="E-Learning is a platform for students to learn and get help from teachers"
          keywords="profile, elearning, education"
        />
        <div className="flex">
          <AdminSidebar
            collapsed={sidebarCollapsed}
            mobileOpen={mobileOpen}
            isMobile={isMobile}
            onCollapseToggle={handleCollapseToggle}
            onMobileToggle={handleDrawerToggle}
            currentTheme={currentTheme}
            setTheme={setTheme}
          />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: isMobile
                ? "100%"
                : sidebarCollapsed
                  ? "calc(100% - 250px)"
                  : "calc(100% - 80px)",
              backgroundColor: currentTheme === "dark" ? "#0F172A" : "#F8FAFC",
              color: currentTheme === "dark" ? "#FFFFFF" : "#000000",
              minHeight: "100vh",
              transition: "margin-left 0.3s ease, width 0.3s ease",
            }}
          >
            {isMobile && (
              <IconButton
                onClick={handleDrawerToggle}
                sx={{
                  position: "fixed",
                  top: 10,
                  left: 10,
                  zIndex: 1000,
                  backgroundColor:
                    currentTheme === "dark" ? "#1E293B" : "#FFFFFF",
                  color: currentTheme === "dark" ? "#FFFFFF" : "#000000",
                  "&:hover": {
                    backgroundColor:
                      currentTheme === "dark" ? "#334155" : "#F1F5F9",
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <DashboardHero />
            <UsersAnalytics />
          </Box>
        </div>
      </AdminProtected>
    </div>
  );
};

export default Page;
