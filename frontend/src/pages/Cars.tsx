import AppBreadCrumb from "@/components/common/AppBreadCrumb";
import CarContainer from "@/components/cars/CarListContainer";
import AddCarDialog from "@/components/cars/AddCarDialog";

const Cars = () => {
  return (
    <div className="flex flex-col p-9">
      <div className="flex flex-1 items-center justify-between">
        <div>
          <AppBreadCrumb currentPageHref="/cars" currentPageLabel="Cars" />
          <h5 className="mb-10 font-bold text-primary">Cars</h5>
        </div>
        <AddCarDialog />
      </div>
      <CarContainer />
    </div>
  );
};

export default Cars;
