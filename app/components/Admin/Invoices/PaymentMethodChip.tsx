import { Chip } from "@mui/material";
import { FaCcVisa, FaCcMastercard, FaPaypal, FaBitcoin } from "react-icons/fa";
import { SiStripe } from "react-icons/si";

const methodIcons: Record<string, JSX.Element> = {
  credit_card: <FaCcVisa />,
  paypal: <FaPaypal />,
  stripe: <SiStripe />,
  crypto: <FaBitcoin />,
  bank_transfer: <FaCcMastercard />,
};

const methodLabels: Record<string, string> = {
  credit_card: "Credit Card",
  paypal: "PayPal",
  stripe: "Stripe",
  crypto: "Crypto",
  bank_transfer: "Bank Transfer",
};

const PaymentMethodChip = ({ method }: { method: string }) => {
  return (
    <Chip
      icon={methodIcons[method] || undefined}
      label={methodLabels[method] || method}
      size="small"
      variant="outlined"
      sx={{
        textTransform: "capitalize",
        fontWeight: "medium",
        "& .MuiChip-icon": {
          fontSize: "0.9rem",
          ml: 0.5,
        },
      }}
    />
  );
};

export default PaymentMethodChip;
