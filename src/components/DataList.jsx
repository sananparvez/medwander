import React, { useState, useEffect } from 'react';
import axios from 'axios';
  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/submissions`);
      setSubmissions(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch submissions');
      setLoading(false);
    }
  };
