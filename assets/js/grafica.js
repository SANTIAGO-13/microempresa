import { Bar } from "react-chartjs-2";
import { Chart as Chartjs, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

Chartjs.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

async function obtenerDatosDeVentas() {
    try {
        const response = await fetch('http://localhost:3000/api/ventas');
        const data = await response.json();

        const labels = data.map(item => item.mes);
        const ventas = data.map(item => item.ventas);

        return { labels, ventas };
    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }
}

async function graficaLinea() {
    const datos = await obtenerDatosDeVentas();

    const ctx = document.getElementById('myChart').getContext('2d');
    new Chartjs(ctx, {
        type: 'bar',
        data: {
            labels: datos.labels,
            datasets: [{
                label: 'Ventas vendidas',
                data: datos.ventas,
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Ventas Mensuales' }
            }
        }
    });
}

window.onload = graficaLinea;

