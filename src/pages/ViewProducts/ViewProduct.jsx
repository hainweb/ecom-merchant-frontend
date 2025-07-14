import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL, IMG_URL } from '../Urls/Urls';

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("none");
  const [loading, setLoading] = useState(true);
  const [deleteProId, setDeleteProId]=useState("")

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/admin-products`, { 
        withCredentials: true 
      });

       console.log(response);
        
      
      let sortedProducts = [...response.data.products];
      applySorting(sortedProducts);
      
      setProducts(sortedProducts);
      setFilteredProducts(sortedProducts);
      setError(null);
      setRefreshKey(Date.now());
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const applySorting = (productsArray) => {
    switch(sortOption) {
      case "none":
        productsArray.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        ).reverse();
        break;
      case "latest":
        productsArray.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "highToLow":
        productsArray.sort((a, b) => b.Price - a.Price);
        break;
      case "lowToHigh":
        productsArray.sort((a, b) => a.Price - b.Price);
        break;
      case "orderHighToLow":
        productsArray.sort((a, b) => b.ordercount - a.ordercount);
        break;
      case "orderLowToHigh":
        productsArray.sort((a, b) => a.ordercount - b.ordercount);
        break;
      default:
        break;
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    
    const filtered = products.filter((product) =>
      product.Name.toLowerCase().includes(query) ||
      product.Category.toLowerCase().includes(query) ||
      product.Description.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    let sortedProducts = [...products];
    applySorting(sortedProducts);
    setFilteredProducts(sortedProducts);
  };

  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      return;
    }

    try {
      setDeleteProId(productId)
      const response = await axios.post(`${BASE_URL}/delete-item/${productId}`,null,{withCredentials:true});
      if (response.data.status) {
       
        alert('Product deleted successfully');
        fetchProducts();
      }
      setDeleteProId("")
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product. Please try again.');
    }
  };

  const getQuantityBadge = (quantity) => {
    const baseClasses = "px-2.5 py-0.5 rounded-full text-sm font-medium";
    if (quantity < 1) {
      return <span className={`${baseClasses} bg-red-50 text-red-700 border border-red-200`}>Out of Stock</span>;
    } else if (quantity < 2) {
      return <span className={`${baseClasses} bg-red-50 text-red-700 border border-red-200`}>Last Item!</span>;
    } else if (quantity <=10) {
      return <span className={`${baseClasses} bg-amber-50 text-amber-700 border border-amber-200`}>Low Stock: {quantity}</span>;
    }
    return <span className={`${baseClasses} bg-green-50 text-green-700 border border-green-200`}>In Stock: {quantity}</span>;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  useEffect(() => {
    fetchProducts();
    
  }, [sortOption]);

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-12 bg-gray-200 rounded-lg mb-4" />
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="h-20 bg-gray-200 rounded-lg" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">!</span>
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Your Product Inventory</h1>
            <p className="mt-1 text-sm text-gray-500">
              {filteredProducts.length} products found
            </p>
          </div>
          <Link
            to="/add-product"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
          >
            <span className="mr-2">+</span>
            Add Product
          </Link>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search by name, category, or description..."
              className="pl-10 pr-4 py-2 w-full sm:w-80 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            />
          </div>
          
          <div className="relative cursor-pointer">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">↕️</span>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="pl-10 pr-4 py-2 w-full sm:w-64 border cursor-pointer border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none"
            >
              <option value="none">Sort by Latest</option>
              <option value="latest">Sort by FIrst Added</option>
              <option value="highToLow">Price: High to Low</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="orderHighToLow">Most Orders</option>
              <option value="orderLowToHigh">Least Orders</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
          <div className="max-h-[650px] overflow-y-auto">
            {loading ? (
              <div className="p-6">
                <LoadingSkeleton />
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <span className="text-4xl mb-4">📦</span>
                          <p className="text-lg font-medium">No products found</p>
                          <p className="text-sm">Try adjusting your search or filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product, index) => (
                      <tr key={product._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <Link to={`/product/${product._id}`} key={product._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={product.thumbnailImage}
                              alt={product.Name}
                            />
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{product.Name}</p>
                              <p className="text-sm text-gray-500 truncate max-w-xs">{product.Description}</p>
                            </div>
                          </div>
                        </td></Link>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {formatPrice(product.Price)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {product.Category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getQuantityBadge(product.Quantity)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.ordercount} orders
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                          <Link
                            to={`/edit-product/${product._id}`}
                            className="inline-flex items-center px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors duration-200"
                          >
                            Edit
                          </Link>
                          
                          <button
                            onClick={() => handleDelete(product._id, product.Name)}
                            className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors duration-200"
                          >
                            {deleteProId === product._id ? (
  <div className="w-4 h-4 border-2 border-red-700 rounded-full animate-spin border-t-transparent"></div>
                  
) : (
  "Delete"
)}

                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProducts;
