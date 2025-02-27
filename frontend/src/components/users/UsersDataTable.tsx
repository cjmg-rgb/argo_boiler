import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  SortingState,
  getSortedRowModel,
  PaginationState,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, Fragment, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DepartmentSelectFilter from "./DepartmentSelectFilter";
import { useDebounce } from "@/hooks/states/useDebounce";
import { Skeleton } from "@/components/ui/skeleton";
import useGetUsers from "@/hooks/api/users/useGetUsers";
import { userColumns } from "./usersColumnDef";
import AddUserDialog from "./AddUserDialog";

const UsersDataTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const debouncedValue = useDebounce(searchParams.get("keyword") || "");

  const { data, isLoading, isFetching, isSuccess, fetchNextPage } = useGetUsers(
    {
      departmentId: (searchParams.get("department") as string) || "",
      keyword: debouncedValue,
    },
  );

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const flatUsers = data?.pages.flatMap((page) => page.users) || [];

  const table = useReactTable({
    data: flatUsers,
    columns: userColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
    },
    autoResetPageIndex: false,
  });

  const handleDepartmentSelect = (departmentId: string) => {
    let selectedDepartment: string;

    if (departmentId === "all") {
      selectedDepartment = "";
    } else {
      selectedDepartment = departmentId;
    }

    setSearchParams({
      keyword: (searchParams.get("keyword") as string) || "",
      department: selectedDepartment,
    });
    table.resetPageIndex();
  };

  useEffect(() => {
    if (isSuccess) {
      setTotalPages(data.pages[0].totalPages);
    }
  }, [isSuccess, data]);

  return (
    <Fragment>
      <div className="mb-5 flex items-center justify-between">
        <Input
          className="max-w-[300px]"
          placeholder="Search a user...."
          onChange={(e) => {
            setSearchParams({
              keyword: e.target.value,
              department: searchParams.get("department") || "",
            });
            table.resetPageIndex();
          }}
        />
        <div className="flex items-center gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="whitespace-nowrap text-sm text-muted-foreground">
              Filter by department :
            </div>
            <DepartmentSelectFilter
              defaultValue={searchParams.get("department") || "all"}
              onDepartmentSelect={handleDepartmentSelect}
            />
          </div>
          <AddUserDialog />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {(isLoading || isFetching) && (
              <Fragment>
                {Array(10)
                  .fill(null)
                  .map((_, i) => (
                    <TableRow key={i}>
                      {Array(7)
                        .fill(null)
                        .map((_, i) => (
                          <TableCell key={i} className="h-[50px]">
                            <Skeleton className="h-[20px]" />
                          </TableCell>
                        ))}
                    </TableRow>
                  ))}
              </Fragment>
            )}
            {isSuccess && !isLoading && !isFetching && (
              <Fragment>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={userColumns.length}
                      className="h-24 text-center"
                    >
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center text-sm">
          Page {pagination.pageIndex + 1} of{" "}
          {totalPages ? (
            totalPages
          ) : isSuccess && !totalPages ? (
            1
          ) : (
            <Skeleton className="ml-2 size-5" />
          )}
        </div>
        <div className="flex gap-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.pageIndex === 0}
            onClick={() => {
              if (pagination.pageIndex + 1 > 1) {
                table.setPageIndex(pagination.pageIndex - 1);
              }
            }}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={
              isFetching ||
              isLoading ||
              pagination.pageIndex + 1 >= (totalPages as number)
            }
            onClick={() => {
              if (!isLoading && !isFetching && isSuccess) {
                if (pagination.pageIndex + 1 < (totalPages as number)) {
                  fetchNextPage();
                  table.setPageIndex(pagination.pageIndex + 1);
                }
              }
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </Fragment>
  );
};

export default UsersDataTable;
