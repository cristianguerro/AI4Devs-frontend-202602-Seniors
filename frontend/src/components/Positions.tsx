import React, { useEffect, useState } from "react";
import { Alert, Card, Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getPositions, Position } from "../services/positionsService";

const Positions: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    const loadPositions = async () => {
      setLoading(true);
      setError("");

      try {
        const fetchedPositions = await getPositions();
        if (mounted) {
          setPositions(fetchedPositions);
        }
      } catch (loadError) {
        if (mounted) {
          const message = loadError instanceof Error ? loadError.message : "Error cargando posiciones";
          setError(message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadPositions();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Posiciones</h2>
      {error ? (
        <Alert variant="danger" dismissible onClose={() => setError("")} role="alert">
          {error}
        </Alert>
      ) : null}
      <Row className="mb-4">
        <Col md={3}>
          <Form.Control type="text" placeholder="Buscar por título" />
        </Col>
        <Col md={3}>
          <Form.Control type="date" placeholder="Buscar por fecha" />
        </Col>
        <Col md={3}>
          <Form.Control as="select">
            <option value="">Estado</option>
            <option value="open">Abierto</option>
            <option value="filled">Contratado</option>
            <option value="closed">Cerrado</option>
            <option value="draft">Borrador</option>
          </Form.Control>
        </Col>
        <Col md={3}>
          <Form.Control as="select">
            <option value="">Manager</option>
            <option value="john_doe">John Doe</option>
            <option value="jane_smith">Jane Smith</option>
            <option value="alex_jones">Alex Jones</option>
          </Form.Control>
        </Col>
      </Row>
      {loading ? (
        <div className="d-flex justify-content-center py-5" data-testid="positions-loading">
          <Spinner animation="border" role="status" />
        </div>
      ) : null}
      {!loading ? (
        <Row>
          {positions.length === 0 ? (
            <Col>
              <p className="text-muted mb-0" data-testid="positions-empty">
                No positions available
              </p>
            </Col>
          ) : null}
          {positions.map((position) => (
            <Col md={4} key={position.id} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>{position.title}</Card.Title>
                  <Card.Text>
                    <strong>Manager:</strong> {position.manager}
                    <br />
                    <strong>Deadline:</strong> {position.deadline}
                  </Card.Text>
                  <span
                    className={`badge ${position.status === "Abierto" ? "bg-warning" : position.status === "Contratado" ? "bg-success" : position.status === "Borrador" ? "bg-secondary" : "bg-warning"} text-white`}
                  >
                    {position.status}
                  </span>
                  <div className="d-flex justify-content-between mt-3">
                    <Link to={`/positions/${position.id}/process`}>
                      <Button variant="primary">Ver proceso</Button>
                    </Link>
                    <Button variant="secondary">Editar</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : null}
    </Container>
  );
};

export default Positions;
