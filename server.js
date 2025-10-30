require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ✅ CORS: permitir frontend Netlify y localhost
app.use(cors({
  origin: [
    "https://6903a4682b09bf0c5e5c9b7a--gestorevento.netlify.app",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar MongoDB:', err));

// 🔹 Importar rutas
const eventsRouter = require('./routes/events');
app.use('/api/events', eventsRouter);

// Puerto dinámico
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
