import React, { useEffect, useState } from 'react';

const AddressList = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/addresses`);
        if (!response.ok) {
          throw new Error('Failed to fetch addresses');
        }
        const data = await response.json();
        setAddresses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  if (loading) return <p className="text-lg text-center">Loading...</p>;
  if (error) return <p className="text-lg text-center text-red-600">Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Addresses</h2>
      <ul className="space-y-6">
        {addresses.map((address) => (
          <li key={address._id} className="border border-gray-200 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out bg-gray-50">
            <div className="flex flex-col space-y-2">
              <p className="text-lg font-semibold text-gray-700">
                <strong>Name:</strong> {address.name}
              </p>
              <p className="text-gray-600">
                <strong>Email:</strong> {address.email}
              </p>
              <p className="text-gray-600">
                <strong>Phone:</strong> {address.phone}
              </p>
              <p className="text-gray-600">
                <strong>Street:</strong> {address.street}
              </p>
              <p className="text-gray-600">
                <strong>City:</strong> {address.city}
              </p>
              <p className="text-gray-600">
                <strong>State:</strong> {address.state}
              </p>
              <p className="text-gray-600">
                <strong>Postal Code:</strong> {address.postalCode}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Date Added:</strong> {new Date(address.date).toLocaleDateString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddressList;
