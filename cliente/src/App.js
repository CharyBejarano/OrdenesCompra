//import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BarraNavegacion from './componentes/menu/BarraNavegacion';
import ListarCliente  from './componentes/clientes/ListarCliente';
import AgregarCliente from './componentes/clientes/AgregarCliente';
import EditarCliente from './componentes/clientes/EditarCliente';
import ListarProveedor from './componentes/proveedores/ListarProveedor';
import EditarProveedor from './componentes/proveedores/EditarProveedor';
import AgregarProveedor from './componentes/proveedores/AgregarProveedor';
import ListarProducto from './componentes/productos/ListarProducto';
import EditarProducto from './componentes/productos/EditarProducto';
import AgregarProducto from './componentes/productos/AgregarProducto';
import ListarOrdenes from './componentes/ordenes/ListarOrdenes';

import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <BarraNavegacion/>
      <Routes>
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/clientes/lista" element={<ListarCliente/>}/>
        <Route path="/clientes/Agregar" element={<AgregarCliente/>}/>
        <Route path="/clientes/editar/:id" element={<EditarCliente/>}/>

        <Route path="/proveedores/lista" element={<ListarProveedor/>}/>
        <Route path="/proveedores/agregar" element={<AgregarProveedor/>}/>
        <Route path="/proveedores/editar/:id" element={<EditarProveedor />} />

        <Route path="/productos/lista" element={<ListarProducto/>}/>
        <Route path="/productos/editar/:id" element={<EditarProducto/>}/>
        <Route path="/productos/agregar" element = {<AgregarProducto/>}/>

        <Route path="ordenes/lista" element={<ListarOrdenes/>}/>
      </Routes>
    </Router>
  );
}
export default App;
