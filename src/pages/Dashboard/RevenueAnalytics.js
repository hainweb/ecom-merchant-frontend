import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  Activity,
  ShoppingBag,
  IndianRupee,
  BadgePercent,
  CircleDashed,
  HandCoins,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../Urls/Urls';

const AnalyticsDashboard = ({ dataLoading,
  totalOrders,
  totalRevenue,
  averageOrderValue,
  conversionRate,
  deliveredRevenue,
  deliveredOrders,
  pendingCashToAdmin,
  pendingOrders,
  categoryStatus
}) => {
  // State for date range, selected year, revenue trend data and loading status
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [loadingRevenueTrend, setLoadingRevenueTrend] = useState(false);

  // Function to fetch revenue trend data with the current year and date range.
  const fetchRevenueTrend = async () => {
    setLoadingRevenueTrend(true);
    try {
      const response = await axios.get(`${BASE_URL}/get-revenue-trend`, {
        withCredentials: true,
        params: { year: selectedYear, dateRange }
      });
      setRevenueTrend(response.data);
    } catch (error) {
      console.error('Error fetching revenue trend:', error);
    } finally {
      setLoadingRevenueTrend(false);
    }
  };

  // Refetch whenever the selected year or date range changes.
  useEffect(() => {
    fetchRevenueTrend();
  }, [selectedYear, dateRange]);

  // Sales metrics for key cards
  const salesMetrics = {
    totalOrders,
    deliveredOrders,
    totalRevenue,
    deliveredRevenue,
    averageOrderValue,
    conversionRate
  };

  const categoryData = categoryStatus.map(cat => ({
    name: cat.category,
    revenue: cat.deliveredRevenue
  }));

  const categoryOrder = categoryStatus.map(cat => ({
    name: cat.category,
    orders: cat.totalOrderedProducts
  }));

  // When changing the year via arrow buttons, auto change dateRange to "In this year"
  const handlePrevYear = () => {
    setSelectedYear(prevYear => prevYear - 1);
    setDateRange('In this year');
  };

  const handleNextYear = () => {
    setSelectedYear(prevYear => prevYear + 1);
    setDateRange('In this year');
  };

  // Handler for date range select field.
  const handleDateRangeChange = (e) => {
    const value = e.target.value;
    setDateRange(value);
    // If the user selects "Last 7 days" or "Last 30 days", reset the year to the current year.
    if (value === 'Last 7 days' || value === 'Last 30 days') {
      setSelectedYear(new Date().getFullYear());
    }
  };

  // Calculate the total revenue from the revenueTrend data.
  const totalGraphRevenue = revenueTrend.reduce((sum, data) => sum + data.value, 0);


  const colors = [

    '#4ECDC4', // Turquoise
    '#45B7D1', // Sky Blue
    '#96CEB4', // Sage Green
    '#FFEEAD', // Cream Yellow
    '#FF6B6B', // Coral Red
    '#D4A5A5', // Dusty Rose
    '#9B5DE5', // Purple
    '#00BBF9'  // Bright Blue
  ];


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
  {dataLoading ? (
    // Render 4 skeleton cards
    Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
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
            <p className="text-2xl font-bold">₹{salesMetrics.deliveredRevenue}</p>
            <span className="text-green-500 text-sm">↑ 12.5% vs last period</span>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm">Total Orders</h3>
              <ShoppingBag className="text-blue-500" size={20} />
            </div>
            <p className="text-2xl font-bold">{salesMetrics.deliveredOrders}</p>
            <span className="text-green-500 text-sm">↑ 8.2% vs last period</span>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm">Average Order Value</h3>
              <BadgePercent className="text-blue-500" size={20} />
            </div>
            <p className="text-2xl font-bold">₹{salesMetrics.averageOrderValue}</p>
            <span className="text-green-500 text-sm">↑ 15.3% vs last period</span>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm">Conversion Rate</h3>
              <Activity className="text-blue-500" size={20} />
            </div>
            <p className="text-2xl font-bold">{salesMetrics.conversionRate}%</p>
            <span className="text-red-500 text-sm">↓ 2.1% vs last period</span>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm">
                Total Revenue Including Cancelled and Returned Orders
              </h3>
              <IndianRupee className="text-blue-500" size={20} />
            </div>
            <p className="text-2xl font-bold">₹{salesMetrics.totalRevenue}</p>
            <span className="text-green-500 text-sm">↑ 12.5% vs last period</span>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm">
                Total Orders Including Cancelled and Returned Orders
              </h3>
              <ShoppingBag className="text-blue-500" size={20} />
            </div>
            <p className="text-2xl font-bold">{salesMetrics.totalOrders}</p>
            <span className="text-green-500 text-sm">↑ 8.2% vs last period</span>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm">Pending Orders</h3>
              <CircleDashed className="text-blue-500" size={20} />
            </div>
            <p className="text-2xl font-bold">{pendingOrders}</p>
            <span className="text-green-500 text-sm">↑ 8.2% vs last period</span>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm">Pending Order Cash From Deliver</h3>
              <HandCoins className="text-blue-500" size={20} />
            </div>
            <p className="text-2xl font-bold">{pendingCashToAdmin}</p>
            <span className="text-green-500 text-sm">↑ 8.2% vs last period</span>
          </div>
</>
  )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
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
                           <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                             <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
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
                             backgroundColor: 'white',
                             border: '1px solid #E5E7EB',
                             borderRadius: '0.5rem',
                             padding: '0.5rem'
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
                       Revenue in {dateRange === 'In this year' ? selectedYear : dateRange}
                     </span>
                     <span className="text-2xl font-bold text-blue-600">
                       ₹{totalGraphRevenue}
                     </span>
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
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
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
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
      
              </div>

        {/* Sales Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Sales Performance</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>
                Total Revenue Including Cancelled and Returned Orders
              </span>
              <span className="font-semibold line-through">
                ₹{salesMetrics.deliveredRevenue}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Total Revenue</span>
              <span className="font-semibold">₹{salesMetrics.totalRevenue}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Average Order Value</span>
              <span className="font-semibold">
                ₹{salesMetrics.averageOrderValue}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Conversion Rate</span>
              <span className="font-semibold">{salesMetrics.conversionRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Pending Order Cash From Deliver</span>
              <span className="font-semibold">{pendingCashToAdmin}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;
