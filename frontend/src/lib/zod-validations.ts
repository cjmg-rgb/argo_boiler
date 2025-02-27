import { z } from "zod";

export const loginSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "This field is required" })
      .email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
  })
  .strict();

export const addBookingSchema = z.object({
  title: z.string().min(1, { message: "Required" }),
  location: z.string().min(1, { message: "Required" }),
  date: z.date(),
  pickUpTimeHour: z.number({
    message: "Required",
  }),
  dropOffTimeHour: z.number({
    message: "Required",
  }),
  instruction: z.string().min(1, { message: "Required" }),
  carId: z.string().min(1, {
    message: "Required",
  }),
});

export const editBookingSchema = addBookingSchema.extend({
  id: z.string().min(1, { message: "Required" }),
});

export const addNewCarSchema = z
  .object({
    model: z.string().min(1, { message: "Required" }),
    plateNumber: z.string().min(1, { message: "Required" }),
    driverId: z.string().min(1, { message: "Required" }),
    colorTagId: z.string().min(1, { message: "Required" }),
    codingDay: z.number().min(0, { message: "Required" }).max(6),
  })
  .strict();

export const editCarSchema = addNewCarSchema.omit({ colorTagId: true }).extend({
  id: z.string().min(1, { message: "This field is required." }),
});

export const addNewUserSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Required" })
      .email({ message: "Invalid email address" }),
    name: z.string().min(1, { message: "Required" }),
    password: z
      .string()
      .min(1, { message: "Required" })
      .min(8, { message: "Please create a stronger password" }),
    confirmPassword: z.string().min(1, { message: "Required" }),
    department: z.string().min(1, { message: "Required" }),
    role: z.enum(["admin", "user"], { message: "Required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords doesn't match",
    path: ["confirmPassword"],
  });

export const editUserSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, { message: "Required" }),
  credits: z.number().min(0).max(100),
  departmentId: z
    .string()
    .min(1, { message: "Please, select your department." }),
  role: z.enum(["admin", "user"]),
});

export const addDriverSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Required" })
      .email({ message: "Invalid email address" }),
    name: z.string().min(1, { message: "Required" }),
    number: z
      .string()
      .min(11, { message: "Phone number must be atleast 11 digit number" }),
    password: z
      .string()
      .min(1, { message: "Required" })
      .min(8, { message: "Please create a stronger password" }),
    confirmPassword: z.string().min(1, { message: "Required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords doesn't match",
    path: ["confirmPassword"],
  });

export const editDriverSchema = z.object({
  id: z.string(),
  email: z
    .string()
    .min(1, { message: "Required" })
    .email({ message: "Invalid email address" }),
  name: z.string().min(1, { message: "Required" }),
  number: z
    .string()
    .min(11, { message: "Phone number must be atleast 11 digit number" }),
});

export const changePasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: "Required" })
      .min(8, { message: "Please create a stronger password" }),
    confirmPassword: z.string().min(1, { message: "Required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords doesn't match",
    path: ["confirmPassword"],
  });
