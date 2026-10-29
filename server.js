const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Carpeta pública para el archivo HTML
app.use(express.static('public'));

// Ruta para recibir el formulario y enviarlo a HubSpot
app.post('/api/crear-contacto', async (req, res) => {
    const { nombre, apellido, email, telefono, cargo } = req.body;

    try {
        const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.HUBSPOT_TOKEN}`
            },
            body: JSON.stringify({
                properties: {
                    firstname: nombre,
                    lastname: apellido,
                    email: email,
                    phone: telefono,
                    jobtitle: cargo
                }
            })
        });

        const data = await response.json();

        if (response.ok) {
            res.json({ success: true, message: '¡Contacto creado en HubSpot con éxito!', data });
        } else {
            res.json({ success: false, error: data.message || 'Error al conectar con HubSpot' });
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Error interno en el servidor' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});