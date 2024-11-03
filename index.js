const express = require('express');
const mysql = require('mysql2');
const xlsx = require('xlsx');
const cors = require('cors');

const app = express();

// Middleware
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

