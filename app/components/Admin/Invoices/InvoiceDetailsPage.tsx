"use client";
import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  Divider,
  Avatar,
  Paper,
  Stack,
} from "@mui/material";
import {
  AiOutlinePrinter,
  AiOutlineDownload,
  AiOutlineArrowLeft,
} from "react-icons/ai";
import { useTheme } from "next-themes";
import { useGetOrderByIdQuery } from "@/redux/features/orders/ordersApi";
import { formatDate } from "../../../utils/dateUtils";
import StatusBadge from "./StatusBadge";
import PaymentMethodChip from "./PaymentMethodChip";
import Loading from "../../Loader/Loader";
import ErrorMessage from "../../shared/ErrorMessage";
import { toast } from "react-hot-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface Props {
  id: string;
}

const InvoiceDetailsPage = ({ id }: Props) => {
  const router = useRouter();
  const { theme } = useTheme();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error, refetch } = useGetOrderByIdQuery(id);
  const invoice = data?.order;
  const calculateDiscountPercentage = () => {
    if (!invoice?.courseId?.estimatedPrice || !invoice?.price) return 0;
    return Math.round(
      (1 - invoice.price / invoice.courseId.estimatedPrice) * 100,
    );
  };
  const estimatedPrice = invoice?.courseId?.estimatedPrice || 0;
  const salePrice = invoice?.price || invoice?.courseId?.price || 0; // Check both locations

  const discountAmount = estimatedPrice - salePrice;
  const totalAmount = estimatedPrice; // Use actual paid amount if available
  const discountPercentage =
    estimatedPrice > 0
      ? Math.round((discountAmount / estimatedPrice) * 100)
      : 0;

  // const calculateDiscountAmount = () => {
  //   if (!invoice?.courseId?.estimatedPrice || !invoice?.totalAmount) return 0
  //   return (invoice.courseId.estimatedPrice - invoice.totalAmount).toFixed(2)
  // }

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      toast.success("Preparing invoice for printing...");
      const printContent = invoiceRef.current?.innerHTML;
      const originalContent = document.body.innerHTML;

      document.body.innerHTML = printContent || "";
      window.print();
      document.body.innerHTML = originalContent;

      // Restore the scroll position
      window.location.reload();
    }
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    toast.loading("Generating PDF...", { id: "pdf-download" });
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`invoice_${invoice?.id || "unknown"}.pdf`);
      toast.success("PDF downloaded successfully!", { id: "pdf-download" });
    } catch (error) {
      toast.error("Failed to generate PDF", { id: "pdf-download" });
      console.error("PDF generation error:", error);
    }
  };

  if (isLoading) return <Loading />;
  if (error) {
    console.error("Error loading invoice:", error);
    return (
      <ErrorMessage
        message={`Failed to load invoice details: ${error.message}`}
        onRetry={refetch}
      />
    );
  }

  if (!invoice) {
    return <ErrorMessage message="Invoice not found" onRetry={refetch} />;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Action buttons */}
      <Stack
        direction="row"
        justifyContent="space-between"
        mb={4}
        flexWrap="wrap"
        gap={2}
      >
        <Button
          startIcon={<AiOutlineArrowLeft />}
          onClick={() => router.back()}
          sx={{ textTransform: "none", order: { xs: 2, sm: 1 } }}
          variant="outlined"
        >
          Back to Invoices
        </Button>

        <Stack direction="row" gap={2} sx={{ order: { xs: 1, sm: 2 } }}>
          <Button
            variant="outlined"
            startIcon={<AiOutlinePrinter />}
            onClick={handlePrint}
            sx={{ textTransform: "none" }}
          >
            Print Invoice
          </Button>
          <Button
            variant="contained"
            startIcon={<AiOutlineDownload />}
            onClick={handleDownloadPDF}
            sx={{ textTransform: "none" }}
          >
            Download PDF
          </Button>
        </Stack>
      </Stack>

      {/* Invoice content */}
      <Box ref={invoiceRef} sx={{ backgroundColor: "background.paper" }}>
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              gap: 3,
              mb: 3,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontSize: {
                    xs: '1.5rem', 
                    sm: '2.125rem' 
                  },
                  fontWeight: "bold"
                }}
              >
                Invoice #{invoice.id}
              </Typography>
            </Box>

            <Box sx={{ textAlign: { xs: "left", md: "right" } }}>
              <Typography variant="subtitle2" color="text.secondary">
                Date Issued
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {formatDate(invoice.createdAt)}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary" mt={1}>
                Due Date
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {formatDate(
                  new Date(invoice.createdAt).setDate(
                    new Date(invoice.createdAt).getDate() + 7,
                  ),
                )}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Customer and payment info */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Billed To
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={invoice.userId?.avatar}
                  alt={invoice.userId?.name}
                />
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    {invoice.userId?.name || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {invoice.userId?.email || ""}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Payment Information
              </Typography>
              <PaymentMethodChip method={invoice.paymentMethod} />
              {invoice.payment_info?.transactionId && (
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Transaction ID: {invoice.payment_info.transactionId}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary" mt={1}>
                Payment Status: {invoice.status}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Course details */}
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Course Details
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 3,
              mt: 3,
            }}
          >
            <Avatar
              variant="rounded"
              src={invoice.courseId?.thumbnail?.url}
              alt={invoice.courseId?.name}
              sx={{ width: 80, height: 80 }}
            />

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {invoice.courseId?.name || "N/A"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Level: {invoice.courseId?.level || "N/A"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Purchased: {invoice.courseId?.purchased || 0} times
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {invoice.courseId?.description || "No description available"}
              </Typography>
            </Box>

            <Box
              sx={{
                textAlign: { xs: "left", sm: "right" },
                mt: { xs: 2, sm: 0 },
              }}
            >
              <Typography
                variant="h6"
                color={theme === "dark" ? "success.light" : "success.dark"}
              >
                ${estimatedPrice.toFixed(2)}{" "}
                {/* Changed from invoice.price to salePrice */}
              </Typography>
              {salePrice > 0 && (
                <>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textDecoration: "line-through" }}
                  >
                    ${salePrice.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    {discountPercentage}% OFF
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Payment summary */}
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Payment Summary
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="body1">Original Price</Typography>
              <Typography variant="body1">${salePrice.toFixed(2)}</Typography>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="body1">
                Discount ({discountPercentage}%)
              </Typography>
              <Typography variant="body1" color="success.main">
                -${discountAmount.toFixed(2)}
              </Typography>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="body1">Sale Price</Typography>
              <Typography variant="body1">
                ${estimatedPrice.toFixed(2)}
              </Typography>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="body1">Tax (0%)</Typography>
              <Typography variant="body1">$0.00</Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6" fontWeight="bold">
                Total Amount
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                color={theme === "dark" ? "success.light" : "success.dark"}
              >
                ${totalAmount.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: "center", color: "text.secondary" }}>
          <Typography variant="body2">Thank you for your purchase!</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            For any questions regarding this invoice, please contact
            support@example.com
          </Typography>
          <Typography variant="body2" sx={{ mt: 2, fontStyle: "italic" }}>
            This is an auto-generated invoice. No signature required.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default InvoiceDetailsPage;
