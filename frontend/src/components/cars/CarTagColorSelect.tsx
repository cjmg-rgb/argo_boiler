import useColors from "@/hooks/api/colors/useColors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Props {
  isPending: boolean;
  setColorTag: (colorId: string) => void;
  hasRequiredError: boolean;
}

const CarTagColorSelect = ({
  setColorTag,
  isPending,
  hasRequiredError,
}: Props) => {
  const { data, isLoading, isSuccess } = useColors();

  return (
    <div>
      <Label
        htmlFor="color-tag"
        className="after:ml-1 after:text-red-600 after:content-['*']"
      >
        Color tag
      </Label>
      <Select onValueChange={setColorTag}>
        <SelectTrigger
          id="color-tag"
          disabled={isLoading || isPending || (isSuccess && data.count === 0)}
        >
          <SelectValue
            placeholder={
              isLoading
                ? "Checking available colors..."
                : isSuccess
                  ? data.count > 0
                    ? "Choose a color to use"
                    : "No available colors at the moment"
                  : "Something went wrong"
            }
          />
        </SelectTrigger>
        <SelectContent className="z-[100] h-[150px]">
          {isSuccess &&
            data.colors.map((color) => (
              <SelectItem key={color.id} value={color.id}>
                <div className="flex items-center gap-x-2">
                  <span
                    style={{ backgroundColor: color.label }}
                    className="block h-3 w-3 rounded-full"
                  ></span>
                  <span>{color.label}</span>
                </div>
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      {hasRequiredError && (
        <p className="mt-1 text-sm text-red-600">Required</p>
      )}
    </div>
  );
};

export default CarTagColorSelect;
