import useCars from "@/hooks/api/cars/useCars";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";

interface Props {
  defaultValue?: string;
  disabled: boolean;
  onCarSelect: (carId: string) => void;
  hasRequiredError: boolean;
}

const CarSelection = ({
  onCarSelect,
  defaultValue,
  hasRequiredError,
  disabled,
}: Props) => {
  const { data, isLoading, isSuccess } = useCars();

  return (
    <div>
      <Label
        htmlFor="car"
        className="after:ml-1 after:text-red-600 after:content-['*']"
      >
        Car
      </Label>
      <Select
        onValueChange={(value) => onCarSelect(value)}
        value={defaultValue || ""}
      >
        <SelectTrigger id="car" disabled={isLoading || disabled}>
          <SelectValue
            placeholder={
              isLoading ? "Getting available cars..." : "Choose a car to book"
            }
          />
        </SelectTrigger>
        <SelectContent className="z-[100]">
          {isSuccess && (
            <>
              {data.cars.map((car) => (
                <SelectItem key={car.id} value={car.id}>
                  <div className="flex items-center gap-x-3">
                    <div
                      style={{ backgroundColor: car.colorTag.label }}
                      className="size-2 rounded-full"
                    ></div>
                    <span>
                      {car.model} - {car.driver.name}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </>
          )}
        </SelectContent>
      </Select>
      {hasRequiredError && (
        <p className="mt-1 text-sm text-red-600">Required</p>
      )}
    </div>
  );
};

export default CarSelection;
