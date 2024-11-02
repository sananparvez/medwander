import React, { useState, useEffect } from 'react';
import DynamicForm from './DynamicForm';
import DataList from './DataList';

const MainInterface = () => {
  const [formType, setFormType] = useState(null);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    // Check local storage for existing data
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      setShowList(true);
    }
  }, []);

  const handleFormClick = (type) => {
    setFormType(type);
    setShowList(false);
  };
