import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DynamicForm = ({ formType }) => {
  const [formData, setFormData] = useState({
    name: '',
    countryCode: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Country codes list - you can expand this as needed
  const countryCodes = [
    { code: '+1', country: 'USA/Canada' },
    { code: '+44', country: 'UK' },
    { code: '+91', country: 'India' }
    // Add more country codes as needed
  ];

  useEffect(() => {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const validateForm = (values) => {
    const errors = {};

    // Name validation
    if (!values.name.match(/^[a-zA-Z\s]+$/)) {
      errors.name = 'Name must contain only alphabetic characters';
    }

    // Phone validation
    if (!values.phoneNumber.match(/^\d+$/)) {
      errors.phoneNumber = 'Phone number must contain only numbers';
    }

    // Country code validation
    if (!values.countryCode) {
      errors.countryCode = 'Please select a country code';
    }

    return errors;
  };

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      // Save to localStorage
      localStorage.setItem('formData', JSON.stringify({
        ...formData,
        lastSubmitted: new Date().toISOString()
      }));

      // Submit to server
      await axios.post(`${API_BASE_URL}/api/submit-form`, {
        formType,
        ...formData
      });

      // Clear form and errors after successful submission
      setFormData({ name: '', countryCode: '', phoneNumber: '' });
      setErrors({});
    } catch (error) {
      setErrors({ submit: 'Failed to submit form. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">Form {formType}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="px-4 py-2 border focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md shadow-sm"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">Country Code</label>
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="px-4 py-2 border focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md shadow-sm"
                >
                  <option value="">Select Country Code</option>
                  {countryCodes.map(({ code, country }) => (
                    <option key={code} value={code}>{`${country} (${code})`}</option>
                  ))}
                </select>
                {errors.countryCode && <p className="mt-1 text-sm text-red-600">{errors.countryCode}</p>}
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="px-4 py-2 border focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md shadow-sm"
                />
                {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>

              {errors.submit && <p className="mt-2 text-sm text-red-600 text-center">{errors.submit}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicForm;

