import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import useDeleteBooking from "@/hooks/api/bookings/useDeleteBooking";
import { toast } from "react-hot-toast";
import useAuth from "@/hooks/states/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { IBookings } from "@/types";
import { socket } from "../providers/SocketProvider";

interface Props {
  bookingId: string;
  bookedBy: string;
  bookedById: string;
  bookingColor: string;
  children: React.ReactNode;
  creditDeduction: number;
  closeViewBookingDialog?: () => void;
}

const DeleteBookingDialog = ({
  bookingId,
  closeViewBookingDialog,
  bookedBy,
  bookedById,
  bookingColor,
  children,
  creditDeduction,
}: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { mutate: deleteBooking, isPending } = useDeleteBooking();
  const { auth, updateCredits } = useAuth((state) => state);
  const queryClient = useQueryClient();

  const handleDeleteBooking = () => {
    deleteBooking(bookingId, {
      onSuccess: (data) => {
        toast.success("Booking successfully deleted");
        updateCredits(auth!.credits + creditDeduction);

        const querySetter = (queryData: IBookings): IBookings => ({
          ...queryData,
          bookings: queryData.bookings.filter(
            (booking) => booking.id !== data.id,
          ),
        });

        queryClient.setQueryData(["bookings"], querySetter);

        if (queryClient.getQueryData(["my-bookings"])) {
          queryClient.setQueryData(["my-bookings"], querySetter);
          queryClient.invalidateQueries({ queryKey: ["bookings"] });
        }

        queryClient.invalidateQueries({ queryKey: ["my-bookings"] });

        setIsDialogOpen(false);

        if (closeViewBookingDialog) {
          closeViewBookingDialog();
        }

        socket.emit("delete-booking", {
          bookingId,
          bookingColor,
          bookedBy,
          bookedById,
        });
      },
      onError: (err) => {
        toast.error(err.response?.data.message || "Internal server error");
      },
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            booking and remove the data from our database.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDeleteBooking}
            disabled={isPending}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBookingDialog;
