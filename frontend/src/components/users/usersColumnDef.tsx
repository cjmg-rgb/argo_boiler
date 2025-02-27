import { cn } from "@/lib/utils";
import { IUser, IDepartment } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditUserDialog from "./EditUserDialog";

export const userColumns: ColumnDef<IUser>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "credits",
    header: () => <div className="text-center">Credits</div>,
    cell: ({ row }) => {
      const credit = row.getValue("credits") as number;

      return (
        <div
          className={cn("rounded-full p-1 text-center text-xs font-semibold", {
            "bg-red-400/20 text-red-500": credit <= 10,
            "bg-green-400/20 text-green-600": credit > 10,
          })}
        >
          {credit}
        </div>
      );
    },
  },
  {
    accessorKey: "department",
    header: () => <div className="text-center">Department</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {(row.getValue("department") as IDepartment).name}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: () => <div className="text-center">Role</div>,
    cell: ({ row }) => (
      <div className="text-center capitalize">{row.getValue("role")}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id: string = row.getValue("id");
      const name: string = row.getValue("name");
      const email: string = row.getValue("email");
      const department: IDepartment = row.getValue("department");
      const credits: number = row.getValue("credits");
      const role: "admin" | "user" = row.getValue("role");

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <EditUserDialog
              id={id}
              name={name}
              email={email}
              department={department}
              credits={credits}
              role={role}
            />
            <DropdownMenuItem className="text-red-500 focus:bg-red-400/20 focus:text-red-500">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
