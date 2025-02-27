import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { PiEyeLight, PiEyeSlash } from "react-icons/pi";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IChangePasswordFields } from "@/types";
import { changePasswordSchema } from "@/lib/zod-validations";
import useChangePassword from "@/hooks/api/users/useChangePassword";
import toast from "react-hot-toast";

const ChangePasswordDialog = () => {
  const [showPass, setShowPass] = useState<boolean>(false);
  const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IChangePasswordFields>({
    resolver: zodResolver(changePasswordSchema),
  });
  const { mutate: changePassword, isPending } = useChangePassword();

  const handleChangePassword: SubmitHandler<IChangePasswordFields> = (
    formData,
  ) => {
    const { password } = formData;
    changePassword(password, {
      onSuccess: () => {
        toast.success("Password successfully changed");
        reset();
        setIsDialogOpen(false);
      },
      onError: (err) => {
        toast.error(err.response?.data.message || "Internal server error");
      },
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Button>Change password</Button>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-3">
          <DialogTitle className="text-primary">Change password</DialogTitle>
          <DialogDescription>Change your passsword and save</DialogDescription>
        </DialogHeader>
        <form
          id="change-password-form"
          className="flex flex-col gap-y-3"
          onSubmit={handleSubmit(handleChangePassword)}
        >
          <div>
            <Label
              htmlFor="inputPass"
              className="after:ml-1 after:text-red-600 after:content-['*']"
            >
              New Password
            </Label>
            <div className="flex w-full gap-x-3 rounded-sm px-3 ring-1 ring-input focus-within:ring-1 focus-within:ring-secondary">
              <input
                id="inputPass"
                type={showPass ? "text" : "password"}
                placeholder="Enter new password"
                className="flex-1 text-sm focus-visible:outline-none"
                disabled={isPending}
                {...register("password")}
              />
              <Button
                type="button"
                className="bg-transparent px-0 shadow-none hover:bg-transparent"
                onClick={() => setShowPass(!showPass)}
                disabled={isPending}
              >
                {showPass ? (
                  <PiEyeLight size={18} color="black" />
                ) : (
                  <PiEyeSlash size={18} color="black" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="inputConfirmPass"
              className="after:ml-1 after:text-red-600 after:content-['*']"
            >
              Confirm Password
            </Label>
            <div className="flex w-full gap-x-3 rounded-sm px-3 ring-1 ring-input focus-within:ring-1 focus-within:ring-secondary">
              <input
                id="inputConfirmPass"
                type={showConfirmPass ? "text" : "password"}
                placeholder="Confirm password"
                className="flex-1 text-sm focus-visible:outline-none"
                disabled={isPending}
                {...register("confirmPassword")}
              />
              <Button
                type="button"
                className="bg-transparent px-0 shadow-none hover:bg-transparent"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                disabled={isPending}
              >
                {showConfirmPass ? (
                  <PiEyeLight size={18} color="black" />
                ) : (
                  <PiEyeSlash size={18} color="black" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </form>
        <DialogFooter>
          <Button
            type="submit"
            form="change-password-form"
            disabled={isPending}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
