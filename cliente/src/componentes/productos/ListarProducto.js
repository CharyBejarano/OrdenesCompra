import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col, Form, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import productoService from '../../services/apiProductos';

const ListarProducto = () => {
    const [productos, setProductos] = useState([]);
    const [idBusqueda, setIdBusqueda] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paginaActual, setPaginaActual] = useState(1);
    const [productosPorPagina] = useState(10);

    const totalPaginas = Math.ceil(productos.length / productosPorPagina);

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        try {
            setLoading(true);
            const data = await productoService.getProductos();
            setProductos(data);
            setError(null);
        } catch (error) {
            setError('Error al cargar los productos');
        } finally {
            setLoading(false);
        }
    };

    const buscarProductoPorId = async () => {
        if (!idBusqueda) return;

        try {
            setLoading(true);
            const producto = await productoService.getProductoPorId(idBusqueda);
            setProductos(producto ? [producto] : []);
            setPaginaActual(1); // Resetear página al buscar
            setError(null);
        } catch (error) {
            setError('Producto no encontrado o error al buscar');
            setProductos([]);
        } finally {
            setLoading(false);
        }
    };

    const eliminarProducto = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este producto?')) {
            try {
                setLoading(true);
                await productoService.eliminarProducto(id);
                setProductos(productos.filter(producto => producto.id !== id));
                setError(null);
            } catch (error) {
                setError('Error al eliminar producto');
            } finally {
                setLoading(false);
            }
        }
    };

    const productosPaginados = productos.slice(
        (paginaActual - 1) * productosPorPagina,
        paginaActual * productosPorPagina
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
                    <h2>Lista de Productos</h2>
                </Col>
                <Col className='text-end'>
                    <Button as={Link} to="/productos/agregar" variant="primary">Crear Producto</Button>
                </Col>
            </Row>

            <Form className="mb-3">
                <Row>
                    <Col md={10}>
                        <Form.Control
                            type="number"
                            placeholder="Buscar producto por ID"
                            value={idBusqueda}
                            onChange={(e) => setIdBusqueda(e.target.value)}
                        />
                    </Col>
                    <Col md={2}>
                        <Button variant='outline-success' className='w-100' onClick={buscarProductoPorId}>Buscar</Button>
                        <Button
                            variant='outline-secondary'
                            className='w-100 mt-2'
                            onClick={() => {
                                setIdBusqueda('');
                                setPaginaActual(1);
                                cargarProductos();
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
                        <th>Nombre del Producto</th>
                        <th>Precio Unitario</th>
                        <th>Paquete</th>
                        <th>Discontinuado</th>
                        <th>ID Proveedor</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productosPaginados.map((producto) => (
                        <tr key={producto.id}>
                            <td>{producto.id}</td>
                            <td>{producto.productName}</td>
                            <td>${producto.unitPrice?.toFixed(2)}</td>
                            <td>{producto.package}</td>
                            <td>{producto.isDiscontinued ? 'Sí' : 'No'}</td>
                            <td>{producto.supplierId}</td>
                            <td>
                                <Button as={Link} to={`/productos/editar/${producto.id}`} variant="warning" size='sm' className='me-2'>Editar</Button>
                                <Button variant='danger' size='sm' onClick={() => eliminarProducto(producto.id)}>Eliminar</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Paginación mejorada */}
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

export default ListarProducto;



