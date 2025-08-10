// DashboardHeader.tsx
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
    pollingInterval: 60000, // refetch every 60 seconds
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
    <div className="w-full px-6 py-4 bg-gradient-to-r from-gray-800 to-indigo-800 text-white rounded-xl shadow-md mb-6 flex items-center justify-between">
      {/* Left Side: Title and Greeting */}
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {user && (
          <p className="text-sm text-white/80 mt-1">
            Welcome back,{" "}
            <span className="font-medium">{user.name || "Admin"}</span> 👋
          </p>
        )}
      </div>

      {/* Right Side: Avatar, ThemeSwitcher, Notification */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <Image
          src={user?.avatar?.url || avatarIcon}
          alt="Profile"
          width={40}
          height={40}
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
        >
          <Badge badgeContent={unreadNotifications} color="error">
            <NotificationsNoneIcon sx={{ color: "white" }} />
          </Badge>
        </IconButton>

        {/* Notification Menu */}
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
              width: 350,
              maxHeight: 400,
              overflowY: "auto",
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
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
                }}
              >
                <div className="p-2">
                  <Typography variant="subtitle1">
                    {notification.title}
                  </Typography>
                  <Typography variant="body2">
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
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
