import React, { useState, FC, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { AiOutlineCamera } from "react-icons/ai";
import avatarIcon from "../../../public/assets/avatar.png";
import {
  useUpdateAvatarMutation,
  useUpdateProfileMutation,
} from "@/redux/features/user/userApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import toast from "react-hot-toast";

interface Props {
  avatar: string | null;
  user: any;
}

const ProfileInfo: FC<Props> = ({ user, avatar }) => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const currentTheme = resolvedTheme || theme;
  const [name, setName] = useState(user?.name || "");
  const [editMode, setEditMode] = useState(false);
  const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
  const [updateProfile, { isSuccess: success, error: updateError }] =
    useUpdateProfileMutation();
  const [loadUser, setLoadUser] = useState(false);
  const {} = useLoadUserQuery(undefined, { skip: loadUser ? false : true });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          const avatar = reader.result;
          setPreviewImage(reader.result as string);
          updateAvatar(avatar);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (isSuccess || success) {
      setLoadUser(true);
      toast.success("Avatar updated successfully");
      window.location.reload();
      // refetch();
    }
    if (error || updateError) {
      toast.error("Error updating avatar");
      // setPreviewImage(null);
    }
  }, [isSuccess, error, success, updateError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name !== "") {
      await updateProfile({
        name: name,
      });
    }
  };

  if (!mounted) {
    return null;
  }

  // Determine which image to display
  const displayImage =
    previewImage || (user?.avatar?.url ? user.avatar.url : avatarIcon.src);

  return (
    <div
      className={`w-full p-6 ${currentTheme === "dark" ? "text-gray-200" : "text-gray-800"}`}
    >
      <h1 className="text-2xl font-bold mb-6">Profile Information</h1>

      <div className="flex flex-col items-center mb-8">
        <div className="relative w-32 h-32 mb-4">
          <Image
            src={displayImage}
            alt="Profile"
            width={128}
            height={128}
            priority
            className="rounded-full object-cover border-4 border-indigo-500"
          />
          {editMode && (
            <label className="absolute bottom-2 right-2 bg-indigo-600 p-2 rounded-full cursor-pointer">
              <AiOutlineCamera className="text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>
        <h2 className="text-xl font-semibold">{user?.name}</h2>
        <p className="text-gray-500">{user?.email}</p>
      </div>

      {/* Rest of your form remains the same */}
      {editMode ? (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-4">
            <label className="block mb-2 font-medium">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-2 rounded border ${currentTheme === "dark" ? "bg-slate-700 border-slate-600" : "bg-white border-gray-300"}`}
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-medium">Email Address</label>
            <p
              className={`p-2 rounded ${currentTheme === "dark" ? "bg-slate-700" : "bg-gray-100"}`}
            >
              {user?.email}
            </p>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className={`px-4 py-2 rounded ${currentTheme === "dark" ? "bg-slate-600 hover:bg-slate-500" : "bg-gray-200 hover:bg-gray-300"}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="max-w-md mx-auto">
          <div className="mb-4">
            <label className="block mb-1 font-medium">Full Name</label>
            <p
              className={`p-2 rounded ${currentTheme === "dark" ? "bg-slate-700" : "bg-gray-100"}`}
            >
              {user?.name}
            </p>
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">Email Address</label>
            <p
              className={`p-2 rounded ${currentTheme === "dark" ? "bg-slate-700" : "bg-gray-100"}`}
            >
              {user?.email}
            </p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
