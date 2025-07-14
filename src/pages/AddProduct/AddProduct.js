import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../Urls/Urls';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const [product, setProduct] = useState({});
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [errors, setErrors] = useState({});
    const [specifications, setSpecifications] = useState([]);
    const [newSpec, setNewSpec] = useState({ key: '', value: '' });
    const [highlights, setHighlights] = useState([]);
    const [newHighlight, setNewHighlight] = useState('');
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();

    const [customOptions, setCustomOptions] = useState([]); // To store all custom options
    const [newOption, setNewOption] = useState({ name: '', values: '' }); // For adding a new option

    // Handle new option input changes
    const handleOptionChange = (e) => {
        setNewOption({ ...newOption, [e.target.name]: e.target.value });
    };

    // Add a new custom option
    const addCustomOption = () => {
        if (newOption.name.trim() && newOption.values.trim()) {
            const valuesArray = newOption.values.split(',').map((val) => val.trim());
            setCustomOptions([...customOptions, { name: newOption.name, values: valuesArray }]);
            setNewOption({ name: '', values: '' });
        }
    };

    // Remove a specific custom option
    const removeCustomOption = (index) => {
        setCustomOptions(customOptions.filter((_, i) => i !== index));
    };


    // Handle product input changes
    const handleInputChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    // Handle new specification input changes
    const handleSpecChange = (e) => {
        setNewSpec({ ...newSpec, [e.target.name]: e.target.value });
    };

    // Add a new specification
    const addSpecification = () => {
        if (newSpec.key && newSpec.value) {
            setSpecifications([...specifications, newSpec]);
            setNewSpec({ key: '', value: '' });
        }
    };

    // Remove a specific specification
    const removeSpecification = (index) => {
        setSpecifications(specifications.filter((_, i) => i !== index));
    };

    // Add a new highlight
    const addHighlight = () => {
        if (newHighlight.trim()) {
            setHighlights([...highlights, newHighlight]);
            setNewHighlight('');
        }
    };

    // Remove a specific highlight
    const removeHighlight = (index) => {
        setHighlights(highlights.filter((_, i) => i !== index));
    };

    // Handle thumbnail change and validation
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const img = new Image();
            img.onload = () => {
                if (img.width === 300 && img.height === 300) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setThumbnail(file);
                        setThumbnailPreview(reader.result);
                    };
                    reader.readAsDataURL(file);
                    setErrors((prevErrors) => ({ ...prevErrors, thumbnail: null }));
                } else {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        thumbnail: 'Thumbnail must be 300x300 pixels.',
                    }));
                    setThumbnail(null);
                    setThumbnailPreview(null);
                }
            };
            img.src = URL.createObjectURL(file);
        }
    };

    // Remove thumbnail
    const removeThumbnail = () => {
        setThumbnail(null);
        setThumbnailPreview(null);
    };

    // Handle additional images change and validation
    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        const previewsPromises = files.map((file) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    if (img.width === 600 && img.height === 600) {
                        resolve({
                            file,
                            preview: URL.createObjectURL(file),
                        });
                    } else {
                        reject('All additional images must be 600x600 pixels.');
                    }
                };
                img.onerror = () => reject('Error loading image file.');
                img.src = URL.createObjectURL(file);
            });
        });

        Promise.allSettled(previewsPromises).then((results) => {
            const validFiles = results
                .filter((result) => result.status === 'fulfilled')
                .map((result) => result.value);

            const invalidFiles = results
                .filter((result) => result.status === 'rejected')
                .map((result) => result.reason);

            if (invalidFiles.length) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    images: invalidFiles[0],
                }));
            }

            setImages((prevImages) => [
                ...prevImages,
                ...validFiles.map((valid) => valid.file),
            ]);
            setImagePreviews((prevPreviews) => [
                ...prevPreviews,
                ...validFiles.map((valid) => valid.preview),
            ]);
        });
    };

    // Remove a specific additional image
    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    };

    // Validate the form fields
    const validateForm = () => {
        const errors = {};
        if (!product.Name || product.Name.trim() === '') {
            errors.Name = 'Product Name is required';
        }
        if (!product.Price || isNaN(product.Price) || Number(product.Price) <= 0) {
            errors.Price = 'Valid Price is required';
        }

        if (!product.SellingPrice || isNaN(product.SellingPrice) || Number(product.SellingPrice) <= 0) {
            errors.SellingPrice = 'Valid SellingPrice is required';
        }

        if (Number(product.Price) >= Number(product.SellingPrice)) {
            errors.SellingPrice = 'SellingPrice should not be less than Price';
        }


        if (!product.Category || product.Category.trim() === '') {
            errors.Category = 'Category is required';
        }
        if (!product.Description || product.Description.trim() === '') {
            errors.Description = 'Description is required';
        }
        if (!product.Quantity || isNaN(product.Quantity) || product.Quantity < 0) {
            errors.Quantity = 'Valid Quantity is required';
        }
        if (!thumbnail) {
            errors.thumbnail = 'Thumbnail image is required';
        }
        if (!product.ReturnOption) {
            errors.ReturnOption = 'Return option is required';
        }
        // Join error messages with a newline separator (removing the object brackets)
        const errorMessages = Object.values(errors).join('\n');
        if (errorMessages.length > 0) {
            alert(errorMessages);
        }

        return errors;
    };

    // Handle form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();



        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const formData = new FormData();
        formData.append('Name', product.Name);
        formData.append('Price', product.Price);
        formData.append('SellingPrice', product.SellingPrice);
        formData.append('Category', product.Category);
        formData.append('Description', product.Description);
        formData.append('Quantity', product.Quantity);
        formData.append('Return', product.ReturnOption);
        formData.append('Specifications', JSON.stringify(specifications));
        formData.append('Highlights', JSON.stringify(highlights));
        formData.append('CustomOptions', JSON.stringify(customOptions));


        if (thumbnail) {
            formData.append('thumbnail', thumbnail);
        }

        images.forEach((image) => {
            formData.append('images', image);
        });

        try {
            setLoading(true)
            const response = await axios.post(`${BASE_URL}/add-product`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.status) {
                setLoading(false)
                alert('Product Added Successfully');
                navigate('/');
            } else {
                alert('Something went wrong');
                setLoading(false)
            }
        } catch (err) {
            console.error('Error adding product:', err);
            setLoading(false)
            alert('Failed to Add product');
        }
    };

    return (
        <section className="add-product bg-gray-100 p-6 rounded-lg max-w-4xl mt-2 mx-auto">
            <form onSubmit={handleFormSubmit} className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-700">Add Product</h1>

                {/* Product Name */}
                <div>
                    <label htmlFor="Name" className="block text-gray-700 font-medium">
                        Product Name
                    </label>
                    <input
                        type="text"
                        name="Name"
                        value={product.Name || ''}
                        onChange={handleInputChange}
                        placeholder="Enter product name"
                        className={`mt-2 p-3 w-full border ${errors.Name ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                    />
                    {errors.Name && <p className="text-red-500 text-sm">{errors.Name}</p>}
                </div>


                {/*Selling Price */}
                <div>
                    <label htmlFor="SellingPrice" className="block text-gray-700 font-medium">
                        Selling Price
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
                    {errors.SellingPrice && <p className="text-red-500 text-sm">{errors.SellingPrice}</p>}
                </div>

                {/* Price */}
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
                    {errors.Price && <p className="text-red-500 text-sm">{errors.Price}</p>}
                </div>





                {/* Category */}
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
                    {errors.Category && <p className="text-red-500 text-sm">{errors.Category}</p>}
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="Description" className="block text-gray-700 font-medium">
                        Description
                    </label>
                    <input
                        type="text"
                        name="Description"
                        id="Description"
                        value={product.Description || ''}
                        onChange={handleInputChange}
                        placeholder="Enter product description"
                        className={`mt-2 p-3 w-full border ${errors.Description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.Description && <p className="text-red-500 text-sm">{errors.Description}</p>}
                </div>

                {/* Quantity */}
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
                    {errors.Quantity && <p className="text-red-500 text-sm">{errors.Quantity}</p>}
                </div>

                {/* Specifications */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-700">Specifications</h2>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            name="key"
                            value={newSpec.key}
                            onChange={handleSpecChange}
                            placeholder="Key"
                            className="p-3 w-full border rounded-lg"
                        />
                        <input
                            type="text"
                            name="value"
                            value={newSpec.value}
                            onChange={handleSpecChange}
                            placeholder="Value"
                            className="p-3 w-full border rounded-lg"
                        />
                        <button
                            type="button"
                            onClick={addSpecification}
                            className="p-3 bg-blue-500 text-white rounded-lg"
                        >
                            Add
                        </button>
                    </div>
                    <ul className="mt-4">
                        {specifications.map((spec, index) => (
                            <li key={index} className="flex justify-between items-center">
                                {spec.key}: {spec.value}
                                <button
                                    type="button"
                                    onClick={() => removeSpecification(index)}
                                    className="text-red-500"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Highlights */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-700">Highlights</h2>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={newHighlight}
                            onChange={(e) => setNewHighlight(e.target.value)}
                            placeholder="Highlight"
                            className="p-3 w-full border rounded-lg"
                        />
                        <button
                            type="button"
                            onClick={addHighlight}
                            className="p-3 bg-blue-500 text-white rounded-lg"
                        >
                            Add
                        </button>
                    </div>
                    <ul className="mt-4">
                        {highlights.map((highlight, index) => (
                            <li key={index} className="flex justify-between items-center">
                                {highlight}
                                <button
                                    type="button"
                                    onClick={() => removeHighlight(index)}
                                    className="text-red-500"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>



                {/* Custom Options */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-700">Custom Options</h2>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            name="name"
                            value={newOption.name}
                            onChange={handleOptionChange}
                            placeholder="Option Name (e.g., Color)"
                            className="p-3 w-full border rounded-lg"
                        />
                        <input
                            type="text"
                            name="values"
                            value={newOption.values}
                            onChange={handleOptionChange}
                            placeholder="Values (comma-separated)"
                            className="p-3 w-full border rounded-lg"
                        />
                        <button
                            type="button"
                            onClick={addCustomOption}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        >
                            Add
                        </button>
                    </div>
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
                    <label htmlFor="ReturnOption" className="block text-gray-700 font-medium">
                        Return Option
                    </label>
                    <select
                        name="ReturnOption"
                        id="ReturnOption"
                        value={product.ReturnOption || ''}
                        onChange={handleInputChange}
                        className={`mt-2 p-3 w-full border ${errors.ReturnOption ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        <option value="">Select a return option</option>
                        <option value="No Return">No Return</option>
                        <option value="3 Days">3 Days</option>
                        <option value="5 Days">5 Days</option>
                        <option value="7 Days">7 Days</option>
                    </select>
                    {errors.ReturnOption && <p className="text-red-500 text-sm">{errors.ReturnOption}</p>}
                </div>

                {/* Thumbnail Image */}
                <div>
                    <label htmlFor="Thumbnail" className="block text-gray-700 font-medium">
                        Thumbnail Image
                    </label>
                    <input
                        type="file"
                        onChange={handleThumbnailChange}
                        className={`mt-2 p-3 w-full border ${errors.thumbnail ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                    />
                    {errors.thumbnail && <p className="text-red-500 text-sm">{errors.thumbnail}</p>}
                </div>

                {thumbnailPreview && (
                    <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-32 h-32 object-cover rounded-lg" />
                )}

                {/* Additional Images */}
                <div>
                    <label htmlFor="Images" className="block text-gray-700 font-medium">
                        Additional Images
                    </label>
                    <input
                        type="file"
                        multiple
                        onChange={handleImagesChange}
                        className="mt-2 p-3 w-full border rounded-lg"
                    />
                    {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
                </div>

                <div className="grid grid-cols-3 gap-4 mt-2">
                    {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={preview}
                                alt={`Preview ${index}`}
                                className="w-32 h-32 object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>

                {/* Submit Button */}

                {loading ? (
                  <button type="button" class="bg-indigo-500 text-white px-4 py-2 flex items-center rounded disabled:opacity-75 cursor-not-allowed" disabled>
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                   
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Adding...
                </button>
                
                ) : (
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none"
                    >
                        Add product
                    </button>
                )
                }
            </form>
        </section>
    );

};

export default AddProduct;
