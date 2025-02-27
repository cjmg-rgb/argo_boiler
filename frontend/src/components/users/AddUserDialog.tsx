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
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useAddUser from "@/hooks/api/users/useAddUser";
import { addNewUserSchema } from "@/lib/zod-validations";
import { IAddUserForm, IPaginatedUsers } from "@/types";
import { userTypes } from "@/utils/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { LuEye, LuEyeOff } from "react-icons/lu";
import DepartmentSelection from "../common/DepartmentSelection";
import { Input } from "../ui/input";
import { useSearchParams } from "react-router-dom";

const AddUserDialog = () => {
  const [show1, setShow1] = useState<boolean>(false);
  const [show2, setShow2] = useState<boolean>(false);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [searchParams] = useSearchParams();

  const {
    register,
    setValue,
    setError,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IAddUserForm>({
    resolver: zodResolver(addNewUserSchema),
  });

  const { mutate: addUser, isPending } = useAddUser();
  const queryClient = useQueryClient();

  const handleAddUser: SubmitHandler<IAddUserForm> = (formData) => {
    addUser(formData, {
      onSuccess: (data) => {
        const departmentId = searchParams.get("department");
        const keyword = searchParams.get("keyword") as string;

        if (departmentId || keyword) {
          const newUserLowerCasedEmail = data.email.toLowerCase();
          const newUserLowerCasedName = data.name.toLowerCase();
          const lowerCasedKeyword = keyword.toLowerCase();

          if (
            data.department.id === departmentId &&
            (newUserLowerCasedEmail.includes(lowerCasedKeyword) ||
              newUserLowerCasedName.includes(lowerCasedKeyword))
          ) {
            queryClient.setQueryData(
              ["users", { departmentId, keyword }],
              (
                queryData: InfiniteData<IPaginatedUsers>,
              ): InfiniteData<IPaginatedUsers> => ({
                ...queryData,
                pages: queryData.pages.map((page, i) => {
                  if (!i) {
                    return { ...page, users: [data, ...page.users] };
                  } else {
                    return page;
                  }
                }),
              }),
            );
          }
        } else {
          queryClient.setQueryData(
            ["users", { departmentId: "", keyword: "" }],
            (
              queryData: InfiniteData<IPaginatedUsers>,
            ): InfiniteData<IPaginatedUsers> => ({
              ...queryData,
              pages: queryData.pages.map((page, i) => {
                if (!i) {
                  return { ...page, users: [data, ...page.users] };
                } else {
                  return page;
                }
              }),
            }),
          );
        }
        reset();
        setIsDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: ["users"] });
        toast.success(`User "${data.name}" has been successfully added!`);
      },
      onError: (err) => {
        toast.error(err.response?.data.message || "Internal server error.");
      },
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-x-1 bg-green-500 hover:bg-green-400">
          <Plus size={20} />
          Add user
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create an account</DialogTitle>
          <DialogDescription>Add a new account in the system</DialogDescription>
        </DialogHeader>
        <form id="add-user" onSubmit={handleSubmit(handleAddUser)}>
          <div className="flex flex-col gap-y-2">
            <div>
              <Label
                htmlFor="email"
                className="after:ml-1 after:text-red-600 after:content-['*']"
              >
                Email
              </Label>
              <Input
                id="email"
                disabled={isPending}
                type="email"
                placeholder="example@email.com"
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
                disabled={isPending}
                type="text"
                placeholder="e.g. John Doe"
                {...register("name")}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
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
              <div className="flex h-9 w-full gap-x-3 rounded-sm border border-input bg-transparent px-3 py-1 text-sm font-normal shadow-sm focus-within:border-secondary disabled:cursor-not-allowed disabled:opacity-50">
                <input
                  id="password"
                  disabled={isPending}
                  className="flex-1 outline-none placeholder:text-muted-foreground"
                  type={show1 ? "text" : "password"}
                  placeholder="8+ characters"
                  {...register("password")}
                />
                <button
                  onClick={() => setShow1(!show1)}
                  type="button"
                  className="text-gray-400"
                >
                  {show1 ? <LuEye size={18} /> : <LuEyeOff size={18} />}
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
                htmlFor="confirmPassword"
                className="after:ml-1 after:text-red-600 after:content-['*']"
              >
                Confirm Password
              </Label>
              <div className="flex h-9 w-full gap-x-3 rounded-sm border border-input bg-transparent px-3 py-1 text-sm font-normal shadow-sm focus-within:border-secondary disabled:cursor-not-allowed disabled:opacity-50">
                <input
                  id="confirmPassword"
                  disabled={isPending}
                  className="flex-1 outline-none placeholder:text-muted-foreground"
                  type={show2 ? "text" : "password"}
                  {...register("confirmPassword")}
                />
                <button
                  onClick={() => setShow2(!show2)}
                  type="button"
                  className="text-gray-400"
                >
                  {show2 ? <LuEye size={18} /> : <LuEyeOff size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div className="flex gap-x-2">
              <DepartmentSelection
                hasRequiredError={!!errors.department?.message}
                disabled={isPending}
                selectedDepartment={(departmentId: string) => {
                  setValue("department", departmentId);
                  setError("department", { message: "" });
                }}
              />
              <div className="select-container flex-1">
                <Label
                  htmlFor="access-type"
                  className="after:ml-1 after:text-red-600 after:content-['*']"
                >
                  Role
                </Label>
                <Select
                  onValueChange={(data) => {
                    setValue("role", data as "admin" | "user");
                    setError("role", { message: "" });
                  }}
                >
                  <SelectTrigger id="access-type" disabled={isPending}>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent className="z-[100]">
                    {userTypes.map(({ label, value }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role?.message && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.role.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Close
            </Button>
          </DialogClose>
          <Button form="add-user" type="submit" disabled={isPending}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
