import React, { useEffect, useState } from 'react';
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Complaints = () => {
  const [contacts, setContacts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/allcontacts`);
        const data = await response.json();
        console.log("Fetched data:", data); // Log fetched data
  
        if (response.ok) {
          setContacts(data.data); // Assuming 'data.data' holds complaints
        } else {
          setErrorMessage('Error fetching contact data.');
        }
      } catch (error) {
        console.error("Fetch error:", error); // Log error
        setErrorMessage('Error fetching contact data.');
      }
    };
  
    fetchContacts();
  }, []); // Empty dependency array to run only once

  return (
    <div className="container mx-auto p-6">
      <div className="mb-4">
        <Link to="/adminpanel" className="flex items-center text-lg text-blue-600 hover:text-blue-800">
          <FaArrowAltCircleLeft className="mr-2" />
          Back to Admin Panel
        </Link>
      </div>

      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
        <h2 className="text-3xl font-bold mb-6 text-center">Contact Submissions</h2>

        {errorMessage ? (
          <p className="text-red-600 text-center mb-4">{errorMessage}</p>
        ) : (
          <div className="overflow-x-auto">
            {contacts.length > 0 ? (
              <table className="min-w-full text-left text-sm text-gray-600 border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Email</th>
                    <th className="px-4 py-2 border">Phone</th>
                    <th className="px-4 py-2 border">Message</th>
                    <th className="px-4 py-2 border">Date Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact._id} className="hover:bg-gray-50 transition duration-300">
                      <td className="px-4 py-2 border">{contact.name}</td>
                      <td className="px-4 py-2 border">{contact.email}</td>
                      <td className="px-4 py-2 border">{contact.phone}</td>
                      <td className="px-4 py-2 border">{contact.message}</td>
                      <td className="px-4 py-2 border">{new Date(contact.date).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-lg text-gray-600">No contact submissions yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Complaints;
