import Image from "next/image";

const AuthBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      <Image
        src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70"
        alt="Auth background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
};

export default AuthBackground;
