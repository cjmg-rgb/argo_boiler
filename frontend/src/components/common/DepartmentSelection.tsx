import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import useDepartments from "@/hooks/api/departments/useDepartments";
import { Label } from "../ui/label";

interface Props {
  selectedDepartment: (departmentId: string) => void;
  disabled: boolean;
  defaultDepartment?: string;
  hasRequiredError: boolean;
}

const DepartmentSelection = ({
  defaultDepartment,
  selectedDepartment,
  disabled,
  hasRequiredError,
}: Props) => {
  const { data, isLoading, isSuccess, isError } = useDepartments();

  return (
    <div className="select-container flex-[2]">
      <Label
        htmlFor="department"
        className="after:ml-1 after:text-red-600 after:content-['*']"
      >
        Department
      </Label>
      <Select
        defaultValue={defaultDepartment}
        onValueChange={(value) => selectedDepartment(value)}
      >
        <SelectTrigger
          id="department"
          disabled={isLoading || isError || disabled}
        >
          <SelectValue
            className="placeholder:text-red-700"
            placeholder={
              isLoading
                ? "Getting available departments..."
                : isSuccess
                  ? defaultDepartment
                    ? defaultDepartment
                    : "Select Department"
                  : "Something went wrong."
            }
          />
        </SelectTrigger>
        <SelectContent className="z-[100] max-h-[200px]">
          {isSuccess &&
            data.departments.map(({ id, name }) => (
              <SelectItem value={id} key={id}>
                {name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      {hasRequiredError && <p className="text-sm text-red-600">Required</p>}
    </div>
  );
};

export default DepartmentSelection;
