import { useEffect, useState } from "react";
import api from "../../api/axios";

const TeamReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get("/team-reports");

        
        if (Array.isArray(res.data)) {
          setReports(res.data);
        } else if (Array.isArray(res.data.data)) {
          setReports(res.data.data);
        } else if (Array.isArray(res.data.reports)) {
          setReports(res.data.reports);
        } else {
          setReports([]);
        }
      } catch (error) {
        console.error("Failed to load team reports", error);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Team Reports</h2>

      {loading && (
        <p className="text-sm text-gray-500">Loading reports...</p>
      )}

      {!loading && reports.length === 0 && (
        <p className="text-sm text-gray-500">No reports found</p>
      )}

      {!loading && reports.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200">
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
              {reports.map((report) => (
                <tr key={report.id} className="text-sm hover:bg-gray-50">
                  <td className="p-2 border">
                    {report.user?.name || "N/A"}
                  </td>

                  <td className="p-2 border">
                    {report.task?.title || "N/A"}
                  </td>

                  <td className="p-2 border">
                    {report.work_summary || "-"}
                  </td>

                  <td className="p-2 border text-center">
                    {report.hours_spent ?? 0}
                  </td>

                  <td className="p-2 border">
                    {report.created_at
                      ? new Date(report.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeamReports;
