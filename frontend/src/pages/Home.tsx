import CarList from "@/components/home/CarList";
// import CreditBreakdown from "@/components/home/CreditBreakdown";
import CreditDeduction from "@/components/home/CreditDeduction";
import FormGuidelines from "@/components/home/FormGuidelines";

const Home = () => {
  return (
    <div className="flex flex-1 flex-col font-light">
      <CarList />
      <FormGuidelines />
      <CreditDeduction />
      {/* <CreditBreakdown /> */}
    </div>
  );
};

export default Home;
