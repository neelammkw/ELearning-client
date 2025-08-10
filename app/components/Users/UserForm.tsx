"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-hot-toast";
import {
  useCreateUserMutation,
  useUpdateUserRoleMutation,
} from "@/redux/features/user/userApi";
import { useTheme } from "next-themes";

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: any;
  isTeam?: boolean;
  canDowngradeAdmin?: boolean;
}

const UserForm = ({
  open,
  onClose,
  onSuccess,
  user,
  isTeam,
  canDowngradeAdmin = false,
}: UserFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: isTeam ? "admin" : "user",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUserRole, { isLoading: isUpdating }] =
    useUpdateUserRoleMutation();
  const { theme } = useTheme();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        role: isTeam ? "admin" : "user",
      });
    }
  }, [user, isTeam]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({ email: "", password: "" });

    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    // Only require password for new user creation (not team updates)
    if (!user && !formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    try {
      if (user) {
        // This is an existing user - update their role
        const result = await updateUserRole({
          email: formData.email,
          role: formData.role,
        }).unwrap();
        toast.success("User role updated successfully");
      } else {
        // This is a new user - create them
        const result = await createUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }).unwrap();
        toast.success(
          isTeam
            ? "Team member added successfully"
            : "User created successfully",
        );
      }
      setFormData({
        name: "",
        email: "",
        password: "",
        role: isTeam ? "admin" : "user",
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("API Error:", error);
      const message = error?.data?.message || error?.message;
      if (message.includes("certificate")) {
        toast.error("Security configuration error - please contact support");
      } else {
        toast.error(message || "Operation failed");
      }
    }
  };

  if (!open) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor:
          theme === "dark" ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <Box
        sx={{
          backgroundColor: theme === "dark" ? "#d1cdcd" : "background.paper",
          padding: 3,
          borderRadius: 2,
          width: "90%",
          color: "text.primary !important",
          maxWidth: 500,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Typography variant="h5" mb={3} sx={{ color: "text.primary" }}>
          {user
            ? isTeam
              ? "Update Team Member Role"
              : "Edit User"
            : isTeam
              ? "Add Team Member"
              : "Add New User"}
        </Typography>

        <form onSubmit={handleSubmit}>
          {(!user || !isTeam) && (
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              margin="normal"
              required={!user}
              disabled={!!user}
            />
          )}

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            margin="normal"
            required
            disabled={!!user}
            error={!!errors.email}
            helperText={errors.email}
          />

          {!user && (
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              margin="normal"
              required
              error={!!errors.password}
              helperText={errors.password}
            />
          )}

          <TextField
            select
            fullWidth
            label="Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            margin="normal"
            disabled={isTeam && !user}
          >
            <MenuItem value="admin">Admin</MenuItem>
            {(!user || formData.role !== "admin" || canDowngradeAdmin) && (
              <MenuItem value="user">User</MenuItem>
            )}
          </TextField>

          {user?.role === "admin" && canDowngradeAdmin && (
            <Typography variant="caption" color="error">
              You are downgrading an admin to a user.
            </Typography>
          )}

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}
          >
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating ? (
                <CircularProgress size={24} />
              ) : user ? (
                "Update"
              ) : isTeam ? (
                "Add Member"
              ) : (
                "Create User"
              )}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default UserForm;
