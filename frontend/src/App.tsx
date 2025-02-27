import { Routes, Route } from "react-router-dom";
import RootLayout from "./components/layouts/RootLayout";
import Login from "./pages/Login";
import CarSchedule from "./pages/MyBookings";
import Users from "./pages/Users";
import Cars from "./pages/Cars";
import useGetCurrentUser from "./hooks/api/users/useGetCurrentUser";
import useAuth from "./hooks/states/useAuth";
import { useEffect } from "react";
import AuthMiddleware from "./components/middlewares/AuthMiddleware";
import loading from "./assets/images/car-load.json";
import Lottie from "lottie-react";
import BookingsCalendar from "./pages/BookingsCalendar";
import Drivers from "./pages/Drivers";
import MonthlyReports from "./pages/MonthlyReports";

const App = () => {
  const { data, isLoading, isSuccess, isError } = useGetCurrentUser();
  const { setCredentials, removeCredentials } = useAuth();

  useEffect(() => {
    if (isSuccess) {
      setCredentials(data);
    }
    if (isError) {
      removeCredentials();
    }
  }, [isSuccess, isError, data]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full justify-center bg-primary">
        <div className="relative flex flex-col items-center justify-center">
          <Lottie
            animationData={loading}
            style={{ width: 400, borderRadius: 20 }}
          />
          <span className="bottom-[30%] max-w-[520px] text-center text-lg text-white">
            "And in the end, the love you take is equal to the love you make." —
            The Beatles, The End
          </span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<AuthMiddleware />}>
        <Route element={<RootLayout />}>
          <Route path="/" element={<BookingsCalendar />} />
          <Route path="/my-bookings" element={<CarSchedule />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/users" element={<Users />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/monthly-reports" element={<MonthlyReports />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
