require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ✅ Middleware CORS global
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "https://gestorevento.netlify.app",
      "https://690410188b8b30000831f827--gestorevento.netlify.app", // Netlify deploy preview
      "http://localhost:5500",
      "http://127.0.0.1:5500"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
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

// ✅ Ruta de prueba
app.get('/', (req, res) => {
  res.send('✅ Backend funcionando.');
});

// ✅ Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
