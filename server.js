require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ✅ Configuración CORS para Netlify y local
app.use(cors({
  origin: [
    "https://gestorevento.netlify.app", // tu frontend en Netlify
    /\.netlify\.app$/,
    "http://localhost:5500",
    "http://127.0.0.1:5500"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// ✅ Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error al conectar MongoDB:', err));

// ✅ Importar rutas
const eventsRouter = require('./routes/events');
const participantsRouter = require('./routes/participants');

app.use('/api/events', eventsRouter);
app.use('/api/participants', participantsRouter);

// ✅ Ruta base de prueba
app.get('/', (req, res) => {
  res.send('✅ Backend de Gestor de Eventos funcionando correctamente.');
});

// ✅ Puerto dinámico (Render lo asigna automáticamente)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
