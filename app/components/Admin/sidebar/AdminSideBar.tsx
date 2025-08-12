"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  School as SchoolIcon,
  LiveTv as LiveTvIcon,
  Category as CategoryIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Home as HomeIcon,
  Group as GroupIcon,
  BarChart as BarChartIcon,
  KeyboardArrowDown as ChevronDownIcon,
  KeyboardArrowRight as ChevronRightIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from "@mui/icons-material";
import {
  Box,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  Avatar,
} from "@mui/material";
import avatarIcon from "@/public/assets/avatar.png";
import { useSelector } from "react-redux";

interface AdminSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  isMobile: boolean;
  onCollapseToggle: () => void;
  onMobileToggle: () => void;
  currentTheme: string;
  setTheme: (theme: string) => void;
}

const AdminSideBar: React.FC<AdminSidebarProps> = ({
  collapsed,
  mobileOpen,
  isMobile,
  onCollapseToggle,
  onMobileToggle,
  currentTheme,
  setTheme,
}) => {
  const router = useRouter();
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const subMenuTimer = useRef<NodeJS.Timeout | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/admin",
    },
    {
      text: "Data",
      icon: <PeopleIcon />,
      subItems: [
        { text: "Users", icon: <PeopleIcon />, path: "/admin/users" },
        { text: "Invoices", icon: <ReceiptIcon />, path: "/admin/invoices" },
      ],
    },
    {
      text: "Content",
      icon: <SchoolIcon />,
      subItems: [
        {
          text: "Create Course",
          icon: <SchoolIcon />,
          path: "/admin/create-course",
        },
        { text: "Live Courses", icon: <LiveTvIcon />, path: "/admin/courses" },
      ],
    },
    {
      text: "Customization",
      icon: <CategoryIcon />,
      subItems: [
        { text: "Hero", icon: <HomeIcon />, path: "/admin/hero" },
        { text: "FAQ", icon: <QuestionAnswerIcon />, path: "/admin/faq" },
        {
          text: "Categories",
          icon: <CategoryIcon />,
          path: "/admin/categories",
        },
      ],
    },
    {
      text: "Controllers",
      icon: <GroupIcon />,
      subItems: [
        { text: "Manage Team", icon: <GroupIcon />, path: "/admin/team" },
      ],
    },
    {
      text: "Analytics",
      icon: <BarChartIcon />,
      subItems: [
        {
          text: "Course Analytics",
          icon: <BarChartIcon />,
          path: "/admin/courses-analytics",
        },
        {
          text: "Orders Analytics",
          icon: <BarChartIcon />,
          path: "/admin/orders-analytics",
        },
        {
          text: "Users Analytics",
          icon: <BarChartIcon />,
          path: "/admin/users-analytics",
        },
      ],
    },
    {
      text: "Back To Site",
      path: "/",
    },
  ];

  const handleSubMenuToggle = (text: string) => {
    setOpenSubMenu(openSubMenu === text ? null : text);
  };

  const handleMouseEnter = (text: string) => {
    if (isMobile) return;
    if (subMenuTimer.current) {
      clearTimeout(subMenuTimer.current);
    }
    setHoveredItem(text);
    if (collapsed) {
      setOpenSubMenu(text);
    }
  };

  const handleMouseLeave = () => {
    if (!collapsed) {
      setOpenSubMenu(null);
    }
    if (isMobile) return;
    if (collapsed) {
      subMenuTimer.current = setTimeout(() => {
        setOpenSubMenu(null);
        setHoveredItem(null);
      }, 300);
    } else {
      setHoveredItem(null);
    }
  };

  const handleItemClick = (path: string) => {
    router.push(path);
    if (isMobile) {
      onMobileToggle();
    }
  };

  const toggleTheme = () => {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  const drawerContent = (
    <Box
      sx={{
        height: "120vh",
        backgroundColor: currentTheme === "dark" ? "#0F172A" : "#F8FAFC",
        color: currentTheme === "dark" ? "#FFFFFF" : "#000000",
        borderRight: `1px solid ${currentTheme === "dark" ? "#334155" : "#E2E8F0"}`,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        // overflow: "hidden"
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          minHeight: "64px",
        }}
      >
        {!collapsed && (
          <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
            Admin Panel
          </Typography>
        )}
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton onClick={onCollapseToggle} size="small">
            {collapsed ? (
              <ChevronRightIcon
                sx={{ color: currentTheme === "dark" ? "#FFFFFF" : "#000000" }}
              />
            ) : (
              <ChevronDownIcon
                sx={{ color: currentTheme === "dark" ? "#FFFFFF" : "#000000" }}
              />
            )}
          </IconButton>
        </Box>
      </Box>
      <Divider />

      {!collapsed && (
        <Box sx={{ p: 1, textAlign: "center" }}>
          <Avatar
            src={user?.avatar?.url || avatarIcon.src}
            sx={{
              width: 60,
              height: 60,
              margin: "0 auto",
              border: `2px solid ${currentTheme === "dark" ? "#334155" : "#E2E8F0"}`,
            }}
          />
          <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 500 }}>
            {user?.name || "Admin"}
          </Typography>
        </Box>
      )}
      <Divider />

      <List sx={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
        {menuItems.map((item) => (
          <React.Fragment key={item.text}>
            {item.path ? (
              <ListItem disablePadding>
                <ListItemButton
                  onMouseLeave={() => handleMouseLeave()}
                  onClick={() => handleItemClick(item.path)}
                  sx={{
                    pl: collapsed ? 2 : 2.5,
                    pr: collapsed ? 2 : 2.5,
                    minHeight: 40,
                    justifyContent: collapsed ? "center" : "initial",
                    backgroundColor:
                      router.pathname === item.path
                        ? currentTheme === "dark"
                          ? "rgba(255, 255, 255, 0.15)"
                          : "rgba(0, 0, 0, 0.08)"
                        : "inherit",
                    "&:hover": {
                      backgroundColor:
                        currentTheme === "dark"
                          ? "rgba(255, 255, 255, 0.08)"
                          : "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <Tooltip
                    title={item.text}
                    placement="right"
                    enterDelay={300}
                    enterTouchDelay={0}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: collapsed ? 0 : 2,
                        justifyContent: "center",
                        width: collapsed ? 24 : 'auto',
                        height: collapsed ? 24 : 'auto',
                        display: 'flex',
                        alignItems: 'center',

                        color: currentTheme === "dark" ? "#FFFFFF" : "#000000",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                  </Tooltip>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      opacity: collapsed ? 0 : 1,
                      color: currentTheme === "dark" ? "#FFFFFF" : "#000000",
                      transition: "opacity 0.2s ease",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ) : (
              <Box
                onMouseEnter={() => handleMouseEnter(item.text)}
                onMouseLeave={() => handleMouseLeave()}
                // onMouseEnter={() => !isMobile && handleMouseEnter(item.text)}
                // onMouseLeave={() => !isMobile && handleMouseLeave()}
                onClick={() => isMobile && handleSubMenuToggle(item.text)}
                sx={{
                  position: "relative",
                  cursor: "pointer",
                }}
              >
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      if (isMobile || !collapsed) {
                        handleSubMenuToggle(item.text);
                      }
                    }}
                    sx={{
                      minHeight: 40,
                      justifyContent: collapsed ? "center" : "initial",
                      px: 2,
                      // padding: '4px 0',
                      "&:hover": {
                        backgroundColor: !isMobile
                          ? currentTheme === "dark"
                            ? "rgba(255, 255, 255, 0.08)"
                            : "rgba(0, 0, 0, 0.04)"
                          : "inherit",
                      },
                    }}
                  >
                    <Tooltip
                      title={item.text}
                      placement="right"
                      enterDelay={300}
                      enterTouchDelay={0}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: collapsed ? 0 : 2,
                          justifyContent: "center",
                          color:
                            currentTheme === "dark" ? "#FFFFFF" : "#000000",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                    </Tooltip>
                    {!collapsed && (
                      <>
                        <ListItemText
                          primary={item.text}
                          sx={{
                            opacity: 1,
                            color:
                              currentTheme === "dark" ? "#FFFFFF" : "#000000",
                          }}
                        />
                        {openSubMenu === item.text ? (
                          <ChevronDownIcon />
                        ) : (
                          <ChevronRightIcon />
                        )}
                      </>
                    )}
                  </ListItemButton>
                </ListItem>
                <Collapse
                  // in={(!collapsed && openSubMenu === item.text) ||
                  //     (collapsed && hoveredItem === item.text)}
                  in={
                    (!collapsed && openSubMenu === item.text) ||
                    (collapsed &&
                      (isMobile
                        ? openSubMenu === item.text
                        : hoveredItem === item.text))
                  }
                  timeout="auto"
                  unmountOnExit
                  sx={{
                    // position: collapsed ? 'fixed' : 'absolute',
                    position: "fixed",

                    left: collapsed ? "15px" : "5px",
                    zIndex: 1300,
                    "& .MuiCollapse-wrapper": {
                      backgroundColor:
                        currentTheme === "dark" ? "#1E293B" : "#F1F5F9",
                      borderRadius: "4px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      minWidth: "200px",
                    },
                    "& .MuiCollapse-wrapperInner": {
                      width: "200px", // Match the wrapper width
                    },
                  }}
                >
                  <List
                    component="div"
                    disablePadding
                    sx={{
                      width: "200px",
                      "& .MuiListItemButton-root": {
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      },
                    }}
                  >
                    {item.subItems?.map((subItem) => (
                      <ListItem key={subItem.text} disablePadding>
                        <ListItemButton
                          onClick={() => handleItemClick(subItem.path)}
                          sx={{
                            pl: collapsed ? 0 : 2,
                            minHeight: 40,
                            backgroundColor:
                              router.pathname === subItem.path
                                ? currentTheme === "dark"
                                  ? "rgba(255, 255, 255, 0.15)"
                                  : "rgba(0, 0, 0, 0.08)"
                                : "inherit",
                            "&:hover": {
                              backgroundColor:
                                currentTheme === "dark"
                                  ? "rgba(255, 255, 255, 0.08)"
                                  : "rgba(0, 0, 0, 0.04)",
                            },
                          }}
                        >
                          <Tooltip
                            title={subItem.text}
                            placement="right"
                            enterDelay={300}
                            enterTouchDelay={0}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 0,
                                ml: collapsed ? 3 : 2,
                                mr: collapsed ? 1 : 2,
                                justifyContent: "center",
                                color:
                                  currentTheme === "dark"
                                    ? "#FFFFFF"
                                    : "#000000",
                              }}
                            >
                              {subItem.icon}
                            </ListItemIcon>
                          </Tooltip>

                          <ListItemText
                            primary={subItem.text}
                            sx={{
                              color:
                                currentTheme === "dark" ? "#FFFFFF" : "#000000",
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </Box>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: collapsed ? 80 : 220,
            boxSizing: "border-box",
            backgroundColor: currentTheme === "dark" ? "#0F172A" : "#F8FAFC",
            color: currentTheme === "dark" ? "#FFFFFF" : "#000000",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      open
      sx={{
        width: collapsed ? 80 : 220,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: collapsed ? 80 : 220,
          boxSizing: "border-box",
          backgroundColor: currentTheme === "dark" ? "#0F172A" : "#F8FAFC",
          color: currentTheme === "dark" ? "#FFFFFF" : "#000000",
          transition: "width 0.3s ease",
          overflowX: "hidden",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default AdminSideBar;
