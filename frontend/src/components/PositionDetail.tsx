import React, { useEffect, useState } from 'react';
import { Alert, Button, Container, Spinner } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import { Link, useParams } from 'react-router-dom';
import KanbanBoard from './kanban/KanbanBoard';
import {
    CandidateByPosition,
    InterviewStep,
    getCandidatesByPosition,
    getInterviewFlowByPosition,
} from '../services/positionService';

const PositionDetail: React.FC = () => {
    const { positionId } = useParams<{ positionId: string }>();

    const [positionName, setPositionName] = useState<string>('');
    const [steps, setSteps] = useState<InterviewStep[]>([]);
    const [candidates, setCandidates] = useState<CandidateByPosition[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    useEffect(() => {
        if (!positionId) return;
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setLoadError(null);
            try {
                const [flow, candidateList] = await Promise.all([
                    getInterviewFlowByPosition(positionId),
                    getCandidatesByPosition(positionId),
                ]);
                if (cancelled) return;
                setPositionName(flow.positionName);
                setSteps(flow.interviewFlow.interviewSteps);
                setCandidates(candidateList);
            } catch (err) {
                if (cancelled) return;
                const message =
                    err instanceof Error
                        ? err.message
                        : 'No se pudo cargar la información de la posición';
                setLoadError(message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [positionId]);

    return (
        <Container fluid className="py-4 px-3 px-md-4">
            <div className="d-flex align-items-center mb-3">
                <Button
                    as={Link as any}
                    to="/positions"
                    variant="link"
                    className="p-0 me-2 text-decoration-none"
                    aria-label="Volver a posiciones"
                >
                    <ArrowLeft size={24} />
                </Button>
                <h2 className="m-0 flex-grow-1 text-truncate">
                    {positionName || 'Posición'}
                </h2>
            </div>

            {actionError && (
                <Alert
                    variant="danger"
                    onClose={() => setActionError(null)}
                    dismissible
                    className="py-2"
                >
                    {actionError}
                </Alert>
            )}

            {loading && (
                <div className="text-center py-5">
                    <Spinner animation="border" role="status" />
                    <div className="mt-2 text-muted">Cargando proceso…</div>
                </div>
            )}

            {!loading && loadError && (
                <Alert variant="danger">{loadError}</Alert>
            )}

            {!loading && !loadError && (
                <KanbanBoard
                    steps={steps}
                    candidates={candidates}
                    onCandidatesChange={setCandidates}
                    onError={setActionError}
                />
            )}
        </Container>
    );
};

export default PositionDetail;
