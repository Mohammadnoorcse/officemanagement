import { useEffect, useState } from "react";
import api from "../../api/axios";

const TeamReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api.get("/team-reports").then(res => setReports(res.data));
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Team Reports</h2>

      {reports.length === 0 && (
        <p className="text-sm text-gray-500">No reports found</p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-2 border">Employee</th>
              <th className="p-2 border">Task</th>
              <th className="p-2 border">Summary</th>
              <th className="p-2 border">Hours</th>
              <th className="p-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.id} className="text-sm">
                <td className="p-2 border">
                  {report.user?.name}
                </td>
                <td className="p-2 border">
                  {report.task?.title}
                </td>
                <td className="p-2 border">
                  {report.work_summary}
                </td>
                <td className="p-2 border text-center">
                  {report.hours_spent}
                </td>
                <td className="p-2 border">
                  {new Date(report.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamReports;
