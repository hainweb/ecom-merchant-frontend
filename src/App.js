import { useEffect, useState, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "./pages/Urls/Urls";
import Navbar from "./Components/Layout/Navbar/Navbar";
import ProductDisplay from "./pages/ViewProducts/Product";
import Dashboard from "./pages/Dashboard/Dashboard";
import OrdersTable from "./pages/TotalOrders/Orders";
import ForgotPassword from "./pages/Login/ForgotPassword";
import AdminIntro from "./pages/AdminIntro";
import Signup from "./pages/Signup/Signup";
import Application from "./pages/Application/Application";
import IntroPopup from "./Components/IntroPopup/IntroPopup";


const Login = lazy(() => import("./pages/Login/Login"));
const ViewProduct = lazy(() => import("./pages/ViewProducts/ViewProduct"));
const EditProduct = lazy(() => import("./pages/ViewProducts/EditProduct"));
const AddProduct = lazy(() => import("./pages/AddProduct/AddProduct"));

function App() {
  const [admin, setAdmin] = useState("");
  const [loading, setLoading] = useState(true);
  const [approved, setApproved] = useState(null);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
         axios.post(
          "https://hain-analytics-backend.onrender.com/api/analytics/log",
          { platform: "merchant" }
        );
        const response = await axios.get(`${BASE_URL}/get-admin`, {
          withCredentials: true,
        });
        
        if (response.data.status && response.data.isApproved) {
          setApproved(true);
          setAdmin(response.data.admin);

          if (response.data.admin.isIntroSeen === false) {
            setShowIntro(true);
          }
        } else if (response.data.status && !response.data.isApproved) {
          setApproved(false);
        }
      } catch (error) {
        console.error("Error fetching admin:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (approved === false) {
      return <Navigate to="/application" replace />;
    }
    return admin ? children : <AdminIntro />;
  };

  const ApplicationRoute = ({ children }) => {
    if (approved !== false) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  const handleCloseIntro = () => {
    setShowIntro(false);
  };

  return (
    <div className="App">
      {showIntro && admin && (
        <IntroPopup onClose={handleCloseIntro} setAdmin={setAdmin} />
      )}

      {loading && (
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

            <Route
              path="/application"
              element={
                <ApplicationRoute>
                  <Application />
                </ApplicationRoute>
              }
            />

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
                  <ProductDisplay />
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

            <Route path="/signup" element={<Signup />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/intro" element={<AdminIntro />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
