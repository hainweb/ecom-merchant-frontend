import { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "./pages/Urls/Urls";
import Navbar from "./Components/Layout/Navbar/Navbar";
import ProductDisplay from "./pages/ViewProducts/Product";
import Dashboard from "./pages/Dashboard/Dashboard";
import OrdersTable from "./pages/TotalOrders/Orders";
import ForgotPassword from "./pages/Login/ForgotPassword";
import AdminIntro from "./pages/AdminIntro";

// Lazy-loaded Components
const Login = lazy(() => import("./pages/Login/Login"));
const ViewProduct = lazy(() => import("./pages/ViewProducts/ViewProduct"));
const EditProduct = lazy(() => import("./pages/ViewProducts/EditProduct"));
const AddProduct = lazy(() => import("./pages/AddProduct/AddProduct"));


function App() { 
  const [admin, setAdmin] = useState("");
  const [loading, setLoading]= useState(true)

  // Fetch admin data on mount
  useEffect(() => {
    const fetchAdmin = async () => {
      
      try {
        const response = await axios.get(`${BASE_URL}/get-admin`, {
          withCredentials: true,
        });
        if (response.data.status) {
          setAdmin(response.data.admin);
        }
      } catch (error) {
        console.error("Error fetching admin:", error);
      }finally{
        setLoading(false)
      }
    };
    fetchAdmin();
  }, []);

  const ProtectedRoute = ({ children }) => {
    return admin ? children : <AdminIntro/>;
  };

  return (
    <div className="App">
      {loading &&(
         <div className="row">
              <div className="container" style={{ textAlign: "center" }}>
                <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 flex-col">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  <br />
                  <p>Loading, please wait...</p>
                </div>
              </div>
            </div>
      )}
      <Router>
        <Navbar admin={admin} setAdmin={setAdmin} />
        <Suspense
          fallback={
            <div className="row">
              <div className="container" style={{ textAlign: "center" }}>
                <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 flex-col">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  <br />
                  <p>Loading, please wait...</p>
                </div>
              </div>
            </div>
          }
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login setAdmin={setAdmin} />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ViewProduct />
                </ProtectedRoute>
              }
            />

            <Route
              path="/product/:id"
              element={
                <ProtectedRoute>
                  {" "}
                  <ProductDisplay />{" "}
                </ProtectedRoute>
              }
            />

            <Route
              path="/edit-product/:id"
              element={
                <ProtectedRoute>
                  <EditProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-product"
              element={
                <ProtectedRoute>
                  <AddProduct />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/total-orders"
              element={
                <ProtectedRoute>
                  <OrdersTable />
                </ProtectedRoute>
              }
            />

            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/intro" element={<AdminIntro/>} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
