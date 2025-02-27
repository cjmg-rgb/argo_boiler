import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetDrivers from "@/hooks/api/drivers/useGetDrivers";
import { Fragment } from "react";

interface Props {
  onDriverSelect: (driverId: string) => void;
  defaultValue: undefined | string;
  filter?: "all" | "available";
  disabled?: boolean;
}

const DriverSelect = ({
  onDriverSelect,
  disabled,
  defaultValue,
  filter = "all",
}: Props) => {
  const { data, isLoading, isError, isSuccess } = useGetDrivers();
  const filteredDrivers = data?.drivers.filter((driver) => {
    if (filter === "all") {
      return true;
    } else {
      return driver.car === null;
    }
  });

  return (
    <Select value={defaultValue} onValueChange={onDriverSelect}>
      <SelectTrigger
        id="available-drivers"
        disabled={
          isLoading ||
          isError ||
          disabled ||
          (isSuccess && filteredDrivers?.length === 0)
        }
      >
        <SelectValue
          placeholder={
            isLoading
              ? "Getting drivers..."
              : isSuccess
                ? filteredDrivers!.length > 0
                  ? "Select Driver"
                  : "No available drivers at the moment"
                : "Something went wrong"
          }
        />
      </SelectTrigger>
      <SelectContent className="z-[100] mr-8 max-h-[200px]">
        {isSuccess && (
          <Fragment>
            {filteredDrivers!.map(({ id, name }) => (
              <SelectItem value={id} key={id}>
                {name}
              </SelectItem>
            ))}
          </Fragment>
        )}
      </SelectContent>
    </Select>
  );
};

export default DriverSelect;
