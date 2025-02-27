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
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { days } from "@/utils/helpers";
import CarTagColorSelect from "./CarTagColorSelect";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { IAddCarFields, ICars } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { addNewCarSchema } from "@/lib/zod-validations";
import { useQueryClient } from "@tanstack/react-query";
import useAddCar from "@/hooks/api/cars/useAddCar";
import { toast } from "react-hot-toast";
import DriverSelect from "../drivers/DriverSelect";
import { useState } from "react";

const AddCarDialog = () => {
  const {
    register,
    reset,
    setValue,
    setError,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IAddCarFields>({
    resolver: zodResolver(addNewCarSchema),
    defaultValues: {
      model: "",
      plateNumber: "",
      driverId: "",
      codingDay: -1,
      colorTagId: "",
    },
    mode: "onSubmit",
  });
  const { mutate: addCar, isPending } = useAddCar();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const handleAddNewCar: SubmitHandler<IAddCarFields> = (formData) => {
    addCar(formData, {
      onSuccess: (data) => {
        queryClient.setQueryData(
          ["cars"],
          (queryData: ICars): ICars => ({
            ...queryData,
            cars: [data, ...queryData.cars],
          }),
        );
        reset();
        queryClient.invalidateQueries({ queryKey: ["cars"], exact: true });
        queryClient.invalidateQueries({ queryKey: ["colors"], exact: true });
        queryClient.invalidateQueries({
          queryKey: ["drivers"],
          exact: true,
        });

        setIsDialogOpen(false);
        toast.success(`Car "${data.model}" has been successfully added.`);
      },
      onError: (err) => {
        toast.error(err.response?.data.message || "Internal sever error.");
      },
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-x-1 bg-green-500 hover:bg-green-400">
          <Plus size={20} />
          Add car
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add car</DialogTitle>
          <DialogDescription>Enter car details</DialogDescription>
        </DialogHeader>
        <form
          id="add-car-form"
          className="flex flex-col gap-y-3"
          onSubmit={handleSubmit(handleAddNewCar)}
        >
          <div>
            <Label
              htmlFor="car-model"
              className="after:ml-1 after:text-red-600 after:content-['*']"
            >
              Car model
            </Label>
            <Input
              id="car-model"
              type="text"
              placeholder="e.g. Toyota Wigo"
              disabled={isPending}
              {...register("model")}
            />
            {errors.model && (
              <p className="mt-1 text-sm text-red-600">
                {errors.model.message}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="plate-number"
              className="after:ml-1 after:text-red-600 after:content-['*']"
            >
              Plate number
            </Label>
            <Input
              id="plate-number"
              type="text"
              disabled={isPending}
              {...register("plateNumber")}
            />
            {errors.plateNumber && (
              <p className="mt-1 text-sm text-red-600">
                {errors.plateNumber.message}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="plate-number"
              className="after:ml-1 after:text-red-600 after:content-['*']"
            >
              Driver
            </Label>
            <DriverSelect
              defaultValue={watch("driverId")}
              filter="available"
              disabled={isPending}
              onDriverSelect={(driverId) => {
                setValue("driverId", driverId);
                setError("driverId", { message: "" });
              }}
            />
            {errors.driverId?.message && (
              <p className="mt-1 text-sm text-red-600">
                {errors.driverId.message}
              </p>
            )}
          </div>
          <div className="flex gap-x-2">
            <div className="select-container flex-1">
              <CarTagColorSelect
                isPending={isPending}
                hasRequiredError={!!errors.colorTagId?.message}
                setColorTag={(colorId) => {
                  setValue("colorTagId", colorId);
                  setError("colorTagId", { message: "" });
                }}
              />
            </div>
            <div className="select-container flex-1">
              <Label
                htmlFor="coding-day"
                className="after:ml-1 after:text-red-600 after:content-['*']"
              >
                Coding day
              </Label>
              <Select
                onValueChange={(value) => {
                  setValue("codingDay", parseInt(value));
                  setError("codingDay", { message: "" });
                }}
              >
                <SelectTrigger id="coding-day" disabled={isPending}>
                  <SelectValue placeholder="Choose coding day" />
                </SelectTrigger>
                <SelectContent className="z-[100] h-[150px]">
                  {days.map((day, i) => (
                    <SelectItem key={day} value={i.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.codingDay?.message && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.codingDay.message}
                </p>
              )}
            </div>
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Close
            </Button>
          </DialogClose>
          <Button type="submit" form="add-car-form" disabled={isPending}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCarDialog;
