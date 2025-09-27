const BusinessHoursInfo = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 className="font-medium text-blue-900 mb-2">Business Hours</h4>
      <div className="text-sm text-blue-800 space-y-1">
        <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
        <p>Saturday: 9:00 AM - 5:00 PM</p>
        <p>Sunday: Closed</p>
        <p className="text-blue-600 mt-2">Lunch break: 12:00 PM - 1:00 PM</p>
      </div>
    </div>
  );
};

export default BusinessHoursInfo;
