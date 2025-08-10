import React from "react";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlineFilePdf,
} from "react-icons/ai";
import { FiDownload } from "react-icons/fi";
import { CircularProgress } from "@mui/material";

interface InvoiceActionsMenuProps {
  orderId: GridRowId;
  onView: () => void;
  onEdit: () => void;
  onGeneratePDF: () => void;
  onDownload: () => void;
  onDelete: () => void;
  status: string;
  theme?: string;
}

const InvoiceActionsMenu: React.FC<InvoiceActionsMenuProps> = ({
  orderId,
  onView,
  onEdit,
  onGeneratePDF,
  onDownload,
  onDelete,
  status,
  theme,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Actions">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{
            "&:hover": {
              backgroundColor:
                theme === "dark"
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 10.8333C10.4603 10.8333 10.8334 10.4602 10.8334 9.99999C10.8334 9.53975 10.4603 9.16666 10 9.16666C9.53978 9.16666 9.16669 9.53975 9.16669 9.99999C9.16669 10.4602 9.53978 10.8333 10 10.8333Z"
              stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 4.99999C10.4603 4.99999 10.8334 4.6269 10.8334 4.16666C10.8334 3.70642 10.4603 3.33333 10 3.33333C9.53978 3.33333 9.16669 3.70642 9.16669 4.16666C9.16669 4.6269 9.53978 4.99999 10 4.99999Z"
              stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 16.6667C10.4603 16.6667 10.8334 16.2936 10.8334 15.8333C10.8334 15.3731 10.4603 15 10 15C9.53978 15 9.16669 15.3731 9.16669 15.8333C9.16669 16.2936 9.53978 16.6667 10 16.6667Z"
              stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
          sx: {
            minWidth: "200px",
            py: 0,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            onView();
            handleClose();
          }}
        >
          <ListItemIcon>
            <AiOutlineEye size={18} />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onEdit();
            handleClose();
          }}
          disabled={status === "completed"}
        >
          <ListItemIcon>
            <AiOutlineEdit size={18} />
          </ListItemIcon>
          <ListItemText>Edit Status</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onGeneratePDF();
            handleClose();
          }}
        >
          <ListItemIcon>
            <AiOutlineFilePdf size={18} />
          </ListItemIcon>
          <ListItemText>Generate PDF</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDownload();
            handleClose();
          }}
        >
          <ListItemIcon>
            <FiDownload size={18} />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDelete();
            handleClose();
          }}
          disabled={status === "completed"}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <AiOutlineDelete size={18} color="inherit" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default InvoiceActionsMenu;
