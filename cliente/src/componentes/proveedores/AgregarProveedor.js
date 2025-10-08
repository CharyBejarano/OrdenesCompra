import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import proveedorService from '../../services/apiProveedores';

const AgregarProveedor = () => {
  const navigate = useNavigate();

  const [proveedor, setProveedor] = useState({
    companyName: "",
    contactName: "",
    contactTitle: "",
    city: "",
    country: "",
    phone: "",
    fax: "",
    email: ""
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProveedor({
      ...proveedor,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await proveedorService.crearProveedor(proveedor);
      navigate('/proveedores/lista'); // Redirige a la lista de proveedores
    } catch (err) {
      setError("Error al crear el proveedor");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Agregar Proveedor</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre de la Empresa</label>
          <input
            type="text"
            name="companyName"
            className="form-control"
            value={proveedor.companyName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nombre de Contacto</label>
          <input
            type="text"
            name="contactName"
            className="form-control"
            value={proveedor.contactName}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Cargo del Contacto</label>
          <input
            type="text"
            name="contactTitle"
            className="form-control"
            value={proveedor.contactTitle}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Ciudad</label>
          <input
            type="text"
            name="city"
            className="form-control"
            value={proveedor.city}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">País</label>
          <input
            type="text"
            name="country"
            className="form-control"
            value={proveedor.country}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input
            type="text"
            name="phone"
            className="form-control"
            value={proveedor.phone}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Fax</label>
          <input
            type="text"
            name="fax"
            className="form-control"
            value={proveedor.fax}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo Electrónico</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={proveedor.email}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Guardar
        </button>
      </form>
    </div>
  );
};

export default AgregarProveedor;

