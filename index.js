import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import connection from './db.js';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/assets', express.static(path.join(__dirname, 'assets')));


// Ruta principal para servir la página de inicio de sesión
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Ruta para la página de registro
app.get('/registrate.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'registrate.html'));
});

// Otras rutas para los archivos HTML
app.get('/pagina_principal.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'pagina_principal.html'));
});

app.get('/perfil.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'perfil.html'));
});

app.get('/gestion.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'gestion.html'));
});

app.get('/informes.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'informes.html'));
});

app.get('/inventario.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'inventario.html'));
});

app.get('/productos.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'productos.html'));
});

app.get('/venta.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'venta.html'));
});

app.get('/cliente.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cliente.html'));
});

app.get('/notacredito.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'notacredito.html'));
});

app.get('/proveedor.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'proveedor.html'));
});

app.get('/representante.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'representante.html'));
});

app.get('/compra.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'compra.html'));
});

app.get('/pais.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'pais.html'));
});

app.get('/departamento.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'departamento.html'));
});

app.get('/cuidad.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cuidad.html'));
});



app.get('/perfil.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'perfil.html'));
});

app.get('/informes.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'informes.html'));
});

// Ruta para informe_resultado.html
app.get('/informe_resultado.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'informe_resultado.html'));
});

// Ruta para procesar el formulario de inicio de sesión
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    connection.query('SELECT * FROM usuarios WHERE Correo = ?', [email], (error, results) => {
        if (error) {
            console.error('Error en la base de datos:', error.message);
            return res.status(500).json({ success: false, message: 'Error en la base de datos.' });
        }

        if (results.length > 0 && bcrypt.compareSync(password, results[0].Contraseña)) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'No estás registrado o la contraseña es incorrecta.' });
        }
    });
});

// Ruta para procesar el formulario de registro
app.post('/api/register', (req, res) => {
    const { id_usuario, Nombre1, Nombre2, Apellido1, Apellido2, Dirección, id_pais, id_dpto, id_cdad, Celular, Correo, Usuario, contrasena, Estado, id_perfil } = req.body;

    if (!contrasena) {
        return res.status(400).json({ success: false, message: 'La contraseña es requerida.' });
    }

    const hashedPassword = bcrypt.hashSync(contrasena, 10);

    const query = `
        INSERT INTO usuarios (id_usuario, Nombre1, Nombre2, Apellido1, Apellido2, Dirección, id_pais, id_dpto, id_cdad, Celular, Correo, Usuario, Contraseña, id_perfil, Estado) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        id_usuario, Nombre1, Nombre2, Apellido1, Apellido2, Dirección, id_pais, id_dpto, id_cdad, Celular, Correo, Usuario, hashedPassword, id_perfil, Estado
    ];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error al registrar el usuario:', error.message);
            return res.status(500).json({ success: false, message: 'Error al registrar el usuario.', error: error.message });
        }

        res.json({ success: true, message: 'Registro exitoso.' });
    });
});

// Ruta para obtener todos los productos del inventario
app.get('/api/inventario', (req, res) => {
    const query = 'SELECT * FROM inventario';

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener el inventario:', error.message);
            return res.status(500).json({ success: false, message: 'Error al obtener el inventario.' });
        }

        res.json(results);
    });
});

// Ruta para verificar si un ID de producto ya existe en el inventario
app.get('/api/inventario/:id_productos', (req, res) => {
    const { id_productos } = req.params;
    const query = 'SELECT * FROM inventario WHERE id_productos = ?';

    connection.query(query, [id_productos], (error, results) => {
        if (error) {
            console.error('Error al verificar el ID del producto:', error.message);
            return res.status(500).json({ success: false, message: 'Error al verificar el ID del producto.' });
        }

        res.json(results);
    });
});

// Ruta para procesar el formulario de inventario
app.post('/api/inventario', (req, res) => {
    const { id_productos, Cantidad, stock_min, stock_max, Estado } = req.body;

    // Verificar si el ID del producto ya existe
    connection.query('SELECT * FROM inventario WHERE id_productos = ?', [id_productos], (error, results) => {
        if (error) {
            console.error('Error al verificar el ID del producto:', error.message);
            return res.status(500).json({ success: false, message: 'Error al verificar el ID del producto.' });
        }

        if (results.length > 0) {
            return res.status(400).json({ success: false, message: 'El ID del producto ya está guardado.' });
        }

        // Insertar el nuevo producto si el ID no existe
        const query = `
            INSERT INTO inventario (id_productos, Cantidad, \`Stock min\`, \`Stock max\`, Estado)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [id_productos, Cantidad, stock_min, stock_max, Estado];

        connection.query(query, values, (error, results) => {
            if (error) {
                console.error('Error al agregar el inventario:', error.message);
                return res.status(500).json({ success: false, message: 'Error al agregar el inventario.' });
            }

            res.json({ success: true, message: 'Inventario agregado exitosamente.' });
        });
    });
});

// Ruta para editar un producto en el inventario
app.put('/api/inventario', (req, res) => {
    const { id_productos, Cantidad } = req.body;

    const query = `
        UPDATE inventario 
        SET Cantidad = ? 
        WHERE id_productos = ?
    `;
    const values = [Cantidad, id_productos];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error al editar el inventario:', error.message);
            return res.status(500).json({ success: false, message: 'Error al editar el inventario.' });
        }

        res.json({ success: true, message: 'Inventario editado exitosamente.' });
    });
});

// Ruta para eliminar un producto del inventario
app.delete('/api/inventario/:id_productos', (req, res) => {
    const { id_productos } = req.params;

    const query = 'DELETE FROM inventario WHERE id_productos = ?';

    connection.query(query, [id_productos], (error, results) => {
        if (error) {
            console.error('Error al eliminar el producto:', error.message);
            return res.status(500).json({ success: false, message: 'Error al eliminar el producto.' });
        }

        res.json({ success: true, message: 'Producto eliminado exitosamente.' });
    });
});


// Ruta para procesar el formulario de productos (agregar)
app.post('/api/productos', (req, res) => {
    const { id_productos, Descripción, Cantidad, Valor_unitario, Estado } = req.body;

    connection.query('SELECT * FROM productos WHERE id_productos = ?', [id_productos], (error, results) => {
        if (error) {
            console.error('Error al verificar el ID del producto:', error.message);
            return res.status(500).json({ success: false, message: 'Error al verificar el ID del producto.' });
        }

        if (results.length > 0) {
            return res.status(400).json({ success: false, message: 'El ID del producto ya está en uso.' });
        }

        const query = `
            INSERT INTO productos (id_productos, Descripción, Cantidad, Valor_unitario, Estado)
            VALUES (?, ?, ?, ?, ?)
        `;
        connection.query(query, [id_productos, Descripción, Cantidad, Valor_unitario, Estado], (error, results) => {
            if (error) {
                console.error('Error al agregar el producto:', error.message);
                return res.status(500).json({ success: false, message: 'Error al agregar el producto.' });
            }

            res.status(200).json({ success: true, message: 'Producto agregado exitosamente.' });
        });
    });
});

// Ruta para obtener todos los productos
app.get('/api/productos', (req, res) => {
    const query = 'SELECT * FROM productos';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener los productos:', error.message);
            return res.status(500).json({ success: false, message: 'Error al obtener los productos.' });
        }

        res.status(200).json(results);
    });
});

// Ruta para actualizar un producto
app.put('/api/productos/:id', (req, res) => {
    const { id } = req.params;
    const { Descripción, Cantidad, Valor_unitario, Estado } = req.body;

    const query = `
        UPDATE productos
        SET Descripción = ?, Cantidad = ?, Valor_unitario = ?, Estado = ?
        WHERE id_productos = ?
    `;
    connection.query(query, [Descripción, Cantidad, Valor_unitario, Estado, id], (error, results) => {
        if (error) {
            console.error('Error al actualizar el producto:', error.message);
            return res.status(500).json({ success: false, message: 'Error al actualizar el producto.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
        }

        res.status(200).json({ success: true, message: 'Producto actualizado exitosamente.' });
    });
});

// Ruta para eliminar un producto
app.delete('/api/productos/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM productos WHERE id_productos = ?';
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar el producto:', error.message);
            return res.status(500).json({ success: false, message: 'Error al eliminar el producto.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
        }

        res.status(200).json({ success: true, message: 'Producto eliminado exitosamente.' });
    });
});

// Ruta para obtener todas las ventas
app.get('/api/venta', (req, res) => {
    const query = `
        SELECT v.id_venta, v.id_cliente, v.Fecha, v.Valor, v.Iva, v.Total_pagar, v.Estado, 
            dv.id_productos, dv.Cantidad, dv.Valor_unitario 
        FROM venta v
        JOIN detalle_venta dv ON v.id_venta = dv.id_venta
    `;

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener las ventas:', error.message);
            return res.status(500).json({ success: false, message: 'Error al obtener las ventas.' });
        }

        res.json(results);
    });
});

// Ruta para procesar el formulario de ventas y detalles de ventas
app.post('/api/venta', (req, res) => {
    const { id_venta, id_cliente, Fecha, Valor, Iva, id_productos, Cantidad, Valor_unitario, Total_pagar, Estado } = req.body;

    // Insertar datos en la tabla de ventas
    const queryVenta = `
        INSERT INTO venta (id_venta, id_cliente, Fecha, Valor, Iva, Total_pagar, Estado)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const valuesVenta = [id_venta, id_cliente, Fecha, Valor, Iva, Total_pagar, Estado];

    connection.query(queryVenta, valuesVenta, (error, resultsVenta) => {
        if (error) {
            console.error('Error al agregar la venta:', error.message);
            return res.status(500).json({ success: false, message: 'Error al agregar la venta.' });
        }

        // Insertar detalles de la venta
        const queryDetalles = `
            INSERT INTO detalle_venta (id_venta, id_productos, Cantidad, Valor_unitario, Estado)
            VALUES (?, ?, ?, ?, ?)
        `;
        const valuesDetalles = [id_venta, id_productos, Cantidad, Valor_unitario, Estado];

        connection.query(queryDetalles, valuesDetalles, (error, resultsDetalles) => {
            if (error) {
                console.error('Error al agregar los detalles de la venta:', error.message);
                return res.status(500).json({ success: false, message: 'Error al agregar los detalles de la venta: ' + error.message });
            }

            res.json({ success: true, message: 'Venta registrada exitosamente.' });
        });
    });
});

// Ruta para eliminar una venta
app.delete('/api/venta/:id', (req, res) => {
    const id = req.params.id;

    // Eliminar detalles de la venta
    const queryDetalles = 'DELETE FROM detalle_venta WHERE id_venta = ?';
    connection.query(queryDetalles, [id], (error, resultsDetalles) => {
        if (error) {
            console.error('Error al eliminar los detalles de la venta:', error.message);
            return res.status(500).json({ success: false, message: 'Error al eliminar los detalles de la venta.' });
        }

        // Eliminar la venta
        const queryVenta = 'DELETE FROM venta WHERE id_venta = ?';
        connection.query(queryVenta, [id], (error, resultsVenta) => {
            if (error) {
                console.error('Error al eliminar la venta:', error.message);
                return res.status(500).json({ success: false, message: 'Error al eliminar la venta.' });
            }

            res.json({ success: true, message: 'Venta eliminada exitosamente.' });
        });
    });
});




// Ruta para registrar un cliente
app.post('/api/cliente', (req, res) => {
    const { id_cliente, Nombre1, Nombre2, Apellido1, Apellido2, Dirección, Cod_pais, Cod_Dpto, Cod_Cuid, Celular, Correo, Estado } = req.body;

    const query = `
        INSERT INTO cliente (id_cliente, Nombre1, Nombre2, Apellido1, Apellido2, Dirección, Cod_pais, Cod_Dpto, Cod_Cuid, Celular, Correo, Estado) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        id_cliente, Nombre1, Nombre2, Apellido1, Apellido2, Dirección, Cod_pais, Cod_Dpto, Cod_Cuid, Celular, Correo, Estado
    ];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error al registrar el cliente:', error.message);
            return res.status(500).json({ success: false, message: 'Error al registrar el cliente.', error: error.message });
        }

        res.json({ success: true, message: 'Registro de cliente exitoso.' });
    });
});

// Ruta para obtener todos los clientes
app.get('/api/cliente', (req, res) => {
    const query = 'SELECT * FROM cliente';

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener los clientes:', error.message);
            return res.status(500).json({ success: false, message: 'Error al obtener los clientes.' });
        }

        res.json(results);
    });
});

// Ruta para obtener un cliente por su ID
app.get('/api/cliente/:id_cliente', (req, res) => {
    const { id_cliente } = req.params;
    const query = 'SELECT * FROM cliente WHERE id_cliente = ?';

    connection.query(query, [id_cliente], (error, results) => {
        if (error) {
            console.error('Error al obtener el cliente:', error.message);
            return res.status(500).json({ success: false, message: 'Error al obtener el cliente.' });
        }

        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ success: false, message: 'Cliente no encontrado.' });
        }
    });
});

// Ruta para editar un cliente
app.put('/api/cliente/:id_cliente', (req, res) => {
    const { id_cliente } = req.params;
    const { Nombre1, Nombre2, Apellido1, Apellido2, Dirección, Cod_pais, Cod_Dpto, Cod_Cuid, Celular, Correo, Estado } = req.body;

    const query = `
        UPDATE cliente
        SET Nombre1 = ?, Nombre2 = ?, Apellido1 = ?, Apellido2 = ?, Dirección = ?, Cod_pais = ?, Cod_Dpto = ?, Cod_Cuid = ?, Celular = ?, Correo = ?, Estado = ?
        WHERE id_cliente = ?
    `;
    const values = [
        Nombre1, Nombre2, Apellido1, Apellido2, Dirección, Cod_pais, Cod_Dpto, Cod_Cuid, Celular, Correo, Estado, id_cliente
    ];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error al editar el cliente:', error.message);
            return res.status(500).json({ success: false, message: 'Error al editar el cliente.', error: error.message });
        }

        if (results.affectedRows > 0) {
            res.json({ success: true, message: 'Cliente actualizado exitosamente.' });
        } else {
            res.status(404).json({ success: false, message: 'Cliente no encontrado.' });
        }
    });
});

// Ruta para eliminar un cliente
app.delete('/api/cliente/:id_cliente', (req, res) => {
    const { id_cliente } = req.params;
    const query = 'DELETE FROM cliente WHERE id_cliente = ?';

    connection.query(query, [id_cliente], (error, results) => {
        if (error) {
            console.error('Error al eliminar el cliente:', error.message);
            return res.status(500).json({ success: false, message: 'Error al eliminar el cliente.', error: error.message });
        }

        if (results.affectedRows > 0) {
            res.json({ success: true, message: 'Cliente eliminado exitosamente.' });
        } else {
            res.status(404).json({ success: false, message: 'Cliente no encontrado.' });
        }
    });
});

// Ruta para obtener todas las notas de crédito
app.get('/api/notacredito', (req, res) => {
    const query = 'SELECT * FROM nota_de_credito';

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener las notas de crédito:', error.message);
            return res.status(500).json({ success: false, message: 'Error al obtener las notas de crédito' });
        }

        res.json(results);
    });
});

// Ruta para agregar una nueva nota de crédito
app.post('/api/notacredito', (req, res) => {
    const { id_NotaCredito, id_venta, Fech_factra, Rzn_devolucion, Mnt_total, id_cliente, Estado } = req.body;
    const query = 'INSERT INTO nota_de_credito (id_NotaCredito, id_venta, Fech_factra, Rzn_devolucion, Mnt_total, id_cliente, Estado) VALUES (?, ?, ?, ?, ?, ?, ?)';

    connection.query(query, [id_NotaCredito, id_venta, Fech_factra, Rzn_devolucion, Mnt_total, id_cliente, Estado], (error, results) => {
        if (error) {
            console.error('Error al agregar la nota de crédito:', error.message);
            return res.status(500).json({ success: false, message: 'Error al agregar la nota de crédito' });
        }

        res.json({ success: true, message: 'Nota de crédito agregada correctamente' });
    });
});

// Ruta para verificar si un ID ya existe en una tabla específica
app.get('/api/check/:type/:id', (req, res) => {
    const { type, id } = req.params;
    let table = '';
    let column = '';

    switch (type) {
        case 'notacredito':
            table = 'nota_de_credito';
            column = 'id_NotaCredito';
            break;
        case 'venta':
            table = 'ventas';
            column = 'id_venta';
            break;
        case 'cliente':
            table = 'clientes';
            column = 'id_cliente';
            break;
        default:
            return res.status(400).json({ success: false, message: 'Tipo de ID no válido' });
    }

    const query = `SELECT COUNT(*) AS count FROM ${table} WHERE ${column} = ?`;
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error(`Error al verificar el ID en ${table}:`, error.message);
            return res.status(500).json({ success: false, message: 'Error al verificar el ID' });
        }

        const exists = results[0].count > 0;
        res.json({ exists });
    });
});


// Ruta para editar una nota de crédito
app.put('/api/notacredito/:id', (req, res) => {
    const { id } = req.params;
    const { id_venta, Fech_factra, Rzn_devolucion, Mnt_total, id_cliente, Estado } = req.body;

    const query = `
        UPDATE nota_de_credito 
        SET id_venta = ?, Fech_factra = ?, Rzn_devolucion = ?, Mnt_total = ?, id_cliente = ?, Estado = ?
        WHERE id_NotaCredito = ?
    `;
    const values = [
        id_venta, Fech_factra, Rzn_devolucion, Mnt_total, id_cliente, Estado, id
    ];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error al actualizar la nota de crédito:', error.message);
            return res.status(500).json({ success: false, message: 'Error al actualizar la nota de crédito.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Nota de crédito no encontrada.' });
        }

        res.json({ success: true, message: 'Nota de crédito actualizada exitosamente.' });
    });
});

// Ruta para eliminar una nota de crédito
app.delete('/api/notacredito/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM nota_de_credito WHERE id_NotaCredito = ?';

    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar la nota de crédito:', error.message);
            return res.status(500).json({ success: false, message: 'Error al eliminar la nota de crédito.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Nota de crédito no encontrada.' });
        }

        res.json({ success: true, message: 'Nota de crédito eliminada exitosamente.' });
    });
});

// Ruta para obtener todos los proveedores
app.get('/api/proveedor', (req, res) => {
    connection.query('SELECT * FROM proveedores', (error, results) => {
        if (error) {
            console.error('Error al obtener proveedores:', error.message);
            return res.status(500).json({ success: false, message: 'Error al obtener proveedores.' });
        }
        res.json(results);
    });
});

// Ruta para registrar un proveedor
app.post('/api/proveedor', (req, res) => {
    const { Nit, Razon_social, Direccion, id_pais, id_dpto, id_cdad, Correo, Celular, Estado } = req.body;

    // Verificar si el NIT ya existe
    connection.query('SELECT * FROM proveedores WHERE Nit = ?', [Nit], (error, results) => {
        if (error) {
            console.error('Error al verificar el NIT:', error.message);
            return res.status(500).json({ success: false, message: 'Error al verificar el NIT.' });
        }
        if (results.length > 0) {
            return res.status(400).json({ success: false, message: 'El NIT ya existe.' });
        }

        // Verificar si la Dirección ya existe
        connection.query('SELECT * FROM proveedores WHERE Direccion = ?', [Direccion], (error, results) => {
            if (error) {
                console.error('Error al verificar la dirección:', error.message);
                return res.status(500).json({ success: false, message: 'Error al verificar la dirección.' });
            }
            if (results.length > 0) {
                return res.status(400).json({ success: false, message: 'La dirección ya existe.' });
            }

            // Verificar si el Correo ya existe
            connection.query('SELECT * FROM proveedores WHERE Correo = ?', [Correo], (error, results) => {
                if (error) {
                    console.error('Error al verificar el correo:', error.message);
                    return res.status(500).json({ success: false, message: 'Error al verificar el correo.' });
                }
                if (results.length > 0) {
                    return res.status(400).json({ success: false, message: 'El correo ya existe.' });
                }

                // Verificar si el Celular ya existe
                connection.query('SELECT * FROM proveedores WHERE Celular = ?', [Celular], (error, results) => {
                    if (error) {
                        console.error('Error al verificar el celular:', error.message);
                        return res.status(500).json({ success: false, message: 'Error al verificar el celular.' });
                    }
                    if (results.length > 0) {
                        return res.status(400).json({ success: false, message: 'El celular ya existe.' });
                    }

                    // Si todo está bien, insertar el nuevo proveedor
                    const query = `
                        INSERT INTO proveedores (Nit, Razon_social, Direccion, id_pais, id_dpto, id_cdad, Correo, Celular, Estado) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;
                    const values = [
                        Nit, Razon_social, Direccion, id_pais, id_dpto, id_cdad, Correo, Celular, Estado
                    ];

                    connection.query(query, values, (error, results) => {
                        if (error) {
                            console.error('Error al registrar el proveedor:', error.message);
                            return res.status(500).json({ success: false, message: 'Error al registrar el proveedor.', error: error.message });
                        }

                        res.json({ success: true, message: 'Registro de proveedor exitoso.' });
                    });
                });
            });
        });
    });
});

// Ruta para actualizar un proveedor
app.put('/api/proveedor/:id', (req, res) => {
    const id = req.params.id;
    const { Nit, Razon_social, Direccion, id_pais, id_dpto, id_cdad, Correo, Celular, Estado } = req.body;

    const query = `
        UPDATE proveedores
        SET Nit = ?, Razon_social = ?, Direccion = ?, id_pais = ?, id_dpto = ?, id_cdad = ?, Correo = ?, Celular = ?, Estado = ?
        WHERE Nit = ?
    `;
    const values = [
        Nit, Razon_social, Direccion, id_pais, id_dpto, id_cdad, Correo, Celular, Estado, id
    ];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error al actualizar el proveedor:', error.message);
            return res.status(500).json({ success: false, message: 'Error al actualizar el proveedor.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Proveedor no encontrado.' });
        }
        res.json({ success: true, message: 'Proveedor actualizado exitosamente.' });
    });
});

// Ruta para eliminar un proveedor
app.delete('/api/proveedor/:id', (req, res) => {
    const id = req.params.id;

    connection.query('DELETE FROM proveedores WHERE Nit = ?', [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar el proveedor:', error.message);
            return res.status(500).json({ success: false, message: 'Error al eliminar el proveedor.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Proveedor no encontrado.' });
        }
        res.json({ success: true, message: 'Proveedor eliminado exitosamente.' });
    });
});

// Ruta para registrar un representante legal
app.post('/api/representante', (req, res) => {
    const { Id_repre_legal, Direccion, id_pais, id_dpto, id_ciud, Correo, Celular, Estado } = req.body;

    // Verificar si el Id_repre ya existe
    connection.query('SELECT * FROM representante_legal WHERE Id_repre_legal = ?', [Id_repre_legal], (error, results) => {
        if (error) {
            console.error('Error al verificar el Id_repre:', error.message);
            return res.status(500).json({ success: false, message: 'Error al verificar el Id_repre.' });
        }
        if (results.length > 0) {
            return res.status(400).json({ success: false, message: 'El Id_repre ya existe.' });
        }

        // Verificar si la Dirección ya existe
        connection.query('SELECT * FROM representante_legal WHERE Direccion = ?', [Direccion], (error, results) => {
            if (error) {
                console.error('Error al verificar la dirección:', error.message);
                return res.status(500).json({ success: false, message: 'Error al verificar la dirección.' });
            }
            if (results.length > 0) {
                return res.status(400).json({ success: false, message: 'La dirección ya existe.' });
            }

            // Verificar si el Correo ya existe
            connection.query('SELECT * FROM representante_legal WHERE Correo = ?', [Correo], (error, results) => {
                if (error) {
                    console.error('Error al verificar el correo:', error.message);
                    return res.status(500).json({ success: false, message: 'Error al verificar el correo.' });
                }
                if (results.length > 0) {
                    return res.status(400).json({ success: false, message: 'El correo ya existe.' });
                }

                // Verificar si el Celular ya existe
                connection.query('SELECT * FROM representante_legal WHERE Celular = ?', [Celular], (error, results) => {
                    if (error) {
                        console.error('Error al verificar el celular:', error.message);
                        return res.status(500).json({ success: false, message: 'Error al verificar el celular.' });
                    }
                    if (results.length > 0) {
                        return res.status(400).json({ success: false, message: 'El celular ya existe.' });
                    }

                    // Si todo está bien, insertar el nuevo representante legal
                    const query = `
                        INSERT INTO representante_legal (Id_repre_legal, Direccion, id_pais, id_dpto, id_ciud, Correo, Celular, Estado) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    `;
                    const values = [Id_repre_legal, Direccion, id_pais, id_dpto, id_ciud, Correo, Celular, Estado];

                    connection.query(query, values, (error, results) => {
                        if (error) {
                            console.error('Error al registrar el representante legal:', error.message);
                            return res.status(500).json({ success: false, message: 'Error al registrar el representante legal.', error: error.message });
                        }

                        res.json({ success: true, message: 'Registro de representante legal exitoso.' });
                    });
                });
            });
        });
    });
});

// Ruta para obtener todos los representantes legales
app.get('/api/representante', (req, res) => {
    connection.query('SELECT * FROM representante_legal', (error, results) => {
        if (error) {
            console.error('Error al obtener representantes legales:', error.message);
            return res.status(500).json({ success: false, message: 'Error al obtener representantes legales.' });
        }
        res.json(results); // Devuelve los resultados en formato JSON
    });
});

// Ruta para actualizar un representante legal
app.put('/api/representante', (req, res) => {
    const { Id_repre_legal, Direccion, id_pais, id_dpto, id_ciud, Correo, Celular, Estado } = req.body;

    // Actualizar el representante legal
    const query = `
        UPDATE representante_legal 
        SET Direccion = ?, id_pais = ?, id_dpto = ?, id_ciud = ?, Correo = ?, Celular = ?, Estado = ? 
        WHERE Id_repre_legal = ?
    `;
    const values = [Direccion, id_pais, id_dpto, id_ciud, Correo, Celular, Estado, Id_repre_legal];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error al actualizar el representante legal:', error.message);
            return res.status(500).json({ success: false, message: 'Error al actualizar el representante legal.', error: error.message });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Representante legal no encontrado.' });
        }

        res.json({ success: true, message: 'Representante legal actualizado exitosamente.' });
    });
});

// Ruta para eliminar un representante legal
app.delete('/api/representante/:id', (req, res) => {
    const id = req.params.id;

    // Eliminar el representante legal
    const query = 'DELETE FROM representante_legal WHERE Id_repre_legal = ?';
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar el representante legal:', error.message);
            return res.status(500).json({ success: false, message: 'Error al eliminar el representante legal.', error: error.message });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Representante legal no encontrado.' });
        }

        res.json({ success: true, message: 'Representante legal eliminado exitosamente.' });
    });
});



// Ruta para obtener todas las compras
app.get('/api/compra', (req, res) => {
    const query = 'SELECT * FROM compra LEFT JOIN detalle_compra ON compra.id_compra = detalle_compra.id_compra';
    connection.query(query, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Error al obtener compras', error: err });
        res.json(results);
    });
});

// Ruta para obtener una compra por ID
app.get('/api/compra/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM compra LEFT JOIN detalle_compra ON compra.id_compra = detalle_compra.id_compra WHERE compra.id_compra = ?';
    connection.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Error al obtener la compra', error: err });
        if (results.length === 0) return res.status(404).json({ success: false, message: 'Compra no encontrada' });
        res.json(results[0]);
    });
});

// Ruta para crear una nueva compra
app.post('/api/compra', (req, res) => {
    const { id_compra, Nit, Fecha, Valor, Iva, Total_pagar, id_productos, Cantidad, Estado } = req.body;

    console.log('Datos recibidos para crear la compra:', req.body);

    const queryCompra = 'INSERT INTO compra (id_compra, Nit, Fecha, Valor, Iva, Total_pagar, Estado) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const queryDetalle = 'INSERT INTO detalle_compra (id_compra, id_productos, Cantidad, Valor) VALUES (?, ?, ?, ?)';

    connection.beginTransaction((err) => {
        if (err) {
            console.error('Error en la transacción:', err);
            return res.status(500).json({ success: false, message: 'Error en la transacción', error: err });
        }

        connection.query(queryCompra, [id_compra, Nit, Fecha, Valor, Iva, Total_pagar, Estado], (err, result) => {
            if (err) {
                console.error('Error al agregar la compra:', err);
                return connection.rollback(() => res.status(500).json({ success: false, message: 'Error al agregar la compra', error: err }));
            }

            connection.query(queryDetalle, [id_compra, id_productos, Cantidad, Valor], (err) => {
                if (err) {
                    console.error('Error al agregar el detalle de la compra:', err);
                    return connection.rollback(() => res.status(500).json({ success: false, message: 'Error al agregar el detalle de la compra', error: err }));
                }

                connection.commit((err) => {
                    if (err) {
                        console.error('Error en el commit:', err);
                        return connection.rollback(() => res.status(500).json({ success: false, message: 'Error en el commit de la transacción', error: err }));
                    }
                    res.json({ success: true, message: 'Compra agregada correctamente' });
                });
            });
        });
    });
});

// Ruta para actualizar una compra
app.put('/api/compra/:id', (req, res) => {
    const { id } = req.params;
    const { Nit, Fecha, Valor, Iva, Total_pagar, id_productos, Cantidad, Estado } = req.body;

    const queryCompra = 'UPDATE compra SET Nit = ?, Fecha = ?, Valor = ?, Iva = ?, Total_pagar = ? WHERE id_compra = ?';
    const queryDetalle = 'UPDATE detalle_compra SET id_productos = ?, Cantidad = ?, Estado = ? WHERE id_compra = ?';

    connection.beginTransaction((err) => {
        if (err) return res.status(500).json({ success: false, message: 'Error en la transacción', error: err });

        connection.query(queryCompra, [Nit, Fecha, Valor, Iva, Total_pagar, id], (err) => {
            if (err) return connection.rollback(() => res.status(500).json({ success: false, message: 'Error al actualizar la compra', error: err }));

            connection.query(queryDetalle, [id_productos, Cantidad, Estado, id], (err) => {
                if (err) return connection.rollback(() => res.status(500).json({ success: false, message: 'Error al actualizar el detalle de la compra', error: err }));

                connection.commit((err) => {
                    if (err) return connection.rollback(() => res.status(500).json({ success: false, message: 'Error en la transacción', error: err }));
                    res.json({ success: true, message: 'Compra actualizada correctamente' });
                });
            });
        });
    });
});

// Ruta para eliminar una compra
app.delete('/api/compra/:id', (req, res) => {
    const { id } = req.params;

    const queryDetalle = 'DELETE FROM detalle_compra WHERE id_compra = ?';
    const queryCompra = 'DELETE FROM compra WHERE id_compra = ?';

    connection.beginTransaction((err) => {
        if (err) return res.status(500).json({ success: false, message: 'Error en la transacción', error: err });

        connection.query(queryDetalle, [id], (err) => {
            if (err) return connection.rollback(() => res.status(500).json({ success: false, message: 'Error al eliminar el detalle de la compra', error: err }));

            connection.query(queryCompra, [id], (err) => {
                if (err) return connection.rollback(() => res.status(500).json({ success: false, message: 'Error al eliminar la compra', error: err }));

                connection.commit((err) => {
                    if (err) return connection.rollback(() => res.status(500).json({ success: false, message: 'Error en la transacción', error: err }));
                    res.json({ success: true, message: 'Compra eliminada correctamente' });
                });
            });
        });
    });
});




// Ruta para obtener todos los países
app.get('/api/pais', (req, res) => {
    const query = 'SELECT * FROM pais';

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener los países:', error.message);
            return res.status(500).json({ success: false, message: 'Error al obtener los países.' });
        }

        res.json(results);
    });
});

// Ruta para registrar un país
app.post('/api/pais', (req, res) => {
    const { id_pais, Nombre, Estado } = req.body;

    // Verificar si el ID País ya existe
    connection.query('SELECT * FROM pais WHERE id_pais = ?', [id_pais], (error, results) => {
        if (error) {
            console.error('Error al verificar el ID País:', error.message);
            return res.status(500).json({ success: false, message: 'Error al verificar el ID País.' });
        }
        if (results.length > 0) {
            return res.status(400).json({ success: false, message: 'El ID País ya existe.' });
        }

        // Insertar en la tabla pais
        const query = `
            INSERT INTO pais (id_pais, Nombre, Estado) 
            VALUES (?, ?, ?)
        `;
        const values = [id_pais, Nombre, Estado];

        connection.query(query, values, (error, results) => {
            if (error) {
                console.error('Error al registrar el país:', error.message);
                return res.status(500).json({ success: false, message: 'Error al registrar el país.' });
            }

            res.json({ success: true, message: 'País registrado con éxito.' });
        });
    });
});

// Ruta para actualizar un país
app.put('/api/pais/:id', (req, res) => {
    const { id } = req.params;
    const { Nombre, Estado } = req.body;

    const query = `
        UPDATE pais
        SET Nombre = ?, Estado = ?
        WHERE id_pais = ?
    `;
    const values = [Nombre, Estado, id];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error al actualizar el país:', error.message);
            return res.status(500).json({ success: false, message: 'Error al actualizar el país.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'País no encontrado.' });
        }

        res.json({ success: true, message: 'País actualizado con éxito.' });
    });
});

// Ruta para eliminar un país
app.delete('/api/pais/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM pais WHERE id_pais = ?';
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar el país:', error.message);
            return res.status(500).json({ success: false, message: 'Error al eliminar el país.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'País no encontrado.' });
        }

        res.json({ success: true, message: 'País eliminado con éxito.' });
    });
});


// Ruta para obtener todos los departamentos
app.get('/api/departamento', (req, res) => {
    const query = 'SELECT * FROM departamento';

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener los departamentos:', error.message);
            return res.status(500).json({ success: false, message: 'Error al obtener los departamentos.' });
        }

        res.json(results);
    });
});

// Ruta para registrar un departamento
app.post('/api/departamento', (req, res) => {
    const { id_dpto, id_pais, Nombre, Estado } = req.body;  // Cambio de id_país a id_pais

    // Verificar si el ID Departamento ya existe
    connection.query('SELECT * FROM departamento WHERE id_dpto = ? AND id_pais = ?', [id_dpto, id_pais], (error, results) => {
        if (error) {
            console.error('Error al verificar el departamento:', error.message);
            return res.status(500).json({ success: false, message: 'Error al verificar el departamento.' });
        }

        if (results.length > 0) {
            return res.status(400).json({ success: false, message: 'El departamento ya existe.' });
        }

        const query = 'INSERT INTO departamento (id_dpto, id_pais, Nombre, Estado) VALUES (?, ?, ?, ?)';

        connection.query(query, [id_dpto, id_pais, Nombre, Estado], (error) => {
            if (error) {
                console.error('Error al registrar el departamento:', error.message);
                return res.status(500).json({ success: false, message: 'Error al registrar el departamento.' });
            }

            res.json({ success: true, message: 'Departamento registrado exitosamente.' });
        });
    });
});

// Ruta para editar un departamento
app.put('/api/departamento/:id_dpto/:id_pais', (req, res) => {
    const { id_dpto, id_pais } = req.params;
    const { Nombre, Estado } = req.body;

    const query = 'UPDATE departamento SET Nombre = ?, estado = ? WHERE id_dpto = ? AND id_pais = ?';

    connection.query(query, [Nombre, Estado, id_dpto, id_pais], (error) => {
        if (error) {
            console.error('Error al actualizar el departamento:', error.message);
            return res.status(500).json({ success: false, message: 'Error al actualizar el departamento.' });
        }

        res.json({ success: true, message: 'Departamento actualizado exitosamente.' });
    });
});

// Ruta para eliminar un departamento
app.delete('/api/departamento/:id_dpto/:id_pais', (req, res) => {
    const { id_dpto, id_pais } = req.params;

    const query = 'DELETE FROM departamento WHERE id_dpto = ? AND id_pais = ?';

    connection.query(query, [id_dpto, id_pais], (error) => {
        if (error) {
            console.error('Error al eliminar el departamento:', error.message);
            return res.status(500).json({ success: false, message: 'Error al eliminar el departamento.' });
        }

        res.json({ success: true, message: 'Departamento eliminado exitosamente.' });
    });
});



// Obtener todas las ciudades
app.get('/api/cuidad', (req, res) => {
    connection.query('SELECT * FROM cuidad', (error, results) => {
        if (error) {
            console.error('Error al obtener las ciudades:', error.message);
            return res.status(500).json({ success: false, message: 'Error al obtener las ciudades.' });
        }
        res.json({ success: true, data: results });
    });
});

// Crear una nueva ciudad
app.post('/api/cuidad', (req, res) => {
    const { id_cdad, id_dpto, nombre, estado } = req.body;

    // Comprobar si el ID ya existe en la base de datos
    connection.query('SELECT * FROM cuidad WHERE id_cdad = ? AND id_dpto = ?', [id_cdad, id_dpto], (error, results) => {
        if (error) {
            console.error('Error al verificar el ID:', error.message);
            return res.status(500).json({ success: false, message: 'Error al verificar el ID.' });
        }

        if (results.length > 0) {
            return res.status(400).json({ success: false, message: 'El ID ya existe en la base de datos.' });
        }

        // Insertar la nueva ciudad en la base de datos
        connection.query('INSERT INTO cuidad (id_cdad, id_dpto, nombre, estado) VALUES (?, ?, ?, ?)', [id_cdad, id_dpto, nombre, estado], (error) => {
            if (error) {
                console.error('Error al registrar la ciudad:', error.message);
                return res.status(500).json({ success: false, message: 'Error al registrar la ciudad.' });
            }
            res.json({ success: true, message: 'Ciudad registrada correctamente.' });
        });
    });
});

// Editar una ciudad existente
app.put('/api/cuidad/:id_cdad/:id_dpto', (req, res) => {
    const { id_cdad, id_dpto } = req.params;
    const { nombre, estado } = req.body;

    connection.query('UPDATE cuidad SET nombre = ?, estado = ? WHERE id_cdad = ? AND id_dpto = ?', [nombre, estado, id_cdad, id_dpto], (error, results) => {
        if (error) {
            console.error('Error al editar la ciudad:', error.message);
            return res.status(500).json({ success: false, message: 'Error al editar la ciudad.' });
        }
        res.json({ success: true, message: 'Ciudad editada correctamente.' });
    });
});

// Eliminar una ciudad existente
app.delete('/api/cuidad/:id_cdad/:id_dpto', (req, res) => {
    const { id_cdad, id_dpto } = req.params;

    connection.query('DELETE FROM cuidad WHERE id_cdad = ? AND id_dpto = ?', [id_cdad, id_dpto], (error, results) => {
        if (error) {
            console.error('Error al eliminar la ciudad:', error.message);
            return res.status(500).json({ success: false, message: 'Error al eliminar la ciudad.' });
        }
        res.json({ success: true, message: 'Ciudad eliminada correctamente.' });
    });
});


// Ruta para procesar el formulario de perfil
app.post('/api/perfil', (req, res) => {
    const { id_perfil, Descripcion, Estado } = req.body;

    // Verificar si el ID de perfil ya existe
    connection.query('SELECT * FROM perfil WHERE id_perfil = ?', [id_perfil], (error, results) => {
        if (error) {
            console.error('Error al verificar el ID de perfil:', error.message);
            return res.status(500).json({ success: false, message: 'Error al verificar el ID de perfil.' });
        }

        if (results.length > 0) {
            return res.status(400).json({ success: false, message: 'El ID de perfil ya existe.' });
        }

        // Insertar el nuevo perfil
        const query = `
            INSERT INTO perfil (id_perfil, Descripcion, Estado) 
            VALUES (?, ?, ?)
        `;
        const values = [id_perfil, Descripcion, Estado];

        connection.query(query, values, (error, results) => {
            if (error) {
                console.error('Error al registrar el perfil:', error.message);
                return res.status(500).json({ success: false, message: 'Error al registrar el perfil.' });
            }

            res.json({ success: true, message: 'Perfil registrado exitosamente.' });
        });
    });
});

// Ruta para obtener informe
app.get('/api/informe', (req, res) => {
    const { fechaInicial, fechaFinal, gestion } = req.query;

    if (!gestion) {
        return res.status(400).json({ success: false, message: 'El parámetro "gestion" es obligatorio.' });
    }

    let query = '';
    let params = [];

    switch (gestion) {
        case 'compra':
            query = 'SELECT * FROM compra WHERE Fecha BETWEEN ? AND ?';
            params = [fechaInicial, fechaFinal];
            break;
        case 'venta':
            query = 'SELECT * FROM venta WHERE Fecha BETWEEN ? AND ?';
            params = [fechaInicial, fechaFinal];
            break;
        case 'nota_de_credito':
            query = 'SELECT * FROM nota_de_credito WHERE Fech_factra BETWEEN ? AND ?';
            params = [fechaInicial, fechaFinal];
            break;
        case 'productos':
            query = 'SELECT * FROM productos';
            break;
        case 'inventario':
            query = 'SELECT * FROM inventario';
            break;
        default:
            return res.status(400).json({ success: false, message: 'Gestión no válida.' });
    }

    connection.query(query, params, (error, results) => {
        if (error) {
            console.error('Error al obtener el informe:', error.message);
            return res.status(500).json({ success: false, message: 'Error al obtener el informe.' });
        }

        console.log(results); // Log para verificar los resultados
        res.json(results);
    });
});


app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});

