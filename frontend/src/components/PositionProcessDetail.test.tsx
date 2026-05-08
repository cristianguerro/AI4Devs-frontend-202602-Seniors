import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PositionProcessDetail from "./PositionProcessDetail";
import * as processService from "../services/positionProcessService";

jest.mock("../services/positionProcessService");

const mockedService = processService as jest.Mocked<typeof processService>;

const mockFlowResponse: processService.InterviewFlowResponse = {
  positionName: "Senior Backend Engineer Position",
  interviewFlow: {
    id: 1,
    description: "Flow",
    interviewSteps: [
      { id: 1, name: "Llamada telefónica", orderIndex: 1 },
      { id: 2, name: "Entrevista técnica", orderIndex: 2 },
      { id: 3, name: "Entrevista cultural", orderIndex: 3 },
    ],
  },
};

const mockCandidates: processService.Candidate[] = [
  {
    id: 10,
    applicationId: 700,
    fullName: "John Doe",
    currentInterviewStep: "Llamada telefónica",
    averageScore: 3.2,
  },
];

const buildDataTransfer = (candidateId: number) => ({
  setData: jest.fn(),
  getData: jest.fn(() => String(candidateId)),
});

const renderDetailPage = () =>
  render(
    <MemoryRouter initialEntries={["/positions/1/process"]}>
      <Routes>
        <Route path="/positions" element={<div>Positions Screen</div>} />
        <Route path="/positions/:positionId/process" element={<PositionProcessDetail />} />
      </Routes>
    </MemoryRouter>,
  );

describe("PositionProcessDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedService.getInterviewFlowByPosition.mockResolvedValue(mockFlowResponse);
    mockedService.getCandidatesByPosition.mockResolvedValue(mockCandidates);
    mockedService.updateCandidateStage.mockResolvedValue(undefined);
  });

  it("renders title, stages, candidate content, and supports back navigation", async () => {
    renderDetailPage();

    expect(await screen.findByText("Senior Backend Engineer Position")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Llamada telefónica", level: 2 })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Entrevista técnica", level: 2 })).toBeTruthy();
    expect(screen.getByText("John Doe")).toBeTruthy();
    expect(screen.getByText(/Promedio:/)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Volver a posiciones" }));

    expect(await screen.findByText("Positions Screen")).toBeTruthy();
  });

  it("moves candidates via drag-and-drop and persists stage changes", async () => {
    renderDetailPage();

    await screen.findByText("John Doe");

    const targetColumn = screen.getByTestId("stage-column-2");
    const candidateCard = screen.getByTestId("candidate-card-10");
    const dataTransfer = buildDataTransfer(10);

    fireEvent.dragStart(candidateCard, { dataTransfer });
    fireEvent.drop(targetColumn, { dataTransfer });

    await waitFor(() => {
      expect(mockedService.updateCandidateStage).toHaveBeenCalledWith(10, 700, 2);
    });

    expect(within(targetColumn).getByText("John Doe")).toBeTruthy();
  });

  it("rolls candidate back and shows error when update fails", async () => {
    mockedService.updateCandidateStage.mockRejectedValueOnce(new Error("network down"));
    renderDetailPage();

    await screen.findByText("John Doe");

    const targetColumn = screen.getByTestId("stage-column-2");
    const candidateCard = screen.getByTestId("candidate-card-10");
    const dataTransfer = buildDataTransfer(10);

    fireEvent.dragStart(candidateCard, { dataTransfer });
    fireEvent.drop(targetColumn, { dataTransfer });

    expect(await screen.findByRole("alert")).toBeTruthy();

    await waitFor(() => {
      expect(within(screen.getByTestId("stage-column-1")).getByText("John Doe")).toBeTruthy();
    });
  });

  it("renders empty stage drop targets", async () => {
    renderDetailPage();

    await screen.findByText("Senior Backend Engineer Position");

    const emptyStage = screen.getByTestId("stage-column-3");
    expect(within(emptyStage).getByText("Arrastra candidatos aquí")).toBeTruthy();
  });
});
