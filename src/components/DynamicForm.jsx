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
