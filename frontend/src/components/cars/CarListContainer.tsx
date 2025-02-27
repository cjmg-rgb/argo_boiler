import useCars from "@/hooks/api/cars/useCars";
import { Skeleton } from "@/components/ui/skeleton";
import Car from "./Car";
import { Fragment } from "react";

const CarListContainer = () => {
  const { data, isLoading, isSuccess, isError } = useCars();

  return (
    <div>
      <div className="flex flex-wrap gap-4">
        {isLoading &&
          Array(12)
            .fill(null)
            .map((_, index) => (
              <Skeleton key={index} className="h-[250px] w-[340px]" />
            ))}

        {isError && <p>Failed to load bookings.</p>}

        {isSuccess &&
          (data.cars.length > 0 ? (
            <Fragment>
              {data?.cars.map((car) => <Car key={car.id} {...car} />)}
            </Fragment>
          ) : (
            <p>No cars available yet.</p>
          ))}
      </div>
    </div>
  );
};

export default CarListContainer;
