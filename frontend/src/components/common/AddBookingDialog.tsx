import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaCalendarAlt } from "react-icons/fa";
import { IAddBookingForm, IBookings } from "@/types";
import useAddBooking from "@/hooks/api/bookings/useAddBooking";
import useAuth from "@/hooks/states/useAuth";
import { cn } from "@/lib/utils";
import { addBookingSchema } from "@/lib/zod-validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { time } from "@/utils/helpers";
import { CalendarIcon } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import CarSelection from "./CarSelection";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { socket } from "../providers/SocketProvider";

const AddBookingDialog = () => {
  const { auth, updateCredits } = useAuth((state) => state);
  const {
    register,
    setValue,
    setError,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IAddBookingForm>({
    defaultValues: {
      title: "",
      location: "",
      date: new Date(),
      pickUpTimeHour: null,
      dropOffTimeHour: null,
      carId: null,
      instruction: "",
    },
    resolver: zodResolver(addBookingSchema),
  });
  const { mutate: addBooking, isPending } = useAddBooking();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const handleAddBooking: SubmitHandler<IAddBookingForm> = (formData) => {
    addBooking(formData, {
      onSuccess: (data) => {
        updateCredits(auth!.credits - data.creditDeduction);

        if (queryClient.getQueryData(["my-bookings"])) {
          queryClient.setQueryData(
            ["my-bookings"],
            (queryData: IBookings): IBookings => ({
              ...queryData,
              bookings: [data, ...queryData.bookings],
            }),
          );
        }

        queryClient.setQueryData(
          ["bookings"],
          (queryData: IBookings): IBookings => ({
            ...queryData,
            bookings: [data, ...queryData.bookings],
          }),
        );

        queryClient.invalidateQueries({ queryKey: ["bookings"] });
        queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
        queryClient.invalidateQueries({ queryKey: ["reports"] });
        setIsDialogOpen(false);
        reset();
        toast.success(`Booking "${data.title}" successfully added.`);

        socket.emit("new-booking", data);
      },
      onError: (err) => {
        toast.error(err.response?.data.message || "Internal server error.");
      },
    });
  };

  return (
    <div className="fixed bottom-10 right-14 z-50">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-x-2 px-8 py-6 shadow-lg transition-transform hover:scale-110 hover:shadow-xl">
            <FaCalendarAlt size={20} />
            <span>Book A Car</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add new booking</DialogTitle>
            <DialogDescription>
              Select your car, choose your dates, and confirm your booking.
            </DialogDescription>
          </DialogHeader>
          <form
            id="add-booking"
            onSubmit={handleSubmit(handleAddBooking)}
            className="flex flex-col gap-y-3"
          >
            <div>
              <Label
                htmlFor="title"
                className="after:ml-1 after:text-red-600 after:content-['*']"
              >
                Title
              </Label>
              <Input
                id="title"
                disabled={isPending}
                placeholder="e.g. Viewing with client"
                {...register("title")}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <Label
                htmlFor="locations"
                className="after:ml-1 after:text-red-600 after:content-['*']"
              >
                Locations
              </Label>
              <Input
                id="locations"
                placeholder="e.g. Quezon City"
                disabled={isPending}
                {...register("location")}
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.location.message}
                </p>
              )}
            </div>
            <div className="flex gap-x-2">
              <div>
                <Label
                  htmlFor="booking-date"
                  className="after:ml-1 after:text-red-600 after:content-['*']"
                >
                  Booking Date
                </Label>
                <div className="w-full flex-[3] rounded-md border border-input focus-within:ring-1 focus-within:ring-secondary">
                  <Popover>
                    <PopoverTrigger asChild className="w-full">
                      <Button
                        disabled={isPending}
                        value="outline"
                        className={cn(
                          "w-full justify-start bg-transparent text-left font-normal text-black shadow-none hover:bg-transparent",
                          !watch("date") && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {watch("date") ? (
                          <span className="text-black">
                            {format(watch("date") as Date, "PPP")}
                          </span>
                        ) : (
                          <span>Date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="z-[500] w-auto p-0"
                      align="start"
                    >
                      <Calendar
                        id="booking-date"
                        mode="single"
                        selected={watch("date") as Date}
                        fromDate={new Date()}
                        onSelect={(newDate) => {
                          if (newDate) setValue("date", newDate);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.date.message}
                  </p>
                )}
              </div>
              <div className="select-container flex-[2]">
                {/* Pick-up time selection  */}
                <div>
                  <Label
                    htmlFor="pick-up"
                    className="after:ml-1 after:text-red-600 after:content-['*']"
                  >
                    Pick-up time
                  </Label>
                  <Select
                    value={watch("pickUpTimeHour")?.toString() || ""}
                    disabled={isPending || watch("date") === null}
                    onValueChange={(value) => {
                      setValue("pickUpTimeHour", parseInt(value));
                      setError("pickUpTimeHour", {
                        message: "",
                      });
                    }}
                  >
                    <SelectTrigger id="pick-up">
                      <SelectValue placeholder="Choose a time" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      className="z-[500] max-h-[200px]"
                    >
                      {time
                        .filter(({ indexValue }) => {
                          if (watch("dropOffTimeHour")) {
                            const dropOffTime = watch(
                              "dropOffTimeHour",
                            ) as number;
                            return indexValue < dropOffTime;
                          }

                          return true;
                        })
                        .map(({ label, indexValue }) => (
                          <SelectItem
                            key={indexValue}
                            value={indexValue.toString()}
                          >
                            {label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.pickUpTimeHour?.message && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.pickUpTimeHour.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="select-container flex-[2]">
                {/* Drop-off time selection  */}
                <div>
                  <Label
                    htmlFor="drop-off"
                    className="after:ml-1 after:text-red-600 after:content-['*']"
                  >
                    Drop-off time
                  </Label>
                  <Select
                    value={watch("dropOffTimeHour")?.toString() || ""}
                    disabled={isPending || watch("date") === null}
                    onValueChange={(value) => {
                      setValue("dropOffTimeHour", parseInt(value));
                      setError("dropOffTimeHour", {
                        message: "",
                      });
                    }}
                  >
                    <SelectTrigger
                      id="drop-off"
                      disabled={!watch("pickUpTimeHour")}
                    >
                      <SelectValue placeholder="Choose a time" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      className="z-[500] max-h-[200px]"
                    >
                      {time
                        .filter(({ indexValue }) => {
                          const pickUpTime = watch("pickUpTimeHour") as number;
                          return indexValue > pickUpTime;
                        })
                        .map(({ label, indexValue }) => (
                          <SelectItem
                            key={indexValue.toString()}
                            value={indexValue.toString()}
                          >
                            {label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.dropOffTimeHour?.message && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.dropOffTimeHour.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="select-container">
              <CarSelection
                defaultValue={watch("carId") as string}
                hasRequiredError={!!errors.carId?.message}
                disabled={isPending}
                onCarSelect={(carId: string) => {
                  setValue("carId", carId);
                }}
              />
            </div>
            <div>
              <Label
                htmlFor="instruction"
                className="after:ml-1 after:text-red-600 after:content-['*']"
              >
                Instruction
              </Label>
              <Input
                id="instruction"
                disabled={isPending}
                {...register("instruction")}
              />
              {errors.instruction && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.instruction.message}
                </p>
              )}
            </div>
          </form>
          <DialogFooter>
            <DialogClose asChild>
              <Button disabled={isPending} variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" form="add-booking" disabled={isPending}>
              {isPending ? "Adding your booking" : "Add Booking"}{" "}
              {watch("pickUpTimeHour") && watch("dropOffTimeHour") && (
                <>{`(Credit Deduction: ${(watch("dropOffTimeHour") as number) - (watch("pickUpTimeHour") as number)})`}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddBookingDialog;
