import logo from "../../assets/images/logo.png";
import { TbReportAnalytics, TbUsers } from "react-icons/tb";
import { VscNotebook } from "react-icons/vsc";
import { NavLink } from "react-router-dom";
import useAuth from "@/hooks/states/useAuth";
import { PiCarSimpleLight } from "react-icons/pi";
import { CiCalendar } from "react-icons/ci";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TbSteeringWheel } from "react-icons/tb";
import AccountDetails from "../account/AccountDetails";
import { SlOptionsVertical } from "react-icons/sl";
import useLogout from "@/hooks/api/auth/useLogout";
import toast from "react-hot-toast";

export const navLinks = [
  {
    label: "Calendar of Bookings",
    href: "/",
    icon: <CiCalendar size={20} />,
    forAdmin: false,
  },
  {
    label: "My Bookings",
    href: "/my-bookings",
    icon: <VscNotebook size={20} />,
    forAdmin: false,
  },
  {
    label: "Cars",
    href: "/cars",
    icon: <PiCarSimpleLight size={20} />,
    forAdmin: true,
  },
  {
    label: "Users",
    href: "/users",
    icon: <TbUsers size={20} />,
    forAdmin: true,
  },
  {
    label: "Drivers",
    href: "/drivers",
    icon: <TbSteeringWheel size={20} />,
    forAdmin: true,
  },
  {
    label: "Monthly Reports",
    href: "/monthly-reports",
    icon: <TbReportAnalytics size={20} />,
    forAdmin: true,
  },
];

const AppSidebar = () => {
  const { auth, removeCredentials } = useAuth((state) => state);
  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout(null, {
      onSuccess: () => {
        removeCredentials();
      },
      onError: (err) => {
        toast.error(err.response?.data.message || "Internal server error");
      },
    });
  };

  return (
    <Sidebar className="text-white">
      <SidebarHeader>
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-x-2">
            <img src={logo} className="size-10" />
            <div>
              <div className="text-xl font-semibold text-white">Argo Navis</div>
              <span className="text-xs">Version 2.0</span>
            </div>
          </div>
          <div className="flex flex-col items-center rounded-md bg-white p-2 px-4 font-bold text-primary">
            <span>{auth?.credits}</span>
            <span className="text-center text-[11px] font-normal">Credits</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navLinks
                .filter((item) =>
                  auth?.role === "admin" ? true : !item.forAdmin,
                )
                .map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.href} className="flex items-center p-0">
                        {item.icon}
                        <span className="leading-none">{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex w-full items-center gap-x-3 rounded p-3">
                <Avatar className="size-8 text-primary">
                  <AvatarFallback>
                    {auth?.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col items-start">
                  <span className="font-semibold">{auth?.name}</span>
                  <span className="text-xs">{auth?.email}</span>
                </div>
                <div>
                  <SlOptionsVertical />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                className="mb-4 w-[--radix-popper-anchor-width] bg-primary text-white"
              >
                <AccountDetails />
                <DropdownMenuItem onClick={handleLogout}>
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
