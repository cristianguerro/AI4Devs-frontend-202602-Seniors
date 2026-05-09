import React, { useCallback, useMemo, useState } from 'react';
import KanbanColumn from './KanbanColumn';
import {
    CandidateByPosition,
    InterviewStep,
    updateCandidateStage,
} from '../../services/positionService';
import './kanban.css';

type Props = {
    steps: InterviewStep[];
    candidates: CandidateByPosition[];
    onCandidatesChange: (next: CandidateByPosition[]) => void;
    onError: (message: string | null) => void;
};

const KanbanBoard: React.FC<Props> = ({
    steps,
    candidates,
    onCandidatesChange,
    onError,
}) => {
    const [draggingApplicationId, setDraggingApplicationId] = useState<number | null>(null);

    const orderedSteps = useMemo(
        () => [...steps].sort((a, b) => a.orderIndex - b.orderIndex),
        [steps],
    );

    const candidatesByStepName = useMemo(() => {
        const map = new Map<string, CandidateByPosition[]>();
        for (const step of orderedSteps) map.set(step.name, []);
        for (const candidate of candidates) {
            const bucket = map.get(candidate.currentInterviewStep);
            if (bucket) bucket.push(candidate);
        }
        return map;
    }, [orderedSteps, candidates]);

    const moveCandidate = useCallback(
        async (applicationId: number, targetStepId: number) => {
            const targetStep = orderedSteps.find((s) => s.id === targetStepId);
            if (!targetStep) return;
            const moving = candidates.find((c) => c.applicationId === applicationId);
            if (!moving) return;
            if (moving.currentInterviewStep === targetStep.name) return;

            const previous = candidates;
            const optimistic = candidates.map((c) =>
                c.applicationId === applicationId
                    ? { ...c, currentInterviewStep: targetStep.name }
                    : c,
            );
            onCandidatesChange(optimistic);
            onError(null);

            try {
                await updateCandidateStage(moving.id, moving.applicationId, targetStep.id);
            } catch (err) {
                onCandidatesChange(previous);
                const message =
                    err instanceof Error
                        ? err.message
                        : 'No se pudo actualizar la fase del candidato';
                onError(message);
            }
        },
        [orderedSteps, candidates, onCandidatesChange, onError],
    );

    const handleDragStart = (candidate: CandidateByPosition) => {
        setDraggingApplicationId(candidate.applicationId);
        onError(null);
    };

    const handleDragEnd = () => {
        setDraggingApplicationId(null);
    };

    const handleDrop = (targetStep: InterviewStep) => {
        const id = draggingApplicationId;
        setDraggingApplicationId(null);
        if (id == null) return;
        void moveCandidate(id, targetStep.id);
    };

    return (
        <div className="kanban-board">
            {orderedSteps.map((step) => (
                <KanbanColumn
                    key={step.id}
                    step={step}
                    steps={orderedSteps}
                    candidates={candidatesByStepName.get(step.name) ?? []}
                    draggingApplicationId={draggingApplicationId}
                    onCardDragStart={handleDragStart}
                    onCardDragEnd={handleDragEnd}
                    onDropOnColumn={handleDrop}
                    onMoveCandidate={moveCandidate}
                />
            ))}
        </div>
    );
};

export default KanbanBoard;
