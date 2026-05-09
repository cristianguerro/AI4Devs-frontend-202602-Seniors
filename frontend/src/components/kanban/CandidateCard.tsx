import React from 'react';
import { Card } from 'react-bootstrap';
import { StarFill, Star } from 'react-bootstrap-icons';
import { CandidateByPosition } from '../../services/positionService';

type Props = {
    candidate: CandidateByPosition;
    isDragging: boolean;
    onDragStart: (candidate: CandidateByPosition) => void;
    onDragEnd: () => void;
};

const MAX_SCORE = 5;

const CandidateCard: React.FC<Props> = ({ candidate, isDragging, onDragStart, onDragEnd }) => {
    const filled = Math.max(0, Math.min(MAX_SCORE, Math.round(candidate.averageScore || 0)));

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
            </Card.Body>
        </Card>
    );
};

export default CandidateCard;
