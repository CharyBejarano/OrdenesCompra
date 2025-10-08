import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col, Form, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import clienteService from '../../services/api';

const ListarCliente = () => {
    const [clientes, setClientes] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [idBusqueda, setIdBusqueda] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paginaActual, setPaginaActual] = useState(1);
    const [clientesPorPagina] = useState(10);

    const totalPaginas = Math.ceil(clientes.length / clientesPorPagina);

    useEffect(() => {
        cargarClientes();
    }, []);

    const cargarClientes = async () => {
        try {
            setLoading(true);
            const data = await clienteService.getClientes();
            setClientes(data);
            setError(null);
        } catch (error) {
            setError('Error al cargar los clientes');
        } finally {
            setLoading(false);
        }
    };

    const buscarCliente = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const data = await clienteService.buscarCliente(filtro);
            setClientes(data);
            setPaginaActual(1); // Resetear página
            setError(null);
        } catch (error) {
            setError('Error al buscar los clientes');
        } finally {
            setLoading(false);
        }
    };

    const buscarClientePorId = async () => {
        if (!idBusqueda) return;

        try {
            setLoading(true);
            const cliente = await clienteService.getClientePorId(idBusqueda);
            setClientes(cliente ? [cliente] : []);
            setPaginaActual(1); // Resetear página
            setError(null);
        } catch (error) {
            setError('Cliente no encontrado o error al buscar');
            setClientes([]);
        } finally {
            setLoading(false);
        }
    };

    const eliminarCliente = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este cliente?')) {
            try {
                setLoading(true);
                await clienteService.eliminarCliente(id);
                setClientes(clientes.filter(cliente => cliente.id !== id));
                setError(null);
            } catch (error) {
                setError('Error al eliminar cliente');
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    };

    const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) {
        return " "; // O una edad predeterminada
    }

    const fechaActual = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = fechaActual.getFullYear() - nacimiento.getFullYear();
    const mes = fechaActual.getMonth();
    const dia = fechaActual.getDate();

    // Ajuste si no ha cumplido años este año
    if (mes < nacimiento.getMonth() || (mes === nacimiento.getMonth() && dia < nacimiento.getDate())) {
        edad--;
    }

    return edad;
};

    const clientesPaginados = clientes.slice(
        (paginaActual - 1) * clientesPorPagina,
        paginaActual * clientesPorPagina
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
                    <h2>Lista de clientes</h2>
                </Col>
                <Col className='text-end'>
                    <Button as={Link} to="/clientes/Agregar" variant="primary">Crear Cliente</Button>
                </Col>
            </Row>

            <Form onSubmit={buscarCliente} className="mb-3">
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
                        <Button
                            variant='outline-success'
                            className='w-100'
                            onClick={buscarClientePorId}
                        >
                            Buscar por ID
                        </Button>
                        <Button
                            variant='outline-secondary'
                            className='w-100 mt-2'
                            onClick={() => {
                                setFiltro('');
                                setIdBusqueda('');
                                setPaginaActual(1);
                                cargarClientes();
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
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Ciudad</th>
                        <th>País</th>
                        <th>Teléfono</th>
                        <th>Email</th>
                        <th>Fecha de nacimiento</th>
                        <th>Edad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clientesPaginados.map((cliente) => (
                        <tr key={cliente.id}>
                            <td>{cliente.id}</td>
                            <td>{cliente.firstName}</td>
                            <td>{cliente.lastName}</td>
                            <td>{cliente.city}</td>
                            <td>{cliente.country}</td>
                            <td>{cliente.phone}</td>
                            <td>{cliente.email}</td>
                            <td>{cliente.birthDate}</td>
                            <td>{calcularEdad(cliente.birthDate)}</td>
                            <td>
                                <Button
                                    as={Link}
                                    to={`/clientes/editar/${cliente.id}`}
                                    variant="warning"
                                    size='sm'
                                    className='me-2'
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant='danger'
                                    size='sm'
                                    onClick={() => eliminarCliente(cliente.id)}
                                >
                                    Eliminar
                                </Button>
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

export default ListarCliente;



