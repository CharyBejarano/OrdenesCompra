import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Spinner, Alert } from 'react-bootstrap';
import productoService from '../../services/apiProductos';

const EditarProducto = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarProducto = async () => {
            try {
                const data = await productoService.getProductoPorId(id);
                setProducto(data);
            } catch (err) {
                setError('Error al cargar el producto');
            } finally {
                setLoading(false);
            }
        };
        cargarProducto();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setProducto({ ...producto, [name]: newValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await productoService.actualizarProducto(id, producto);
            navigate('/productos'); // Redirige a la lista de productos
        } catch (err) {
            if (err.response && err.response.data?.message) {
                alert(err.response.data.message);
            } else {
                alert('Error al actualizar el producto');
            }
        }
    };

    if (loading) return <Spinner animation="border" variant="primary" />;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!producto) return null;

    return (
        <Container>
            <h2>Editar Producto</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nombre del Producto</Form.Label>
                    <Form.Control
                        type="text"
                        name="productName"
                        value={producto.productName}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>ID del Proveedor</Form.Label>
                    <Form.Control
                        type="number"
                        name="supplierId"
                        value={producto.supplierId}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Precio Unitario</Form.Label>
                    <Form.Control
                        type="number"
                        step="0.01"
                        name="unitPrice"
                        value={producto.unitPrice ?? ''}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Paquete</Form.Label>
                    <Form.Control
                        type="text"
                        name="package"
                        value={producto.package ?? ''}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Check
                        type="checkbox"
                        label="¿Está descontinuado?"
                        name="isDiscontinued"
                        checked={producto.isDiscontinued}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Button type="submit" variant="primary">Guardar Cambios</Button>
                <Button
                    variant="secondary"
                    className="ms-2"
                    onClick={() => navigate('/productos/lista')}
                >
                    Cancelar
                </Button>
            </Form>
        </Container>
    );
};

export default EditarProducto;
