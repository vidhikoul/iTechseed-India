import React from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';

function Header() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        {/* Logo */}
        <Navbar.Brand href="/">
          <img
            src="/Danalogo.png" 
            alt="Dana Web Logo"
            href="https://www.Dana.com" 
            width="40"
            height="40"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          {/* Navigation Items */}
          <Nav className="ms-auto">
            <Nav.Link href="/overview">Overview</Nav.Link>
            <NavDropdown title="Admin Panel" id="admin-panel-dropdown">
              <NavDropdown.Item href="/admin/user-management">
                User Management
              </NavDropdown.Item>
              <NavDropdown.Item href="/admin/inventory-management">
                Inventory Management
              </NavDropdown.Item>
              <NavDropdown.Item href="/admin/clients">
                Client & Supplier Management
              </NavDropdown.Item>
              <NavDropdown.Item href="/admin/sap-import">
                SAP Data Import
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Transactions" id="transactions-dropdown">
              <NavDropdown.Item href="/transactions">
                Transaction Tracking
              </NavDropdown.Item>
              <NavDropdown.Item href="/challan-management">
                Challan Management
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/mobile-integration">Mobile Integration</Nav.Link>
            <Nav.Link href="/settings">Settings</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
