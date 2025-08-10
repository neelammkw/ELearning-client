// components/shared/ErrorMessage.tsx
import { Button, Typography, Box } from "@mui/material";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "50vh",
        gap: 2,
      }}
    >
      <Typography variant="h6" color="error">
        {message}
      </Typography>
      {onRetry && (
        <Button variant="contained" onClick={onRetry}>
          Retry
        </Button>
      )}
    </Box>
  );
};

export default ErrorMessage;
