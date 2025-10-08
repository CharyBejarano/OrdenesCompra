import React, { useEffect, useState } from 'react';
import ordenService from '../services/ordenService'; // Servicio para obtener datos de órdenes
import {
  Bar,
  Line,
  Pie,
} from 'react-chartjs-2'; // Componentes de gráficos de Chart.js para React
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar los elementos que usaremos en Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // Estados para almacenar datos que alimentarán los gráficos
  const [dataMes, setDataMes] = useState([]); // Datos órdenes por mes
  const [dataVentas, setDataVentas] = useState([]); // Datos ventas por mes
  const [dataClientes, setDataClientes] = useState([]); // Datos órdenes por cliente
  const [dataRangos, setDataRangos] = useState([]); // Datos distribución de totales por rango
  const [loading, setLoading] = useState(false); // Estado de carga para mostrar mensaje mientras se obtienen datos

  // Hook para ejecutar la función de carga de datos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Indicar que estamos cargando datos

        // Obtener todas las órdenes desde el servicio
        const ordenes = await ordenService.getOrdenes();

        // Variables para agrupar los datos
        const ordenesPorMes = {};
        const ventasPorMes = {};
        const ordenesPorCliente = {};
        const rangosTotales = {
          '0–500': 0,
          '501–1000': 0,
          '1001–2000': 0,
          '+2000': 0,
        };

        // Procesar cada orden para agrupar datos
        ordenes.forEach((orden) => {
          const fecha = new Date(orden.orderDate);
          // Obtener el mes en formato corto y español (ej: 'ene', 'feb')
          const mes = fecha.toLocaleString('es-ES', { month: 'short' });
          const total = parseFloat(orden.totalAmount); // Total de la orden como número
          const clienteId = orden.customerId; // ID del cliente

          // Contar cantidad de órdenes por mes
          ordenesPorMes[mes] = (ordenesPorMes[mes] || 0) + 1;

          // Sumar ventas totales por mes
          ventasPorMes[mes] = (ventasPorMes[mes] || 0) + total;

          // Contar órdenes por cliente
          ordenesPorCliente[clienteId] = (ordenesPorCliente[clienteId] || 0) + 1;

          // Clasificar la orden en un rango de monto total
          if (total <= 500) rangosTotales['0–500']++;
          else if (total <= 1000) rangosTotales['501–1000']++;
          else if (total <= 2000) rangosTotales['1001–2000']++;
          else rangosTotales['+2000']++;
        });

        // Convertir los objetos a arrays que usan los gráficos
        setDataMes(
          Object.entries(ordenesPorMes).map(([mes, ordenes]) => ({ mes, ordenes }))
        );
        setDataVentas(
          Object.entries(ventasPorMes).map(([mes, total]) => ({ mes, total }))
        );
        setDataClientes(
          Object.entries(ordenesPorCliente).map(([clienteId, ordenes]) => ({
            clienteId,
            ordenes,
          }))
        );
        setDataRangos(
          Object.entries(rangosTotales).map(([rango, cantidad]) => ({
            rango,
            cantidad,
          }))
        );
      } catch (error) {
        // Mostrar error en consola si falla la obtención de datos
        console.error('Error al obtener las órdenes:', error);
      } finally {
        setLoading(false); // Termina la carga de datos
      }
    };

    fetchData(); // Ejecutar la función de carga al montar componente
  }, []);

  // Colores para la gráfica de pastel
  const colores = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e'];

  // Mostrar mensaje mientras se cargan los datos
  if (loading) return <p style={{ textAlign: 'center' }}>Cargando datos...</p>;

  // Configuración de datos para la gráfica de órdenes por mes (barra)
  const ordenesPorMesData = {
    labels: dataMes.map((d) => d.mes),
    datasets: [
      {
        label: 'Órdenes',
        data: dataMes.map((d) => d.ordenes),
        backgroundColor: '#4e73df',
        borderRadius: 5, // Bordes redondeados para barras
      },
    ],
  };

  // Configuración de datos para la gráfica de ventas por mes (línea)
  const ventasPorMesData = {
    labels: dataVentas.map((d) => d.mes),
    datasets: [
      {
        label: 'Ventas',
        data: dataVentas.map((d) => d.total),
        borderColor: '#1cc88a',
        backgroundColor: 'rgba(28, 200, 138, 0.2)', // Color con transparencia para relleno bajo línea
        fill: true,
        tension: 0.3, // Curvatura suave de línea
        pointRadius: 4, // Tamaño puntos
        pointBackgroundColor: '#1cc88a',
      },
    ],
  };

const topClientes = dataClientes
  .sort((a, b) => b.ordenes - a.ordenes)  // Orden descendente por cantidad de órdenes
  .slice(0, 20); // Tomar solo los primeros 20

// Configuración de datos para gráfica de órdenes por cliente (barra)
const clientesData = {
  labels: topClientes.map((d) => d.clienteId),
  datasets: [
    {
      label: 'Órdenes',
      data: topClientes.map((d) => d.ordenes),
      backgroundColor: '#36b9cc',
      borderRadius: 5,
    },
  ],
};

  // Configuración de datos para gráfica de distribución por rango (pastel)
  const rangosData = {
    labels: dataRangos.map((d) => d.rango),
    datasets: [
      {
        label: 'Cantidad',
        data: dataRangos.map((d) => d.cantidad),
        backgroundColor: colores,
        hoverOffset: 30, // Efecto al pasar el cursor en la gráfica de pastel
      },
    ],
  };

  // Opciones comunes para todos los gráficos para mejorar visualización y responsividad
  const commonOptions = {
    plugins: {
      legend: { position: 'top' }, // Leyenda arriba
      tooltip: { enabled: true }, // Tooltips activos
    },
    responsive: true,
    maintainAspectRatio: false, // Para que la altura se adapte al contenedor
  };

  return (
    // Contenedor principal centrado y con max width para que no se extienda demasiado
    <div
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: 20,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Título principal del dashboard */}
      <h1
        style={{
          textAlign: 'center',
          marginBottom: 40,
          color: '#333',
        }}
      >
        Dashboard de Órdenes y Ventas
      </h1>

      {/* Contenedor superior con las dos primeras gráficas una al lado de la otra */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 40 }}>
        {/* Gráfica: Órdenes por Mes */}
        <div style={containerStyle}>
          <h3 style={titleStyle}>Total de Órdenes por Mes</h3>
          <div style={{ height: 300 }}>
            <Bar
              data={ordenesPorMesData}
              options={{ ...commonOptions, scales: { y: { beginAtZero: true } } }}
            />
          </div>
        </div>

        {/* Gráfica: Ventas por Mes (línea) */}
        <div style={containerStyle}>
          <h3 style={titleStyle}>Total de Ventas por Mes</h3>
          <div style={{ height: 300 }}>
            <Line
              data={ventasPorMesData}
              options={{ ...commonOptions, scales: { y: { beginAtZero: true } } }}
            />
          </div>
        </div>
      </div>

      {/* Gráfica: Clientes con más Órdenes */}
      <div style={{ ...containerStyle, marginBottom: 40 }}>
        <h3 style={titleStyle}>Clientes con más Órdenes</h3>
        <div style={{ height: 300 }}>
          <Bar
            data={clientesData}
            options={{ ...commonOptions, scales: { y: { beginAtZero: true } } }}
          />
        </div>
      </div>

      {/* Gráfica: Distribución de Totales por Rango */}
      <div style={{ ...containerStyle, marginBottom: 40 }}>
        <h3 style={titleStyle}>Distribución de Totales por Rango</h3>
        <div style={{ height: 300 }}>
          <Pie data={rangosData} options={commonOptions} />
        </div>
      </div>
    </div>
  );
};

// Estilos reutilizables para los contenedores de gráficos
const containerStyle = {
  flex: 1, // Para que el flex padre reparta el espacio equitativamente
  backgroundColor: '#fff',
  borderRadius: 10,
  padding: 20,
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)', // Sombra suave para elevar el contenedor
};

// Estilo para títulos de gráficos
const titleStyle = {
  marginBottom: 20,
  color: '#555',
  fontWeight: '600',
};

export default Dashboard;






