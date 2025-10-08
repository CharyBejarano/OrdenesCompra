import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col, Form, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import proveedorService from '../../services/apiProveedores';

const ListarProveedor = () => {
    const [proveedores, setProveedores] = useState([]);
    const [idBusqueda, setIdBusqueda] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paginaActual, setPaginaActual] = useState(1);
    const [proveedoresPorPagina] = useState(10);

    const totalPaginas = Math.ceil(proveedores.length / proveedoresPorPagina);

    useEffect(() => {
        cargarProveedores();
    }, []);

    const cargarProveedores = async () => {
        try {
            setLoading(true);
            const data = await proveedorService.getProveedores();
            setProveedores(data);
            setError(null);
        } catch (error) {
            setError('Error al cargar los proveedores');
        } finally {
            setLoading(false);
        }
    };

    const buscarProveedorPorId = async () => {
        if (!idBusqueda) return;

        try {
            setLoading(true);
            const proveedor = await proveedorService.getProveedorPorId(idBusqueda);
            setProveedores(proveedor ? [proveedor] : []);
            setPaginaActual(1); // Resetear página al buscar
            setError(null);
        } catch (error) {
            setError('Proveedor no encontrado o error al buscar');
            setProveedores([]);
        } finally {
            setLoading(false);
        }
    };

    const eliminarProveedor = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este proveedor?')) {
            try {
                setLoading(true);
                await proveedorService.eliminarProveedor(id);
                setProveedores(proveedores.filter(proveedor => proveedor.id !== id));
                setError(null);
            } catch (error) {
                setError('Error al eliminar proveedor');
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    };

    // Obtener los proveedores de la página actual
    const proveedoresPaginados = proveedores.slice(
        (paginaActual - 1) * proveedoresPorPagina,
        paginaActual * proveedoresPorPagina
    );

    // Cambiar de página con validación de límites
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
                    <h2>Lista de Proveedores</h2>
                </Col>
                <Col className='text-end'>
                    <Button as={Link} to="/proveedores/Agregar" variant="primary">Crear Proveedor</Button>
                </Col>
            </Row>

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
                        <Button variant='outline-success' className='w-100' onClick={buscarProveedorPorId}>Buscar por ID</Button>
                        <Button
                            variant='outline-secondary'
                            className='w-100 mt-2'
                            onClick={() => {
                                setIdBusqueda('');
                                setPaginaActual(1);
                                cargarProveedores();
                            }}
                        >
                            Limpiar
                        </Button>
                    </Col>
                </Row>
            </Form>

            <Table striped bordered hover responsive className="mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre de Compañía</th>
                        <th>Contacto</th>
                        <th>Ciudad</th>
                        <th>País</th>
                        <th>Teléfono</th>
                        <th>Email</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {proveedoresPaginados.map((proveedor) => (
                        <tr key={proveedor.id}>
                            <td>{proveedor.id}</td>
                            <td>{proveedor.companyName}</td>
                            <td>{proveedor.contactName}</td>
                            <td>{proveedor.city}</td>
                            <td>{proveedor.country}</td>
                            <td>{proveedor.phone}</td>
                            <td>{proveedor.email}</td>
                            <td>
                                <Button as={Link} to={`/proveedores/editar/${proveedor.id}`} variant="warning" size='sm' className='me-2'>Editar</Button>
                                <Button variant='danger' size='sm' onClick={() => eliminarProveedor(proveedor.id)}>Eliminar</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Paginación completa */}
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

export default ListarProveedor;

