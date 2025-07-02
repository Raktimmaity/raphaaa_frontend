// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { fetchAllOrders, updateOrderStatus } from "../../redux/slices/adminOrderSlice";

// const OrderManagement = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { user } = useSelector((state) => state.auth);
//   const { orders, loading, error } = useSelector((state) => state.adminOrders);

//   useEffect(() => {
//     if(!user || user.role !== "admin") {
//       navigate("/");
//     } else {
//       dispatch(fetchAllOrders());
//     }
//   }, [dispatch, user, navigate]);
//   // const orders = [
//   //   {
//   //     _id: 221131,
//   //     user: {
//   //       name: "john Doe",
//   //     },
//   //     totalPrice: 110,
//   //     status: "Processing",
//   //   },
//   // ];

//   const handleStatusChange = (orderId, status) => {
//     // console.log({ id: orderId, status });
//     dispatch(updateOrderStatus({ id: orderId, status }));
//   };

//   if(loading) return <p>Loading...</p>
//   if(error) return <p> Error: {error} </p>

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-6">Order Management</h2>
//       <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
//         <table className="min-w-full text-sm text-left text-gray-700">
//           <thead className="bg-gray-100 text-xs uppercase text-gray-600">
//             <tr>
//               <th className="py-4 px-6">Order ID</th>
//               <th className="py-4 px-6">Order Customer</th>
//               <th className="py-4 px-6">Total Price</th>
//               <th className="py-4 px-6">Status</th>
//               <th className="py-4 px-6">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.length > 0 ? (
//               orders.map((order) => (
//                 <tr
//                   key={order._id}
//                   className="hover:bg-gray-50 transition-all duration-200"
//                 >
//                   <td className="py-4 px-6 font-semibold text-gray-900 whitespace-nowrap">
//                     #{order._id}
//                   </td>
//                   <td className="py-4 px-6">{order.user.name}</td>
//                   <td className="py-4 px-6">₹{order.totalPrice.toFixed(2)}</td>
//                   <td className="py-4 px-6">
//                     <select
//                       value={order.status}
//                       onChange={(e) =>
//                         handleStatusChange(order._id, e.target.value)
//                       }
//                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2 w-full"
//                     >
//                       <option value="Processing">Processing</option>
//                       <option value="Shipped">Shipped</option>
//                       <option value="Delivered">Delivered</option>
//                       <option value="Cancelled">Cancelled</option>
//                     </select>
//                   </td>
//                   <td className="py-4 px-6">
//                     <button
//                       onClick={() => handleStatusChange(order._id, "Delivered")}
//                       className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
//                     >
//                       Mark as Delivered
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan={5}
//                   className="p-6 text-center text-gray-500 italic"
//                 >
//                   No orders found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default OrderManagement;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllOrders, updateOrderStatus, deleteOrder, clearError } from "../../redux/slices/adminOrderSlice";

const OrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    console.log('User:', user);
    console.log('Orders:', orders);
    console.log('Loading:', loading);
    console.log('Error:', error);

    if(!user) {
      navigate("/login");
      return;
    }
    
    if(user.role !== "admin") {
      navigate("/");
      return;
    }
    
    dispatch(fetchAllOrders());
  }, [dispatch, user, navigate]);

  const handleStatusChange = (orderId, status) => {
    console.log('Updating order:', { id: orderId, status });
    dispatch(updateOrderStatus({ id: orderId, status }));
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      dispatch(deleteOrder(orderId));
    }
  };

  const clearErrorHandler = () => {
    dispatch(clearError());
  };

  if(loading) return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="mt-2">Loading orders...</p>
      </div>
    </div>
  );

  if(error) return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <div className="flex justify-between items-center">
          <span>Error: {typeof error === 'string' ? error : error.message || 'Something went wrong'}</span>
          <button 
            onClick={clearErrorHandler}
            className="text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      </div>
      <button 
        onClick={() => dispatch(fetchAllOrders())}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <div className="text-sm text-gray-600">
          Total Orders: {orders.length}
        </div>
      </div>
      
      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="py-4 px-6">Order ID</th>
              <th className="py-4 px-6">Customer</th>
              <th className="py-4 px-6">Total Price</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Payment Method</th>
              <th className="py-4 px-6">Created At</th>
              <th className="py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-all duration-200 border-b"
                >
                  <td className="py-4 px-6 font-semibold text-gray-900 whitespace-nowrap">
                    #{order._id.slice(-8)}
                  </td>
                  <td className="py-4 px-6">
                    {order.user?.name || 'Unknown User'}
                  </td>
                  <td className="py-4 px-6">₹{order.totalPrice?.toFixed(2) || '0.00'}</td>
                  <td className="py-4 px-6">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2 w-full"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 capitalize">
                    {order.paymentMethod?.replace('_', ' ') || 'N/A'}
                  </td>
                  <td className="py-4 px-6">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusChange(order._id, "Delivered")}
                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors text-xs"
                      >
                        Mark Delivered
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="p-6 text-center text-gray-500 italic"
                >
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;