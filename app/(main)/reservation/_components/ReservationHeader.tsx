import { Calendar } from "lucide-react";

const ReservationHeader = () => {
  return (
    <div className="bg-white border-b">
      <div className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Reservation</h1>
        </div>
        <p className="text-gray-600">
          Select your preferred date and time slot for your appointment
        </p>
      </div>
    </div>
  );
};

export default ReservationHeader;
