import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchOrderDetails } from "../redux/slices/orderSlice";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  const convertNumberToWords = (amount) => {
    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    if ((amount = amount.toString()).length > 9) return "Overflow";
    let n = ("000000000" + amount)
      .substr(-9)
      .match(/^(\d{2})(\d{2})(\d{2})(\d{3})$/);
    if (!n) return;
    let str = "";
    str +=
      n[1] != 0
        ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + " Crore "
        : "";
    str +=
      n[2] != 0
        ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + " Lakh "
        : "";
    str +=
      n[3] != 0
        ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + " Thousand "
        : "";
    str +=
      n[4] != 0 ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + " " : "";
    return str.trim();
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Tax Invoice", 14, 15);
    doc.setFontSize(10);

    // Seller Info
    doc.text("HOME TEX BAZAR - Current", 14, 22);
    doc.text("Plot No 524, Sachivalaya Vihar", 14, 27);
    doc.text("Sanganer", 14, 32);
    doc.text("Jaipur , 302020", 14, 37);
    doc.text("GSTIN/UIN: 08AJJPJ0309B1ZS", 14, 42);
    doc.text("State Name: Rajasthan, Code: 08", 14, 47);
    doc.text("E-Mail: hometex2008@gmail.com", 14, 52);

    // Buyer Info
    doc.text("Buyer (Bill to):", 105, 22);
    doc.text(`${orderDetails.user?.name || "Customer"}`, 105, 27);
    doc.text(`${orderDetails.user?.email || ""}`, 105, 32);
    doc.text(`Phone: ${orderDetails.user?.phone || "N/A"}`, 105, 37);
    doc.text("Address:", 105, 42);
    doc.text(
      `${orderDetails.shippingAddress?.address}, ${orderDetails.shippingAddress?.city}`,
      105,
      47
    );
    doc.text(
      `${orderDetails.shippingAddress?.country} - ${orderDetails.shippingAddress?.postalCode}`,
      105,
      52
    );

    // Invoice metadata
    doc.text(`Invoice No.: ${orderDetails._id}`, 14, 60);
    doc.text(
      `Dated: ${new Date(orderDetails.createdAt).toLocaleDateString()}`,
      105,
      60
    );

    autoTable(doc, {
      startY: 70,
      head: [["Sl", "Description", "HSN/SAC", "Qty", "Rate", "per", "Disc.%", "Amount"]],
      body: orderDetails.orderItems.map((item, index) => [
        index + 1,
        item.name,
        "5208",
        item.quantity,
        item.price,
        "MTR",
        "5%",
        `₹${(item.quantity * item.price).toFixed(2)}`,
      ]),
    });

    const subtotal = orderDetails.orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const igst = subtotal * 0.05;
    const total = subtotal + igst;

    const baseY = doc.lastAutoTable.finalY + 10;
    doc.text(`IGST (5%): ₹${igst.toFixed(2)}`, 150, baseY);
    doc.text(`Round Off: ₹0.25`, 150, baseY + 5);
    doc.text(`Total: ₹${(total + 0.25).toFixed(2)}`, 150, baseY + 10);

    doc.text(`Amount Chargeable (in words):`, 14, baseY + 18);
    doc.text(
      `INR ${convertNumberToWords(Math.round(total + 0.25))} Only`,
      14,
      baseY + 23
    );

    doc.text(
      `Tax Amount (in words): INR ${convertNumberToWords(Math.round(igst))} Only`,
      14,
      baseY + 30
    );
    doc.text("Declaration:", 14, baseY + 38);
    doc.setFontSize(9);
    doc.text(
      "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.",
      14,
      baseY + 43
    );

    doc.setFontSize(10);
    doc.text("Company's Bank Details:", 14, baseY + 52);
    doc.text("ICICI BANK (Current A/c) - 1445", 14, baseY + 57);
    doc.text("A/c No.: 675205601445", 14, baseY + 62);
    doc.text(
      "Branch & IFS Code: Pooja Tower, Gopalpura by Pass Jaipur & ICIC0006752",
      14,
      baseY + 67
    );

    doc.text("for HOME TEX BAZAR - Current", 150, baseY + 67);
    doc.text("Authorised Signatory", 150, baseY + 75);
    doc.setFontSize(8);
    doc.text("This is a Computer Generated Invoice", 75, baseY + 85);

    doc.save(`Invoice_${orderDetails._id}.pdf`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Order Details</h2>
      {!orderDetails ? (
        <p>No Order details found</p>
      ) : (
        <div className="bg-white shadow-xl p-4 sm:p-6 rounded-lg border">
          <div className="flex flex-col sm:flex-row justify-between mb-8">
            <div>
              <h3 className="text-lg md:text-xl font-semibold">
                Order Id: # {orderDetails._id}
              </h3>
              <p className="text-gray-600">
                {new Date(orderDetails.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
              <span
                className={`${
                  orderDetails.isPaid
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                } px-3 py-1 rounded-full text-sm font-medium mb-2`}
              >
                {orderDetails.isPaid ? "Approved" : "Pending"}
              </span>
              <span
                className={`${
                  orderDetails.isDelivered
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                } px-3 py-1 rounded-full text-sm font-medium mb-2`}
              >
                {orderDetails.isDelivered ? "Delivered" : "Pending Delivery"}
              </span>
            </div>
          </div>

          {/* 🧑 User Info */}
          {orderDetails.user && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-2">Customer Info</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
                <p>
                  <span className="font-medium text-gray-900">Name:</span>{" "}
                  {orderDetails.user.name}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Email:</span>{" "}
                  {orderDetails.user.email}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Phone:</span>{" "}
                  +91 {orderDetails.shippingAddress.phone || "N/A"}
                </p>
              </div>
            </div>
          )}

          {/* 💳 & 🚚 Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold mb-2">Payment Info</h4>
              <p>Payment Method: {orderDetails.paymentMethod}</p>
              <p>Status: {orderDetails.isPaid ? "Paid" : "Unpaid"}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Shipping Info</h4>
              <p>
                Address:{" "}
                {`${orderDetails.shippingAddress.address}, ${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.country}, ${orderDetails.shippingAddress.postalCode}`}
              </p>
            </div>
          </div>

          {/* 🛒 Product Table */}
          <div className="overflow-x-auto">
            <h4 className="text-lg font-semibold mb-4">Products</h4>
            <table className="min-w-full text-gray-600 mb-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Unit Price</th>
                  <th className="py-2 px-4">Quantity</th>
                  <th className="py-2 px-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.orderItems.map((item) => (
                  <tr key={item.productId} className="border-b">
                    <td className="py-2 px-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="text-sm">
                          <Link
                            to={`/product/${item.productId?._id || item.productId}`}
                            className="text-blue-600 hover:underline font-medium"
                          >
                            {item.name}
                          </Link>
                          <p className="text-gray-500">Color: {item.color || "N/A"}</p>
                          <p className="text-gray-500">Size: {item.size || "N/A"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-4">₹{item.price}</td>
                    <td className="py-2 px-4">{item.quantity}</td>
                    <td className="py-2 px-4">₹{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mt-4">
            <Link to="/my-orders" className="text-blue-500 hover:underline">
              Back to my Orders
            </Link>
            {/* <button
              onClick={generatePDF}
              className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 transition text-sm font-medium"
            >
              Download Invoice
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
