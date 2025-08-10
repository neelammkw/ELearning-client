"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useUpdatePasswordMutation } from "@/redux/features/user/userApi";

type FormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const ChangePassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const [updatePassword, { reset: resetMutation }] =
    useUpdatePasswordMutation();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    const { currentPassword, newPassword, confirmPassword } = data;

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await updatePassword({
        oldPassword: currentPassword,
        newPassword,
      }).unwrap();
      toast.success("Password updated successfully");
      reset();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
      resetMutation();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Current Password</label>
        <input
          type="password"
          {...register("currentPassword", {
            required: "Current password is required",
          })}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
        {errors.currentPassword && (
          <p className="text-red-500 text-sm">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">New Password</label>
        <input
          type="password"
          {...register("newPassword", {
            required: "New password is required",
            minLength: {
              value: 6,
              message: "New password must be at least 6 characters",
            },
          })}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
        {errors.newPassword && (
          <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">
          Confirm New Password
        </label>
        <input
          type="password"
          {...register("confirmPassword", {
            required: "Please confirm your new password",
            validate: (value) =>
              value === watch("newPassword") || "Passwords do not match",
          })}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        {loading ? "Changing..." : "Change Password"}
      </button>
    </form>
  );
};

export default ChangePassword;
