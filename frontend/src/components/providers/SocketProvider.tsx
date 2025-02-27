import { io } from "socket.io-client";
import React, { useEffect } from "react";
import { IBooking, IBookings } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuth from "@/hooks/states/useAuth";

interface Props {
  children: React.ReactNode;
}

const APP_ENV = import.meta.env.VITE_APP_ENV;

export const socket = io(
  APP_ENV === "PROD" ? import.meta.env.VITE_API : import.meta.env.VITE_DEV_API,
);

const SocketProvider = ({ children }: Props) => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.emit("connection");

    socket.on("new-booking", (newBooking: IBooking) => {
      queryClient.setQueryData(
        ["bookings"],
        (queryData: IBookings): IBookings => ({
          ...queryData,
          bookings: [...queryData.bookings, newBooking],
        }),
      );

      if (newBooking.bookedBy.id === auth?.id) return;

      toast(
        `${newBooking.bookedBy.name} added a booking "${newBooking.title}"`,
        {
          style: {
            color: "white",
            backgroundColor: newBooking.car.colorTag.label,
            fontSize: 12,
          },
          position: "top-right",
        },
      );
    });

    socket.on("update-booking", (updatedBooking: IBooking) => {
      queryClient.setQueryData(
        ["bookings"],
        (queryData: IBookings): IBookings => ({
          ...queryData,
          bookings: queryData.bookings.map((booking) =>
            updatedBooking.id === booking.id ? updatedBooking : booking,
          ),
        }),
      );

      toast(`${updatedBooking.bookedBy.name} updated a booking`, {
        style: {
          color: "white",
          backgroundColor: updatedBooking.car.colorTag.label,
          fontSize: 12,
        },
        position: "top-right",
      });
    });

    type TDeletedBooking = {
      bookingId: string;
      bookedBy: string;
      bookedById: string;
      bookingColor: string;
    };

    socket.on("delete-booking", (deletedBooking: TDeletedBooking) => {
      queryClient.setQueryData(
        ["bookings"],
        (queryData: IBookings): IBookings => ({
          ...queryData,
          bookings: queryData.bookings.filter(
            (booking) => booking.id !== deletedBooking.bookingId,
          ),
        }),
      );

      if (deletedBooking.bookedById === auth?.id) return;

      toast(`${deletedBooking.bookedBy} removed a booking`, {
        style: {
          color: "white",
          backgroundColor: deletedBooking.bookingColor,
          fontSize: 12,
        },
        position: "top-right",
      });
    });

    return () => {
      socket.removeAllListeners();
    };
  }, []);

  return <>{children}</>;
};

export default SocketProvider;
