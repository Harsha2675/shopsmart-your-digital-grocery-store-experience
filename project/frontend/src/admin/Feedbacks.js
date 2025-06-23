import React, { useEffect, useState } from 'react';
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/allfeedbacks`);
        const data = await response.json();

        if (response.ok && data.data) {
          setFeedbacks(data.data);
        } else {
          setErrorMessage('Error fetching feedback data.');
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setErrorMessage('Error fetching feedback data.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="container mx-auto p-6">
      {/* Back Link */}
      <div className="mb-4">
        <Link
          to="/adminpanel"
          className="flex items-center text-lg text-blue-600 hover:text-blue-800 transition"
        >
          <FaArrowAltCircleLeft className="mr-2" />
          Back to Admin Panel
        </Link>
      </div>

      {/* Feedback Panel */}
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Feedback Submissions</h2>

        {loading ? (
          <p className="text-center text-lg">Loading...</p>
        ) : errorMessage ? (
          <p className="text-red-600 text-center mb-4">{errorMessage}</p>
        ) : feedbacks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700 border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 border">Name</th>
                  <th className="px-4 py-3 border">Email</th>
                  <th className="px-4 py-3 border">Phone</th>
                  <th className="px-4 py-3 border">Product Name</th>
                  <th className="px-4 py-3 border">Rating</th>
                  <th className="px-4 py-3 border">Comment</th>
                  <th className="px-4 py-3 border">Date Submitted</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((feedback) => (
                  <tr key={feedback._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 border">{feedback.name}</td>
                    <td className="px-4 py-3 border">{feedback.email}</td>
                    <td className="px-4 py-3 border">{feedback.phone}</td>
                    <td className="px-4 py-3 border">{feedback.productName}</td>
                    <td className="px-4 py-3 border">{feedback.rating}</td>
                    <td className="px-4 py-3 border max-w-xs truncate" title={feedback.comment}>
                      {feedback.comment}
                    </td>
                    <td className="px-4 py-3 border">
                      {feedback.date ? new Date(feedback.date).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-lg text-gray-600">No feedback submissions yet.</p>
        )}
      </div>
    </div>
  );
};

export default Feedbacks;
