import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import eventsRouter from './routes/events.js';
import participantsRouter from './routes/participants.js';

dotenv.config();
const app = express();

// ======================
// Configuración CORS MEJORADA
// ======================
const allowedOrigins = [
  "https://gestorevento.netlify.app",
  "https://690410188b8b30000831f827--gestorevento.netlify.app",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:3000",
  "https://gestor-eventos-backend-84mx.onrender.com"
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    
    if(allowedOrigins.indexOf(origin) !== -1){
      return callback(null, true);
    } else {
      console.log('⚠️ Origin no permitido pero aceptado:', origin);
      return callback(null, true);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Middleware para logging de requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// ======================
// Middleware
// ======================
app.use(express.json());

// ======================
// Conexión a MongoDB
// ======================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error al conectar MongoDB:', err));

// ======================
// Rutas
// ======================
app.use('/api/events', eventsRouter);
app.use('/api/participants', participantsRouter);

// Ruta de prueba MEJORADA
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ Backend de Gestor de Eventos funcionando correctamente.',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta de salud para verificar que el servidor responde
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado'
  });
});

// Ruta de prueba específica para CORS
app.get('/api/test-cors', (req, res) => {
  res.json({ 
    message: '✅ Prueba de CORS exitosa',
    origin: req.headers.origin,
    allowed: true,
    timestamp: new Date().toISOString()
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('❌ Error global:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message
  });
});

// ======================
// Puerto
// ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌐 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Orígenes permitidos: ${allowedOrigins.join(', ')}`);
});