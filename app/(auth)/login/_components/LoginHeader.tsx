import { CardHeader, CardTitle } from "@/components/ui/card";

const LoginHeader = () => {
  return (
    <CardHeader className="text-center pb-6">
      <CardTitle className="text-2xl font-bold text-gray-900">
        Welcome Back
      </CardTitle>
      <p className="text-sm text-gray-600 mt-2">
        Sign in to manage your reservations
      </p>
    </CardHeader>
  );
};

export default LoginHeader;
