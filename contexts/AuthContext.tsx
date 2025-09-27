"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  isForgotPasswordSubmitting: boolean;
  setIsForgotPasswordSubmitting: (value: boolean) => void;
  isRedirecting: boolean;
  setIsRedirecting: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotPasswordSubmitting, setIsForgotPasswordSubmitting] =
    useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        isSubmitting,
        setIsSubmitting,
        isForgotPasswordSubmitting,
        setIsForgotPasswordSubmitting,
        isRedirecting,
        setIsRedirecting,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
