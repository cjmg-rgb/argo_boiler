import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ICars, IDriver, IDrivers, IEditDriverFields } from "@/types";
import { KeyIcon } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editDriverSchema } from "@/lib/zod-validations";
import useEditDriverDetails from "@/hooks/api/drivers/useEditDriverDetails";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

interface Props extends IDriver {}

const EditDriverDialog = ({ id, name, email, number }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<IEditDriverFields>({
    defaultValues: {
      id,
      email,
      name,
      number,
    },
    resolver: zodResolver(editDriverSchema),
  });
  const { mutate: editDriverDetails, isPending } = useEditDriverDetails();
  const queryClient = useQueryClient();

  const handleEditDriverDetails: SubmitHandler<IEditDriverFields> = (
    formData,
  ) => {
    editDriverDetails(formData, {
      onSuccess: (data) => {
        queryClient.setQueryData(
          ["drivers"],
          (queryData: IDrivers): IDrivers => ({
            ...queryData,
            drivers: queryData.drivers.map((driver) =>
              driver.id === data.id ? data : driver,
            ),
          }),
        );

        queryClient.invalidateQueries({ queryKey: ["drivers"] });

        if (queryClient.getQueryData(["cars"])) {
          queryClient.setQueryData(
            ["cars"],
            (queryData: ICars): ICars => ({
              ...queryData,
              cars: queryData.cars.map((car) =>
                car.driver.id === data.id ? { ...car, driver: data } : car,
              ),
            }),
          );
          queryClient.invalidateQueries({ queryKey: ["cars"] });
        }

        reset();
        toast.success("Driver successfully updated");
        setIsDialogOpen(false);
      },
      onError: (err) => {
        toast.error(err.response?.data.message || "Internal server error");
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
          <DialogTitle>Edit driver details</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur.
          </DialogDescription>
        </DialogHeader>
        <form
          id="edit-driver-form"
          className="flex flex-col gap-y-3"
          onSubmit={handleSubmit(handleEditDriverDetails)}
        >
          <div>
            <Label
              htmlFor="email"
              className="after:ml-1 after:text-red-600 after:content-['*']"
            >
              Email
            </Label>
            <Input
              id="email"
              type="text"
              placeholder="example@email.com"
              disabled={isPending}
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="name"
              className="after:ml-1 after:text-red-600 after:content-['*']"
            >
              Name
            </Label>

            <Input
              id="name"
              type="text"
              placeholder="e.g. John Doe"
              disabled={isPending}
              {...register("name")}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label
              htmlFor="phone-number"
              className="after:ml-1 after:text-red-600 after:content-['*']"
            >
              Phone number
            </Label>
            <Input
              id="phone-number"
              type="text"
              disabled={isPending}
              {...register("number")}
            />
            {errors.number && (
              <p className="mt-1 text-sm text-red-600">
                {errors.number.message}
              </p>
            )}
          </div>
        </form>
        <DialogFooter>
          <Button className="mr-auto" variant={"outline"}>
            <KeyIcon size={18} />
          </Button>
          <DialogClose asChild>
            <Button variant={"outline"} disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="submit"
            form="edit-driver-form"
            disabled={!isDirty || isPending}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDriverDialog;
