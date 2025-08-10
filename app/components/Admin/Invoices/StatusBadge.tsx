import { Chip } from "@mui/material";
import { useTheme } from "next-themes";

const statusColors: Record<string, { bg: string; text: string }> = {
  completed: { bg: "success.main", text: "success.contrastText" },
  pending: { bg: "warning.main", text: "warning.contrastText" },
  cancelled: { bg: "error.main", text: "error.contrastText" },
  refunded: { bg: "info.main", text: "info.contrastText" },
  failed: { bg: "error.main", text: "error.contrastText" },
};

type StatusBadgeProps = {
  status?: string;
};

const StatusBadge = ({ status = "pending" }: StatusBadgeProps) => {
  const { theme } = useTheme();
  const colorConfig = statusColors[status?.toLowerCase() || "pending"] || {
    bg: "action.disabledBackground",
    text: "text.secondary",
  };

  return (
    <Chip
      label={status?.toUpperCase() || "PENDING"}
      size="small"
      sx={{
        backgroundColor: colorConfig.bg,
        color: colorConfig.text,
        fontWeight: "medium",
        width: "90px",
        "& .MuiChip-label": {
          px: 0.5,
        },
      }}
    />
  );
};

export default StatusBadge;
