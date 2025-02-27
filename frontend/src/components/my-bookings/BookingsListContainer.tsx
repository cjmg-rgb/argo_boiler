import useGetCurrentUserBookings from "@/hooks/api/bookings/useGetCurrentUserBookings";
import Booking from "./Booking";
import { Skeleton } from "@/components/ui/skeleton";
import useLogout from "@/hooks/api/auth/useLogout";
import { useEffect } from "react";
import useAuth from "@/hooks/states/useAuth";

const BookingsListContainer = () => {
  const { data, error, isLoading, isError, isSuccess } =
    useGetCurrentUserBookings();
  const { mutate: logout } = useLogout();
  const { removeCredentials } = useAuth();

  useEffect(() => {
    if (isError && error.status === 401) {
      logout(null, {
        onSuccess: () => {
          removeCredentials();
        },
      });
    }
  }, [isError]);

  return (
    <div>
      <div className="mb-10">
        <h5 className="font-bold text-primary">My Bookings</h5>
      </div>
      <div className="flex flex-wrap gap-4">
        {isLoading &&
          Array(12)
            .fill(null)
            .map((_, index) => (
              <Skeleton key={index} className="h-[300px] w-[340px]" />
            ))}

        {isError && <p className="text-red-500">Failed to load bookings.</p>}

        {isSuccess &&
          data?.bookings?.map((booking) => (
            <Booking key={booking.id} {...booking} />
          ))}

        {isSuccess && data?.bookings?.length === 0 && <p>No bookings yet.</p>}
      </div>
    </div>
  );
};

export default BookingsListContainer;
