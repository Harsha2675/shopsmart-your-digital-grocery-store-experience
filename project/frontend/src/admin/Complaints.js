import React, { useEffect, useState } from 'react';
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Complaints = () => {
  const [contacts, setContacts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/allcontacts`);
        const data = await response.json();

        if (response.ok && data.data) {
          setContacts(data.data); // assuming contacts are in data.data
        } else {
          setErrorMessage('Failed to fetch complaints.');
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setErrorMessage('Something went wrong while fetching complaints.');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  return (
    <div className="container mx-auto p-6">
      {/* Back link */}
      <div className="mb-4">
        <Link
          to="/adminpanel"
          className="flex items-center text-lg text-blue-600 hover:text-blue-800 transition"
        >
          <FaArrowAltCircleLeft className="mr-2" />
          Back to Admin Panel
        </Link>
      </div>

      {/* Main panel */}
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Complaints & Contact Submissions</h2>

        {loading ? (
          <p className="text-center text-lg">Loading...</p>
        ) : errorMessage ? (
          <p className="text-red-600 text-center mb-4">{errorMessage}</p>
        ) : contacts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700 border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 border">Name</th>
                  <th className="px-4 py-3 border">Email</th>
                  <th className="px-4 py-3 border">Phone</th>
                  <th className="px-4 py-3 border">Message</th>
                  <th className="px-4 py-3 border">Date Submitted</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 border">{contact.name}</td>
                    <td className="px-4 py-3 border">{contact.email}</td>
                    <td className="px-4 py-3 border">{contact.phone}</td>
                    <td className="px-4 py-3 border max-w-xs truncate" title={contact.message}>
                      {contact.message}
                    </td>
                    <td className="px-4 py-3 border">
                      {contact.date ? new Date(contact.date).toLocaleString() : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-lg text-gray-600">No complaints submitted yet.</p>
        )}
      </div>
    </div>
  );
};

export default Complaints;
