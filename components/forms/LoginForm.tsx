"use client";

import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useAuth } from "@/contexts/AuthContext";
import ForgotPasswordModal from "./ForgotPasswordModal";

interface LoginFormProps {
  onDemoLogin?: (email: string, password: string) => void;
}

export interface LoginFormRef {
  handleDemoLogin: (email: string, password: string) => void;
}

const LoginForm = forwardRef<LoginFormRef, LoginFormProps>(
  ({ onDemoLogin }, ref) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const { setIsSubmitting, setIsRedirecting, isRedirecting } = useAuth();

    useEffect(() => {
      return () => {
        setIsRedirecting(false);
      };
    }, [setIsRedirecting]);

    useEffect(() => {
      const message = searchParams.get("message");
      const verified = searchParams.get("verified");
      const email = searchParams.get("email");

      if (message === "verification-sent") {
        setVerificationMessage(
          "Please check your email and click the verification link to activate your account."
        );
        if (email) {
          setEmail(decodeURIComponent(email));
        }
      } else if (verified === "true" && email) {
        setVerificationMessage(
          `Your email ${email} has been successfully verified! You can now log in.`
        );
        setEmail(decodeURIComponent(email));
      } else if (message === "password-reset-success") {
        setVerificationMessage(
          "Your password has been successfully reset! You can now log in with your new password."
        );
      }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await performLogin(email, password);
    };

    const performLogin = async (
      emailValue: string,
      passwordValue: string,
      rememberMeValue?: boolean
    ) => {
      setIsLoading(true);
      setIsSubmitting(true);
      setError("");

      try {
        const result = await signIn("credentials", {
          email: emailValue,
          password: passwordValue,
          rememberMe: rememberMeValue ?? rememberMe,
          redirect: false,
        });

        if (result?.error) {
          setError(result.error);
        } else if (result?.ok) {
          setIsRedirecting(true);
          router.push("/reservation");
        }
      } catch {
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
        setIsSubmitting(false);
      }
    };

    const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
      setEmail(demoEmail);
      setPassword(demoPassword);
      setRememberMe(true);
      setTimeout(() => {
        performLogin(demoEmail, demoPassword, true);
      }, 100);
    };

    useImperativeHandle(ref, () => ({
      handleDemoLogin,
    }));

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-11 rounded-lg border-gray-200 focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 h-11 rounded-lg border-gray-200 focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
              required
            />
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
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
              className="rounded border-gray-300 focus:ring-[#2563EB]/20 cursor-pointer"
            />
            <Label
              htmlFor="remember"
              className="text-sm text-gray-600 cursor-pointer"
            >
              Remember me
            </Label>

            <input
              type="hidden"
              name="rememberMe"
              value={rememberMe ? "true" : "false"}
            />
          </div>

          <button
            type="button"
            onClick={() => setIsForgotPasswordOpen(true)}
            className="text-sm text-[#2563EB] hover:text-[#1d4ed8] transition-colors cursor-pointer"
          >
            Forgot password?
          </button>
        </div>

        {verificationMessage && (
          <div
            className={`p-3 rounded-lg text-sm ${
              verificationMessage.includes("successfully verified")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}
          >
            {verificationMessage}
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading || isRedirecting}
          className="w-full h-11 bg-black text-white hover:bg-neutral-800 hover:scale-105 transition-all duration-200 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              <span>Signing in...</span>
            </div>
          ) : isRedirecting ? (
            "Redirecting..."
          ) : (
            "Login"
          )}
        </Button>

        <ForgotPasswordModal
          isOpen={isForgotPasswordOpen}
          onClose={() => setIsForgotPasswordOpen(false)}
        />
      </form>
    );
  }
);

LoginForm.displayName = "LoginForm";

export default LoginForm;
