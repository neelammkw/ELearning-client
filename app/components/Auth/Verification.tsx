import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { useTheme } from "next-themes";
import { useSelector } from "react-redux";
import { useActivationMutation } from "@/redux/features/auth/authApi";

interface Props {
  setRoute: (route: string) => void;
  setOpen?: (open: boolean) => void;
}

type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
};

const Verification: React.FC<Props> = ({ setRoute, setOpen }) => {
  const { token } = useSelector((state: any) => state.auth);
  const [activation, { isSuccess, error }] = useActivationMutation();
  const [invalidError, setInvalidError] = useState<boolean>(false);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account activated successfully");
      setRoute("Login");
      setOpen?.(false);
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
        setInvalidError(true);
      } else {
        toast.error("Verification failed");
      }
    }
  }, [isSuccess, error]);

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    "0": "",
    "1": "",
    "2": "",
    "3": "",
  });
  const [timeLeft, setTimeLeft] = useState(30);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleInputChange = (index: keyof VerifyNumber, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newVerifyNumber = { ...verifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);
    setInvalidError(false);

    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (
    index: keyof VerifyNumber,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !verifyNumber[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const verifyOTP = async () => {
    const otp = Object.values(verifyNumber).join("");

    if (otp.length !== 4) {
      setInvalidError(true);
      toast.error("Please enter a 4-digit code");
      return;
    }

    try {
      await activation({
        activation_token: token,
        activation_code: otp,
      });
    } catch (err) {
      console.error("Verification error:", err);
    }
  };

  const resendOTP = () => {
    setTimeLeft(30);
    toast.success("A new verification code has been sent");
    // Add your resend OTP logic here
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  return (
    <div className="w-full px-4 py-6 sm:p-6">
      <div
        className={`backdrop-blur-sm bg-opacity-50 ${isDark ? "bg-slate-800" : "bg-slate-100"} rounded-lg shadow-lg max-w-md mx-auto`}
      >
        <div className="p-4 sm:p-6">
          <div className="flex flex-col items-center justify-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${isDark ? "bg-blue-900" : "bg-blue-100"}`}
            >
              <VscWorkspaceTrusted
                size={30}
                className={`${isDark ? "text-blue-300" : "text-blue-600"}`}
              />
            </div>
            <h1
              className={`text-2xl sm:text-3xl ${isDark ? "text-white" : "text-black"} font-medium text-center mt-4`}
            >
              Verification
            </h1>
            <p
              className={`text-sm sm:text-base ${isDark ? "text-gray-300" : "text-gray-600"} text-center mt-2`}
            >
              Enter the 4-digit code sent to your email
            </p>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            {Object.keys(verifyNumber).map((key, index) => (
              <input
                key={key}
                ref={inputRefs[index]}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={verifyNumber[key as keyof VerifyNumber]}
                onChange={(e) =>
                  handleInputChange(key as keyof VerifyNumber, e.target.value)
                }
                onKeyDown={(e) => handleKeyDown(key as keyof VerifyNumber, e)}
                className={`w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl rounded-lg border ${
                  isDark ? "bg-gray-700 text-white" : "bg-white text-black"
                } ${
                  invalidError
                    ? "border-red-500 animate-shake"
                    : isDark
                      ? "border-gray-600"
                      : "border-gray-300"
                } focus:outline-none focus:ring-2 ${
                  isDark ? "focus:ring-blue-500" : "focus:ring-blue-400"
                }`}
              />
            ))}
          </div>

          {invalidError && (
            <p className="text-center mt-3 text-sm text-red-500">
              Please enter a valid 4-digit code
            </p>
          )}

          <button
            onClick={verifyOTP}
            disabled={Object.values(verifyNumber).join("").length !== 4}
            className={`w-full py-2 sm:py-3 rounded-lg font-medium mt-6 ${
              isDark
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            Verify
          </button>

          <div className="flex justify-center mt-4">
            {timeLeft > 0 ? (
              <p
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Resend code in {timeLeft}s
              </p>
            ) : (
              <button
                onClick={resendOTP}
                className={`text-sm font-medium ${
                  isDark
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-500"
                }`}
              >
                Resend Code
              </button>
            )}
          </div>

          <p
            className={`text-center text-sm ${
              isDark ? "text-gray-400" : "text-gray-600"
            } mt-6`}
          >
            Didn't receive the code? Check your spam folder or{" "}
            <button
              onClick={() => setRoute("Sign-Up")}
              className={`font-medium ${
                isDark
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-500"
              }`}
            >
              update your email
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verification;
