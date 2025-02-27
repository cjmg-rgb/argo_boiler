const CreditDeduction = () => {
  return (
    <div className="flex flex-col items-center gap-y-4 border-b-white p-8">
      <div className="flex flex-col items-center font-semibold">
        <h6>CREDIT DEDUCTION</h6>
      </div>
      <div>
        <p>
          Every 1 hour of your car schedule equivalent to 1 credit  
          <span className="font-semibold"> (1 hour = 1 credit point)</span>
        </p>
        <br />
        <p>
          Weekend Schedule will not deduct your current credit. <br />
          Weekdays deduct you from 8:00 AM to 12:00 PM and 01:00 PM to 7:00 PM.
        </p>
      </div>
    </div>
  );
};

export default CreditDeduction;
