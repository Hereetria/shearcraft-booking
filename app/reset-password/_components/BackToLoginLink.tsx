import Link from "next/link";

export default function BackToLoginLink() {
  return (
    <div className="text-center">
      <Link
        href="/login"
        className="text-sm text-[#2563EB] hover:text-[#1d4ed8] transition-colors"
      >
        ← Back to Login
      </Link>
    </div>
  );
}
