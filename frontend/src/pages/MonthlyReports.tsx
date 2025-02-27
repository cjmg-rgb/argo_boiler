import AppBreadCrumb from "@/components/common/AppBreadCrumb";
import MonthlyReportsContainer from "@/components/monthly-reports/MonthlyReportsContainer";

const MonthlyReports = () => {
  return (
    <div className="p-9">
      <AppBreadCrumb
        currentPageLabel="Monthly Reports"
        currentPageHref="/monthly-reports"
      />
      <MonthlyReportsContainer />
    </div>
  );
};

export default MonthlyReports;
