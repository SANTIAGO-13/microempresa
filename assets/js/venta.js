// Redirige a la página de gestión
function redirectToGestion() {
    window.location.href = 'gestion.html';
}

// Muestra el menú y redirige a las páginas correspondientes
function showMenu() {
    const option = prompt('Selecciona una opción:\n1. Agregar cliente\n2. Agregar nota de crédito');
    switch(option) {
        case '1':
            window.location.href = 'cliente.html';
            break;
        case '2':
            window.location.href = 'notacredito.html';
            break;
        default:
            alert('Opción no válida.');
    }
}

// Función para enviar los datos del formulario al servidor
document.getElementById('venta-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const id_venta = document.getElementById('venta-id').value; // Usa el valor ingresado en el formulario

    const ventaData = {
        id_venta: id_venta, // Ahora toma el id_venta del formulario
        id_cliente: document.getElementById('cliente-id').value,
        Fecha: document.getElementById('fecha').value,
        Valor: document.getElementById('valor').value,
        Iva: document.getElementById('iva').value,
        id_productos: document.getElementById('producto-id').value,
        Cantidad: document.getElementById('cantidad').value,
        Valor_unitario: document.getElementById('valor-unitario').value,
        Total_pagar: document.getElementById('total-pagar').value,
        Estado: document.getElementById('estado').value
    };

    console.log(ventaData); // Verifica qué datos se están enviando

    const url = '/api/venta';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ventaData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Venta registrada exitosamente.');
            loadVentas();
            document.getElementById('venta-form').reset(); // Reinicia el formulario
        } else {
            alert('Error al registrar la venta: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al registrar la venta: ' + error.message);
    });
});

// Función para cargar las ventas al cargar la página
function loadVentas() {
    fetch('/api/venta')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('venta-table').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ''; // Limpiar la tabla antes de cargar nuevos datos

            data.forEach(venta => {
                const fecha = new Date(venta.Fecha);
                const opciones = { year: 'numeric', month: '2-digit', day: '2-digit' };
                const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${venta.id_venta}</td>
                    <td>${venta.id_cliente}</td>
                    <td>${fechaFormateada}</td>
                    <td>${venta.Valor}</td>
                    <td>${venta.Iva}</td>
                    <td>${venta.id_productos}</td>
                    <td>${venta.Cantidad}</td>
                    <td>${venta.Valor_unitario}</td>
                    <td>${venta.Total_pagar}</td>
                    <td>${venta.Estado}</td>
                    <td>
                        <button class="edit-button" onclick="editRow(this)">Editar</button>
                        <button class="delete-button" onclick="deleteRow(this)">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error al cargar las ventas:', error);
        });
}

// Función para editar una fila
function editRow(button) {
    const row = button.parentElement.parentElement;
    const cells = row.getElementsByTagName('td');

    document.getElementById('venta-id').value = cells[0].innerText;
    document.getElementById('cliente-id').value = cells[1].innerText;
    document.getElementById('fecha').value = cells[2].innerText;
    document.getElementById('valor').value = cells[3].innerText;
    document.getElementById('iva').value = cells[4].innerText;
    document.getElementById('producto-id').value = cells[5].innerText;
    document.getElementById('cantidad').value = cells[6].innerText;
    document.getElementById('valor-unitario').value = cells[7].innerText;
    document.getElementById('total-pagar').value = cells[8].innerText;
    document.getElementById('estado').value = cells[9].innerText;
}

// Función para eliminar una fila
function deleteRow(button) {
    if (confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
        const row = button.parentElement.parentElement;
        const id = row.getElementsByTagName('td')[0].innerText;

        fetch(`/api/venta/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Venta eliminada exitosamente.');
                row.remove();
            } else {
                alert('Error al eliminar la venta.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al eliminar la venta.');
        });
    }
}

// Cargar las ventas cuando se carga la página
window.onload = loadVentas;









