import { IBooking, IBookings, IEditBookingForm } from "@/types";
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
import { getHoursIndexOfDate, time } from "@/utils/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { editBookingSchema } from "@/lib/zod-validations";
import { SubmitHandler, useForm } from "react-hook-form";
import useEditBooking from "@/hooks/api/bookings/useEditBooking";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CarSelection from "../common/CarSelection";
import { useState, Fragment } from "react";
import useAuth from "@/hooks/states/useAuth";
import useLogout from "@/hooks/api/auth/useLogout";
import { socket } from "../providers/SocketProvider";

interface Props extends IBooking {
  closeViewBookingDialog?: () => void;
  children: React.ReactNode;
}

const EditBookingDialog = ({
  id,
  car,
  date,
  dropOffTime,
  pickUpTime,
  instruction,
  location,
  title,
  creditDeduction,
  editAttempts,
  closeViewBookingDialog,
  children,
}: Props) => {
  const {
    setValue,
    reset,
    watch,
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<IEditBookingForm>({
    defaultValues: {
      id,
      title,
      date: new Date(date),
      pickUpTimeHour: getHoursIndexOfDate(pickUpTime),
      dropOffTimeHour: getHoursIndexOfDate(dropOffTime),
      location,
      instruction,
      carId: car.id,
    },
    resolver: zodResolver(editBookingSchema),
  });

  const { mutate: editBooking, isPending } = useEditBooking();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { auth, updateCredits, removeCredentials } = useAuth((state) => state);
  const { mutate: logout } = useLogout();
  const queryClient = useQueryClient();

  const handleEditBookingDetails: SubmitHandler<IEditBookingForm> = (
    formData,
  ) => {
    editBooking(formData, {
      onSuccess: (data) => {
        const updatedUserCredits =
          auth!.credits + creditDeduction - data.creditDeduction;

        updateCredits(updatedUserCredits);

        const bookingsQuerySetter = (queryData: IBookings): IBookings => ({
          ...queryData,
          bookings: queryData?.bookings.map((booking) =>
            booking.id === data.id ? data : booking,
          ),
        });
        queryClient.setQueryData(["bookings"], bookingsQuerySetter);

        if (queryClient.getQueryData(["my-bookings"])) {
          queryClient.setQueryData(["my-bookings"], bookingsQuerySetter);
        }

        setIsDialogOpen(false);
        reset();

        if (closeViewBookingDialog) {
          closeViewBookingDialog();
        }
        toast.success("Booking successfully updated.", {});

        socket.emit("update-booking", data);
      },
      onError: (err) => {
        if (err.response?.status === 401) {
          logout(null, {
            onSuccess: () => {
              removeCredentials();
            },
          });
        }
        toast.error(err.response?.data.message || "Internal server error");
      },
    });
  };

  return (
    <Fragment>
      {editAttempts === 0 && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>{children}</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit booking</DialogTitle>
              <DialogDescription>
                Note: You can only edit your booking once
              </DialogDescription>
            </DialogHeader>
            <form
              id="edit-booking-form"
              className="flex flex-col gap-y-3"
              onSubmit={handleSubmit(handleEditBookingDetails)}
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
                  type="text"
                  placeholder="e.g. Viewing with client"
                  {...register("title")}
                  disabled={isPending}
                />
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
                  type="text"
                  placeholder="e.g. Quezon City"
                  {...register("location")}
                  disabled={isPending}
                />
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
                          mode="single"
                          selected={watch("date") as Date}
                          onSelect={(newDate) => {
                            if (newDate)
                              setValue("date", newDate, { shouldDirty: true });
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
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
                      defaultValue={watch("pickUpTimeHour")?.toString()}
                      disabled={isPending || watch("date") === null}
                      onValueChange={(value) => {
                        setValue("pickUpTimeHour", parseInt(value), {
                          shouldDirty: true,
                        });
                      }}
                    >
                      <SelectTrigger id="pick-up">
                        <SelectValue placeholder={"Pick-up Time *"} />
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
                              key={label}
                              value={indexValue.toString()}
                            >
                              {label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="select-container flex-[2]">
                  {/* Drop-off time selection  */}
                  <Label
                    htmlFor="drop-off"
                    className="after:ml-1 after:text-red-600 after:content-['*']"
                  >
                    Drop-off time
                  </Label>
                  <Select
                    defaultValue={watch("dropOffTimeHour")?.toString()}
                    disabled={isPending || watch("date") === null}
                    onValueChange={(value) =>
                      setValue("dropOffTimeHour", parseInt(value), {
                        shouldDirty: true,
                      })
                    }
                  >
                    <SelectTrigger
                      id="drop-off"
                      disabled={!watch("pickUpTimeHour")}
                    >
                      <SelectValue placeholder={"Drop-off Time *"} />
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
                          <SelectItem key={label} value={indexValue.toString()}>
                            {label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="select-container">
                <CarSelection
                  hasRequiredError={false}
                  disabled={isPending}
                  onCarSelect={(carId: string) => {
                    setValue("carId", carId, { shouldDirty: true });
                  }}
                  defaultValue={car.id}
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
              <DialogClose>
                <Button variant="outline" disabled={isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                form="edit-booking-form"
                disabled={!isDirty || isPending}
              >
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Fragment>
  );
};

export default EditBookingDialog;
