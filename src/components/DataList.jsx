import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
const DataList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/submissions`);
      setSubmissions(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch submissions');
      setLoading(false);
    }
  };

  const handleExcelSync = async () => {
    try {
      setLoading(true);
      await axios.post('/api/sync-excel');
      alert('Excel file updated successfully');
    } catch (error) {
      alert('Failed to sync with Excel');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Submissions</h2>
        <button
          onClick={handleExcelSync}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={loading}
        >
          Sync to Excel
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Form Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {submissions.map((submission) => (
              <tr key={submission.id}>
                <td className="px-6 py-4">{submission.form_type}</td>
                <td className="px-6 py-4">{submission.name}</td>
                <td className="px-6 py-4">{submission.country_code}</td>
                <td className="px-6 py-4">{submission.phone_number}</td>
                <td className="px-6 py-4">
                  {new Date(submission.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataList;
