export type InterviewStep = {
  id: number;
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

export type Candidate = {
  id: number;
  applicationId: number;
  fullName: string;
  currentInterviewStep: string | number;
  averageScore: number;
};

type InterviewFlowApiPayload =
  | InterviewFlowResponse
  | {
      interviewFlow: InterviewFlowResponse;
    };

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3010";

const requestJson = async <T>(paths: string[], options?: RequestInit): Promise<T> => {
  let lastError: Error | null = null;

  for (const path of paths) {
    try {
      const response = await fetch(`${API_BASE_URL}${path}`, options);

      if (!response.ok) {
        lastError = new Error(`Request failed with status ${response.status}`);
        continue;
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown request error");
    }
  }

  throw lastError ?? new Error("No endpoint available for request");
};

export const getInterviewFlowByPosition = async (positionId: number): Promise<InterviewFlowResponse> => {
  const payload = await requestJson<InterviewFlowApiPayload>([
    `/positions/${positionId}/interviewFlow`,
    `/position/${positionId}/interviewflow`,
    `/position/${positionId}/interviewFlow`,
  ]);

  if ("positionName" in payload) {
    return payload;
  }

  return payload.interviewFlow;
};

export const getCandidatesByPosition = async (positionId: number): Promise<Candidate[]> =>
  requestJson<Candidate[]>([`/positions/${positionId}/candidates`, `/position/${positionId}/candidates`]);

export const updateCandidateStage = async (
  candidateId: number,
  applicationId: number,
  stageId: number,
): Promise<void> => {
  await requestJson([`/candidates/${candidateId}/stage`, `/candidates/${candidateId}`], {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      applicationId,
      currentInterviewStep: stageId,
    }),
  });
};
