import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import ReservationDatePicker from "./ReservationDatePicker";
import BusinessHoursInfo from "./BusinessHoursInfo";
import SlotsSection from "./SlotsSection";

const ReservationLeftColumn = () => {
  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Date Picker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Select Date & Time
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ReservationDatePicker />
          <BusinessHoursInfo />
        </CardContent>
      </Card>

      {/* Time Slots */}
      <SlotsSection />
    </div>
  );
};

export default ReservationLeftColumn;
