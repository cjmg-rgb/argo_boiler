import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import useAuth from "@/hooks/states/useAuth";
import ChangePasswordDialog from "./ChangePasswordDialog";

const AccountDetails = () => {
  const { auth } = useAuth((state) => state);
  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Account
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-3">
          <div className="flex items-center gap-x-3">
            <div>
              <Avatar>
                <AvatarFallback>{auth?.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <DialogTitle>Account Profile</DialogTitle>
              <DialogDescription>ID: {auth?.id}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="flex flex-col gap-y-3">
          <div className="flex flex-col">
            <span className="font-medium">{auth?.name}</span>
            <span className="text-xs">Name</span>
          </div>

          <div className="flex flex-col">
            <span className="font-medium">{auth?.email}</span>
            <span className="text-xs">Email Address</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium capitalize">{auth?.role}</span>
            <span className="text-xs">Role</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{auth?.department.name}</span>
            <span className="text-xs">Department</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{auth?.credits}</span>
            <span className="text-xs">Credits</span>
          </div>
        </div>
        <DialogFooter>
          <ChangePasswordDialog />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccountDetails;
