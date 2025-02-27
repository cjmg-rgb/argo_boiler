const FormGuidelines = () => {
  return (
    <div className="flex flex-col items-center gap-y-4 border-b-white p-8">
      <div className="flex flex-col items-center font-semibold">
        <h6>FORM GUIDELINES</h6>
      </div>
      <div className="w-full text-start">
        <p>It will provide details on each field in the car booking form.</p>
        <ul className="list-disc pl-6">
          <li>
            <span className="font-semibold">Booking Title</span> describes the
            type of field work you need to do, e.g., viewing, scouting, client
            meeting, ocular visit, etc.
          </li>
          <li>
            <span className="font-semibold">Location </span>is your designated
            location for the car booking, e.g., Makati City, Mandaluyong,
            Manila, Caloocan, San Jose Del Monte, etc.
          </li>
          <li>
            <span className="font-semibold">Date</span> shows a mini-calendar
            dedicated to your specific reservation date. The default value is
            today's date. You can reserve up to 15 days in advance.
          </li>
          <li>
            <span className="font-semibold">Pick-up Time</span> is your
            departure time from the office.
          </li>
          <li>
            <span className="font-semibold">Drop-off Time</span> is your
            expected arrival time at the office.
          </li>
          <li>
            <span className="font-semibold">Car Selection</span> is a dropdown
            input that provides a list of all company cars.
          </li>
          <li>
            <span className="font-semibold">
              Special Instruction/Description
            </span>{" "}
            allows you to indicate specific instructions, such as the exact
            location and/or agenda, instructions for the driver, etc.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FormGuidelines;
