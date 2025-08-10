"use client";
import React, { useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowId,
} from "@mui/x-data-grid";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Tooltip,
} from "@mui/material";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye } from "react-icons/ai";
import { FiRefreshCw } from "react-icons/fi";
import { useTheme } from "next-themes";
import { toast } from "react-hot-toast";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
} from "@/redux/features/user/userApi";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import { formatDate } from "../../utils/dateUtils";
import Image from "next/image";
import UserForm from "./UserForm";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  // isVerified: boolean
  courses?: Array<{ courseId: string }>;
  createdAt: string;
  avatar?: {
    url: string;
  };
}
interface ViewUserDialogProps {
  open: boolean;
  onClose: () => void;
  user: IUser | null;
}
const ViewUserDialog: React.FC<ViewUserDialogProps> = ({
  open,
  onClose,
  user,
}) => {
  const { theme } = useTheme();

  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor:
            theme === "dark" ? "rgba(81, 81, 81, 1)" : "rgba(59, 130, 246, 1)",
          color: theme === "dark" ? "white" : "white",
        }}
      >
        User Details
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          backgroundColor:
            theme === "dark" ? "rgba(30, 41, 59, 1)" : "rgba(249, 250, 251, 1)",
          padding: "20px",
          color: theme === "dark" ? "white" : "black",
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center mb-4">
            {user.avatar?.url ? (
              <Image
                src={user.avatar.url}
                alt={user.name}
                width={120}
                height={120}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
                <Typography variant="h4">
                  {user.name.charAt(0).toUpperCase()}
                </Typography>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="subtitle2" color="textSecondary">
                Name
              </Typography>
              <Typography variant="body1">{user.name}</Typography>
            </div>
            <div>
              <Typography variant="subtitle2" color="textSecondary">
                Email
              </Typography>
              <Typography variant="body1">{user.email}</Typography>
            </div>
            <div>
              <Typography variant="subtitle2" color="textSecondary">
                Role
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color:
                    user.role === "admin"
                      ? theme === "dark"
                        ? "primary.light"
                        : "primary.dark"
                      : "text.primary",
                  fontWeight: user.role === "admin" ? "bold" : "normal",
                }}
              >
                {user.role}
              </Typography>
            </div>
            <div>
              <Typography variant="subtitle2" color="textSecondary">
                Joined At
              </Typography>
              <Typography variant="body1">
                {formatDate(user.createdAt)}
              </Typography>
            </div>
            <div className="col-span-2">
              <Typography variant="subtitle2" color="textSecondary">
                Courses Enrolled
              </Typography>
              <Typography variant="body1">
                {user.courses?.length || 0} courses
              </Typography>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions
        sx={{
          backgroundColor:
            theme === "dark" ? "rgba(30, 41, 59, 1)" : "rgba(249, 250, 251, 1)",
        }}
      >
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

type Props = {
  isTeam: boolean;
};
const AllUsers: FC<Props> = ({ isTeam }) => {
  const { theme } = useTheme();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [selectedId, setSelectedId] = useState<GridRowId | null>(null);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: allUsers, isLoading, error, refetch } = useGetAllUsersQuery({});
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<IUser | null>(null);

  const handleView = (id: GridRowId) => {
    try {
      const user = users?.find((u: IUser) => u._id === id);
      if (!user) {
        throw new Error("User not found");
      }
      setViewingUser(user);
      setViewDialogOpen(true);
    } catch (error) {
      toast.error("Failed to view user");
      console.error(error);
    }
  };

  const users = isTeam
    ? allUsers?.filter((user: IUser) => user.role === "admin")
    : allUsers;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success("Users refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh users");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedId) return;

    try {
      await deleteUser(selectedId.toString()).unwrap();
      toast.success("User deleted successfully");
      setOpenConfirm(false);
      refetch();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleEdit = (id: GridRowId) => {
    try {
      const user = users?.find((u: IUser) => u._id === id);
      if (!user) {
        throw new Error("User not found");
      }
      setSelectedUser(user);
      setOpenForm(true);
    } catch (error) {
      toast.error("Failed to edit user");
      console.error(error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "_id",
      headerName: "ID",
      flex: 0.5,
      renderCell: (params) => (
        <Typography variant="body2" noWrap color="text.primary">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          {params.row.avatar?.url && (
            <Image
              src={params.row.avatar.url}
              alt={params.value as string}
              width={32}
              height={32}
              className="rounded-full object-cover"
              priority
            />
          )}
          <Typography variant="body2" noWrap color="text.primary">
            {params.value as string}
          </Typography>
        </div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
      renderCell: (params) => (
        <Typography variant="body2" noWrap color="text.primary">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      flex: 0.5,
      renderCell: (params) => (
        <Typography
          variant="body2"
          color={
            params.value === "admin"
              ? theme === "dark"
                ? "primary.light"
                : "primary.dark"
              : "text.primary"
          }
          fontWeight={params.value === "admin" ? "bold" : "normal"}
        >
          {params.value}
        </Typography>
      ),
    },

    {
      field: "courses",
      headerName: "Courses",
      flex: 0.5,
      valueGetter: (params) => params?.length || 0,
      renderCell: (params) => (
        <Typography variant="body2" color="text.primary">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "createdAt",
      headerName: "Joined At",
      flex: 0.8,
      valueGetter: (params) => formatDate(params),
      renderCell: (params) => (
        <Typography variant="body2" color="text.primary">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      flex: 0.8,
      getActions: (params) => [
        <GridActionsCellItem
          key="view"
          icon={
            <Tooltip title="View">
              <AiOutlineEye
                className={theme === "dark" ? "text-blue-300" : "text-blue-600"}
                size={18}
              />
            </Tooltip>
          }
          label="View"
          onClick={() => handleView(params.id)}
          showInMenu
        />,
        <GridActionsCellItem
          key="edit"
          icon={
            <Tooltip title="Edit">
              <AiOutlineEdit
                className={
                  theme === "dark" ? "text-green-300" : "text-green-600"
                }
                size={18}
              />
            </Tooltip>
          }
          label="Edit"
          onClick={() => handleEdit(params.id)}
          showInMenu
        />,
        <GridActionsCellItem
          key="delete"
          icon={
            <Tooltip title="Delete">
              {isDeleting && params.id === selectedId ? (
                <CircularProgress size={18} />
              ) : (
                <AiOutlineDelete
                  className={theme === "dark" ? "text-red-300" : "text-red-600"}
                  size={18}
                />
              )}
            </Tooltip>
          }
          label="Delete"
          onClick={() => {
            setSelectedId(params.id);
            setOpenConfirm(true);
          }}
          showInMenu
        />,
      ],
    },
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Typography variant="h5" color="error" className="mb-4">
          Failed to load users
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRefresh}
          startIcon={<FiRefreshCw />}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-[20px] p-4">
      <Box
        className="mb-4"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" }, // Stack vertically on small screens, row on larger
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2, // Add gap between items when stacked
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          color={theme === "dark" ? "text.white" : "text.black"}
          sx={{
            fontSize: { xs: "1.5rem", sm: "2rem" }, // Smaller font on mobile
            mb: { xs: 1, sm: 0 }, // Add margin bottom only when stacked
          }}
        >
          {isTeam ? "Admin Team Management" : "Users Management"}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: { xs: "100%", sm: "auto" }, // Full width on mobile, auto on larger
            flexDirection: { xs: "column", sm: "row" }, // Stack buttons vertically on mobile
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleRefresh}
            startIcon={
              <FiRefreshCw className={isRefreshing ? "animate-spin" : ""} />
            }
            disabled={isRefreshing}
            sx={{
              textTransform: "none",
              width: { xs: "100%", sm: "auto" }, // Full width on mobile
            }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              setSelectedUser(null);
              setOpenForm(true);
            }}
            sx={{
              textTransform: "none",
              width: { xs: "100%", sm: "auto" }, // Full width on mobile
            }}
          >
            Add New User
          </Button>
        </Box>
      </Box>
      <Box
        height="75vh"
        sx={{
          overflowX: "auto",
          "& .MuiDataGrid-root": {
            minWidth: "800px",
            border: "none",
            outline: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: `1px solid ${theme === "dark" ? "rgba(81, 81, 81, 1)" : "rgba(224, 224, 224, 1)"}`,
            color:
              theme === "dark"
                ? "rgba(255, 255, 255, 0.9)"
                : "rgba(0, 0, 0, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor:
              theme === "dark"
                ? "rgba(81, 81, 81, 1)"
                : "rgba(59, 130, 246, 1)",
            color: theme === "dark" ? "black" : "black",
            borderBottom: "none",
            fontSize: "0.875rem",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-columnHeader": {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
            width: "100%",
            textAlign: "center",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor:
              theme === "dark"
                ? "rgba(181, 178, 168)"
                : "rgba(249, 250, 251, 1)",
          },
          "& .css-1ymq787 .MuiDataGrid-container--top": {
            backgroundColor:
              theme === "dark" ? "rgba(110, 106, 93)" : "rgba(59, 130, 246, 1)",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor:
              theme === "dark" ? "rgba(110, 106, 93)" : "rgba(59, 130, 246, 1)",
            color:
              theme === "dark"
                ? "rgba(255, 255, 255, 0.9)"
                : "rgba(255, 255, 255, 0.9)",
            borderTop: "none",
          },
          "& .MuiCheckbox-root": {
            color:
              theme === "dark"
                ? "rgba(148, 163, 184, 1)"
                : "rgba(100, 116, 139, 1)",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          },
          "& .MuiDataGrid-toolbarContainer": {
            padding: "8px",
            backgroundColor:
              theme === "dark"
                ? "rgba(30, 41, 59, 0.8)"
                : "rgba(226, 232, 240, 1)",
          },
          "& .MuiDataGrid-row": {
            color:
              theme === "dark"
                ? "rgba(241, 245, 249, 1)"
                : "rgba(0, 0, 0, 0.9)",
            "&:hover": {
              backgroundColor:
                theme === "dark"
                  ? "rgba(30, 41, 59, 0.6)"
                  : "rgba(241, 245, 249, 1)",
            },
          },
          "& .MuiDataGrid-cellContent": {
            width: "100%",
            textAlign: "center",
          },
          "& .MuiDataGrid-actionsCell": {
            justifyContent: "center",
          },
        }}
      >
        <DataGrid
          rows={users || []}
          columns={columns}
          loading={isLoading}
          getRowId={(row) => row._id}
          checkboxSelection
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              height: "60px",
            },
            "& .MuiDataGrid-cell": {
              color:
                theme === "dark"
                  ? "rgba(255, 255, 255, 0.9)"
                  : "rgba(0, 0, 0, 0.9)",
            },
          }}
          slots={{
            noRowsOverlay: () => (
              <div className="flex flex-col items-center justify-center h-full">
                <Typography
                  variant="body1"
                  className="mb-2"
                  color="text.primary"
                >
                  No users available
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleRefresh}
                  startIcon={<FiRefreshCw />}
                >
                  Refresh
                </Button>
              </div>
            ),
            noResultsOverlay: () => (
              <div className="flex flex-col items-center justify-center h-full">
                <Typography
                  variant="body1"
                  className="mb-2"
                  color="text.primary"
                >
                  No results found
                </Typography>
              </div>
            ),
          }}
        />
      </Box>

      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Delete"
        content="Are you sure you want to delete this user? This action cannot be undone."
        loading={isDeleting}
      />
      <ViewUserDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        user={viewingUser}
      />

      <UserForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        user={selectedUser}
        onSuccess={() => {
          refetch();
          setOpenForm(false);
        }}
        isTeam={isTeam}
        canDowngradeAdmin={true}
      />
    </div>
  );
};

export default AllUsers;
