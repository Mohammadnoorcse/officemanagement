import React, { useEffect, useState } from "react";
import axios from "axios";

const api_key = "a83f041117f24e74b2e235ba14f797f7";

const AttendanceTable = ({ data }) => {
  const [addresses, setAddresses] = useState({});

  useEffect(() => {
    if (!data || data.length === 0) return;

    const fetchAddresses = async () => {
      const results = await Promise.all(
        data.map(async (att) => {
          if (!att.latitude || !att.longitude) return { id: att.id, address: "-" };

          try {
            const res = await axios.get(
              `https://api.opencagedata.com/geocode/v1/json?q=${att.latitude}+${att.longitude}&key=${api_key}`
            );
            const formatted = res.data.results?.[0]?.formatted || "-";
            return { id: att.id, address: formatted };
          } catch (err) {
            return { id: att.id, address: "-" };
          }
        })
      );

      const addrObj = results.reduce((acc, cur) => ({ ...acc, [cur.id]: cur.address }), {});
      setAddresses(addrObj);
    };

    fetchAddresses();
  }, [data]);

  if (!data || data.length === 0) return <p>No attendance records found.</p>;

  return (
    <table className="min-w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">Date</th>
          <th className="p-2 border">Login</th>
          <th className="p-2 border">Logout</th>
          <th className="p-2 border">Login Address</th>
        </tr>
      </thead>
      <tbody>
        {data.map((att) => (
          <tr key={att.id}>
            <td className="p-2 border">{att.date}</td>
            <td className="p-2 border">{att.login_time || "-"}</td>
            <td className="p-2 border">{att.logout_time || "-"}</td>
            <td className="p-2 border">{addresses[att.id] || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AttendanceTable;
