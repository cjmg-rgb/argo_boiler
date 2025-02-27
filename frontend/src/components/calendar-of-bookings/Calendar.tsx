import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { useState, useEffect, useMemo, useRef } from "react";
import { EventSourceInput } from "@fullcalendar/core/index.js";
import MonthEventCell from "./MonthEventCell";
import WeekEventCell from "./ListEventCell";
import ListEventCell from "./ListEventCell";
import useGetBookings from "@/hooks/api/bookings/useGetBookings";
import { IBooking } from "@/types";
import useAuth from "@/hooks/states/useAuth";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ViewBookingDialogContent from "../calendar-of-bookings/ViewBookingDialogContent";

type Tabs = "month" | "week" | "list";

const Calendar = () => {
  const [events, setEvents] = useState<EventSourceInput>();
  const [activeTab, setActiveTab] = useState<Tabs>("week");
  const { data, isLoading, isError, isSuccess, isFetching, isFetched } =
    useGetBookings();
  const [clickedEventBookingDetails, setClickedEventBookingDetails] =
    useState<null | IBooking>(null);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const currentUserId = useAuth((state) => state.auth?.id);
  const viewBookingBtnRef = useRef<HTMLButtonElement | null>(null);

  const eventComponent = useMemo(() => {
    if (activeTab === "month") {
      return MonthEventCell;
    }

    if (activeTab === "week") {
      return WeekEventCell;
    }

    if (activeTab === "list") {
      return ListEventCell;
    }
  }, [activeTab]);

  useEffect(() => {
    const calendarTabs = Array.from(
      (document.querySelectorAll(".fc-button-group")[1] as HTMLDivElement)
        .childNodes,
    );

    calendarTabs.forEach((tab) => {
      const buttonTab = tab as HTMLButtonElement;
      const tabValue = buttonTab.title.split(" ")[0] as Tabs;
      buttonTab.addEventListener("click", () => {
        setActiveTab(tabValue);
      });
    });
  }, []);

  useEffect(() => {
    if (isSuccess) {
      const bookings: EventSourceInput = [];
      data!.bookings.forEach((booking) => {
        //const bookingDateObject = new Date(booking.date);

        bookings.push({
          title: booking.title,
          date: booking.date,
          start: booking.pickUpTime,
          end: booking.dropOffTime,
          borderColor:
            currentUserId === booking.bookedBy.id ? "green" : "transparent",

          backgroundColor: booking.car.colorTag.label,
          extendedProps: booking,
        });
      });

      setEvents(bookings);
    }
  }, [isSuccess, isLoading, isError, isFetching, isFetched, data]);

  return (
    <div className="h-full">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger hidden ref={viewBookingBtnRef} />
        {clickedEventBookingDetails && (
          <ViewBookingDialogContent
            closeViewBookingDialog={() => setIsDialogOpen(false)}
            {...clickedEventBookingDetails}
          />
        )}
      </Dialog>
      <FullCalendar
        eventClick={(e) => {
          setClickedEventBookingDetails(e.event.extendedProps as IBooking);
          viewBookingBtnRef.current?.click();
        }}
        height={"100%"}
        nowIndicator
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin]}
        headerToolbar={{
          start: "prev,next today",
          center: "title",
          end: "dayGridMonth,timeGridWeek,listDay",
        }}
        initialView={"timeGridWeek"}
        events={isSuccess ? events : []}
        eventContent={eventComponent}
      />
    </div>
  );
};

export default Calendar;
