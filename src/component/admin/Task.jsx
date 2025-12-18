import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";

const Task = () => {
  const [tasks, setTasks] = useState([]);

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks/all");
      setTasks(res.data);
      console.log("task", res);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
  if (!window.confirm("Are you sure you want to delete this task?")) return;

  try {
    await api.delete(`/tasks/${id}`);
    fetchTasks(); // refresh list after delete
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
    fetchTasks();
  }, []);
  return (
    <div className="w-full h-full overflow-y-auto ">
      <h2 className="text-sm font-bold text-[#531954] mb-2">Tasks Management</h2>

      <div className="flex flex-col gap-4">
        {/* DO Tasks */}
        <div>
          <h3 className="font-bold text-blue-700">Do</h3>
          <div className="w-full mt-4 grid md:grid-cols-3 sm:grid-cols-2 gap-4">
            {tasks.do?.length > 0 ? (
              tasks.do.map((task) => (
                //   <p key={task.id}>
                //      ({task.start_date} - {task.end_date})
                //   </p>

                <>
                  <div className="flex flex-col gap-2 shadow-sm p-4 rounded-md" key={task.id}>
                    <p className="line-clamp-5 text-sm text-gray-700">{task.description}.</p>
                    <div className="w-full flex items-center gap-2">
                        <div className="w-[2.5rem] h-[2.5rem] "><img src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" alt="" className="w-full h-full rounded-full"/></div>
                        <span className="text-gray-700">{task?.user.name}</span>
                       
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-400">{task.start_date} to {task.end_date}</p>
                        <button className="text-red-600 cursor-pointer" onClick={() => deleteTask(task.id)}><MdDelete /></button>
                    </div>
                     

                     

                  </div>
                </>
              ))
            ) : (
              <p>No tasks</p>
            )}
          </div>
        </div>

        {/* DOING Tasks */}
        <div>
          <h3 className="font-bold text-yellow-700">Doing</h3>
         <div className="w-full mt-4 grid md:grid-cols-3 sm:grid-cols-2 gap-4">
            {tasks.doing?.length > 0 ? (
              tasks.doing.map((task) => (
                //   <p key={task.id}>
                //      ({task.start_date} - {task.end_date})
                //   </p>

                <>
                  <div className="flex flex-col gap-2 shadow-sm p-4 rounded-md" key={task.id}>
                    <p className="line-clamp-5 text-sm text-gray-700">{task.description}.</p>
                    <div className="w-full flex items-center gap-2">
                        <div className="w-[2.5rem] h-[2.5rem] "><img src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" alt="" className="w-full h-full rounded-full"/></div>
                        <span className="text-gray-700">{task?.user.name}</span>
                       
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-400">{task.start_date} to {task.end_date}</p>
                        <button className="text-red-600 cursor-pointer" onClick={() => deleteTask(task.id)}><MdDelete /></button>
                    </div>
                     

                     

                  </div>
                </>
              ))
            ) : (
              <p>No working</p>
            )}
          </div>
        </div>

        {/* DONE Tasks */}
        <div>
          <h3 className="font-bold text-green-700">Done</h3>
       <div className="w-full mt-4 grid md:grid-cols-3 sm:grid-cols-2 gap-4">
            {tasks.done?.length > 0 ? (
              tasks.done.map((task) => (
                //   <p key={task.id}>
                //      ({task.start_date} - {task.end_date})
                //   </p>

                <>
                  <div className="flex flex-col gap-2 shadow-sm p-4 rounded-md" key={task.id}>
                    <p className="line-clamp-5 text-sm text-gray-700">{task.description}.</p>
                    <div className="w-full flex items-center gap-2">
                        <div className="w-[2.5rem] h-[2.5rem] "><img src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" alt="" className="w-full h-full rounded-full"/></div>
                        <span className="text-gray-700">{task?.user.name}</span>
                       
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-400">{task.start_date} to {task.end_date}</p>
                        <button className="text-red-600 cursor-pointer" onClick={() => deleteTask(task.id)}><MdDelete /></button>
                    </div>
                     

                     

                  </div>
                </>
              ))
            ) : (
              <p>No complete</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;
