import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Badge, Button, Card, Container, Form, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import {
  Candidate,
  getCandidatesByPosition,
  getInterviewFlowByPosition,
  InterviewStep,
  updateCandidateStage,
} from "../services/positionProcessService";
import "./PositionProcessDetail.css";

type StageMap = Record<number, Candidate[]>;

const matchStageId = (candidate: Candidate, steps: InterviewStep[]): number | null => {
  if (typeof candidate.currentInterviewStep === "number") {
    return candidate.currentInterviewStep;
  }

  const matchingStep = steps.find((step) => step.name === candidate.currentInterviewStep);
  return matchingStep ? matchingStep.id : null;
};

const buildStageMap = (steps: InterviewStep[], candidates: Candidate[]): StageMap => {
  const initial = steps.reduce<StageMap>((accumulator, step) => {
    accumulator[step.id] = [];
    return accumulator;
  }, {});

  for (const candidate of candidates) {
    const stageId = matchStageId(candidate, steps);
    if (stageId !== null && initial[stageId]) {
      initial[stageId].push(candidate);
    }
  }

  return initial;
};

const PositionProcessDetail: React.FC = () => {
  const { positionId } = useParams<{ positionId: string }>();
  const navigate = useNavigate();
  const [positionTitle, setPositionTitle] = useState<string>("Proceso de posición");
  const [steps, setSteps] = useState<InterviewStep[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCandidateId, setActiveCandidateId] = useState<number | null>(null);

  const numericPositionId = Number(positionId);

  useEffect(() => {
    if (!numericPositionId) {
      setErrorMessage("No se pudo identificar la posición solicitada.");
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const [flowResponse, candidatesResponse] = await Promise.all([
          getInterviewFlowByPosition(numericPositionId),
          getCandidatesByPosition(numericPositionId),
        ]);

        const orderedSteps = [...flowResponse.interviewFlow.interviewSteps].sort((a, b) => a.orderIndex - b.orderIndex);

        setPositionTitle(flowResponse.positionName || "Proceso de posición");
        setSteps(orderedSteps);
        setCandidates(candidatesResponse);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error al cargar el proceso.";
        setErrorMessage(message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [numericPositionId]);

  const stageMap = useMemo(() => buildStageMap(steps, candidates), [steps, candidates]);

  const moveCandidateToStage = useCallback(
    async (candidateId: number, targetStepId: number) => {
      const candidateToMove = candidates.find((candidate) => candidate.id === candidateId);
      if (!candidateToMove) {
        return;
      }

      if (matchStageId(candidateToMove, steps) === targetStepId) {
        return;
      }

      const previousCandidates = candidates;
      const optimisticCandidates = candidates.map((candidate) =>
        candidate.id === candidateId
          ? {
              ...candidate,
              currentInterviewStep: targetStepId,
            }
          : candidate,
      );

      setErrorMessage("");
      setCandidates(optimisticCandidates);

      try {
        await updateCandidateStage(candidateToMove.id, candidateToMove.applicationId, targetStepId);
      } catch (error) {
        setCandidates(previousCandidates);
        const message = error instanceof Error ? error.message : "No se pudo actualizar la etapa.";
        setErrorMessage(`No se pudo mover el candidato: ${message}`);
      }
    },
    [candidates, steps],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLElement>, targetStepId: number) => {
      event.preventDefault();
      const rawCandidateId = event.dataTransfer.getData("text/plain");
      const candidateId = Number(rawCandidateId);
      setActiveCandidateId(null);

      if (!candidateId) {
        return;
      }

      void moveCandidateToStage(candidateId, targetStepId);
    },
    [moveCandidateToStage],
  );

  const handleDragStart = (event: React.DragEvent<HTMLElement>, candidateId: number) => {
    event.dataTransfer.setData("text/plain", String(candidateId));
    setActiveCandidateId(candidateId);
  };

  const handleDragEnd = () => {
    setActiveCandidateId(null);
  };

  return (
    <main className="process-page-bg py-4">
      <Container fluid="lg">
        <header className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-4">
          <div>
            <Button variant="outline-dark" onClick={() => navigate("/positions")} className="mb-3">
              Volver a posiciones
            </Button>
            <h1 className="process-page-title mb-0">{positionTitle}</h1>
          </div>
          <Badge bg="light" text="dark" className="process-page-badge border">
            Gestión de proceso
          </Badge>
        </header>

        {loading ? (
          <div className="d-flex align-items-center gap-3">
            <Spinner animation="border" role="status" />
            <span>Cargando proceso...</span>
          </div>
        ) : null}

        {!loading && errorMessage ? (
          <Alert variant="danger" role="alert">
            {errorMessage}
          </Alert>
        ) : null}

        {!loading && steps.length > 0 ? (
          <section className="kanban-scroll" aria-label="Proceso de entrevistas">
            <div className="kanban-grid">
              {steps.map((step) => {
                const stepCandidates = stageMap[step.id] || [];

                return (
                  <article
                    key={step.id}
                    className="kanban-column"
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => handleDrop(event, step.id)}
                    data-testid={`stage-column-${step.id}`}
                  >
                    <h2 className="kanban-column-title">{step.name}</h2>
                    <div className="kanban-cards">
                      {stepCandidates.length === 0 ? (
                        <div className="kanban-empty">Arrastra candidatos aquí</div>
                      ) : null}

                      {stepCandidates.map((candidate) => (
                        <Card
                          key={candidate.id}
                          draggable
                          onDragStart={(event) => handleDragStart(event, candidate.id)}
                          onDragEnd={handleDragEnd}
                          className={`candidate-card ${
                            activeCandidateId === candidate.id ? "candidate-card--active" : ""
                          }`}
                          aria-grabbed={activeCandidateId === candidate.id}
                          tabIndex={0}
                          data-testid={`candidate-card-${candidate.id}`}
                        >
                          <Card.Body>
                            <Card.Title className="candidate-card-name">{candidate.fullName}</Card.Title>
                            <Card.Text className="candidate-card-score">
                              Promedio: <strong>{candidate.averageScore.toFixed(1)}</strong>
                            </Card.Text>
                            <Form.Group controlId={`stage-selector-${candidate.id}`}>
                              <Form.Label className="candidate-card-label">Mover con teclado</Form.Label>
                              <Form.Select
                                size="sm"
                                value={String(matchStageId(candidate, steps) ?? "")}
                                onChange={(event) => {
                                  const targetStepId = Number(event.target.value);
                                  void moveCandidateToStage(candidate.id, targetStepId);
                                }}
                                aria-label={`Mover a otra fase a ${candidate.fullName}`}
                              >
                                {steps.map((stepOption) => (
                                  <option key={stepOption.id} value={stepOption.id}>
                                    {stepOption.name}
                                  </option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}
      </Container>
    </main>
  );
};

export default PositionProcessDetail;
