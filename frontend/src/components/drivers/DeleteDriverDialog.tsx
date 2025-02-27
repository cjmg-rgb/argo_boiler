import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import useDeleteDriver from "@/hooks/api/drivers/useDeleteDriver";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { IDrivers } from "@/types";

interface Props {
  driverId: string;
}

const DeleteDriverDialog = ({ driverId }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { mutate: deleteDriver, isPending } = useDeleteDriver();
  const queryClient = useQueryClient();

  const handleDeleteDriver = () => {
    deleteDriver(
      { driverId },
      {
        onSuccess: (data) => {
          toast.success("Driver successfully deleted");
          queryClient.setQueryData(
            ["drivers"],
            (queryData: IDrivers): IDrivers => ({
              ...queryData,
              drivers: queryData.drivers.filter(
                (driver) => driver.id !== data.id,
              ),
            }),
          );
          queryClient.invalidateQueries({ queryKey: ["drivers"] });
          setIsDialogOpen(false);
        },
        onError: (err) => {
          toast.error(err.response?.data.message || "Internal server error");
        },
      },
    );
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="text-red-600 hover:bg-red-100 hover:text-red-600"
          onSelect={(e) => e.preventDefault()}
        >
          Delete
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            driver's information and remove the data from our database.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDeleteDriver}
            disabled={isPending}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDriverDialog;
