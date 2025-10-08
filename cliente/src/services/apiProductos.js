const API_BASE_URL_PRODUCTS = 'https://webapiordenescomprasproduccion-ahb3ftbqgxh8fae3.eastus2-01.azurewebsites.net/api/Products';
// const API_BASE_URL_PRODUCTS = 'https://localhost:7219/api/Products';

const productoService = {
    // Obtener todos los productos
    getProductos: async () => {
        const response = await fetch(API_BASE_URL_PRODUCTS);
        if (!response.ok) {
            throw new Error('Error al obtener productos');
        }
        return await response.json();
    },

    // Obtener un producto por su ID
    getProductoPorId: async (id) => {
        const response = await fetch(`${API_BASE_URL_PRODUCTS}/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener producto por ID');
        }
        return await response.json();
    },

    // Crear un nuevo producto
    crearProducto: async (producto) => {
        const response = await fetch(API_BASE_URL_PRODUCTS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(producto),
        });

        if (!response.ok) {
            throw new Error('Error al crear producto');
        }

        return await response.json();
    },

    // Actualizar un producto existente
    actualizarProducto: async (id, producto) => {
        const response = await fetch(`${API_BASE_URL_PRODUCTS}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(producto),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar producto');
        }
    },

    // Eliminar un producto
    eliminarProducto: async (id) => {
        const response = await fetch(`${API_BASE_URL_PRODUCTS}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Error al eliminar producto');
        }
    },

    // Actualizar parcialmente un producto (PATCH)
    actualizarProductoParcial: async (id, patchDoc) => {
        const response = await fetch(`${API_BASE_URL_PRODUCTS}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patchDoc),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar parcialmente el producto');
        }

        return await response.json();
    }
};

export default productoService;


