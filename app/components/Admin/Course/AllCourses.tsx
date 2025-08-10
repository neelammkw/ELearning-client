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
  useGetAllCoursesQuery,
  useDeleteCourseMutation,
} from "@/redux/features/courses/coursesApi";
import ConfirmDialog from "../../../components/shared/ConfirmDialog";
import CourseForm from "./CourseForm";
import { formatDate } from "../../../utils/dateUtils";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ICourse {
  _id: string;
  name: string;
  ratings: number;
  purchased: number;
  createdAt: string;
  thumbnail?: {
    url: string;
  };
  price?: number;
  description?: string;
  benefits?: Array<{ title: string }>;
  prerequisites?: Array<{ title: string }>;
  level?: string;
  demoUrl?: string;
  tags?: string;
}

const AllCourses = () => {
  const { theme } = useTheme();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [selectedId, setSelectedId] = useState<GridRowId | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();
  const { data, isLoading, error, refetch } = useGetAllCoursesQuery({});
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success("Courses refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh courses");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedId) return;

    try {
      await deleteCourse(selectedId.toString()).unwrap();
      toast.success("Course deleted successfully");
      setOpenConfirm(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete course");
    }
  };

  const handleEdit = (id: GridRowId) => {
    router.push(`/admin/edit-course/${id}`);
  };

  const handleView = (id: GridRowId) => {
    // toast.success(`Viewing course ${id}`)
    router.push(`/admin/view-course/${id}`);
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
      headerName: "Course Title",
      flex: 1.5,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          {params.row.thumbnail?.url && (
            <Image
              src={params.row.thumbnail.url}
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
      field: "ratings",
      headerName: "Ratings",
      flex: 0.5,
      type: "number",
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2" color="text.primary">
            {params.value?.toFixed(1) || "N/A"}
          </Typography>
          {params.value && (
            <Box color={theme === "dark" ? "gold" : "orange"}>★</Box>
          )}
        </Box>
      ),
    },
    {
      field: "purchased",
      headerName: "Students",
      flex: 0.5,
      type: "number",
      renderCell: (params) => (
        <Typography variant="body2" color="text.primary">
          {params.value || 0}
        </Typography>
      ),
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.5,
      type: "number",
      renderCell: (params) => (
        <Typography
          variant="body2"
          color={
            params.value
              ? theme === "dark"
                ? "success.light"
                : "success.dark"
              : "text.secondary"
          }
        >
          {params.value ? `$${params.value}` : "Free"}
        </Typography>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
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
          Failed to load courses
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
      <Box className="flex justify-between items-center mb-4">
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          color={theme === "dark" ? "common.white" : "text.black"}
        >
          Courses Management
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="contained"
            color="primary"
            onClick={handleRefresh}
            startIcon={
              <FiRefreshCw className={isRefreshing ? "animate-spin" : ""} />
            }
            disabled={isRefreshing}
            sx={{ textTransform: "none" }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              router.push(`/admin/create-course`);
            }}
            sx={{ textTransform: "none" }}
          >
            Add New Course
          </Button>
        </div>
      </Box>

      <Box
        height="90vh"
        sx={{
          "& .MuiDataGrid-root": {
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
                ? "rgba(30, 41, 59, 1)"
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
                ? "rgba(15, 23, 42, 0.8)"
                : "rgba(249, 250, 251, 1)",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor:
              theme === "dark"
                ? "rgba(30, 41, 59, 1)"
                : "rgba(59, 130, 246, 1)",
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
          // Center content in cells
          "& .MuiDataGrid-cellContent": {
            width: "100%",
            textAlign: "center",
          },
          // Center action buttons
          "& .MuiDataGrid-actionsCell": {
            justifyContent: "center",
          },
        }}
      >
        <DataGrid
          rows={data || []}
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
                  No courses available
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
        content="Are you sure you want to delete this course? This action cannot be undone."
        loading={isDeleting}
      />

      <CourseForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        course={selectedCourse}
        onSuccess={() => {
          refetch();
          setOpenForm(false);
        }}
      />
    </div>
  );
};

export default AllCourses;
