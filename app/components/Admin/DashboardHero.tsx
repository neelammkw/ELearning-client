"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import avatarIcon from "@/public/assets/avatar.png";
import { ThemeSwitcher } from "@/app/utils/ThemeSwitcher";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { Badge, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import {
  useGetNotificationsQuery,
  useUpdateNotificationStatusMutation,
} from "@/redux/features/notifications/notificationApi";

interface Props {
  title?: string;
}

const DashboardHero: React.FC<Props> = ({ title = "Dashboard" }) => {
  const { user } = useSelector((state: any) => state.auth);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { data, refetch } = useGetNotificationsQuery(undefined, {
    pollingInterval: 60000,
  });
  const [updateNotificationStatus] = useUpdateNotificationStatusMutation();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    refetch();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (id: string) => {
    try {
      await updateNotificationStatus(id);
      refetch();
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  const unreadNotifications =
    data?.notifications?.filter((n: any) => n.status === "unread").length || 0;

  return (
    <div className="w-full px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-800 to-indigo-800 text-white rounded-xl shadow-md mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
      {/* Left Side: Title and Greeting */}
      <div className="w-full sm:w-auto text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold">{title}</h1>
        {user && (
          <p className="text-xs sm:text-sm text-white/80 mt-1">
            Welcome back,{" "}
            <span className="font-medium">{user.name || "Admin"}</span> 👋
          </p>
        )}
      </div>

      {/* Right Side: Avatar, ThemeSwitcher, Notification */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Avatar */}
        <Image
          src={user?.avatar?.url || avatarIcon}
          alt="Profile"
          width={36}
          height={36}
          className="rounded-full border border-white shadow"
        />

        {/* Theme Toggle */}
        <ThemeSwitcher />

        {/* Notification Icon */}
        <IconButton
          onClick={handleClick}
          size="small"
          aria-controls={open ? "notifications-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          sx={{ padding: '8px' }} // Smaller padding on mobile
        >
          <Badge badgeContent={unreadNotifications} color="error">
            <NotificationsNoneIcon sx={{ color: "white", fontSize: '1.25rem' }} />
          </Badge>
        </IconButton>

        {/* Notification Menu - Responsive */}
        <Menu
          anchorEl={anchorEl}
          id="notifications-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              width: { xs: '90vw', sm: 350 }, // Full width on mobile
              maxWidth: { xs: 'calc(100vw - 32px)', sm: 350 }, // Account for padding
              maxHeight: 400,
              overflowY: "auto",
              left: { xs: '16px !important', sm: 'auto' }, // Position on mobile
              right: { xs: '16px !important', sm: 'auto' }, // Position on mobile
              transformOrigin: { xs: 'top center', sm: 'top right' } // Adjust for mobile
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          disableScrollLock={true} // Prevent body scroll lock on mobile
        >
          {data?.notifications?.length ? (
            data.notifications.map((notification: any) => (
              <MenuItem
                key={notification._id}
                onClick={() => handleNotificationClick(notification._id)}
                sx={{
                  borderBottom: "1px solid #eee",
                  backgroundColor:
                    notification.status === "unread" ? "#f5f5f5" : "white",
                  whiteSpace: 'normal', // Allow text wrapping
                  py: 1.5,
                }}
              >
                <div className="p-1 sm:p-2">
                  <Typography variant="subtitle1" sx={{ fontSize: '0.875rem', sm: '1rem' }}>
                    {notification.title}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', sm: '0.875rem' }}>
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.625rem', sm: '0.75rem' }}>
                    {new Date(notification.createdAt).toLocaleString()}
                  </Typography>
                </div>
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>
              <Typography>No notifications</Typography>
            </MenuItem>
          )}
        </Menu>
      </div>
    </div>
  );
};

export default DashboardHero;