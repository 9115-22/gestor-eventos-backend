require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ✅ Configuración de CORS para permitir tu frontend
const corsOptions = {
  origin: [
    "https://6903a4682b09bf0c5e5c9b7a--gestorevento.netlify.app", // URL de tu frontend en Netlify
    "http://localhost:3000" // opcional para pruebas locales
  ],
  methods: ["GET", "POST", "PUT", "DELETE"]
};
app.use(cors(corsOptions));

// Middlewares
app.use(express.json());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar MongoDB:', err));

// Rutas de ejemplo
app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente');
});

// Puerto dinámico asignado por Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
