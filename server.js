const express = require('express');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const app = express();
const pool = new Pool({
  // Configuracion de la conexión a postgres (Estas son las credenciales que tengo en pgadmin se deben colocar los datos dependiendo de como esta configurado el usuario)
  user: 'postgres', 
  host: 'localhost',
  database: 'joyas',
  password: 'postgres',
  port: 5432,
});

app.use(express.json());



// Middleware que registrar el metodo HTTP, la ruta solicitada y la IP
const logRequestDetails = (req, res, next) => {
  const logMessage = `${new Date().toISOString()} - Método: ${req.method} - Ruta solicitada: ${req.originalUrl} - IP del cliente: ${req.ip}\n`;

// Guardo el log en un archivo request_logs.log
  fs.appendFile(path.join(__dirname, 'request_logs.log'), logMessage, (err) => {
    if (err) throw err; 
  });
  next();
};
app.use(logRequestDetails);

const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};

app.use(errorHandler);

// ruta donde obtengo las joyas con paginacion, orden y limite
app.get('/joyas', async (req, res, next) => {
  try {
    const { limits = 10, page = 1, order_by = 'stock_ASC' } = req.query;

    const offset = (page - 1) * limits;
    const order = order_by.split('_');
    const sortField = order[0];
    const sortOrder = order[1] === 'ASC' ? 'ASC' : 'DESC';

    const query = `
      SELECT * FROM inventario
      ORDER BY ${sortField} ${sortOrder}
      LIMIT $1 OFFSET $2
    `;
    
    const result = await pool.query(query, [limits, offset]);
    
    const totalRows = (await pool.query('SELECT COUNT(*) FROM inventario')).rows[0].count;
    const totalPages = Math.ceil(totalRows / limits);

    const response = {
      data: result.rows,
      links: {
        self: `/joyas?limits=${limits}&page=${page}&order_by=${order_by}`,
        next: page < totalPages ? `/joyas?limits=${limits}&page=${parseInt(page) + 1}&order_by=${order_by}` : null,
        prev: page > 1 ? `/joyas?limits=${limits}&page=${parseInt(page) - 1}&order_by=${order_by}` : null,
      },
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
});

// rutaa donde obtengolas joyas por precio, categoría y metal
app.get('/joyas/ltros', async (req, res, next) => {
  try {
    const { precio_min, precio_max, categoria, metal } = req.query;

    let query = 'SELECT * FROM inventario WHERE 1=1';
    const params = [];

    if (precio_min) {
      query += ` AND precio >= $${params.length + 1}`;
      params.push(precio_min);
    }

    if (precio_max) {
      query += ` AND precio <= $${params.length + 1}`;
      params.push(precio_max);
    }

    if (categoria) {
      query += ` AND categoria = $${params.length + 1}`;
      params.push(categoria);
    }

    if (metal) {
      query += ` AND metal = $${params.length + 1}`;
      params.push(metal);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
