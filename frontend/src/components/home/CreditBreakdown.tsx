const CreditBreakdown = () => {
  return (
    <div className="flex flex-col items-center gap-y-4 border-b-white p-8">
      <div className="flex flex-col items-center font-semibold">
        <h6>CREDIT BREAKDOWN</h6>
        <span className="block h-[1px] w-[calc(100%+2rem)] bg-secondary"></span>
      </div>
      <div className="w-full text-start">
        <p>
          Every 30 minutes of your car schedule equivalent to 0.5 credit (30
          minutes = 0.5 credit, and 1 hour = 1 credit).
        </p>
        <ul className="list-disc pl-6">
          <li>Business Development Department - 50 credits</li>
          <li>Sales and Leasing Associates - 18 credits</li>
          <li>Administrative Department - 12 credits</li>
          <li>Marketing Department 10 credits</li>
          <li>Public and Relations Department - 20 credits</li>
          <li>Research and Consultancy Department - 5 credits</li>
          <li>InnoTech Department - 5 credits</li>
        </ul>
      </div>
    </div>
  );
};

export default CreditBreakdown;
