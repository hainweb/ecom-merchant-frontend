import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Activity,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  IndianRupee,
  CircleDashed,
} from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../Urls/Urls";

const AnalyticsDashboard = ({
  dataLoading,
  totalOrders,
  deliveredOrders,
  conversionRate,
  deliveredRevenue,
  averageOrderValue,
  returnedProducts,
  totalOrderedProducts,
  totalInStock,
  pendingCashToAdmin,
  pendingAmountToAdmin,
  pendingOrders,
  totalOutOfStock,
  totalLowStock,
  cancledOrders,
  categoryStatus,

  setCurrentPage,
}) => {
  /*Revenue trend */
  const [dateRange, setDateRange] = useState("Last 7 days");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [loadingRevenueTrend, setLoadingRevenueTrend] = useState(false);

  // Handler for date range select field fro revenue trend.
  const handleDateRangeChange = (e) => {
    const value = e.target.value;
    setDateRange(value);
    // If the user selects "Last 7 days" or "Last 30 days", reset the year to the current year.
    if (value === "Last 7 days" || value === "Last 30 days") {
      setSelectedYear(new Date().getFullYear());
    }
  };

  // Calculate the total revenue from the revenueTrend data.
  const totalGraphRevenue = revenueTrend.reduce(
    (sum, data) => sum + data.value,
    0
  );

  const handlePrevYear = () => {
    setSelectedYear((prevYear) => prevYear - 1);
    setDateRange("In this year");
  };

  const handleNextYear = () => {
    setSelectedYear((prevYear) => prevYear + 1);
    setDateRange("In this year");
  };

  // Function to fetch revenue trend data with the current year and date range.
  const fetchRevenueTrend = async () => {
    setLoadingRevenueTrend(true);
    try {
      const response = await axios.get(`${BASE_URL}/get-revenue-trend`, {
        withCredentials: true,
        params: { year: selectedYear, dateRange },
      });
      setRevenueTrend(response.data);
    } catch (error) {
      console.error("Error fetching revenue trend:", error);
    } finally {
      setLoadingRevenueTrend(false);
    }
  };

  // Refetch whenever the selected year or date range changes.
  useEffect(() => {
    fetchRevenueTrend();
  }, [selectedYear, dateRange]);







  // Sample analytics data
  const salesMetrics = {
    totalOrders: deliveredOrders,
    totalRevenue: deliveredRevenue,
    totalOrderedProducts,
    averageOrderValue,
    conversionRate,
    pendingAmountToAdmin,
    pendingCashToAdmin,
  };

  const productMetrics = {
    lowStock: totalLowStock,
    outOfStock: totalOutOfStock,
    totalInStock: totalInStock,
    returnedProducts,
  };

  const userMetrics = {
    total: totalOrders,
    cancel: cancledOrders || 0,
    return: returnedProducts || 0,
  };

  // Product status data for pie chart
  const productStatusData = [
    { name: "In Stock", value: productMetrics.totalInStock, color: "#3B82F6" },
    { name: "Low Stock", value: productMetrics.lowStock, color: "#F59E0B" },
    {
      name: "Out of Stock",
      value: productMetrics.outOfStock,
      color: "#EF4444",
    },
  ];

  // User activity data by type
  const userTypeData = [
    { name: "Total Orders", value: userMetrics.total, color: "#3B82F6" },
    { name: "Canceled", value: userMetrics.cancel, color: "#EF4444" },
    { name: "Returned Products", value: userMetrics.return, color: "#8B5CF6" },
  ];

  // Custom tooltip for pie charts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow rounded border">
          <p className="text-sm">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const categoryData = categoryStatus.map((cat) => ({
    name: cat.category,
    revenue: cat.deliveredRevenue,
  }));

  const categoryOrder = categoryStatus.map((cat) => ({
    name: cat.category,
    orders: cat.totalOrderedProducts,
  }));

  const colors = [
    "#4ECDC4", // Turquoise
    "#45B7D1", // Sky Blue
    "#96CEB4", // Sage Green
    "#FFEEAD", // Cream Yellow
    "#FF6B6B", // Coral Red
    "#D4A5A5", // Dusty Rose
    "#9B5DE5", // Purple
    "#00BBF9", // Bright Blue
  ];

  

  // Helper function to format a Date as yyyy-mm-dd
  const formatDate = (date) => date.toISOString().split("T")[0];

 const [shippingDateRange, setShippingDateRange] = useState({ start: "", end: "" });
const [shippingStatusData, setShippingStatusData] = useState([]);
const [loadingShippingStatus, setLoadingShippingStatus] = useState(false);


useEffect(() => {
  const fetchShippingStatus = () => {
    setLoadingShippingStatus(true);
    axios
      .get(`${BASE_URL}/get-shipping-status`, { withCredentials: true })
      .then((response) => {
        setShippingStatusData(response.data.data);
        setShippingDateRange(response.data.dateRange);
      })
      .catch((error) => {
        console.error("Error fetching shipping status:", error);
      })
      .finally(() => {
        setLoadingShippingStatus(false);
      });
  };

  fetchShippingStatus();
}, []);


const changeShippingDateRange = (direction) => {
  if (!shippingDateRange.start || !shippingDateRange.end) return;

  const currentStart = new Date(shippingDateRange.start);
  const currentEnd = new Date(shippingDateRange.end);

  const dayShift = 7 * 24 * 60 * 60 * 1000;
  let newStart, newEnd;

  if (direction === "prev") {
    newStart = new Date(currentStart.getTime() - dayShift);
    newEnd = new Date(currentEnd.getTime() - dayShift);
  } else {
    newStart = new Date(currentStart.getTime() + dayShift);
    newEnd = new Date(currentEnd.getTime() + dayShift);
  }

  const newStartStr = formatDate(newStart);
  const newEndStr = formatDate(newEnd);

  setLoadingShippingStatus(true);
  axios
    .get(`${BASE_URL}/get-shipping-status`, {
      params: { start: newStartStr, end: newEndStr },
      withCredentials: true,
    })
    .then((response) => {
      setShippingStatusData(response.data.data);
      setShippingDateRange(response.data.dateRange);
    })
    .catch((error) => {
      console.error("Error fetching new shipping status:", error);
    })
    .finally(() => {
      setLoadingShippingStatus(false);
    });
};



 


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {dataLoading ? (
            // Render 4 skeleton cards
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow p-6 animate-pulse"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gray-300 rounded w-20 h-4" />
                  <div className="bg-gray-300 rounded w-6 h-6" />
                </div>
                <div className="bg-gray-300 rounded w-full h-8" />
                <div className="mt-4 bg-gray-300 rounded w-1/2 h-4" />
              </div>
            ))
          ) : (
            // Render actual cards when loading is false
            <>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 text-sm">Total Revenue</h3>
                  <IndianRupee className="text-blue-500" size={20} />
                </div>
                <p className="text-2xl font-bold">
                  ₹{salesMetrics.totalRevenue}
                </p>
                <span className="text-green-500 text-sm">
                  ↑ 12.5% vs last period
                </span>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 text-sm">Total Orders</h3>
                  <ShoppingBag className="text-blue-500" size={20} />
                </div>
                <p className="text-2xl font-bold">{salesMetrics.totalOrders}</p>
                <span className="text-green-500 text-sm">
                  ↑ 8.2% vs last period
                </span>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 text-sm">Pending Orders</h3>
                  <CircleDashed className="text-blue-500" size={20} />
                </div>
                <p className="text-2xl font-bold">{pendingOrders}</p>
                <span className="text-green-500 text-sm">
                  ↑ 15.3% vs last period
                </span>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 text-sm">Conversion Rate</h3>
                  <Activity className="text-blue-500" size={20} />
                </div>
                <p className="text-2xl font-bold">
                  {salesMetrics.conversionRate}%
                </p>
                <span className="text-red-500 text-sm">
                  ↓ 2.1% vs last period
                </span>
              </div>
            </>
          )}
        </div>

        {/* Product Status and User Type Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">
              Product Status Distribution
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {productStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Order Activity</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePrevYear}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <h2 className="text-xl font-semibold">{selectedYear}</h2>
                <button
                  onClick={handleNextYear}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <select
                value={dateRange}
                onChange={handleDateRangeChange}
                className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>In this year</option>
              </select>
            </div>

            <div className="h-80">
              {loadingRevenueTrend ? (
                <div className="h-full flex items-center justify-center">
                  <span className="text-gray-500">Loading...</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrend}>
                    <defs>
                      <linearGradient
                        id="revenueGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3B82F6"
                          stopOpacity={0.5}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3B82F6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="name"
                      stroke="#6B7280"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#6B7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #E5E7EB",
                        borderRadius: "0.5rem",
                        padding: "0.5rem",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      fill="url(#revenueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {revenueTrend.length > 0 && (
              <div className="mt-4 flex flex-col items-center space-y-2">
                <span className="text-lg font-semibold">
                  Revenue in{" "}
                  {dateRange === "In this year" ? selectedYear : dateRange}
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  ₹{totalGraphRevenue}
                </span>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setCurrentPage("revenue")}
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                More details →
              </button>
            </div>
          </div>


          {/* delivery status info  */}

   <div className="bg-white rounded-lg shadow-md p-6 relative">
  {/* Date Range Navigation */}
  <div className="flex justify-center items-center pb-2">
    <button
      onClick={() => changeShippingDateRange("prev")}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
    >
      <ArrowLeft className="h-4 w-4" />
    </button>
    <span className="mx-4 text-sm font-medium">
      {shippingDateRange.start} to {shippingDateRange.end}
    </span>
    <button
      onClick={() => changeShippingDateRange("next")}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
    >
      <ArrowRight className="h-4 w-4" />
    </button>
  </div>

  <h2 className="text-xl font-semibold mt-4 mb-6">Shipping Status Overview</h2>

  {loadingShippingStatus ? (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
      <span className="text-gray-700 font-semibold">Loading...</span>
    </div>
  ) : (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={shippingStatusData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "0.5rem",
              padding: "0.5rem",
            }}
          />
          <Legend />
          <Bar dataKey="pending" stackId="a" fill="#F59E0B" name="Pending" />
          <Bar dataKey="shipped" stackId="a" fill="#3B82F6" name="Shipped" />
          <Bar dataKey="delivered" stackId="a" fill="#10B981" name="Delivered" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )}
</div>




        </div>

        {/* Category Revenue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Category Revenue</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue">
                    {categoryOrder.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Category Orders</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryOrder}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders">
                    {categoryOrder.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Products Detils */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Product Deatails</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total products ordered</span>
                <span className="font-semibold">
                  {salesMetrics.totalOrderedProducts.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>In stock count</span>
                <span className="font-semibold">
                  {productMetrics.totalInStock.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Low stock count</span>
                <span className="font-semibold">
                  {productMetrics.lowStock.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Out of stock count</span>
                <span className="font-semibold text-red-500">
                  {productMetrics.outOfStock.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 ">
            <h2 className="text-lg font-semibold mb-4">Product Performance</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total orders </span>
                <span className="font-semibold">
                  {salesMetrics.totalOrders}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Reruned products </span>
                <span className="font-semibold">{returnedProducts}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Pending cash to admin </span>
                <span className="font-semibold text-red-500">
                  {salesMetrics.pendingCashToAdmin} Orders, ₹
                  {salesMetrics.pendingAmountToAdmin}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Canceled orders </span>
                <span className="font-semibold text-red-500">
                  {userMetrics.cancel}
                </span>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setCurrentPage("product")}
                  className="text-blue-500 hover:text-blue-600 text-sm"
                >
                  More details →
                </button>
              </div>
            </div>
          </div>
        </div>

     
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Best Performing Categories */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Best Categories</h2>
            <ul className="space-y-2">
              {[...categoryData]
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5)
                .map((cat, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{cat.name}</span>
                    <span className="font-semibold">₹{cat.revenue}</span>
                  </li>
                ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Sales Performance</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Revenue </span>
                <span className="font-semibold">
                  ₹{salesMetrics.totalRevenue}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Orders</span>
                <span className="font-semibold">
                  {salesMetrics.totalOrders || "0"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Average Order Value</span>
                <span className="font-semibold">
                  ₹{salesMetrics.averageOrderValue}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Conversion Rate</span>
                <span className="font-semibold">
                  {salesMetrics.conversionRate}%
                </span>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setCurrentPage("revenue")}
                  className="text-blue-500 hover:text-blue-600 text-sm"
                >
                  More details →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;
