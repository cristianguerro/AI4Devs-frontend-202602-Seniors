import React from 'react';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PositionDetail from './PositionDetail';
import * as positionService from '../services/positionService';

jest.mock('../services/positionService');

const mockedService = positionService as jest.Mocked<typeof positionService>;

const flow: positionService.InterviewFlowResponse = {
    positionName: 'Senior Full-Stack Engineer',
    interviewFlow: {
        id: 1,
        description: 'Standard development interview process',
        interviewSteps: [
            { id: 1, interviewFlowId: 1, interviewTypeId: 1, name: 'Screening', orderIndex: 1 },
            { id: 2, interviewFlowId: 1, interviewTypeId: 2, name: 'Technical Interview', orderIndex: 2 },
            { id: 3, interviewFlowId: 1, interviewTypeId: 3, name: 'Cultural Interview', orderIndex: 3 },
            { id: 4, interviewFlowId: 1, interviewTypeId: 3, name: 'Manager Interview', orderIndex: 4 },
        ],
    },
};

const candidates: positionService.CandidateByPosition[] = [
    {
        id: 10,
        applicationId: 100,
        fullName: 'John Doe',
        currentInterviewStep: 'Screening',
        averageScore: 5,
    },
    {
        id: 11,
        applicationId: 101,
        fullName: 'Jane Smith',
        currentInterviewStep: 'Technical Interview',
        averageScore: 4,
    },
];

const renderAt = (path = '/positions/1') =>
    render(
        <MemoryRouter initialEntries={[path]}>
            <Routes>
                <Route path="/positions/:positionId" element={<PositionDetail />} />
            </Routes>
        </MemoryRouter>,
    );

beforeEach(() => {
    mockedService.getInterviewFlowByPosition.mockResolvedValue(flow);
    mockedService.getCandidatesByPosition.mockResolvedValue(candidates);
    mockedService.updateCandidateStage.mockResolvedValue({ message: 'ok', data: {} });
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('PositionDetail', () => {
    it('renderiza el título de la posición', async () => {
        renderAt();
        expect(
            await screen.findByRole('heading', { name: 'Senior Full-Stack Engineer' }),
        ).toBeInTheDocument();
    });

    it('renderiza una columna por interviewStep', async () => {
        renderAt();
        await screen.findByRole('heading', { name: 'Senior Full-Stack Engineer' });
        for (const step of flow.interviewFlow.interviewSteps) {
            expect(screen.getByTitle(step.name)).toBeInTheDocument();
        }
    });

    it('renderiza cada candidato en la columna de su fase actual', async () => {
        renderAt();
        const johnSelect = (await screen.findByLabelText(
            'Cambiar fase de John Doe',
        )) as HTMLSelectElement;
        const janeSelect = screen.getByLabelText('Cambiar fase de Jane Smith') as HTMLSelectElement;

        expect(johnSelect.value).toBe('1');
        expect(janeSelect.value).toBe('2');
    });

    it('al cambiar la fase desde el select llama a updateCandidateStage', async () => {
        renderAt();
        const johnSelect = (await screen.findByLabelText(
            'Cambiar fase de John Doe',
        )) as HTMLSelectElement;

        await act(async () => {
            userEvent.selectOptions(johnSelect, '2');
        });

        expect(mockedService.updateCandidateStage).toHaveBeenCalledWith(10, 100, 2);
    });

    it('hace rollback y muestra el mensaje de error si la actualización falla', async () => {
        mockedService.updateCandidateStage.mockRejectedValueOnce(new Error('Update failed'));
        renderAt();
        const johnSelect = (await screen.findByLabelText(
            'Cambiar fase de John Doe',
        )) as HTMLSelectElement;

        await act(async () => {
            userEvent.selectOptions(johnSelect, '2');
        });

        const alert = await screen.findByRole('alert');
        expect(within(alert).getByText('Update failed')).toBeInTheDocument();

        await waitFor(() => {
            const restored = screen.getByLabelText(
                'Cambiar fase de John Doe',
            ) as HTMLSelectElement;
            expect(restored.value).toBe('1');
        });
    });
});
