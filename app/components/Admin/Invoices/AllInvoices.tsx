"use client";
import React, { useState, useMemo } from "react";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Typography,
  Avatar,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { FiRefreshCw } from "react-icons/fi";
import { useTheme } from "next-themes";
import { toast } from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import {
  useGetAllOrdersQuery,
  useDeleteOrderMutation,
} from "@/redux/features/orders/ordersApi";
import ConfirmDialog from "../../../components/shared/ConfirmDialog";
import { formatDate } from "../../../utils/dateUtils";
import { useRouter } from "next/navigation";
import SearchBar from "../../../components/shared/SearchBar";
import StatusBadge from "../../../components/Admin/Invoices/StatusBadge";
import { GridActionsCellItem } from "@mui/x-data-grid";
import PaymentMethodChip from "./PaymentMethodChip";
interface IOrder {
  id: string;
  courseId: {
    _id: string;
    name: string;
    price: number;
    thumbnail?: {
      url: string;
    };
  };
  userId: {
    _id: string;
    name: string;
    email: string;
    avatar?: {
      url: string;
    };
  };
  payment_info: {
    id: string;
    status: string;
    amount: number;
    currency: string;
  };
  status: string;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}
interface AllInvoicesProps {
  id: string;
}

const AllInvoices: React.FC<AllInvoicesProps> = ({ id }) => {
  const { theme } = useTheme();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<GridRowId | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:900px)");

  const {
    data: ordersData,
    isLoading,
    error,
    refetch,
  } = useGetAllOrdersQuery({});
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  // Extract orders array from the response data
  const orders = useMemo(() => {
    if (!ordersData) return [];
    if (ordersData.success && Array.isArray(ordersData.orders)) {
      return ordersData.orders;
    }
    return [];
  }, [ordersData]);

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success("Invoices refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh invoices");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedId) return;

    try {
      const { data } = await deleteOrder(selectedId.toString()).unwrap();
      toast.success(data?.message || "Invoice deleted successfully");
      setOpenConfirm(false);
      handleRefresh();
      // Use RTK Query's cache invalidation instead of manual refetch
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.error ||
          "Failed to delete invoice. Please try again.",
      );
      console.error("Delete error:", error);
    }
  };

  const filteredOrders = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();

    return orders
      .filter((order: IOrder) => {
        const userName = order.userId?.name || "N/A";
        const courseName = order.courseId?.name || "Unknown Course";
        const invoiceId = order.id || "";
        const transactionId = order.payment_info?.id || "";

        return (
          userName.toLowerCase().includes(searchLower) ||
          courseName.toLowerCase().includes(searchLower) ||
          invoiceId.toLowerCase().includes(searchLower) ||
          transactionId.toLowerCase().includes(searchLower)
        );
      })
      .map((order: IOrder) => ({
        id: order.id,
        user: {
          name: order.userId?.name || "N/A",
          email: order.userId?.email || "",
          avatar: order.userId?.avatar?.url || "",
        },
        course: {
          name: order.courseId?.name || "Unknown Course",
          thumbnail: order.courseId?.thumbnail?.url || "",
          price: order.totalAmount || 0,
        },
        status: order.status || "pending",
        paymentMethod: order.paymentMethod || "unknown",
        payment_info: {
          id: order.payment_info?.id || "N/A",
          status: order.payment_info?.status || "",
          amount: order.payment_info?.amount || 0,
        },
        createdAt: order.createdAt,
      }));
  }, [orders, searchTerm]);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "INVOICE",
      flex: isMobile ? 0.5 : 0.8,
      minWidth: isMobile ? 50 : 80,
      renderCell: (params) => (
        <Typography variant="body2" noWrap color="text.primary">
          #{params?.value?.substring(0, 8)}
        </Typography>
      ),
    },
    {
      field: "user",
      headerName: "CUSTOMER",
      flex: isMobile ? 1 : 1.2,
      minWidth: isMobile ? 50 : 100,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <Avatar
            src={params?.row.user.avatar}
            alt={params?.row.user.name}
            sx={{ width: 32, height: 32 }}
          >
            {params?.row.user.name.charAt(0)}
          </Avatar>
          {!isMobile && (
            <Typography variant="body2" noWrap color="text.primary">
              {params?.row.user.name}
            </Typography>
          )}
        </div>
      ),
    },
    {
      field: "course",
      headerName: "COURSE",
      flex: isMobile ? 1 : 1.2,
      minWidth: isMobile ? 150 : 200,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <Avatar
            variant="rounded"
            src={params?.row.course.thumbnail}
            alt={params?.row.course.name}
            sx={{ width: 32, height: 32 }}
          />
          <Typography variant="body2" noWrap color="text.primary">
            {params?.row.course.name}
          </Typography>
        </div>
      ),
    },
    {
      field: "course.price",
      headerName: "AMOUNT",
      flex: isMobile ? 0.5 : 0.8,
      minWidth: isMobile ? 80 : 100,
      type: "number",
      valueGetter: (params) => params?.row.course.price,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold" color="primary">
          ${params?.row.course.price.toFixed(2)}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "STATUS",
      flex: isMobile ? 0.5 : 0.8,
      minWidth: isMobile ? 80 : 100,
      renderCell: (params) => <StatusBadge status={params?.value} />,
    },
    ...(!isMobile
      ? [
          {
            field: "paymentMethod",
            headerName: "PAYMENT",
            flex: 0.8,
            minWidth: 80,
            renderCell: (params) => (
              <PaymentMethodChip method={params?.value} />
            ),
          },
          {
            field: "payment_info.id",
            headerName: "TRANSACTION",
            flex: 1,
            minWidth: 80,
            valueGetter: (params) => params?.row.payment_info.id,
            renderCell: (params) => (
              <Typography variant="body2" noWrap color="text.primary">
                {params?.value?.substring(0, 6)}...{params?.value?.slice(-4)}
              </Typography>
            ),
          },
        ]
      : []),
    {
      field: "createdAt",
      headerName: "DATE",
      flex: isMobile ? 0.8 : 0.8,
      minWidth: isMobile ? 80 : 100,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {formatDate(params?.value, isMobile ? "MMM dd" : "MMM dd, yyyy")}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      type: "actions",
      flex: isMobile ? 0.5 : 0.8,
      minWidth: isMobile ? 80 : 100,
      getActions: (params) => [
        <GridActionsCellItem
          key={`view-${params.id}`}
          icon={
            <Tooltip title="View">
              <AiOutlineEye
                className={theme === "dark" ? "text-blue-300" : "text-blue-600"}
                size={18}
              />
            </Tooltip>
          }
          label="View"
          onClick={() => router.push(`/admin/invoices/${params.id}`)}
          showInMenu
        />,
        <GridActionsCellItem
          key={`delete-${params.id}`}
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
          Failed to load invoices
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
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 4,
          gap: 2,
          "& .MuiButton-root": {
            color: theme === "dark" ? "common.white" : "white",
          },
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          color={theme === "dark" ? "common.white" : "text.black"}
          sx={{
            fontSize: { xs: "1.5rem", sm: "2rem" },
            mb: { xs: 1, sm: 0 },
          }}
        >
          Invoice Management
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: { xs: "100%", sm: "auto" },
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search invoices..."
            style={{
              color: theme === "dark" ? "white" : "black",
              backgroundColor: theme === "dark" ? "#333" : "#fff",
              width: "100%",
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleRefresh}
            startIcon={
              <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
            }
            disabled={isLoading}
            sx={{
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Refresh
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
          rows={filteredOrders}
          columns={columns}
          loading={isLoading}
          getRowId={(row) => row.id}
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
                  No invoices available
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
        content="Are you sure you want to delete this invoice? This action cannot be undone."
        loading={isDeleting}
      />
    </div>
  );
};

export default AllInvoices;
