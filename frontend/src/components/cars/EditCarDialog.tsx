import { days } from "@/utils/helpers";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ICar, ICars, IEditCarFields } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import useEditCar from "@/hooks/api/cars/useEditCar";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { editCarSchema } from "@/lib/zod-validations";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface Props extends ICar {}

const EditCarDialog = ({
  id,
  plateNumber,
  codingDay,
  driver,
  model,
}: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { mutate: editCar, isPending } = useEditCar();
  const {
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<IEditCarFields>({
    defaultValues: {
      id,
      model,
      plateNumber,
      driverId: driver.id,
      codingDay,
    },
    resolver: zodResolver(editCarSchema),
  });
  const queryClient = useQueryClient();

  const handleEditCar: SubmitHandler<IEditCarFields> = (formData) => {
    editCar(formData, {
      onSuccess: (data) => {
        queryClient.setQueryData(
          ["cars"],
          (queryData: ICars): ICars => ({
            ...queryData,
            cars: queryData.cars.map((car) =>
              car.id === data.id ? data : car,
            ),
          }),
        );
        queryClient.invalidateQueries({ queryKey: ["cars"], exact: true });

        if (queryClient.getQueryData(["drivers"])) {
          queryClient.invalidateQueries({ queryKey: ["drivers"], exact: true });
        }

        setIsDialogOpen(false);
        reset();
        toast.success("Changes applied successfully.");
      },
      onError: (err) => {
        toast.error(err.response?.data.message || "Internal server error.");
      },
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Edit
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit car details</DialogTitle>
          <DialogDescription>
            Modify and update the car's information.
          </DialogDescription>
        </DialogHeader>
        <form
          id="edit-car-form"
          onSubmit={handleSubmit(handleEditCar)}
          className="flex flex-col gap-y-3"
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
              disabled={isPending}
              {...register("plateNumber")}
            />
            {errors.plateNumber && (
              <p className="mt-1 text-sm text-red-600">
                {errors.plateNumber.message}
              </p>
            )}
          </div>
          <div className="select-container">
            <Label
              htmlFor="coding-day"
              className="after:ml-1 after:text-red-600 after:content-['*']"
            >
              Coding day
            </Label>
            <Select
              defaultValue={codingDay.toString()}
              onValueChange={(value) =>
                setValue("codingDay", parseInt(value), {
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger id="coding-day" disabled={isPending}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[100] max-h-[200px]">
                {days.map((day, i) => (
                  <SelectItem key={day} value={i.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Close
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="edit-car-form"
            disabled={isPending || !isDirty}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCarDialog;
