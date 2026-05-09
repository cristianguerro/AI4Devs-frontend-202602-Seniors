const API_BASE_URL = 'http://localhost:3010';

export type InterviewStep = {
    id: number;
    interviewFlowId: number;
    interviewTypeId: number;
    name: string;
    orderIndex: number;
};

export type InterviewFlowResponse = {
    positionName: string;
    interviewFlow: {
        id: number;
        description: string;
        interviewSteps: InterviewStep[];
    };
};

export type CandidateByPosition = {
    id: number;
    applicationId: number;
    fullName: string;
    currentInterviewStep: string;
    averageScore: number;
};

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        let message = `Request failed with status ${response.status}`;
        try {
            const data = await response.json();
            if (data?.message) message = data.message;
        } catch {
            // response body wasn't JSON; keep the default message
        }
        throw new Error(message);
    }
    return response.json();
};

export const getInterviewFlowByPosition = async (
    positionId: string | number,
): Promise<InterviewFlowResponse> => {
    const response = await fetch(`${API_BASE_URL}/position/${positionId}/interviewflow`);
    const data = await handleResponse(response);
    // The backend wraps the payload as { interviewFlow: { positionName, interviewFlow: { ... } } }
    return data.interviewFlow as InterviewFlowResponse;
};

export const getCandidatesByPosition = async (
    positionId: string | number,
): Promise<CandidateByPosition[]> => {
    const response = await fetch(`${API_BASE_URL}/position/${positionId}/candidates`);
    return handleResponse(response);
};

export const updateCandidateStage = async (
    candidateId: number,
    applicationId: number,
    currentInterviewStep: number,
) => {
    const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, currentInterviewStep }),
    });
    return handleResponse(response);
};
