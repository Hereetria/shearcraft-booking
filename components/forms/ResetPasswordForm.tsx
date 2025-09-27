"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setIsSubmitting } = useAuth();

  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!token) {
      setErrorMessage("Invalid or missing reset token");
      setIsValidToken(false);
      return;
    }

    const validateToken = async () => {
      try {
        const response = await axios.get(
          `/api/auth/validate-reset-token?token=${token}`
        );
        if (response.data.valid) {
          setIsValidToken(true);
        } else {
          setErrorMessage("Invalid or expired reset token");
          setIsValidToken(false);
        }
      } catch (error) {
        setErrorMessage("Invalid or expired reset token");
        setIsValidToken(false);
      }
    };

    validateToken();
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/auth/reset-password", {
        token,
        password: data.password,
      });

      if (response.data.success) {
        setIsSuccess(true);

        setTimeout(() => {
          router.push("/login?message=password-reset-success");
        }, 3000);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.error || "Something went wrong.");
      } else {
        setErrorMessage("Unexpected error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isValidToken === null) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#2563EB] border-t-transparent mx-auto"></div>
        <p className="text-gray-600 text-sm mt-2">Validating reset token...</p>
      </div>
    );
  }

  if (isValidToken === false) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
          <Lock className="h-8 w-8 text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Invalid Token</h3>
          <p className="text-gray-600 text-sm">
            This password reset link is invalid or has expired. Please request a new
            one.
          </p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
          <Lock className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Password Reset Successfully
          </h3>
          <p className="text-gray-600 text-sm">
            Your password has been updated. You will be redirected to the login page
            shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* New Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your new password"
            {...register("password")}
            className="pl-10 pr-10 h-11 border-gray-300 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          />
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your new password"
            {...register("confirmPassword")}
            className="pl-10 pr-10 h-11 border-gray-300 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          />
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
          {errorMessage}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 bg-black text-white hover:bg-neutral-800 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
            <span>Updating...</span>
          </div>
        ) : (
          "Update Password"
        )}
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
