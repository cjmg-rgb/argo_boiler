import useDepartments from "@/hooks/api/departments/useDepartments";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  onDepartmentSelect: (deparmentId: string) => void;
  defaultValue: undefined | string;
}

const DepartmentSelectFilter = ({
  onDepartmentSelect,
  defaultValue,
}: Props) => {
  const { data, isLoading, isSuccess, isError } = useDepartments();

  return (
    <Select value={defaultValue} onValueChange={onDepartmentSelect}>
      <SelectTrigger id="department" disabled={isLoading || isError}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="z-[100] mr-8 max-h-[200px]">
        <SelectItem value="all">All</SelectItem>
        {isSuccess &&
          data.departments.map(({ id, name }) => (
            <SelectItem value={id} key={id}>
              {name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

export default DepartmentSelectFilter;
