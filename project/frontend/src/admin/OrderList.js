import React, { useEffect, useState } from "react";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch the list of orders when the component is mounted
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/orders`);
        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Function to handle status update
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderStatus: newStatus }), // Send new status to backend
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, orderStatus: updatedOrder.order.orderStatus } : order
          )
        );
      } else {
        alert("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating the order status");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Order List</h2>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Products</th>
              <th className="px-4 py-2">Total Amount</th>
              <th className="px-4 py-2">Order Status</th>
              <th className="px-4 py-2">Order Date</th>
              <th className="px-4 py-2">Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="border px-4 py-2">{order._id}</td>
                <td className="border px-4 py-2">
                  {order.userId
                    ? `${order.userId.firstName} ${order.userId.lastName}`
                    : "Unknown User"}
                </td>
                <td className="border px-4 py-2">
                  {order.userId ? order.userId.email : "No Email"}
                </td>
                <td className="border px-4 py-2">
                  {order.cartItems.map((item) => (
                    <div key={item.productId._id}>
                      {item.productId.name} (Qty: {item.qty}, Price: ₹{item.productId.price})
                    </div>
                  ))}
                </td>
                <td className="border px-4 py-2">₹{order.totalAmount}</td>
                <td className="border px-4 py-2">{order.orderStatus}</td>
                <td className="border px-4 py-2">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="border rounded p-2"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderList;
  