import useCars from "@/hooks/api/cars/useCars";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "../ui/card";
import { FaCar } from "react-icons/fa";

const CarList = () => {
  const { data, isLoading, isSuccess } = useCars();

  return (
    <div className="flex flex-col items-center gap-y-4 border-b-white p-8">
      <div className="flex flex-col items-center">
        <h6 className="mb-1 font-semibold uppercase">Car Legends</h6>
      </div>
      <div className="flex max-h-[450px] w-full flex-col gap-y-2 overflow-y-auto">
        {isLoading &&
          Array(6)
            .fill(null)
            .map((_, i) => <Skeleton key={i} className="h-[50px]" />)}
        {isSuccess &&
          data.cars.map((car) => (
            <Card key={car.id} className="flex items-center gap-x-3">
              <div
                className={`flex h-fit w-fit flex-1 items-center gap-x-3 rounded-sm bg-${car.colorTag.label} bg-opacity-50 px-5 py-3`}
                style={{ backgroundColor: `${car.colorTag.label}` }}
              >
                <div>
                  <FaCar size={21} />
                </div>
                <div>
                  <div className="text-bl font-medium">
                    {car.model} ({car.plateNumber})
                  </div>
                  {/* <div>{car.driverName}</div> */}
                </div>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default CarList;
