import { useRef } from "react";
import { jsPDF } from "jspdf";
import ReportTemplate from "./ReportTemplate";
import { Button } from "../ui/button";
import { Card } from "@/components/ui/card";
import html2canvas from "html2canvas";
import { ICarReport, IDepartmentReport } from "@/types";
import Overlay from "../shared/Overlay";

interface Props {
  closeModal: () => void;
  currentDate: {
    month: string;
    year: number;
  };
  getLastDayOfTheMonth: number;
  carReports: ICarReport[];
  departmentReports: IDepartmentReport[];
}

const ReportContainer = ({
  currentDate,
  closeModal,
  getLastDayOfTheMonth,
  carReports,
  departmentReports,
}: Props) => {
  const componentRef = useRef<HTMLDivElement | null>(null);
  const { month, year } = currentDate;

  const handleDownloadPDF = async () => {
    const doc = new jsPDF("landscape", "mm", "a4");

    if (componentRef.current) {
      const element = componentRef.current;

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdfWidth = 297;
      const pdfHeight = 210;
      const imgWidth = canvas.width / 3;
      const imgHeight = canvas.height / 3;

      const aspectRatio = imgWidth / imgHeight;

      let finalWidth, finalHeight;
      if (aspectRatio > pdfWidth / pdfHeight) {
        finalWidth = pdfWidth;
        finalHeight = pdfWidth / aspectRatio;
      } else {
        finalHeight = pdfHeight;
        finalWidth = pdfHeight * aspectRatio;
      }

      const xOffset = (pdfWidth - finalWidth) / 2;
      const yOffset = 5;

      doc.addImage(imgData, "PNG", xOffset, yOffset, finalWidth, finalHeight);

      doc.save(`${currentDate.month}-${currentDate.year}-Report.pdf`);
    }
  };

  return (
    <Overlay>
      <Card className="flex flex-col gap-y-5 p-5">
        <ReportTemplate
          currentDate={{
            month: month,
            year: year,
          }}
          carReports={carReports}
          departmentReports={departmentReports}
          ref={componentRef}
          getLastDayOfTheMonth={getLastDayOfTheMonth}
        />
        <div className="flex justify-end gap-x-3">
          <Button onClick={handleDownloadPDF}>Download Report</Button>
          <Button variant="outline" onClick={closeModal}>
            Cancel
          </Button>
        </div>
      </Card>
    </Overlay>
  );
};

export default ReportContainer;
