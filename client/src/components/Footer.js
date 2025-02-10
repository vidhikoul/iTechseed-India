import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css'; 

function Footer() {
  return (
    <footer className="footer bg-dark text-light py-8 mt-6">
      <Container>
        <Row>
          <Col md={4} className="text-center text-md-start mb-2 mb-md-0">
            <p>© {new Date().getFullYear()} Dana India</p>
          </Col>
          <Col md={4} className="text-center">
            <p>
              <a href="/privacy-policy" className="text-light text-decoration-none">
                Privacy Policy
              </a>{' '}
              |{' '}
              <a href="/terms" className="text-light text-decoration-none">
                Terms of Service
              </a>
            </p>
          </Col>
          <Col md={4} className="text-center text-md-end">
            <p>
              Website:{' '}
              <a
                href="https://www.Dana.com"
                className="text-light text-decoration-none mx-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Dana India
              </a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
