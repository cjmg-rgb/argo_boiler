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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import useEditUser from "@/hooks/api/users/useEditUser";
import { editUserSchema } from "@/lib/zod-validations";
import { IEditUserFieldsWithId, IPaginatedUsers, IUser } from "@/types";
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
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import DepartmentSelection from "../common/DepartmentSelection";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { useRef } from "react";

interface Props extends IUser {}

const EditUserDialog = ({
  id,
  name,
  email,
  role,
  credits,
  department,
}: Props) => {
  const { mutate: editUser, isPending } = useEditUser();
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<IEditUserFieldsWithId>({
    defaultValues: {
      role,
      credits,
      name,
      departmentId: department.id,
      id: id,
    },
    resolver: zodResolver(editUserSchema),
  });
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const handleEditUser: SubmitHandler<IEditUserFieldsWithId> = (formData) => {
    const departmentId = searchParams.get("department") || "";
    const keyword = searchParams.get("keyword") || "";

    editUser(formData, {
      onSuccess: (data) => {
        queryClient.setQueryData(
          ["users", { departmentId, keyword }],
          (
            queryData: InfiniteData<IPaginatedUsers>,
          ): InfiniteData<IPaginatedUsers> => ({
            ...queryData,
            pages: queryData.pages.map((page) => ({
              ...page,
              users: page.users.map((user) => {
                if (user.id === data.id) {
                  return data;
                } else {
                  return user;
                }
              }),
            })),
          }),
        );

        queryClient.invalidateQueries({ queryKey: ["users"] });
        reset();
        toast.success("Changes applied successfully!");
        closeBtnRef.current?.click();
      },
      onError: (err) => {
        toast.error(err.response?.data.message || "Internal server error.");
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Edit
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User Details</DialogTitle>
          <DialogDescription>
            Update user details and save changes.
          </DialogDescription>
        </DialogHeader>
        <form id="edit-user" onSubmit={handleSubmit(handleEditUser)}>
          <div className="flex flex-col gap-y-3">
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
                disabled
                placeholder="e.g. John Doe"
                value={email}
              />
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
                placeholder="e.g. John Doe"
                {...register("name")}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="select-container">
              <DepartmentSelection
                hasRequiredError={!!errors.departmentId?.message}
                defaultDepartment={department.id}
                disabled={isPending}
                selectedDepartment={(departmentId: string) => {
                  setValue("departmentId", departmentId, {
                    shouldDirty: true,
                  });
                }}
              />
            </div>
            <div>
              <Label
                htmlFor="credit"
                className="after:ml-1 after:text-red-600 after:content-['*']"
              >
                Credit
              </Label>
              <Input
                id="credit"
                disabled={isPending}
                type="number"
                max={100}
                min={0}
                {...register("credits", {
                  valueAsNumber: true,
                })}
              />
              {errors.credits && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.credits.message}
                </p>
              )}
            </div>
            <div className="select-container">
              <Label
                id="role"
                className="after:ml-1 after:text-red-600 after:content-['*']"
              >
                Role
              </Label>
              <Select
                defaultValue={role}
                onValueChange={(data) => {
                  setValue("role", data as "admin" | "user", {
                    shouldDirty: true,
                  });
                }}
              >
                <SelectTrigger id="role" disabled={isPending}>
                  <SelectValue placeholder={role} />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  {userTypes.map(({ label, value }) => (
                    <SelectItem value={value} key={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.role?.message}
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
          <Button
            form="edit-user"
            type="submit"
            disabled={isPending || !isDirty}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
