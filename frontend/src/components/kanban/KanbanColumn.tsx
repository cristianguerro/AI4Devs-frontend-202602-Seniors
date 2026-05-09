import React, { useState } from 'react';
import { Badge } from 'react-bootstrap';
import CandidateCard from './CandidateCard';
import {
    CandidateByPosition,
    InterviewStep,
} from '../../services/positionService';

type Props = {
    step: InterviewStep;
    steps: InterviewStep[];
    candidates: CandidateByPosition[];
    draggingApplicationId: number | null;
    onCardDragStart: (candidate: CandidateByPosition) => void;
    onCardDragEnd: () => void;
    onDropOnColumn: (step: InterviewStep) => void;
    onMoveCandidate: (applicationId: number, targetStepId: number) => void;
};

const KanbanColumn: React.FC<Props> = ({
    step,
    steps,
    candidates,
    draggingApplicationId,
    onCardDragStart,
    onCardDragEnd,
    onDropOnColumn,
    onMoveCandidate,
}) => {
    const [isOver, setIsOver] = useState(false);

    return (
        <div
            className={`kanban-column ${isOver ? 'is-drag-over' : ''}`}
            onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                if (!isOver) setIsOver(true);
            }}
            onDragLeave={() => setIsOver(false)}
            onDrop={(e) => {
                e.preventDefault();
                setIsOver(false);
                onDropOnColumn(step);
            }}
        >
            <div className="kanban-column-header">
                <span className="text-truncate" title={step.name}>
                    {step.name}
                </span>
                <Badge bg="secondary" pill>
                    {candidates.length}
                </Badge>
            </div>
            <div className="kanban-column-body">
                {candidates.length === 0 ? (
                    <div className="kanban-empty-state">Sin candidatos</div>
                ) : (
                    candidates.map((c) => (
                        <CandidateCard
                            key={c.applicationId}
                            candidate={c}
                            steps={steps}
                            currentStepId={step.id}
                            isDragging={draggingApplicationId === c.applicationId}
                            onDragStart={onCardDragStart}
                            onDragEnd={onCardDragEnd}
                            onMoveCandidate={onMoveCandidate}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default KanbanColumn;
