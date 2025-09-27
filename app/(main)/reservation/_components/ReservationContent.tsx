import BookingProviderWrapper from "./BookingProviderWrapper";
import ReservationLeftColumn from "./ReservationLeftColumn";
import ReservationRightColumn from "./ReservationRightColumn";
import ServicePackageSelector from "./ServicePackageSelector";
import UrlParameterHandler from "./UrlParameterHandler";
import { serviceService } from "@/services/serviceService";
import { packageService } from "@/services/packageService";

const ReservationContent = async () => {
  const [services, packages] = await Promise.all([
    serviceService.getAllForPublic(),
    packageService.getAllForPublic(),
  ]);

  return (
    <BookingProviderWrapper services={services} packages={packages}>
      <UrlParameterHandler />
      <div className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <ServicePackageSelector services={services} packages={packages} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <ReservationLeftColumn />
            <ReservationRightColumn />
          </div>
        </div>
      </div>
    </BookingProviderWrapper>
  );
};

export default ReservationContent;
