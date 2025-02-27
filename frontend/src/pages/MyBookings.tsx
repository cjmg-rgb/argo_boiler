import BookingsListContainer from "@/components/my-bookings/BookingsListContainer";
import AppBreadCrumb from "@/components/common/AppBreadCrumb";

const MyBookings = () => {
  return (
    <div className="p-9">
      <AppBreadCrumb
        currentPageLabel="My Bookings"
        currentPageHref="/my-bookings"
      />
      <BookingsListContainer />
    </div>
  );
};

export default MyBookings;
