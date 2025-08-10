"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Rating,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "next-themes";
import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
} from "@/redux/features/courses/coursesApi";
import { toast } from "react-hot-toast";

interface CourseFormProps {
  open: boolean;
  onClose: () => void;
  course: any | null;
  onSuccess: () => void;
}

const CourseForm = ({ open, onClose, course, onSuccess }: CourseFormProps) => {
  const { theme } = useTheme();
  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    ratings: 0,
    thumbnail: null as File | null,
  });

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        description: course.description || "",
        price: course.price?.toString() || "",
        ratings: course.ratings || 0,
        thumbnail: null,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        price: "",
        ratings: 0,
        thumbnail: null,
      });
    }
  }, [course]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, thumbnail: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("ratings", formData.ratings.toString());
    if (formData.thumbnail) {
      data.append("thumbnail", formData.thumbnail);
    }

    try {
      if (course) {
        await updateCourse({ id: course._id, data }).unwrap();
        toast.success("Course updated successfully");
      } else {
        await createCourse(data).unwrap();
        toast.success("Course created successfully");
      }
      onSuccess();
    } catch (error) {
      toast.error("Failed to save course");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{course ? "Edit Course" : "Create New Course"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
            />
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              inputProps={{ step: "0.01" }}
            />
            <div>
              <Typography component="legend">Ratings</Typography>
              <Rating
                name="ratings"
                value={formData.ratings}
                onChange={(_, newValue) => {
                  setFormData((prev) => ({ ...prev, ratings: newValue || 0 }));
                }}
                precision={0.5}
              />
            </div>
            <div>
              <Typography variant="subtitle2" gutterBottom>
                Thumbnail
              </Typography>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isCreating || isUpdating}
        >
          {isCreating || isUpdating ? (
            <CircularProgress size={24} />
          ) : course ? (
            "Update"
          ) : (
            "Create"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourseForm;
