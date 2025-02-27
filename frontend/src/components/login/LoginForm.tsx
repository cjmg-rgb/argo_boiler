import { FaRegUser } from "react-icons/fa6";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useState } from "react";
import { loginSchema } from "../../lib/zod-validations";
import { ILoginData } from "../../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useLogin from "@/hooks/api/auth/useLogin";
import toast from "react-hot-toast";
import useAuth from "@/hooks/states/useAuth";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ILoginData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });
  const { mutate: login, isPending } = useLogin();
  const navigate = useNavigate();
  const setCredentials = useAuth((state) => state.setCredentials);

  const handleLogin: SubmitHandler<ILoginData> = (formData) => {
    login(formData, {
      onSuccess: (data) => {
        reset();
        setCredentials(data);
        toast.success(`Welcome back, ${data.name}!`);
        navigate("/", { replace: true });
      },
      onError: (err) => {
        toast.error(err.response?.data.message || "Internal server error.");
      },
    });
  };

  return (
    <Card className="w-full max-w-[400px] border-none bg-primary px-8 py-5 shadow-md">
      <CardHeader>
        <CardTitle className="text-center text-4xl text-white">
          Welcome
        </CardTitle>
        <CardDescription className="text-center text-white">
          Login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-y-3 pt-5"
          onSubmit={handleSubmit(handleLogin)}
        >
          <div>
            <div className="flex h-9 w-full items-center gap-x-3 rounded-sm border border-r border-input border-white bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary focus-visible:outline-none">
              <input
                type="text"
                className="flex-1 bg-transparent text-white outline-none active:bg-transparent disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter your email"
                {...register("email")}
                disabled={isPending}
              />
              <FaRegUser className="text-white" />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div>
            <div className="flex h-9 w-full items-center gap-x-3 rounded-sm border border-r border-input border-white bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary focus-visible:outline-none">
              <input
                type={showPassword ? "text" : "password"}
                className="flex-1 bg-transparent text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter your password"
                {...register("password")}
                disabled={isPending}
              />
              <button
                type="button"
                className="text-white"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <LuEye size={16} /> : <LuEyeOff size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="mt-3" disabled={isPending}>
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
