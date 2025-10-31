require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ===============================
// Configuración CORS global
// ===============================
const allowedOrigins = [
  "https://gestorevento.netlify.app",
  "https://690410188b8b30000831f827--gestorevento.netlify.app",
  "http://localhost:5500",
  "http://127.0.0.1:5500"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// ===============================
// Middlewares
// ===============================
app.use(express.json());

// ===============================
// Conexión a MongoDB
// ===============================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error al conectar MongoDB:', err));

// ===============================
// Rutas
// ===============================
const eventsRouter = require('./routes/events');
const participantsRouter = require('./routes/participants');

app.use('/api/events', eventsRouter);
app.use('/api/participants', participantsRouter);

// ===============================
// Ruta base de prueba
// ===============================
app.get('/', (req, res) => {
  res.send('✅ Backend de Gestor de Eventos funcionando correctamente.');
});

// ===============================
// Puerto dinámico (Render lo asigna automáticamente)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
