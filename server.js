require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ===============================
// CORS: permitir Netlify y localhost
// ===============================
const allowedOrigins = [
  "https://690410188b8b30000831f827--gestorevento.netlify.app",
  "https://gestorevento.netlify.app",
  "http://localhost:5500",
  "http://127.0.0.1:5500"
];

// middleware CORS global
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  // responder preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ===============================
// Middleware
// ===============================
app.use(express.json());

// ===============================
// Conexión a MongoDB
// ===============================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Conectado a MongoDB"))
.catch(err => console.error("❌ Error al conectar MongoDB:", err));

// ===============================
// Rutas
// ===============================
const eventsRouter = require('./routes/events');
const participantsRouter = require('./routes/participants');

app.use('/api/events', eventsRouter);
app.use('/api/participants', participantsRouter);

// ===============================
// Ruta de prueba
// ===============================
app.get('/', (req, res) => {
  res.send('✅ Backend de Gestor de Eventos funcionando correctamente.');
});

// ===============================
// Puerto dinámico
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
