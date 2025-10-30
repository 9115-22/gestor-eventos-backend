require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ✅ CORS configurado con tu dominio de Netlify y localhost
app.use(cors({
  origin: [
    "https://6903a4682b09bf0c5e5c9b7a--gestorevento.netlify.app", // tu dominio actual de Netlify
    /\.netlify\.app$/,  // cualquier otro dominio de Netlify (por si cambias de build)
    "http://localhost:3000" // entorno local
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

// ✅ Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado a MongoDB Atlas'))
.catch(err => console.error('❌ Error al conectar MongoDB:', err));

// ✅ Importar rutas
const eventsRouter = require('./routes/events');
const participantsRouter = require('./routes/participants');

app.use('/api/events', eventsRouter);
app.use('/api/participants', participantsRouter);

// ✅ Puerto dinámico (Render)
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
