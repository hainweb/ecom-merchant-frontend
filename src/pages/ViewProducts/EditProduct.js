import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../Urls/Urls';
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const [specifications, setSpecifications] = useState([]);
    const [newSpec, setNewSpec] = useState({ key: '', value: '' });
    const [highlights, setHighlights] = useState([]);
    const [newHighlight, setNewHighlight] = useState('');
    const [customOptions, setCustomOptions] = useState([]); // Store custom options
    const [newOption, setNewOption] = useState({ name: '', values: '' }); // For adding a custom option
    const [originalProduct, setOriginalProduct] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/edit-product/${id}`, { withCredentials: true });
                const productData = response.data.product;
                setProduct(productData);
                setOriginalProduct(productData);
                setSpecifications(productData.Specifications || []);
                setHighlights(productData.Highlights || []);
                setCustomOptions(productData.CustomOptions || []); // Load existing custom options
                setThumbnailPreview(productData.thumbnailImage);
                setImagePreviews(productData.images || []);
            } catch (err) {
                setError('Failed to load product');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);


    // New: Handle new option input changes
    const handleOptionChange = (e) => {
        setNewOption({ ...newOption, [e.target.name]: e.target.value });
    };

    const addCustomOption = () => {
        if (newOption.name.trim() && newOption.values.trim()) {
            const valuesArray = newOption.values.split(',').map((val) => val.trim());
            setCustomOptions([...customOptions, { name: newOption.name, values: valuesArray }]);
            setNewOption({ name: '', values: '' });
        }
    };

    const removeCustomOption = (index) => {
        setCustomOptions(customOptions.filter((_, i) => i !== index));
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSpecChange = (e) => {
        setNewSpec(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const addSpecification = () => {
        if (newSpec.key && newSpec.value) {
            setSpecifications(prev => [...prev, newSpec]);
            setNewSpec({ key: '', value: '' });
        }
    };

    const removeSpecification = (index) => {
        setSpecifications(prev => prev.filter((_, i) => i !== index));
    };

    const addHighlight = () => {
        if (newHighlight.trim()) {
            setHighlights(prev => [...prev, newHighlight]);
            setNewHighlight('');
        }
    };

    const removeHighlight = (index) => {
        setHighlights(prev => prev.filter((_, i) => i !== index));
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const img = new Image();
            img.onload = () => {
                if (img.width === 300 && img.height === 300) {
                    setThumbnail(file);
                    // Clear the previous preview
                    setThumbnailPreview(null);
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setThumbnailPreview(reader.result);
                    };
                    reader.readAsDataURL(file);
                    setErrors(prev => ({ ...prev, thumbnail: null }));
                } else {
                    setErrors(prev => ({
                        ...prev,
                        thumbnail: 'Thumbnail must be 300x300 pixels.'
                    }));
                    setThumbnail(null);
                    setThumbnailPreview(null);
                }
            };
            img.src = URL.createObjectURL(file);
        }
    };

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        // Clear previous previews when new images are selected
        setImagePreviews([]);

        const previewsPromises = files.map(file => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    if (img.width === 600 && img.height === 600) {
                        resolve({
                            file,
                            preview: URL.createObjectURL(file)
                        });
                    } else {
                        reject('All additional images must be 600x600 pixels.');
                    }
                };
                img.onerror = () => reject('Error loading image file.');
                img.src = URL.createObjectURL(file);
            });
        });

        Promise.allSettled(previewsPromises).then(results => {
            const validFiles = results
                .filter(result => result.status === 'fulfilled')
                .map(result => result.value);

            const invalidFiles = results
                .filter(result => result.status === 'rejected')
                .map(result => result.reason);

            if (invalidFiles.length) {
                setErrors(prev => ({
                    ...prev,
                    images: invalidFiles[0]
                }));
            }

            setImages(validFiles.map(valid => valid.file));
            setImagePreviews(validFiles.map(valid => valid.preview));
        });
    };




    const validateForm = () => {
        const validationErrors = {};

        // Validate product name
        if (!product.Name?.trim()) {
            validationErrors.Name = 'Product Name is required';
        }

        // Validate Price (converted to a number for comparison)
        if (!product.Price || Number(product.Price) <= 0) {
            validationErrors.Price = 'Valid Price is required';
        }

        // Validate Selling Price (converted to a number for comparison)
        if (!product.SellingPrice || Number(product.SellingPrice) <= 0) {
            validationErrors.SellingPrice = 'Valid Selling Price is required';
        } else if (product.Price && Number(product.SellingPrice) <= Number(product.Price)) {
            // Check if Selling Price is less than or equal to Price.
            // Error message: "Selling price must be greater than price"
            validationErrors.SellingPrice = 'Selling price must be greater than price';
        }

        // Validate Category
        if (!product.Category?.trim()) {
            validationErrors.Category = 'Category is required';
        }

        // Validate Description
        if (!product.Description?.trim()) {
            validationErrors.Description = 'Description is required';
        }

        // Validate Return Option
        if (product.Return === undefined) {
            validationErrors.Return = 'Return option is required';
        }

        // Join error messages with a newline separator (removing the object brackets)
        const errorMessages = Object.values(validationErrors).join('\n');
        if (errorMessages.length > 0) {
            alert(errorMessages);
        }
        return validationErrors;
    };



    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSaveLoading(true)
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setSaveLoading(false)
            return;
        }

        const formData = new FormData();
        formData.append('Name', product.Name);
        formData.append('Price', product.Price);
        formData.append('SellingPrice', product.SellingPrice);
        formData.append('Category', product.Category);
        formData.append('Description', product.Description);
        formData.append('Quantity', product.Quantity);
        formData.append('Return', product.Return);
        formData.append('Specifications', JSON.stringify(specifications));
        formData.append('Highlights', JSON.stringify(highlights));
        formData.append('CustomOptions', JSON.stringify(customOptions)); // Include custom options


        if (thumbnail) {
            formData.append('thumbnail', thumbnail);
        }

        images.forEach(image => {
            formData.append('images', image);
        });

        try {
            const response = await axios.post(`${BASE_URL}/edit-product/${id}`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSaveLoading(false)
            if (response.data.status) {
                alert('Product updated successfully');

                navigate('/');
            } else {
                alert('Something went wrong');

            }
        } catch (err) {
            console.error('Error updating product:', err);
            alert('Failed to update product');

        }
    };

    const hasProductChanged = () => {
        if (!originalProduct) return false;

        // Check basic field changes
        const basicFieldsChanged = [
            'Name',
            'Price',
            'SellingPrice',
            'Category',
            'Description',
            'Quantity',
            'Return'
        ].some(field => product[field] !== originalProduct[field]);

        // Check if specifications changed
        const specificationsChanged = JSON.stringify(specifications) !==
            JSON.stringify(originalProduct.Specifications || []);

        // Check if highlights changed
        const highlightsChanged = JSON.stringify(highlights) !==
            JSON.stringify(originalProduct.Highlights || []);

        // Check if new images were added
        const imagesChanged = images.length > 0;

        // Check if new thumbnail was added
        const thumbnailChanged = thumbnail !== null;

        return basicFieldsChanged ||
            specificationsChanged ||
            highlightsChanged ||
            imagesChanged ||
            thumbnailChanged;
    };


    return (
        <section className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
            {loading ? (
                <div className="flex justify-center items-center space-x-2">
                    <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                    <span>Loading...</span>
                </div>
            ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
            ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                    <h1 className="text-2xl font-bold text-gray-700 mb-6">Edit Product</h1>

                    {/* Basic Information */}
                    <div>
                        <label htmlFor="Name" className="block text-gray-700 font-medium">
                            Product Name
                        </label>
                        <input
                            type="text"
                            name="Name"
                            id="Name"
                            value={product.Name || ''}
                            onChange={handleInputChange}
                            placeholder="Enter product name"
                            className={`mt-2 p-3 w-full border ${errors.Name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.Name && <p className="text-red-500 text-sm mt-1">{errors.Name}</p>}
                    </div>


                    <div>
                        <label htmlFor="SellingPrice" className="block text-gray-700 font-medium">
                            SellingPrice(Strick price)
                        </label>
                        <input
                            type="number"
                            name="SellingPrice"
                            id="SellingPrice"
                            value={product.SellingPrice || ''}
                            onChange={handleInputChange}
                            placeholder="Enter product SellingPrice (Strick Price)"
                            className={`mt-2 p-3 w-full border ${errors.SellingPrice ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.SellingPrice && <p className="text-red-500 text-sm mt-1">{errors.SellingPrice}</p>}
                    </div>

                    <div>
                        <label htmlFor="Price" className="block text-gray-700 font-medium">
                            Price
                        </label>
                        <input
                            type="number"
                            name="Price"
                            id="Price"
                            value={product.Price || ''}
                            onChange={handleInputChange}
                            placeholder="Enter product price"
                            className={`mt-2 p-3 w-full border ${errors.Price ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.Price && <p className="text-red-500 text-sm mt-1">{errors.Price}</p>}
                    </div>



                    <div>
                        <label htmlFor="Category" className="block text-gray-700 font-medium">
                            Category
                        </label>
                        <input
                            type="text"
                            name="Category"
                            id="Category"
                            value={product.Category || ''}
                            onChange={handleInputChange}
                            placeholder="Enter product category"
                            className={`mt-2 p-3 w-full border ${errors.Category ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.Category && <p className="text-red-500 text-sm mt-1">{errors.Category}</p>}
                    </div>

                    <div>
                        <label htmlFor="Description" className="block text-gray-700 font-medium">
                            Description
                        </label>
                        <textarea
                            name="Description"
                            id="Description"
                            value={product.Description || ''}
                            onChange={handleInputChange}
                            placeholder="Enter product description"
                            rows="4"
                            className={`mt-2 p-3 w-full border ${errors.Description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.Description && <p className="text-red-500 text-sm mt-1">{errors.Description}</p>}
                    </div>

                    <div>
                        <label htmlFor="Quantity" className="block text-gray-700 font-medium">
                            Quantity
                        </label>
                        <input
                            type="number"
                            name="Quantity"
                            id="Quantity"
                            value={product.Quantity || ''}
                            onChange={handleInputChange}
                            placeholder="Enter product quantity"
                            className={`mt-2 p-3 w-full border ${errors.Quantity ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.Quantity && <p className="text-red-500 text-sm mt-1">{errors.Quantity}</p>}
                    </div>

                    {/* Specifications Section */}
                    <div className="border-t pt-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Specifications</h2>
                        <div className="flex gap-4 ">
                            <input
                                type="text"
                                name="key"
                                value={newSpec.key}
                                onChange={handleSpecChange}
                                placeholder="Key"
                                className="p-3 flex-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                name="value"
                                value={newSpec.value}
                                onChange={handleSpecChange}
                                placeholder="Value"
                                className="p-3 flex-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <button
                                type="button"
                                onClick={addSpecification}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Add
                            </button>
                        </div>
                        <div className="space-y-2">
                            {specifications.map((spec, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span>{spec.key}: {spec.value}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeSpecification(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Highlights Section */}
                    <div className="border-t pt-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Highlights</h2>
                        <div className="flex gap-4 mb-4">
                            <input
                                type="text"
                                value={newHighlight}
                                onChange={(e) => setNewHighlight(e.target.value)}
                                placeholder="Add a highlight"
                                className="p-3 flex-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={addHighlight}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Add
                            </button>
                        </div>
                        <div className="space-y-2">
                            {highlights.map((highlight, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span>{highlight}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeHighlight(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* Custom Options Section */}
                    <div>
                        <h3>Custom Options</h3>
                        {customOptions.length > 0 && (
                            <div className="mt-4">
                                {customOptions.map((option, index) => (
                                    <div key={index} className="flex items-center gap-4 mb-2">
                                        <span className="font-medium text-gray-700">{option.name}:</span>
                                        <span>{option.values.join(', ')}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeCustomOption(index)}
                                            className="text-red-500"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex gap-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Option name (e.g-size)"
                                className="p-3 w-full border rounded-lg"
                                value={newOption.name}
                                onChange={handleOptionChange}
                            />
                            <input
                                type="text"
                                name="values"
                                placeholder="Values (comma-separated)"
                                className="p-3 w-full border rounded-lg"
                                value={newOption.values}
                                onChange={handleOptionChange}
                            />
                            <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={addCustomOption}>Add</button>
                        </div>

                    </div>


                    {/* Display dynamic dropdowns */}
                    {customOptions.map((option, index) => (
                        <div key={index} className="mt-4">
                            <label className="block text-gray-700 font-medium">{option.name}</label>
                            <select
                                name={option.name}
                                onChange={handleInputChange}
                                className="mt-2 p-3 w-full border rounded-lg"
                            >
                                <option value="">Select {option.name}</option>
                                {option.values.map((value, i) => (
                                    <option key={i} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}


                    {/* Return Option */}
                    <div>
                        <label htmlFor="Return" className="block text-gray-700 font-medium">
                            Return Option
                        </label>
                        <select
                            name="Return"
                            id="Return"
                            value={product.Return || ''}
                            onChange={handleInputChange}
                            className={`mt-2 p-3 w-full border ${errors.Return ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            <option value="">Select a return option</option>
                            <option value="No Return">No Return</option>
                            <option value="3 Days">3 Days</option>
                            <option value="5 Days">5 Days</option>
                            <option value="7 Days">7 Days</option>
                        </select>
                        {errors.Return && <p className="text-red-500 text-sm mt-1">{errors.Return}</p>}
                    </div>

                    {/* Image Upload Section */}
                    <div className="border-t pt-6">
                        <div className="mb-6">
                            <label htmlFor="thumbnail" className="block text-gray-700 font-medium mb-2">
                                Thumbnail Image (300x300)
                            </label>
                            <input
                                type="file"
                                id="thumbnail"
                                onChange={handleThumbnailChange}
                                className={`mt-2 p-3 w-full border ${errors.thumbnail ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                            />
                            {errors.thumbnail && <p className="text-red-500 text-sm mt-1">{errors.thumbnail}</p>}
                            {thumbnailPreview && (
                                <div className="mt-2">
                                    <img
                                        src={thumbnailPreview}
                                        alt="Thumbnail Preview"
                                        className="w-32 h-32 object-cover rounded-lg"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="images" className="block text-gray-700 font-medium mb-2">
                                Additional Images (600x600)
                            </label>
                            <input
                                type="file"
                                id="images"
                                multiple
                                onChange={handleImagesChange}
                                className={`mt-2 p-3 w-full border ${errors.images ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                            />
                            {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
                            <div className="grid grid-cols-3 gap-4 mt-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-32 h-32 object-cover rounded-lg"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    {saveLoading ? (
                        <button type="button" class="bg-indigo-500 text-white px-4 py-2 flex items-center rounded disabled:opacity-75 cursor-not-allowed" disabled>
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                         
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                         
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Saving...
                      </button>

                    ) : (
                        <button
                            type="submit"
                            disabled={!hasProductChanged()}
                            className={`w-full py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${hasProductChanged()
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Save Changes
                        </button>
                    )}
                </form>
            )}
        </section>
    )
}



export default EditProduct;
