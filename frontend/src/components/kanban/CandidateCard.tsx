import React from 'react';
import { Card } from 'react-bootstrap';
import { StarFill, Star } from 'react-bootstrap-icons';
import {
    CandidateByPosition,
    InterviewStep,
} from '../../services/positionService';

type Props = {
    candidate: CandidateByPosition;
    steps: InterviewStep[];
    currentStepId: number;
    isDragging: boolean;
    onDragStart: (candidate: CandidateByPosition) => void;
    onDragEnd: () => void;
    onMoveCandidate: (applicationId: number, targetStepId: number) => void;
};

const MAX_SCORE = 5;

const CandidateCard: React.FC<Props> = ({
    candidate,
    steps,
    currentStepId,
    isDragging,
    onDragStart,
    onDragEnd,
    onMoveCandidate,
}) => {
    const filled = Math.max(0, Math.min(MAX_SCORE, Math.round(candidate.averageScore || 0)));

    const handleStageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const targetStepId = Number(e.target.value);
        if (Number.isNaN(targetStepId) || targetStepId === currentStepId) return;
        onMoveCandidate(candidate.applicationId, targetStepId);
    };

    // Stop drag-related events from bubbling so interacting with the select
    // never triggers the card's HTML5 drag.
    const stopDragPropagation = (e: React.SyntheticEvent) => e.stopPropagation();

    return (
        <Card
            className={`kanban-card shadow-sm ${isDragging ? 'is-dragging' : ''}`}
            draggable
            onDragStart={(e) => {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', String(candidate.applicationId));
                onDragStart(candidate);
            }}
            onDragEnd={onDragEnd}
        >
            <Card.Body className="p-2">
                <div className="fw-semibold text-truncate" title={candidate.fullName}>
                    {candidate.fullName}
                </div>
                <div
                    className="kanban-card-score mt-1"
                    aria-label={`Puntuación media ${filled} de ${MAX_SCORE}`}
                >
                    {Array.from({ length: MAX_SCORE }).map((_, i) =>
                        i < filled ? (
                            <StarFill key={i} size={14} />
                        ) : (
                            <Star key={i} size={14} className="star-empty" />
                        ),
                    )}
                </div>
                <select
                    className="form-select form-select-sm kanban-card-select mt-2"
                    aria-label={`Cambiar fase de ${candidate.fullName}`}
                    value={currentStepId}
                    onChange={handleStageChange}
                    onMouseDown={stopDragPropagation}
                    onClick={stopDragPropagation}
                    onDragStart={stopDragPropagation}
                    draggable={false}
                >
                    {steps.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))}
                </select>
            </Card.Body>
        </Card>
    );
};

export default CandidateCard;
