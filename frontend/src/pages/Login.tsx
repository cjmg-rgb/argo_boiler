import LoginForm from "@/components/login/LoginForm";
import logo from "../assets/images/logo.png";
import bgLogin from "../assets/images/login-bg.jpg";
import useAuth from "@/hooks/states/useAuth";
import { Navigate } from "react-router-dom";

const LoginPage = () => {
  const { auth } = useAuth((state) => state);

  if (auth) return <Navigate to="/" />;

  return (
    <div
      className="flex h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${bgLogin})` }}
    >
      <div className="flex h-screen bg-black bg-opacity-40">
        <div className="relative mt-[300px] flex flex-1 flex-col justify-start px-12">
          <div>
            <h5 className="font-semibold">Calendar Booking System</h5>
            <div className="mb-7 h-[8px] w-[420px] rounded-full bg-secondary"></div>
          </div>
          <div>
            <h1 className="mb-3 font-bold">Argo Navis</h1>
            <p>
              The system is named after "Ship Argo", or simply Argo, was a large
              constellation in the southern sky that has since been divided into
              the three constellations of Carina, Puppis and Vela. Argo
              represents the car that PRIME provided for all the employee on
              their field work.
            </p>
          </div>
          <p className="absolute bottom-6 left-12">
            ©2024 Copyright PRIME Philippines
          </p>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center bg-primary/70">
          <img src={logo} alt="Argo Navis' Logo" className="mb-8" />
          <LoginForm />
          <span className="pt-2 text-sm font-medium uppercase">
            Argo navis version. 2.1
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
