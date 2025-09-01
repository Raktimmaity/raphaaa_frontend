// src/pages/OrderDetailsPage.jsx
import React, { useEffect } from "react";
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
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    if ((amount = amount.toString()).length > 9) return "Overflow";
    let n = ("000000000" + amount).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{3})$/);
    if (!n) return;
    let str = "";
    str += n[1] != 0 ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + " Crore " : "";
    str += n[2] != 0 ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + " Lakh " : "";
    str += n[3] != 0 ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + " Thousand " : "";
    str += n[4] != 0 ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + " " : "";
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
    doc.text(`${orderDetails?.user?.name || "Customer"}`, 105, 27);
    doc.text(`${orderDetails?.user?.email || ""}`, 105, 32);
    doc.text(`Phone: ${orderDetails?.user?.phone || "N/A"}`, 105, 37);
    doc.text("Address:", 105, 42);
    doc.text(
      `${orderDetails?.shippingAddress?.address || ""}, ${orderDetails?.shippingAddress?.city || ""}`,
      105,
      47
    );
    doc.text(
      `${orderDetails?.shippingAddress?.country || ""} - ${orderDetails?.shippingAddress?.postalCode || ""}`,
      105,
      52
    );

    // Invoice metadata
    doc.text(`Invoice No.: ${orderDetails?._id || ""}`, 14, 60);
    doc.text(
      `Dated: ${
        orderDetails?.createdAt ? new Date(orderDetails.createdAt).toLocaleDateString() : ""
      }`,
      105,
      60
    );

    autoTable(doc, {
      startY: 70,
      head: [["Sl", "Description", "HSN/SAC", "Qty", "Rate", "per", "Disc.%", "Amount"]],
      body: (orderDetails?.orderItems || []).map((item, index) => [
        index + 1,
        item?.name || "-",
        "5208",
        item?.quantity ?? 0,
        item?.price ?? 0,
        "MTR",
        "5%",
        `₹${(((item?.quantity ?? 0) * (item?.price ?? 0)) || 0).toFixed(2)}`,
      ]),
    });

    const subtotal = (orderDetails?.orderItems || []).reduce(
      (sum, item) => sum + (item?.price ?? 0) * (item?.quantity ?? 0),
      0
    );
    const igst = subtotal * 0.05;
    const total = subtotal + igst;

    const baseY = doc.lastAutoTable.finalY + 10;
    doc.text(`IGST (5%): ₹${igst.toFixed(2)}`, 150, baseY);
    doc.text(`Round Off: ₹0.25`, 150, baseY + 5);
    doc.text(`Total: ₹${(total + 0.25).toFixed(2)}`, 150, baseY + 10);

    doc.text(`Amount Chargeable (in words):`, 14, baseY + 18);
    doc.text(`INR ${convertNumberToWords(Math.round(total + 0.25))} Only`, 14, baseY + 23);

    doc.text(`Tax Amount (in words): INR ${convertNumberToWords(Math.round(igst))} Only`, 14, baseY + 30);
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
    doc.text("Branch & IFS Code: Pooja Tower, Gopalpura by Pass Jaipur & ICIC0006752", 14, baseY + 67);

    doc.text("for HOME TEX BAZAR - Current", 150, baseY + 67);
    doc.text("Authorised Signatory", 150, baseY + 75);
    doc.setFontSize(8);
    doc.text("This is a Computer Generated Invoice", 75, baseY + 85);

    doc.save(`Invoice_${orderDetails?._id || "NA"}.pdf`);
  };

  if (loading) {
    // Subtle skeleton without touching logic
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="h-8 w-44 mb-6 rounded-md bg-gray-200 animate-pulse" />
        <div className="rounded-lg border bg-white p-4 sm:p-6 shadow-sm">
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="h-16 rounded-md bg-gray-100 animate-pulse" />
            <div className="h-16 rounded-md bg-gray-100 animate-pulse" />
            <div className="h-16 rounded-md bg-gray-100 animate-pulse" />
          </div>
          <div className="h-10 w-32 rounded-md bg-gray-100 animate-pulse" />
          <div className="mt-6 h-64 rounded-md bg-gray-100 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Order Details</h2>

        {/* Download button uses existing generatePDF logic */}
        {/* {orderDetails && (
          <button
            onClick={generatePDF}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01.88-2.545l4.12-5.49a2 2 0 113.2 2.31L12.2 15H17a2 2 0 110 4H7a2 2 0 110-4z" />
            </svg>
            Download Invoice
          </button>
        )} */}
      </div>

      {!orderDetails ? (
        <p>No Order details found</p>
      ) : (
        <div className="rounded-xl bg-white p-4 sm:p-6 shadow-xl">
          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row">
            <div>
              <h3 className="text-lg md:text-xl font-semibold">
                Order Id: <span className="text-gray-700"># {orderDetails?._id}</span>
              </h3>
              <p className="text-gray-500">
                {orderDetails?.createdAt ? new Date(orderDetails.createdAt).toLocaleDateString() : ""}
              </p>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                  orderDetails?.isPaid
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    : "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
                }`}
              >
                {orderDetails?.isPaid ? "Approved" : "Pending"}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                  orderDetails?.status === "Delivered"
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    : orderDetails?.status === "Shipped"
                    ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                    : "bg-gray-100 text-gray-700 ring-1 ring-gray-200"
                }`}
              >
                {orderDetails?.status || "Pending"}
              </span>
            </div>
          </div>

          {/* Customer Info */}
          {orderDetails?.user && (
            <div className="mb-8">
              <h4 className="mb-2 text-lg font-semibold">Customer Info</h4>
              <div className="grid grid-cols-1 gap-3 text-sm text-gray-700 sm:grid-cols-2 md:grid-cols-3">
                <p>
                  <span className="font-medium text-gray-900">Name:</span>{" "}
                  {orderDetails?.user?.name}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Email:</span>{" "}
                  {orderDetails?.user?.email}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Phone:</span>{" "}
                  {orderDetails?.shippingAddress?.phone ? `+91 ${orderDetails.shippingAddress.phone}` : "N/A"}
                </p>
              </div>
            </div>
          )}

          {/* Payment & Shipping */}
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            <div className="rounded-lg p-4 shadow-lg bg-gradient-to-r from-blue-50 via-white to-sky-50">
              <h4 className="mb-2 text-lg font-semibold">Payment Info</h4>
              <p className="text-sm text-gray-700">
                Payment Method: <span className="font-medium">{orderDetails?.paymentMethod || "—"}</span>
              </p>
              <p className="text-sm text-gray-700">
                Status:{" "}
                <span className="font-medium">{orderDetails?.isPaid ? "Paid" : "Unpaid"}</span>
              </p>
            </div>

            <div className="rounded-lg p-4 sm:col-span-1 md:col-span-2 shadow-lg bg-gradient-to-r from-green-50 via-white to-emerald-50">
              <h4 className="mb-2 text-lg font-semibold">Shipping Info</h4>
              <p className="text-sm text-gray-700">
                Address:{" "}
                {`${orderDetails?.shippingAddress?.address || ""}${
                  orderDetails?.shippingAddress?.city ? ", " + orderDetails.shippingAddress.city : ""
                }${
                  orderDetails?.shippingAddress?.country ? ", " + orderDetails.shippingAddress.country : ""
                }${
                  orderDetails?.shippingAddress?.postalCode ? ", " + orderDetails.shippingAddress.postalCode : ""
                }`}
              </p>
            </div>
          </div>

          {/* Products */}
          <div className="overflow-x-auto">
            <h4 className="mb-4 text-lg font-semibold">Products</h4>
            <table className="mb-4 min-w-full overflow-hidden rounded-lg text-gray-700">
              <thead className="bg-gray-50 text-left text-sm">
                <tr className="border-b">
                  <th className="py-3 px-4 font-semibold">Name</th>
                  <th className="py-3 px-4 font-semibold">Unit Price</th>
                  <th className="py-3 px-4 font-semibold">Quantity</th>
                  <th className="py-3 px-4 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {(orderDetails?.orderItems || []).map((item) => (
                  <tr key={item?.productId?._id || item?.productId} className="border-b hover:bg-gray-50/60">
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={item?.image}
                          alt={item?.name || "Product"}
                          className="h-12 w-12 rounded-lg object-cover ring-1 ring-gray-200"
                        />
                        <div className="text-sm">
                          <Link
                            to={`/product/${item?.productId?._id || item?.productId}`}
                            className="font-medium text-blue-600 hover:underline"
                          >
                            {item?.name || "-"}
                          </Link>
                          <p className="text-gray-500">Color: {item?.color || "N/A"}</p>
                          <p className="text-gray-500">Size: {item?.size || "N/A"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">₹{Number(item?.price ?? 0).toLocaleString("en-IN")}</td>
                    <td className="py-3 px-4">{item?.quantity ?? 0}</td>
                    <td className="py-3 px-4">
                      ₹{Number((item?.price ?? 0) * (item?.quantity ?? 0)).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer actions */}
          <div className="mt-6 flex flex-col-reverse items-start justify-between gap-4 sm:flex-row sm:items-center">
            <Link to="/my-orders" className="text-blue-600 hover:underline">
              Back to my Orders
            </Link>
            <div className="text-right">
              <div className="text-sm text-gray-500">Total Price</div>
              <div className="text-xl font-semibold text-gray-900">
                ₹{Number(orderDetails?.totalPrice ?? 0).toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
