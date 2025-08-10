// components/shared/SearchBar.tsx
import React from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  styled,
} from "@mui/material";
import { Search as SearchIcon, Close as CloseIcon } from "@mui/icons-material";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  placeholder?: string;
  width?: string | number;
}

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.05)",
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.08)"
          : "rgba(0, 0, 0, 0.08)",
    },
    "&.Mui-focused": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(0, 0, 0, 0.1)",
    },
  },
  "& .MuiOutlinedInput-input": {
    padding: "10px 14px",
  },
}));

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  placeholder = "Search...",
  width = "100%",
}) => {
  return (
    <Box sx={{ width }}>
      <StyledTextField
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        fullWidth
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: value && (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onClick={onClear}
                size="small"
                sx={{
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.7)"
                      : "rgba(0, 0, 0, 0.54)",
                  "&:hover": {
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.9)"
                        : "rgba(0, 0, 0, 0.87)",
                  },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            pr: value ? 0.5 : 1,
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;
