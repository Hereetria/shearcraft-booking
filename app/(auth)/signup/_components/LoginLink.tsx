import Link from "next/link";

const LoginLink = () => {
  return (
    <div className="text-center pt-4">
      <p className="text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[#2563EB] hover:text-[#1d4ed8] font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default LoginLink;
