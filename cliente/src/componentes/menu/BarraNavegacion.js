import React from 'react'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const BarraNavegacion = () => {
// eslint-disable-next-line no-unused-vars
//const user = JSON.parse(localStorage.getItem('user'));
  return (
    <Navbar bg="primary" expand="lg" variant='primary'>
        <Container>
            <Navbar.Brand as={Link} to="/">Sicv</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav"/>
            <Nav>
                <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                {/*modulo de clientes*/}
                <NavDropdown title="Clientes" id="basic-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/clientes/lista">Lista clientes</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/clientes/Agregar">Agregar clientes</NavDropdown.Item>
                </NavDropdown>
                {/*modulo de Productos*/}
                <NavDropdown title="Productos" id="basic-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/productos/Agregar">Nuevo producto</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/productos/lista">Lista producto</NavDropdown.Item>
                </NavDropdown>
                {/*modulo de Facturacion*/}
                <NavDropdown title="Ordenes" id="facturacion-dropdown">
                    <NavDropdown.Item as={Link} to="/ordenes/nuevo">Nueva Orden</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/ordenes/lista">Lista Ordenes</NavDropdown.Item>
                </NavDropdown>
                {/*modulo de Proveedores*/}
                <NavDropdown title="Proveedores" id="proveedores-dropdown">
                    <NavDropdown.Item as={Link} to="/proveedores/lista">Lista Proveedores</NavDropdown.Item>
                </NavDropdown>
            </Nav>
            <Nav>
                <NavDropdown title="Bienvenidos">
                    <NavDropdown.Item as={Link} to="/perfil">Perfil</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/logout">Cerrar sesion</NavDropdown.Item>
                </NavDropdown>
            </Nav>
            
        </Container>
    </Navbar>
  )
}
export default BarraNavegacion;
