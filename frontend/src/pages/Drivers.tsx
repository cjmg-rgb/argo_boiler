import AppBreadCrumb from "@/components/common/AppBreadCrumb";
import AddDriverDialog from "@/components/drivers/AddDriverDialog";
import DriverListContainer from "@/components/drivers/DriverListContainer";

const Drivers = () => {
  return (
    <div className="flex flex-col p-9">
      <div className="flex flex-1 items-center justify-between">
        <div>
          <AppBreadCrumb
            currentPageHref="/drivers"
            currentPageLabel="Drivers"
          />
          <h5 className="mb-10 font-bold text-primary">Drivers</h5>
        </div>
        <AddDriverDialog />
      </div>
      <DriverListContainer />
    </div>
  );
};

export default Drivers;
