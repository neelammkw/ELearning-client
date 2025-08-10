import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiFillGithub,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useTheme } from "next-themes";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-hot-toast";

interface Props {
  setRoute: (route: string) => void;
  setOpen?: (open: boolean) => void;
}

const signUpSchema = Yup.object().shape({
  name: Yup.string().required("Please enter your name").min(3),
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email"),
  password: Yup.string()
    .required("Please enter your password")
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/,
      "Must contain uppercase, lowercase, number, and special character",
    ),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const SignUp: React.FC<Props> = ({ setRoute, setOpen }) => {
  const [show, setShow] = useState({
    password: false,
    confirmPassword: false,
  });
  const [register, { data, isSuccess, error }] = useRegisterMutation();

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Registration successful";
      toast.success(message);
      setRoute("Verification");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error]);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: signUpSchema,
    onSubmit: async ({ name, email, password }) => {
      const data = { name, email, password };
      await register(data);

      // setOpen?.(false);
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full px-4 py-6 sm:p-6">
      <div
        className={`backdrop-blur-sm bg-opacity-50 ${isDark ? "bg-slate-800" : "bg-slate-100"} rounded-lg shadow-lg max-w-md mx-auto`}
      >
        <div className="p-4 sm:p-6">
          <h1
            className={`text-2xl sm:text-3xl ${isDark ? "text-white" : "text-black"} font-medium text-center mb-6`}
          >
            Create Your Account
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className={`block text-sm sm:text-base ${isDark ? "text-gray-300" : "text-gray-700"} mb-1`}
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border ${isDark ? "bg-gray-700 text-white" : "bg-white text-black"} ${
                  errors.name && touched.name
                    ? "border-red-500"
                    : isDark
                      ? "border-gray-600"
                      : "border-gray-300"
                }`}
              />
              {errors.name && touched.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                className={`block text-sm sm:text-base ${isDark ? "text-gray-300" : "text-gray-700"} mb-1`}
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border ${isDark ? "bg-gray-700 text-white" : "bg-white text-black"} ${
                  errors.email && touched.email
                    ? "border-red-500"
                    : isDark
                      ? "border-gray-600"
                      : "border-gray-300"
                }`}
              />
              {errors.email && touched.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <label
                className={`block text-sm sm:text-base ${isDark ? "text-gray-300" : "text-gray-700"} mb-1`}
              >
                Password
              </label>
              <input
                type={show.password ? "text" : "password"}
                name="password"
                value={values.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border ${isDark ? "bg-gray-700 text-white" : "bg-white text-black"} ${
                  errors.password && touched.password
                    ? "border-red-500"
                    : isDark
                      ? "border-gray-600"
                      : "border-gray-300"
                }`}
              />
              <button
                type="button"
                className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => setShow({ ...show, password: !show.password })}
              >
                {show.password ? (
                  <AiOutlineEyeInvisible size={18} />
                ) : (
                  <AiOutlineEye size={18} />
                )}
              </button>
              {errors.password && touched.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="relative">
              <label
                className={`block text-sm sm:text-base ${isDark ? "text-gray-300" : "text-gray-700"} mb-1`}
              >
                Confirm Password
              </label>
              <input
                type={show.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border ${isDark ? "bg-gray-700 text-white" : "bg-white text-black"} ${
                  errors.confirmPassword && touched.confirmPassword
                    ? "border-red-500"
                    : isDark
                      ? "border-gray-600"
                      : "border-gray-300"
                }`}
              />
              <button
                type="button"
                className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() =>
                  setShow({ ...show, confirmPassword: !show.confirmPassword })
                }
              >
                {show.confirmPassword ? (
                  <AiOutlineEyeInvisible size={18} />
                ) : (
                  <AiOutlineEye size={18} />
                )}
              </button>
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className={`w-full py-2 sm:py-3 rounded-lg font-medium ${isDark ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white transition-colors`}
            >
              Sign Up
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div
                  className={`w-full border-t ${isDark ? "border-gray-600" : "border-gray-300"}`}
                ></div>
              </div>
              <div className="relative flex justify-center">
                <span
                  className={`px-2 text-sm ${isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"}`}
                >
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                type="button"
                className={`p-2 sm:p-3 rounded-full ${isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"} transition-colors`}
              >
                <FcGoogle size={20} />
              </button>
              <button
                type="button"
                className={`p-2 sm:p-3 rounded-full ${isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"} transition-colors`}
              >
                <AiFillGithub
                  size={20}
                  className={isDark ? "text-white" : "text-black"}
                />
              </button>
            </div>

            <p
              className={`text-center text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Already have an account?{" "}
              <button
                type="button"
                className={`font-medium ${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"}`}
                onClick={() => setRoute("Login")}
              >
                Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
