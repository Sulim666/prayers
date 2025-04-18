import { createServer } from 'http';
import express from 'express';
import { registerRoutes } from '../server/routes.js';

const app = express();

// Обработка CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Основные настройки Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Регистрация маршрутов
registerRoutes(app);

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('API error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'Что-то пошло не так'
  });
});

// Создание HTTP сервера
const server = createServer(app);

export default async function handler(req, res) {
  // Forward the request to the Express app
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Handle all requests using the app
  app(req, res);
}