const API_ORDENES_URL = 'https://webapiordenescomprasproduccion-ahb3ftbqgxh8fae3.eastus2-01.azurewebsites.net/api/Orders';
//const API_ORDENES_URL = 'https://localhost:7219/api/Orders';

const ordenService = {
    getOrdenes: async () => {
        const response = await fetch(API_ORDENES_URL);
        if (!response.ok) throw new Error('Error al obtener órdenes');
        return await response.json();
    },

    getOrdenPorId: async (id) => {
        const response = await fetch(`${API_ORDENES_URL}/${id}`);
        if (!response.ok) throw new Error('Error al obtener la orden');
        return await response.json();
    },

    crearOrden: async (orden) => {
        const response = await fetch(API_ORDENES_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orden)
        });
        if (!response.ok) throw new Error('Error al crear la orden');
        return await response.json();
    },

    actualizarOrden: async (id, orden) => {
        const response = await fetch(`${API_ORDENES_URL}/${id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orden)
        });
        if (!response.ok) throw new Error('Error al actualizar la orden');
    },

    eliminarOrden: async (id) => {
        const response = await fetch(`${API_ORDENES_URL}/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) throw new Error('Error al eliminar la orden');
    }
};

export default ordenService;
