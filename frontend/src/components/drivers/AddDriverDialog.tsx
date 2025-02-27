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
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { IAddDriverForm, IDrivers } from "@/types";
import { addDriverSchema } from "@/lib/zod-validations";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import useAddDriver from "@/hooks/api/drivers/useAddDriver";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const AddDriverDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const { mutate: addDriver, isPending } = useAddDriver();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IAddDriverForm>({
    resolver: zodResolver(addDriverSchema),
  });

  const queryClient = useQueryClient();

  const handleAddDriver: SubmitHandler<IAddDriverForm> = (formData) => {
    addDriver(formData, {
      onSuccess: (data) => {
        queryClient.setQueryData(
          ["drivers"],
          (queryData: IDrivers): IDrivers => ({
            ...queryData,
            drivers: [data, ...queryData.drivers],
          }),
        );
        queryClient.invalidateQueries({ queryKey: ["drivers"] });
        setIsDialogOpen(false);
        toast("Driver successfully added");
        reset();
      },
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-x-1 bg-green-500 hover:bg-green-400">
          <Plus size={20} />
          Add driver
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add driver</DialogTitle>
          <DialogDescription>Enter driver details</DialogDescription>
        </DialogHeader>
        <form
          id="add-driver-form"
          className="flex flex-col gap-y-3"
          onSubmit={handleSubmit(handleAddDriver)}
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
              placeholder="example@email.com "
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
              id="car-model"
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
              {...register("number")}
              disabled={isPending}
            />
            {errors.number && (
              <p className="mt-1 text-sm text-red-600">
                {errors.number.message}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="password"
              className="after:ml-1 after:text-red-600 after:content-['*']"
            >
              Password
            </Label>
            <div className="flex h-9 w-full gap-x-3 rounded-sm border border-input bg-transparent px-3 py-1 text-sm font-normal shadow-sm focus-within:border-secondary">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="flex-1 outline-none placeholder:text-muted-foreground"
                placeholder="+8 characters"
                disabled={isPending}
                {...register("password")}
              />
              <button
                type="button"
                className="text-gray-400"
                disabled={isPending}
                onClick={() => setShowPassword(!showPassword)}
              >
                {false ? <LuEye size={18} /> : <LuEyeOff size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="confirm-password"
              className="after:ml-1 after:text-red-600 after:content-['*']"
            >
              Confirm Password
            </Label>
            <div className="flex h-9 w-full gap-x-3 rounded-sm border border-input bg-transparent px-3 py-1 text-sm font-normal shadow-sm focus-within:border-secondary">
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                className="flex-1 outline-none placeholder:text-muted-foreground"
                disabled={isPending}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                className="text-gray-400"
                disabled={isPending}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <LuEye size={18} />
                ) : (
                  <LuEyeOff size={18} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="add-driver-form" disabled={isPending}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDriverDialog;
