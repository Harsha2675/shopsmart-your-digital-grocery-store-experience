import React, { useEffect, useState } from "react";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/allusers`);
        const data = await response.json();
        console.log("API Response:", data);
        if (data.alert) {
          setUsers(data.data);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-center text-lg mt-10">Loading users...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link to="/adminpanel" className="flex items-center text-lg text-blue-600 hover:text-blue-800">
          <FaArrowAltCircleLeft className="mr-2" />
          Back to Admin Panel
        </Link>
      </div>

      <h2 className="text-3xl font-semibold mb-6 text-gray-700">All Users</h2>

      {users.length > 0 ? (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="table-auto w-full text-left whitespace-no-wrap">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-gray-600">ID</th>
                <th className="px-4 py-3 text-gray-600">First Name</th>
                <th className="px-4 py-3 text-gray-600">Last Name</th>
                <th className="px-4 py-3 text-gray-600">Email</th>
                <th className="px-4 py-3 text-gray-600">Image</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition duration-300">
                  <td className="px-4 py-3 border-t border-gray-200">{user._id}</td>
                  <td className="px-4 py-3 border-t border-gray-200">{user.firstName}</td>
                  <td className="px-4 py-3 border-t border-gray-200">{user.lastName}</td>
                  <td className="px-4 py-3 border-t border-gray-200">{user.email}</td>
                  <td className="px-4 py-3 border-t border-gray-200">
                    <img
                      src={user.image || "/default-avatar.jpg"} // Placeholder image
                      alt={user.firstName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-lg text-gray-600">No users found.</p>
      )}
    </div>
  );
};

export default AllUsers;
