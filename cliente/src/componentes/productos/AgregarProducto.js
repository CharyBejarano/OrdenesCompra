import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import productoService from '../../services/apiProductos';

const AgregarProducto = () => {
    const navigate = useNavigate();
    const [producto, setProducto] = useState({
        productName: '',
        supplierId: '',
        unitPrice: '',
        package: '',
        isDiscontinued: false
    });

    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setProducto({ ...producto, [name]: newValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await productoService.agregarProducto(producto);
            navigate('/productos/lista'); // Redirige a la lista de productos
        } catch (err) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Error al agregar el producto');
            }
        }
    };

    return (
        <Container>
            <h2>Agregar Producto</h2>

            {error && <Alert variant="danger">{error}</Alert>}

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
                        value={producto.unitPrice}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Paquete</Form.Label>
                    <Form.Control
                        type="text"
                        name="package"
                        value={producto.package}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Check
                        type="checkbox"
                        name="isDiscontinued"
                        label="¿Está descontinuado?"
                        checked={producto.isDiscontinued}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Button type="submit" variant="primary">Guardar</Button>
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

export default AgregarProducto;
