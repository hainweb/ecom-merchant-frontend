import  { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

import { ShoppingBag, ShoppingBasket, CircleDashed, CircleCheckBig } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../Urls/Urls';

const AnalyticsDashboard = ({ dataLoading, totalInStock, totalLowStock, totalOutOfStock, totalOrders, cancledOrders, returnedProducts,
  totalOrderedProducts,
  deliveredOrders,
  pendingCashToAdmin,
  pendingAmountToAdmin,
  cashToAdminOrders,
  pendingOrders,
  categoryStatus

}) => {

  const [categoryProducts, setCategoryProducts] = useState([])
  const [totalProducts, setTotalProducts] = useState('')
  const [totalProductQuantity, setTotalProductQuantity] = useState('')

  useEffect(() => {
    const fetchCategoryProducts = () => {
      axios.get(`${BASE_URL}/get-products-category`,{withCredentials: true}).then((response) => {
        console.log('Products category', response);
        setCategoryProducts(response.data.categories)
        setTotalProducts(response.data.totalProducts)
        setTotalProductQuantity(response.data.totalQuantity)

      })
    }
    fetchCategoryProducts()
  }, [])

  console.log('total in stock', totalInStock);
  console.log('categiry sta', categoryStatus);
 
  const salesMetrics = { 
    totalOrders,
    totalOrderedProducts,
    deliveredOrders,
    pendingOrders,
    cashToAdminOrders,
    pendingCashToAdmin,
    pendingAmountToAdmin
  };

  const productMetrics = {
    totalInStock,
    lowStock: totalLowStock,
    outOfStock: totalOutOfStock,
  };

  const userMetrics = {
    total: totalOrders,
    cancel: (cancledOrders || 0),
    return: (returnedProducts || 0)
  };

  // Product status data for pie chart
  const productStatusData = [
    { name: 'In Stock', value: productMetrics.totalInStock, color: '#3B82F6' },
    { name: 'Low Stock', value: productMetrics.lowStock, color: '#F59E0B' },
    { name: 'Out of Stock', value: productMetrics.outOfStock, color: '#EF4444' }
  ];

  // User activity data by type
  const userTypeData = [
    { name: 'Total Orders', value: userMetrics.total, color: '#3B82F6' },
    { name: 'Canceled', value: userMetrics.cancel, color: '#EF4444' },
    { name: 'Returned Products', value: userMetrics.return, color: '#8B5CF6' }
  ];



  const categoryData = categoryStatus.map(cat => ({
    name: cat.category,
    revenue: cat.deliveredRevenue,
  }));

  const categoryOrder = categoryStatus.map(cat => ({
    name: cat.category,
    orders: cat.totalOrderedProducts,
  })); 
  
  const categoryProductsData = categoryProducts.map(cat => ({
    name: cat.name,
    products: cat.value,
    quantity: cat.quantity
  }));

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

  const CustomCategoryTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 p-2 shadow-lg rounded">
          <p className="font-semibold">{label}</p>
          <p className="text-blue-600">Products: {payload[0].value}</p>
          <p className={`text-${payload[0].payload.quantity <= 5 ? 'red-500' : payload[0].payload.quantity <= 15 ? 'yellow-500' : 'green-500'}`}>
            Quantity: {payload[0].payload.quantity}
          </p>

        </div>
      );
    }
    return null;
  };

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
    
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {dataLoading ? (
    // Render 4 skeleton cards
    Array.from({ length: 4 }).map((_, index) => (
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
              <h3 className="text-gray-500 text-sm">Total Order including cancled and returned orders</h3>
              <ShoppingBag className="text-blue-500" size={20} />
            </div>
            <p className="text-2xl font-bold">{salesMetrics.totalOrders.toLocaleString()}</p>
            <span className="text-green-500 text-sm">↑ 12.5% vs last period</span>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm">Total Products Ordered</h3>
              <ShoppingBasket className="text-blue-500" size={20} />
            </div>
            <p className="text-2xl font-bold">{salesMetrics.totalOrderedProducts.toLocaleString()}</p>
            <span className="text-green-500 text-sm">↑ 8.2% vs last period</span>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm">Total Orders</h3>
              <CircleCheckBig className="text-blue-500" size={20} />
            </div>
            <p className="text-2xl font-bold">{salesMetrics.deliveredOrders.toLocaleString()}</p>
            <span className="text-green-500 text-sm">↑ 15.3% vs last period</span>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm">Pending Orders</h3>
              <CircleDashed className="text-blue-500" size={20} />
            </div>
            <p className="text-2xl font-bold">{salesMetrics.pendingOrders}</p>
            <span className="text-red-500 text-sm">↓ 2.1% vs last period</span>
          </div>
</>
        )}
        </div>

        {/* Product Status and User Type Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Product Status Distribution</h2>
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

        {/* Products Detils */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Product Activity</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total products ordered</span>
                <span className="font-semibold">{salesMetrics.totalOrderedProducts.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>In stock count</span>
                <span className="font-semibold">{productMetrics.totalInStock.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Low stock count</span>
                <span className="font-semibold">{productMetrics.lowStock.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Out of stock count</span>
                <span className="font-semibold text-red-500">{productMetrics.outOfStock.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 ">
            <h2 className="text-lg font-semibold mb-4">Product Performance</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total orders </span>
                <span className="font-semibold">{salesMetrics.deliveredOrders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Reruned products </span>
                <span className="font-semibold">{returnedProducts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Order cash sended to admin </span>
                <span className="font-semibold">{salesMetrics.cashToAdminOrders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Pending cash to admin </span>
                <span className="font-semibold text-red-500">{salesMetrics.pendingCashToAdmin} Orders, ₹{salesMetrics.pendingAmountToAdmin}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Canceled orders </span>
                <span className="font-semibold text-red-500">{userMetrics.cancel}</span>
              </div>


            </div>
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
                {categoryData.map((_, index) => (
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

        {/*  Category Products */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Product Details</h2>
            <div className="space-y-4">
              <div className="flex justify-left items-center">
                <span>Total products :</span>
                <span className="font-semibold ml-4">{totalProducts.toLocaleString()}</span>
              </div>
              <div className="flex justify-left items-center">
                <span>Total products quantity :</span>
                <span className="font-semibold ml-4">{totalProductQuantity.toLocaleString()}</span>
              </div>

            </div>
          </div>


          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4"> Total Category Products</h2>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryProductsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomCategoryTooltip />} />
                  <Bar dataKey="products" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>




      </main>
    </div>
  );
};

export default AnalyticsDashboard;
