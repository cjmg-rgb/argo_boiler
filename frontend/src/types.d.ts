import { z } from "zod";
import {
  addNewCarSchema,
  editCarSchema,
  loginSchema,
  addNewUserSchema,
  editUserSchema,
  addDriverSchema,
  editDriverSchema,
  changePasswordSchema,
} from "./lib/zod-validations";
import { AxiosError } from "axios";

interface IRequestError extends AxiosError<{ message: string }> {}

type TActiveModal = "details" | "deleteConfirmation" | "edit" | "successEdit";

interface ILoginData extends z.infer<typeof loginSchema> {}

interface IAddUserForm extends z.infer<typeof addNewUserSchema> {}

interface IAddDriverForm extends z.infer<typeof addDriverSchema> {}

interface IAddBookingForm {
  title: string;
  location: string;
  date: Date | null;
  pickUpTimeHour: number | null;
  dropOffTimeHour: number | null;
  carId: string | null;
  instruction: string;
}

interface IEditBookingForm extends IAddBookingForm {
  id: string;
}

interface EditUserDetails {
  name: string;
  department: string;
  remainingCredits: string;
  accessType: string;
}

interface IResponse<T> {
  success: boolean;
  data: T;
  message: string;
  statusCode: number;
}

interface IDepartment {
  id: string;
  name: string;
}

interface IDepartments {
  departments: IDepartment[];
  count: number;
}

interface IUser {
  id: string;
  email: string;
  name: string;
  credits: number;
  department: IDepartment;
  role: "admin" | "user";
}

interface IDriver {
  id: string;
  email: string;
  name: string;
  number: string;
  car: ICar | null;
}

interface IDrivers {
  drivers: IDriver[];
  count: number;
}

interface IAuth {
  auth: IUser | null;
  updateCredits: (newCredits: number) => void;
  setCredentials: (credentials: IUser) => void;
  removeCredentials: () => void;
}

interface IUsers {
  users: IUser[];
  count: number;
}

interface IColor {
  id: string;
  label: string;
  isUsed: boolean;
}

interface IColors {
  colors: IColor[];
  count: number;
}

interface ICar {
  id: string;
  model: string;
  plateNumber: string;
  driver: IDriver;
  codingDay: number;
  colorTag: {
    label: string;
  };
}

interface ICars {
  cars: ICar[];
  count: number;
}

interface IAddCarFields extends z.infer<typeof addNewCarSchema> {}

interface IEditCarFields extends z.infer<typeof editCarSchema> {}

interface IEditUserFields extends z.infer<typeof editUserSchema> {}

interface IEditUserFieldsWithId extends IEditUserFields {
  id: string;
}

interface IChangePasswordFields extends z.infer<typeof changePasswordSchema> {}

interface IEditDriverFields extends z.infer<typeof editDriverSchema> {}

interface IBooking {
  id: string;
  title: string;
  location: string;
  date: string;
  pickUpTime: string;
  dropOffTime: string;
  instruction: string;
  creditDeduction: number;
  editAttempts: number;
  car: ICar;
  bookedBy: IUser;
}

interface IBookings {
  bookings: IBooking[];
  count: number;
}

interface IPaginatedUsers {
  users: IUser[];
  count: number;
  totalPages: number;
  hasNextPage: boolean;
  nextPage: number | null;
}

interface IUsersQueryFilter {
  keyword: string | undefined;
  departmentId: string | undefined;
}

interface IDepartmentWithRenderedHrs extends IDepartment {
  hoursRendered: number;
}

interface ICarReport extends ICar {
  hoursRenderedPerDept: IDepartmentWithRenderedHrs[];
}

interface IDepartmentReport extends IDepartment {
  totalRenderedHours: number;
}

interface IReports {
  carReports: ICarReport[];
  departmentReports: IDepartmentReport[];
}

interface IDepartmentTotalHours {
  deptName: string;
  hours: number;
}
