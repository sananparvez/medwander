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

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => handleFormClick('A')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Form A
        </button>
        <button
          onClick={() => handleFormClick('B')}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Form B
        </button>
        <button
          onClick={() => setShowList(true)}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          View Submissions
        </button>
      </div>

      {formType && !showList && (
        <DynamicForm formType={formType} />
      )}

      {showList && (
        <DataList />
      )}
    </div>
  );
};

export default MainInterface;
