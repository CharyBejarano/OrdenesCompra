import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Spinner, Alert } from 'react-bootstrap';
import proveedorService from '../../services/apiProveedores'; // Asegúrate de tener el servicio de proveedor

const EditarProveedor = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [proveedor, setProveedor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarProveedor = async () => {
            try {
                const data = await proveedorService.getProveedorPorId(id);
                setProveedor(data);
            } catch (err) {
                setError('Error al cargar el proveedor');
            } finally {
                setLoading(false);
            }
        };
        cargarProveedor();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProveedor({ ...proveedor, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await proveedorService.actualizarProveedor(id, proveedor);
            navigate('/proveedores/lista'); // Redirige a la lista de proveedores
        } catch (err) {
            if (err.response && err.response.data) {
                alert(err.response.data);
            } else {
                alert('Error al actualizar el proveedor');
            }
        }
    };

    if (loading) return <Spinner animation="border" variant="primary" />;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!proveedor) return null;

    return (
        <Container>
            <h2>Editar Proveedor</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nombre de la Empresa</Form.Label>
                    <Form.Control
                        type="text"
                        name="companyName"
                        value={proveedor.companyName}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Contacto</Form.Label>
                    <Form.Control
                        type="text"
                        name="contactName"
                        value={proveedor.contactName}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={proveedor.email}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                        type="text"
                        name="phone"
                        value={proveedor.phone}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Ciudad</Form.Label>
                    <Form.Control
                        type="text"
                        name="city"
                        value={proveedor.city}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>País</Form.Label>
                    <Form.Control
                        type="text"
                        name="country"
                        value={proveedor.country}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Button type="submit" variant="primary">
                    Guardar Cambios
                </Button>
                <Button
                    variant="secondary"
                    className="ms-2"
                    onClick={() => navigate('/proveedores')}
                >
                    Cancelar
                </Button>
            </Form>
        </Container>
    );
};

export default EditarProveedor;
