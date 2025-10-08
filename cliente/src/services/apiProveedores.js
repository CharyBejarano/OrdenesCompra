const API_BASE_URL = 'https://webapiordenescomprasproduccion-ahb3ftbqgxh8fae3.eastus2-01.azurewebsites.net/api/Suppliers';
//const API_BASE_URL = 'https://localhost:7219/api/Suppliers';

const proveedorService = {
    getProveedores: async () => {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error('Error al obtener proveedores');
        }
        return await response.json();
    },

    getProveedorPorId: async (id) => {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener proveedor por ID');
        }
        return await response.json();
    },

    crearProveedor: async (proveedor) => {
        // ✅ Validaciones antes del POST
        if (!proveedor.companyName || proveedor.companyName.trim() === "") {
            alert("⚠️ El nombre de la compañía es obligatorio");
            return;
        }
        if (!proveedor.contactName || proveedor.contactName.trim() === "") {
            alert("⚠️ El nombre del contacto es obligatorio");
            return;
        }
        if (!proveedor.city || proveedor.city.trim() === "") {
            alert("⚠️ La ciudad es obligatoria");
            return;
        }
        if (!proveedor.country || proveedor.country.trim() === "") {
            alert("⚠️ El país es obligatorio");
            return;
        }
        if (!proveedor.phone || proveedor.phone.trim() === "") {
            alert("⚠️ El teléfono es obligatorio");
            return;
        }

        const response = await fetch(API_BASE_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(proveedor)
        });

        if (!response.ok) {
            // Captura de mensajes de error que devuelve el backend
            const errorData = await response.json();
            if (errorData && errorData.message) {
                alert(`Error: ${errorData.message}`);
            } else {
                alert("Error al crear proveedor");
            }
            throw new Error(errorData.message || "Error al crear proveedor");
        }

        return await response.json();
    },

    actualizarProveedor: async (id, proveedor) => {
        // ✅ Validaciones antes del PUT
        if (!proveedor.companyName || proveedor.companyName.trim() === "") {
            alert("⚠️ El nombre de la compañía es obligatorio");
            return;
        }
        if (!proveedor.contactName || proveedor.contactName.trim() === "") {
            alert("⚠️ El nombre del contacto es obligatorio");
            return;
        }
        if (!proveedor.city || proveedor.city.trim() === "") {
            alert("⚠️ La ciudad es obligatoria");
            return;
        }
        if (!proveedor.country || proveedor.country.trim() === "") {
            alert("⚠️ El país es obligatorio");
            return;
        }
        if (!proveedor.phone || proveedor.phone.trim() === "") {
            alert("⚠️ El teléfono es obligatorio");
            return;
        }

        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(proveedor)
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (errorData && errorData.message) {
                alert(`Error: ${errorData.message}`);
            } else {
                alert("Error al actualizar proveedor");
            }
            throw new Error(errorData.message || "Error al actualizar proveedor");
        }
    },

    eliminarProveedor: async (id) => {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) {
            throw new Error('Error al eliminar proveedor');
        }
    }
};

export default proveedorService;
