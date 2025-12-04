import React, { useState } from "react";
import { IoIosSend } from "react-icons/io";

const data = [
  {
    name: "Aminur",
    month: "December",
    present: 22,
    late: 2,
    leave: 1,
    overtime: 4,
    basic: 15000,
    total: 16000,
  },
  {
    name: "Rahim",
    month: "December",
    present: 20,
    late: 1,
    leave: 3,
    overtime: 2,
    basic: 14000,
    total: 14800,
  },
];

const Salary = () => {
  const [month, setMonth] = useState("");

  return (
    <div className="w-full flex flex-col gap-4 p-2">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-lg font-bold text-[#531954]">Salary {month}</h1>
        <form className="flex border border-[#531954] rounded">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="p-1 rounded outline-none text-xs sm:text-sm"
          />
          <button className="bg-[#531954] text-white p-1 sm:p-2">
            <IoIosSend />
          </button>
        </form>
      </div>

      {/* Table wrapper */}
      <div className="w-full overflow-auto">
        <table className="w-full  border border-gray-300 table-fixed text-[10px] sm:text-sm md:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-1">Name</th>
              <th className="border p-1">Month</th>
              <th className="border p-1">Present</th>
              <th className="border p-1">Late</th>
              <th className="border p-1">Leave</th>
              <th className="border p-1">Overtime</th>
              <th className="border p-1">Basic</th>
              <th className="border p-1">Total</th>
              <th className="border p-1">Status</th>
              <th className="border p-1">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border p-1 break-words">{item.name}</td>
                <td className="border p-1 break-words">{item.month}</td>
                <td className="border p-1">{item.present}</td>
                <td className="border p-1">{item.late}</td>
                <td className="border p-1">{item.leave}</td>
                <td className="border p-1">{item.overtime}</td>
                <td className="border p-1">{item.basic}</td>
                <td className="border p-1 font-semibold">{item.total}</td>
                <td className="border p-1 font-semibold">Pending</td>
                <td className="border p-1 font-semibold">Edit</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Salary;
