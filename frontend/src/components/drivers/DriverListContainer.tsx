import useGetDrivers from "@/hooks/api/drivers/useGetDrivers";
import Driver from "./Driver";
import { Fragment } from "react/jsx-runtime";
import { Skeleton } from "@/components/ui/skeleton";

const DriverListContainer = () => {
  const { data, isLoading, isSuccess, isError } = useGetDrivers();

  return (
    <div className="flex flex-wrap gap-4">
      {isLoading &&
        Array(12)
          .fill(null)
          .map((_, index) => (
            <Skeleton key={index} className="h-[180px] w-[340px]" />
          ))}

      {isError && <p>Failed to load drivers.</p>}

      {isSuccess && data.count > 0 ? (
        <Fragment>
          {data.drivers.map((driver) => (
            <Driver key={driver.id} {...driver} />
          ))}
        </Fragment>
      ) : (
        <p>No available drivers at the moment.</p>
      )}
    </div>
  );
};

export default DriverListContainer;
