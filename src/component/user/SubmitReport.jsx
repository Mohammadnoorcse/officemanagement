import { useState } from "react";
import api from "../../api/axios";

const SubmitReport = ({ taskId }) => {
  const [summary, setSummary] = useState("");
  const [hours, setHours] = useState("");

  const submit = async () => {
    await api.post("/team-report/submit", {
      task_id: taskId,
      work_summary: summary,
      hours_spent: hours,
    });
    alert("Report submitted");
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <textarea
        className="border w-full p-2 mb-3"
        placeholder="Work summary"
        onChange={e => setSummary(e.target.value)}
      />

      <input
        type="number"
        className="border w-full p-2 mb-3"
        placeholder="Hours spent"
        onChange={e => setHours(e.target.value)}
      />

      <button
        onClick={submit}
        className="bg-[#531954] text-white px-4 py-2 rounded"
      >
        Submit Report
      </button>
    </div>
  );
};

export default SubmitReport;
