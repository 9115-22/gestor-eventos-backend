require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ✅ CORS: permitir frontend Netlify y localhost
app.use(cors({
  origin: [
    "https://gestorevento.netlify.app",
    /\.netlify\.app$/,
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());

// Conexión a MongoDB Atlas 
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error al conectar MongoDB:', err));

// 🔹 Importar rutas
const eventsRouter = require('./routes/events');
const participantsRouter = require('./routes/participants');
app.use('/api/events', eventsRouter);
app.use('/api/participants', participantsRouter);

// ✅ Ruta raíz (para verificar estado)
app.get('/', (req, res) => {
  res.send('✅ Backend de Gestor de Eventos funcionando correctamente.');
});

// Puerto dinámico (Render asigna uno automáticamente)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
