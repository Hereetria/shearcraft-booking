import Link from "next/link";

const SignUpLink = () => {
  return (
    <div className="text-center pt-4">
      <p className="text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-[#2563EB] hover:text-[#1d4ed8] font-medium transition-colors"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default SignUpLink;
