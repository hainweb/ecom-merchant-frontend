import  { useState, useEffect } from "react";
import Dashboard from "./AllAnaltics";
import { Link } from "react-router-dom";
import RevenueAnalytics from "./RevenueAnalytics";
import ProductAnalytics from "./ProductAnalytics";
import axios from "axios";
import { BASE_URL } from "../Urls/Urls";

function Main() {
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState("dashboard");
  const [totalInStock, setTotalInStock] = useState("");
  const [totalOutOfStock, setTotalOutOfStock] = useState("");
  const [totalLowStock, setTotalLowStock] = useState("");
  const [totalOrders, setTotalOrders] = useState("");
  const [totalOrderedProducts, setTotalOrderedProducts] = useState("");
  const [cancledOrders, setCancledOrders] = useState("");
  const [returnedProducts, setreturnedProducts] = useState("");
  const [deliveredOrders, setDeliveredOrders] = useState("");
  const [deliveredRevenue, setDeliveredRevenue] = useState("");
  const [cashToAdminOrders, setCashToAdminOrders] = useState("");
  const [pendingOrders, setPendingOrders] = useState("");
  const [pendingCashToAdmin, setPendingCashToAdmin] = useState("");
  const [pendingAmountToAdmin, setPendingAmountToAdmin] = useState("");
  const [categoryStatus, setCategoryStatus] = useState([]);

  const [totalRevenue, setTotalRevenue] = useState("");
  const [conversionRate, setConversionrate] = useState("");
  const [averageOrderValue, setAverageOrderValue] = useState("");

  const [totalUsers, setTotalUsers] = useState("");

  useEffect(() => {
    const fetchDatas = () => {
      setLoading(true);
      axios
        .get(`${BASE_URL}/get-total-revenue`, { withCredentials: true })
        .then((response) => {
          console.log("response data", response);
          setTotalInStock(response.data.totalInStock);
          setTotalLowStock(response.data.totalLowStock);
          setTotalOutOfStock(response.data.totalOutOfStock);
          setCancledOrders(response.data.canceledOrders);
          setreturnedProducts(response.data.returnedProducts);
          setTotalOrders(response.data.totalOrders);
          setTotalOrderedProducts(response.data.totalOrderedProducts);
          setDeliveredOrders(response.data.deliveredOrders);
          setDeliveredRevenue(response.data.deliveredRevenue);
          setCashToAdminOrders(response.data.cashToAdminOrders);
          setPendingCashToAdmin(response.data.pendingCashToAdmin);
          setPendingOrders(response.data.pendingOrders);
          setPendingAmountToAdmin(response.data.pendingAmountToAdmin);
          setCategoryStatus(response.data.categoryWiseStats);

          setTotalRevenue(response.data.totalRevenue);
          setConversionrate(response.data.conversionRate);
          setAverageOrderValue(response.data.averageOrderValue);

          setTotalUsers(response.data.totalUser);
          setLoading(false);
        });
    };
    fetchDatas();
  }, []);

  const [isSticky, setIsSticky] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav
        className={`fixed ${
          isSticky ? "top-0" : "top-18"
        } left-0 right-0 bg-white shadow-sm z-50`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 p-2 sm:p-1 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="overflow-x-auto flex space-x-8 no-scrollbar w-full">
              {isSticky && (
                <Link
                  to="/"
                  className="flex-shrink-0 flex items-center space-x-1 rtl:space-x-reverse"
                >
                  <span className="self-center text-2xl font-semibold whitespace-nowrap text-black">
                    Admin Panel
                  </span>
                </Link>
              )}
              <div className="flex space-x-8 flex-nowrap">
                <button
                  onClick={() => setCurrentPage("dashboard")}
                  className={`whitespace-nowrap px-3 py-2 font-medium text-sm ${
                    currentPage === "dashboard"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-blue-500"
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentPage("revenue")}
                  className={`whitespace-nowrap px-3 py-2 font-medium text-sm ${
                    currentPage === "revenue"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-blue-500"
                  }`}
                >
                  Revenue Analytics
                </button>
                <button
                  onClick={() => setCurrentPage("product")}
                  className={`whitespace-nowrap px-3 py-2 font-medium text-sm ${
                    currentPage === "product"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-blue-500"
                  }`}
                >
                  Product Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`max-w-7xl mx-auto px-4 ${isSticky ? "py-4" : "py-20"}`}>
        {(() => {
          switch (currentPage) {
            case "dashboard":
              return (
                <Dashboard
                  dataLoading={loading}
                  totalRevenue={totalRevenue}
                  totalOrders={totalOrders}
                  totalUsers={totalUsers}
                  conversionRate={conversionRate}
                  averageOrderValue={averageOrderValue}
                  deliveredRevenue={deliveredRevenue}
                  deliveredOrders={deliveredOrders}
                  categoryStatus={categoryStatus}
                  pendingCashToAdmin={pendingCashToAdmin}
                  pendingOrders={pendingOrders}
                  totalOrderedProducts={totalOrderedProducts}
                  returnedProducts={returnedProducts}
                  totalInStock={totalInStock}
                  totalOutOfStock={totalOutOfStock}
                  totalLowStock={totalLowStock}
                  cancledOrders={cancledOrders}
                  setCurrentPage={setCurrentPage}
                  pendingAmountToAdmin={pendingAmountToAdmin}
                />
              );
            case "revenue":
              return (
                <RevenueAnalytics
                  dataLoading={loading}
                  totalRevenue={totalRevenue}
                  totalOrders={totalOrders}
                  conversionRate={conversionRate}
                  averageOrderValue={averageOrderValue}
                  deliveredRevenue={deliveredRevenue}
                  deliveredOrders={deliveredOrders}
                  categoryStatus={categoryStatus}
                  pendingCashToAdmin={pendingCashToAdmin}
                  pendingOrders={pendingOrders}
                />
              );
            case "product":
              return (
                <ProductAnalytics
                  dataLoading={loading}
                  totalInStock={totalInStock}
                  totalOutOfStock={totalOutOfStock}
                  totalLowStock={totalLowStock}
                  totalOrders={totalOrders}
                  totalOrderedProducts={totalOrderedProducts}
                  returnedProducts={returnedProducts}
                  cancledOrders={cancledOrders}
                  deliveredOrders={deliveredOrders}
                  cashToAdminOrders={cashToAdminOrders}
                  pendingCashToAdmin={pendingCashToAdmin}
                  pendingAmountToAdmin={pendingAmountToAdmin}
                  pendingOrders={pendingOrders}
                  categoryStatus={categoryStatus}
                />
              );
            default:
              return <Dashboard />;
          }
        })()}
      </main>
    </div>
  );
}

export default Main;
