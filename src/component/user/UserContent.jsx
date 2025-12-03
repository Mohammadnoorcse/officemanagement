import React, { useEffect, useState } from "react";
import { LuAlarmClockMinus } from "react-icons/lu";
import icon1 from "../../assets/icons8-progress.gif";
import { LuClock } from "react-icons/lu";
import { LuClockAlert } from "react-icons/lu";
import { LuAlarmClockOff } from "react-icons/lu";
const UserContent = () => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const [task,setTask] = useState(false);

  useEffect(() => {
    let interval;
    if (running === false) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [running]);

  const handleStart = () => setRunning(false);
  const handleStop = () => {
    setRunning(true);
    setSeconds(0);
  }

  // Format H:m:s
  const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

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

      <div className="w-full grid lg:grid-cols-3 gap-2">
        {/* items-1 */}
        <div className="w-full p-2 border border-gray-400 rounded-md flex flex-col gap-2 shadow">
          <div className="flex justify-between items-center border-b border-gray-400 pb-4">
            <span>Today</span>
            <span className="bg-red-500 p-1 text-white rounded-md text-sm">
              Late
            </span>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-[14px] text-gray-600">
              This employee consistently demonstrates dedication,
              professionalism, and a strong work ethic
            </p>
            <img src={icon1} alt="" />
          </div>

          <span className="text-[#531954] font-bold text-sm">
            Check-in:3.00pm
          </span>
        </div>

        {/* items-2 */}
        <div className="w-full grid grid-cols-2 gap-2">
          {/* child-1 */}
          <div className="w-full p-2 border border-gray-400 rounded-md shadow flex flex-col gap-2">
            <span className="mt-2 text-green-400">
              <LuClock />
            </span>
            <span className="text-sm font-bold text-green-700">3Days</span>
            <p className="text-[10px] text-gray-400">
              You were present for X days this month. Great job!
            </p>
            <span className="text-sm font-bold text-gray-600">Present</span>
          </div>
          {/* child-1 */}
          <div className="w-full p-2 border border-gray-400 rounded-md shadow flex flex-col gap-2">
            <span className="mt-2 text-red-300">
              <LuClockAlert />
            </span>
            <span className="text-sm font-bold text-red-600">3Days</span>
            <p className="text-[10px] text-gray-400">
              You were absent for X days this month. Kindly keep it minimal.
            </p>
            <span className="text-sm font-bold text-gray-600">Absent</span>
          </div>
          {/* child-1 */}
          <div className="w-full p-2 border border-gray-400 rounded-md shadow flex flex-col gap-2">
            <span className="mt-2 text-red-400">
              <LuAlarmClockOff />
            </span>
            <span className="text-sm font-bold text-red-700">3Days</span>
            <p className="text-[10px] text-gray-400">
              You were late for X days this month. Please try to improve.
            </p>
            <span className="text-sm font-bold text-gray-600">Late</span>
          </div>
          {/* child-1 */}
          <div className="w-full p-2 border border-gray-400 rounded-md shadow flex flex-col gap-2">
            <span className="mt-2">
              <LuClock />
            </span>
            <span className="text-sm font-bold text-green-700">3Days</span>
            <p className="text-[10px] text-gray-400">
              You worked X hours of overtime this month. Thank you for your
              dedication!
            </p>
            <span className="text-sm font-bold text-gray-600">Overtime</span>
          </div>
        </div>
        {/* items-3 */}
        <div className="w-full border border-gray-400 p-2 rounded-md">
          <h2 className="text-sm font-bold text-[#531954]">Break time</h2>
          {running ? (
            <>
              <form action="">
                <textarea
                  rows="9"
                  name=""
                  id=""
                  placeholder="please write the reason"
                  className="w-full mt-2 p-4 text-sm rounded border border-gray-300 outline-none"
                ></textarea>
                <div className="flex justify-between items-center">
                  <button
                    type="submit"
                    onClick={handleStart}
                    className="bg-[#531954] py-1 px-4 text-white rounded-md cursor-pointer"
                  >
                    start
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="w-full h-full flex justify-center items-center flex-col gap-4">
                <span className="text-base font-bold">
                  {hours}:{minutes}:{secs}
                </span>

                <button
                  onClick={handleStop}
                  className="bg-red-600 py-1 px-4 text-white rounded-md cursor-pointer"
                >
                  end
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* third section */}
      <div className="w-full flex gap-4 ">
        {/* item-1 */}
        <div className="w-2/3  border border-gray-400 rounded-md p-2 shadow">
            <h2 className="text-sm font-bold text-gray-600">Task</h2>
            
            <div className="w-full grid grid-cols-3 gap-2 mt-4">
                <div className="w-full border border-gray-300 rounded p-2 relative bg-green-200">
                    <p className="line-clamp-3 text-sm text-gray-600">Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen</p>
                   <div className="flex justify-between items-center mt-4">
                     <span>End:05/12/2024</span>
                     <button onClick={()=>setTask(true)} className="cursor-pointer">Edit</button>

                    {task &&  <div className="w-full h-full absolute top-0 left-0 bg-white rounded px-2">
                       <form action="">
                         <select name="cars" id="cars" className="w-full mt-4 border border-gray-400 rounded ">
                            <option value="volvo">done</option>
                            <option value="saab">Saab</option>
                            <option value="mercedes">Mercedes</option>
                            <option value="audi">Audi</option>
                        </select>

                        <div className="flex justify-between items-center mt-4">
                            <button className="px-2 bg-green-500 text-sm text-white rounded cursor-pointer">Save</button>
                            <button onClick={()=>setTask(false)} className="px-2 bg-red-700 text-sm text-white rounded cursor-pointer">Cancel</button>

                        </div>
                       </form>

                     </div>}


                   </div>
                </div>

            </div>

        </div>
        <div className="w-1/3  border border-gray-400 rounded-md p-2 shadow">
          <h2 className="text-sm font-bold text-gray-600">Task Done</h2>

        </div>

      </div>
    </div>
  );
};

export default UserContent;
