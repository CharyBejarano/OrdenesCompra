import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col, Form, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ordenService from '../../services/ordenService'; // Asegúrate de tener este servicio creado

const ListarOrdenes = () => {
    const [ordenes, setOrdenes] = useState([]);
    const [idBusqueda, setIdBusqueda] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paginaActual, setPaginaActual] = useState(1);
    const [ordenesPorPagina] = useState(10);

    const totalPaginas = Math.ceil(ordenes.length / ordenesPorPagina);

    useEffect(() => {
        cargarOrdenes();
    }, []);

    const cargarOrdenes = async () => {
        try {
            setLoading(true);
            const data = await ordenService.getOrdenes();
            setOrdenes(data);
            setError(null);
        } catch (error) {
            setError('Error al cargar las órdenes');
        } finally {
            setLoading(false);
        }
    };

    const buscarOrdenPorId = async () => {
        if (!idBusqueda) return;

        try {
            setLoading(true);
            const orden = await ordenService.getOrdenPorId(idBusqueda);
            setOrdenes(orden ? [orden] : []);
            setPaginaActual(1);
            setError(null);
        } catch (error) {
            setError('Orden no encontrada o error al buscar');
            setOrdenes([]);
        } finally {
            setLoading(false);
        }
    };

    const ordenesPaginadas = ordenes.slice(
        (paginaActual - 1) * ordenesPorPagina,
        paginaActual * ordenesPorPagina
    );

    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
            setPaginaActual(nuevaPagina);
        }
    };

    if (loading) return <Spinner animation='border' variant='primary' />;
    if (error) return <Alert variant='danger'>{error}</Alert>;

    return (
        <Container>
            <Row className="mb-4">
                <Col>
                    <h2>Lista de órdenes</h2>
                </Col>
                <Col className='text-end'>
                    <Button as={Link} to="/ordenes/Agregar" variant="primary">Crear Orden</Button>
                </Col>
            </Row>

            {/* Buscar por ID */}
            <Form className="mb-3">
                <Row>
                    <Col md={10}>
                        <Form.Control
                            type="number"
                            placeholder="Buscar por ID"
                            value={idBusqueda}
                            onChange={(e) => setIdBusqueda(e.target.value)}
                        />
                    </Col>
                    <Col md={2}>
                        <Button variant='outline-success' className='w-100' onClick={buscarOrdenPorId}>
                            Buscar por ID
                        </Button>
                        <Button
                            variant='outline-secondary'
                            className='w-100 mt-2'
                            onClick={() => {
                                setIdBusqueda('');
                                setPaginaActual(1);
                                cargarOrdenes();
                            }}
                        >
                            Limpiar
                        </Button>
                    </Col>
                </Row>
            </Form>

            {/* Tabla */}
            <Table striped bordered hover responsive className="mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Número de Orden</th>
                        <th>ID Cliente</th>
                        <th>Total</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ordenesPaginadas.map((orden) => (
                        <tr key={orden.id}>
                            <td>{orden.id}</td>
                            <td>{new Date(orden.orderDate).toLocaleDateString()}</td>
                            <td>{orden.orderNumber}</td>
                            <td>{orden.customerId}</td>
                            <td>${orden.totalAmount.toFixed(2)}</td>
                            <td>
                                <Button
                                    as={Link}
                                    to={`/ordenes/editar/${orden.id}`}
                                    variant="warning"
                                    size="sm"
                                    className="me-2"
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => alert('Eliminar orden aún no implementado')}
                                >
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Paginación */}
            <Row className="mt-4">
                <Col className="d-flex justify-content-center align-items-center gap-2 flex-wrap">
                    <Button
                        variant="outline-primary"
                        onClick={() => cambiarPagina(1)}
                        disabled={paginaActual === 1}
                    >
                        ⏮ Primera
                    </Button>

                    <Button
                        variant="outline-primary"
                        onClick={() => cambiarPagina(paginaActual - 1)}
                        disabled={paginaActual === 1}
                    >
                        ◀ Anterior
                    </Button>

                    <span className="fw-bold">
                        Página {paginaActual} de {totalPaginas}
                    </span>

                    <Button
                        variant="outline-primary"
                        onClick={() => cambiarPagina(paginaActual + 1)}
                        disabled={paginaActual === totalPaginas}
                    >
                        Siguiente ▶
                    </Button>

                    <Button
                        variant="outline-primary"
                        onClick={() => cambiarPagina(totalPaginas)}
                        disabled={paginaActual === totalPaginas}
                    >
                        Última ⏭
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default ListarOrdenes;


