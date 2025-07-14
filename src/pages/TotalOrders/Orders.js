import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  Package,
  Truck,
  CheckCircle,
  ShoppingBag,
  Ban,
  Download,
  Calendar,
  FileText,
} from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../Urls/Urls";
import { Link } from "react-router-dom";
import { generateAdminInvoice } from "../../utils/generateInvoice";

const SummaryCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center gap-4">
      <div className={`p-3 bg-${color}-100 rounded-full`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{label}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    </div>
  </div>
);

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${BASE_URL}/get-admin-orders`, {
          withCredentials: true,
        });
        const data = response.data;

        // Sort orders by date (latest first) by replacing " at" from the string.
        data.sort((a, b) => {
          // Replace " at" with an empty string so that the Date constructor can parse it.
          const dateA = new Date(a.date.replace(" at", ""));
          const dateB = new Date(b.date.replace(" at", ""));
          return dateB - dateA;
        });

        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (order) => {
    if (order.cashadmin) return "bg-green-100 text-green-800";
    if (order.status3) return "bg-blue-100 text-blue-800";
    if (order.status2) return "bg-yellow-100 text-yellow-800";
    if (order.cancel) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (order) => {
    if (order.cashadmin) return <CheckCircle className="w-4 h-4" />;
    if (order.status3) return <Package className="w-4 h-4" />;
    if (order.status2) return <Truck className="w-4 h-4" />;
    if (order.cancel) return <Ban className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const getStatusText = (order) => {
    if (order.cashadmin) return "Completed";
    if (order.status3) return "Delivered";
    if (order.status2) return "In Transit";
    if (order.cancel) return "Canceled";
    return "Pending";
  };

  const Modal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-2xl mx-4 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Order Details</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">
                  Customer Info
                </h4>
                <div className="space-y-1">
                  <p>Name: {order.deliveryDetails.name}</p>
                  <p>Contact: {order.deliveryDetails.mobile}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Order Info</h4>
                <div className="space-y-1">
                  <p>Date: {order.date}</p>
                  <p>
                    Amount: ₹
                    {(order.total || order.product?.Price).toLocaleString()}
                  </p>
                  <p>Payment: {order.paymentMethod || "COD"}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">
                Shipping Address
              </h4>
              <p>
                {[
                  order.deliveryDetails.type,
                  order.deliveryDetails.address,
                  order.deliveryDetails.city,
                  order.deliveryDetails.state,
                  order.deliveryDetails.pinncode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">
                Order Timeline
              </h4>
              <div className="space-y-2">
                {order.shipedDate && (
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-500" />
                    <span>Shipped on {order.shipedDate}</span>
                  </div>
                )}
                {order.deliveredDate && (
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-green-500" />
                    <span>Delivered on {order.deliveredDate}</span>
                  </div>
                )}
                {order.cashadminDate && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Completed on {order.cashadminDate}</span>
                  </div>
                )}
                {order.cancel && (
                  <div className="flex items-center gap-2">
                    <Ban className="w-4 h-4 text-red-500" />
                    <span>Canceled on {order.canceledTime}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard
            icon={ShoppingBag}
            label="Total Orders"
            value={orders.length}
            color="blue"
          />
          <SummaryCard
            icon={CheckCircle}
            label="Completed Orders"
            value={orders.filter((order) => order.cashadmin).length}
            color="green"
          />
          <SummaryCard
            icon={Ban}
            label="Canceled Orders"
            value={orders.filter((order) => order.cancel).length}
            color="red"
          />
        </div>

        {/* Invoice  */}

        <div className="w-full max-w-6xl mx-auto p-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Generate Invoice Report
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Select a date range to generate and download your invoice PDF
              </p>
            </div>

            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-6 items-end">
                {/* Date Range Section */}
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        From Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="date"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        To Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="date"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <div className="flex-shrink-0">
                  <button
                    onClick={() => {
                      if (!fromDate || !toDate) {
                        alert("Please select both From and To dates.");
                        return;
                      }

                      const filteredOrders = orders.filter((order) => {
                        const orderDate = new Date(
                          order.date.replace(" at", "")
                        );
                        return (
                          new Date(fromDate) <= orderDate &&
                          orderDate <= new Date(toDate)
                        );
                      });

                      generateAdminInvoice(filteredOrders, fromDate, toDate);
                    }}
                    className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:scale-105 active:scale-95 min-w-[200px]"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Download className="w-4 h-4 group-hover:animate-bounce" />
                      <span>Download Invoice PDF</span>
                    </div>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-200"></div>
                  </button>
                </div>
              </div>

              {/* Status Indicator */}
              {fromDate && toDate && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">
                      Date range selected: {fromDate} to {toDate}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="w-full bg-white rounded-lg shadow-lg flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Order History</h2>
            <Link
              to="/dashboard"
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              See more details
            </Link>
          </div>

          {orders.length > 0 ? (
            <div className="flex flex-col">
              {/* Table Header */}
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-600">
                        Date
                      </th>
                      <th className="text-right p-4 font-semibold text-gray-600">
                        Customer name
                      </th>
                      <th className="text-right p-4 font-semibold text-gray-600">
                        Amount
                      </th>
                      <th className="text-center p-4 font-semibold text-gray-600">
                        Payment
                      </th>
                      <th className="text-center p-4 font-semibold text-gray-600">
                        Status
                      </th>
                      <th className="text-center p-4 font-semibold text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>

              {/* Table Body */}
              <div className="overflow-y-auto max-h-[480px]">
                <table className="min-w-full">
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order._id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="font-medium">{order.date}</div>
                        </td>
                        <td className="p-4 text-left">
                          <div className="font-medium">
                            {order.deliveryDetails.name}
                          </div>
                        </td>
                        <td className="p-4 text-left ">
                          <div className="font-medium">
                            ₹
                            {(
                              order.total || order.product?.Price
                            ).toLocaleString()}
                          </div>
                        </td>
                        <td className="p-4 text-left">
                          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                            {order.paymentMethod || "COD"}
                          </div>
                        </td>
                        <td className="p-4">
                          <div
                            className={`flex items-center justify-center gap-2 px-3 py-1 rounded-full ${getStatusColor(
                              order
                            )}`}
                          >
                            {getStatusIcon(order)}
                            <span className="text-sm font-medium">
                              {getStatusText(order)}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-blue-500 hover:text-blue-600"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>You haven't placed any orders yet.</p>
            </div>
          )}
        </div>

        {/* Modal for Order Details */}
        <Modal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      </div>
    </div>
  );
};

export default OrdersTable;
