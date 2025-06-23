import React, { useEffect, useState } from "react";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/orders`);
        const data = await response.json();

        if (response.ok) {
          setOrders(data);
        } else {
          setError("Failed to fetch orders");
        }
      } catch (err) {
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? { ...order, orderStatus: updatedOrder.order.orderStatus }
              : order
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

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Order List</h2>

      {loading ? (
        <p className="text-center text-lg">Loading orders...</p>
      ) : error ? (
        <p className="text-red-600 text-center">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-lg text-gray-600">No orders found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-sm text-left text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Order ID</th>
                <th className="px-4 py-2 border">User</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Products</th>
                <th className="px-4 py-2 border">Total</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 border">{order._id}</td>
                  <td className="px-4 py-2 border">
                    {order.userId
                      ? `${order.userId.firstName} ${order.userId.lastName}`
                      : "Unknown User"}
                  </td>
                  <td className="px-4 py-2 border">
                    {order.userId?.email || "No Email"}
                  </td>
                  <td className="px-4 py-2 border">
                    {order.cartItems.map((item) => (
                      <div key={item.productId?._id}>
                        {item.productId?.name || "Unknown Product"}<br />
                        <span className="text-xs text-gray-500">
                          Qty: {item.qty}, ₹{item.productId?.price || 0}
                        </span>
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-2 border font-semibold">₹{order.totalAmount}</td>
                  <td className="px-4 py-2 border">{order.orderStatus}</td>
                  <td className="px-4 py-2 border">
                    {order.orderDate
                      ? new Date(order.orderDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
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
        </div>
      )}
    </div>
  );
};

export default OrderList;
