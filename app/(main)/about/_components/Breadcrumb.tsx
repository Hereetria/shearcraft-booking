import Link from "next/link";

const Breadcrumb = () => {
  return (
    <div className="mx-auto max-w-screen-xl px-4 pt-20 md:px-6 lg:px-8">
      <nav className="flex items-center space-x-2 text-sm text-gray-600">
        <Link href="/" className="hover:text-gray-900 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-gray-900">About</span>
      </nav>
    </div>
  );
};

export default Breadcrumb;
