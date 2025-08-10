"use client";
import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  imageUrl?: string;
  imageAlt?: string;
  height?: number;
  width?: number;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  imageUrl = "/images/empty-state.svg",
  imageAlt = "Empty state illustration",
  height = 300,
  width = 300,
}) => {
  const { theme } = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        p: 4,
        height: "100%",
        minHeight: "400px",
      }}
    >
      {imageUrl && (
        <Box sx={{ mb: 3 }}>
          <Image
            src={imageUrl}
            alt={imageAlt}
            height={height}
            width={width}
            style={{
              filter: theme === "dark" ? "invert(0.8)" : "none",
              opacity: theme === "dark" ? 0.7 : 1,
            }}
          />
        </Box>
      )}

      <Typography
        variant="h5"
        component="h3"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: theme === "dark" ? "#ffffff" : "#1a1a1a",
          mb: 1,
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: theme === "dark" ? "#b0b0b0" : "#666666",
          maxWidth: "500px",
          mb: 3,
        }}
      >
        {description}
      </Typography>

      {action && <Box sx={{ mt: 2 }}>{action}</Box>}
    </Box>
  );
};

export default EmptyState;
