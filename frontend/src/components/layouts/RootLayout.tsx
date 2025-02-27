import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "../shared/AppSidebar";
import AddBookingDialog from "../common/AddBookingDialog";
import SocketProvider from "../providers/SocketProvider";

const RootLayout = () => {
  return (
    <SocketProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <main className="flex-1">
            <Outlet />
          </main>
        </SidebarInset>
        <AddBookingDialog />
      </SidebarProvider>
    </SocketProvider>
  );
};

export default RootLayout;
