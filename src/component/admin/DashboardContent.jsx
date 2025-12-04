import React, { useEffect, useState } from "react";
import { LuAlarmClockMinus } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";
import graph1 from "../../assets/graph1.png";
import graph2 from "../../assets/graph2.png";
import graph3 from "../../assets/graph3.png";
import graph4 from "../../assets/graph4.png";

const DashboardContent = () => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex justify-between items-center">
        <div className="">
          <h1 className="text-xl font-bold text-[#531954]">Hii,Noor!</h1>
          <p className="text-sm text-gray-400">
            You have 2 leave request pending
          </p>
        </div>

        <div className="p-2 border border-gray-400 rounded-md flex justify-between items-center gap-2">
          <div>
            <p className="text-sm text-gray-400">Current time</p>
            <span className="text-[12px] font-bold text-gray-600">
              {new Date().toLocaleString("en-US", {
                timeZone: "Asia/Dhaka",
                hour12: true,
              })}
            </span>
          </div>

          <span className="text-2xl text-gray-400">
            <LuAlarmClockMinus />
          </span>
        </div>
      </div>

      {/* second items */}

      <div className="w-full flex sm:flex-row flex-col gap-2">
        {/* items-1 */}
        <div className="sm:w-2/3 w-full grid grid-cols-2 gap-2">
          {/* card */}
          <div className="w-full border border-gray-400 rounded-md p-2 shadow">
            <div className="w-full flex justify-between items-center">
              <h2>Employee's total</h2>
              <div className="w-[1.7rem] h-[1.7rem] bg-green-200 rounded-full flex justify-center items-center">
                <span className="text-green-400">
                  <FaRegUser />
                </span>
              </div>
            </div>

            <div className="flex justify-between items-end mt-4">
              <span className="text-base font-bold">70</span>
              <img src={graph1} alt="graph" className="w-16" />
            </div>
          </div>
          {/* card */}
          <div className="w-full border border-gray-400 rounded-md p-2 shadow">
            <div className="w-full flex justify-between items-center">
              <h2>Employee's present today</h2>
              <div className="w-[1.7rem] h-[1.7rem] bg-green-200 rounded-full flex justify-center items-center">
                <span className="text-green-400">
                  <FaRegUser />
                </span>
              </div>
            </div>

            <div className="flex justify-between items-end mt-4">
              <span className="text-base font-bold">65</span>
              <img src={graph2} alt="graph" className="w-16" />
            </div>
          </div>
          {/* card */}
          <div className="w-full border border-gray-400 rounded-md p-2 shadow">
            <div className="w-full flex justify-between items-center">
              <h2>Employee's leave today</h2>
              <div className="w-[1.7rem] h-[1.7rem] bg-green-200 rounded-full flex justify-center items-center">
                <span className="text-green-400">
                  <FaRegUser />
                </span>
              </div>
            </div>

            <div className="flex justify-between items-end mt-[2rem]">
              <span className="text-base font-bold">5</span>
              <img src={graph3} alt="graph" className="w-16" />
            </div>
          </div>
          {/* card */}
          <div className="w-full border border-gray-400 rounded-md p-2 shadow">
            <div className="w-full flex justify-between items-center">
              <h2>Employee's late today</h2>
              <div className="w-[1.7rem] h-[1.7rem] bg-green-200 rounded-full flex justify-center items-center">
                <span className="text-green-400">
                  <FaRegUser />
                </span>
              </div>
            </div>

            <div className="flex justify-between items-end mt-4">
              <span className="text-base font-bold">7</span>
              <img src={graph4} alt="graph" className="w-16" />
            </div>
          </div>
        </div>
        {/* items-2 */}
        <div className="sm:w-1/3 w-full border border-gray-400 p-2 rounded-md">
          <h2 className="text-sm font-bold text-[#531954]">Task</h2>

          <form action="">
            <select
              name="cars"
              id="cars"
              className="w-full mt-4 border border-gray-400 rounded "
            >
              <option value="volvo">done</option>
              <option value="saab">Saab</option>
              <option value="mercedes">Mercedes</option>
              <option value="audi">Audi</option>
            </select>
            <textarea
              rows="8"
              name=""
              id=""
              placeholder="write the task"
              className="w-full mt-2 p-4 text-sm rounded border border-gray-300 outline-none"
            ></textarea>
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="bg-[#531954] py-1 px-4 text-white rounded-md cursor-pointer"
              >
                submit
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* third section */}
      <div className="w-full flex md:flex-row flex-col gap-4 ">
        {/* item-1 */}
        <div className="md:w-2/3  border border-gray-400 rounded-md p-2 shadow">
          <h2 className="text-sm font-bold text-gray-600">
            Today's Attendance
          </h2>

          <div className="w-full max-h-[10rem] overflow-y-auto mt-4 ">
            <table className="w-full text-left">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="p-2 ">Image</th>
                  <th className="p-2 ">Name</th>
                  <th className="p-2 ">Check-In</th>
                  <th className="p-2 ">Check-Out</th>
                </tr>
              </thead>

              <tbody >
                <tr>
                  <td className="p-2 ">
                    <img
                      src="https://img.freepik.com/free-photo/close-up-portrait-handsome-smiling-young-man-white-t-shirt-blurry-outdoor-nature_176420-6305.jpg?semt=ais_hybrid&w=740&q=80"
                      alt="emp"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>

                  <td className="p-2 ">Aminur Rahman</td>

                  <td className="p-2  text-green-600">09:15 AM</td>

                  <td className="p-2  text-red-600">06:05 PM</td>
                </tr>

                <tr>
                  <td className="p-2 ">
                    <img
                      src="https://img.freepik.com/free-photo/close-up-portrait-handsome-smiling-young-man-white-t-shirt-blurry-outdoor-nature_176420-6305.jpg?semt=ais_hybrid&w=740&q=80"
                      alt="emp"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>

                  <td className="p-2 ">Noor Mohammad</td>

                  <td className="p-2  text-green-600">10:00 AM</td>

                  <td className="p-2  text-red-600">07:00 PM</td>
                </tr>
                <tr>
                  <td className="p-2 ">
                    <img
                      src="https://img.freepik.com/free-photo/close-up-portrait-handsome-smiling-young-man-white-t-shirt-blurry-outdoor-nature_176420-6305.jpg?semt=ais_hybrid&w=740&q=80"
                      alt="emp"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>

                  <td className="p-2 ">Noor Mohammad</td>

                  <td className="p-2  text-green-600">10:00 AM</td>

                  <td className="p-2  text-red-600">07:00 PM</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="md:w-1/3  border border-gray-400 rounded-md p-2 shadow">
          <h2 className="text-sm font-bold text-gray-600">Today's Late</h2>
          <div className="w-full max-h-[10rem] overflow-y-auto mt-4 ">
            <table className="w-full text-left">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                 
                  <th className="p-2 text-[14px]">Name</th>
                  <th className="p-2 text-[14px]">Check-In</th>
                  <th className="p-2 text-[14px]">Check-Out</th>
                </tr>
              </thead>

              <tbody >
                <tr>
                 

                  <td className="p-2 text-[14px]">Aminur Rahman</td>

                  <td className="p-2 text-[14px] text-green-600 ">09:15 AM</td>

                  <td className="p-2 text-[14px] text-red-600">06:05 PM</td>
                </tr>

                <tr>
                 

                  <td className="p-2 text-[14px]">Noor Mohammad</td>

                  <td className="p-2 text-[14px] text-green-600">10:00 AM</td>

                  <td className="p-2 text-[14px] text-red-600">07:00 PM</td>
                </tr>
                <tr>
                  

                  <td className="p-2 text-[14px]">Noor Mohammad</td>

                  <td className="p-2 text-[14px] text-green-600">10:00 AM</td>

                  <td className="p-2 text-[14px] text-red-600">07:00 PM</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
