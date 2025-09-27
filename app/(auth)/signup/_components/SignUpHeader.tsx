import { CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const SignUpHeader = () => {
  return (
    <CardHeader className="text-center pb-6">
      <CardTitle className="text-2xl font-bold text-gray-900">
        Create Account
      </CardTitle>
      <p className="text-sm text-gray-600 mt-2">
        Join ShearCraft and start booking your appointments
      </p>
    </CardHeader>
  );
};

export default SignUpHeader;
