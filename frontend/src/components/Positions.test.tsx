import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Positions from "./Positions";
import * as positionsService from "../services/positionsService";

jest.mock("../services/positionsService");

const mockedService = positionsService as jest.Mocked<typeof positionsService>;

const mockPositions: positionsService.Position[] = [
  { id: 1, title: "Senior Backend Engineer", manager: "John Doe", deadline: "2024-12-31", status: "Abierto" },
  { id: 2, title: "Junior Android Engineer", manager: "Jane Smith", deadline: "2024-11-15", status: "Contratado" },
];

describe("Positions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders positions from API with Ver proceso links", async () => {
    mockedService.getPositions.mockResolvedValue(mockPositions);

    render(
      <MemoryRouter>
        <Positions />
      </MemoryRouter>,
    );

    const links = await screen.findAllByRole("link", { name: "Ver proceso" });

    expect(links).toHaveLength(2);
    expect(links[0].getAttribute("href")).toBe("/positions/1/process");
    expect(links[1].getAttribute("href")).toBe("/positions/2/process");

    expect(screen.getByText("Senior Backend Engineer")).toBeTruthy();
    expect(screen.getByText("Junior Android Engineer")).toBeTruthy();
  });

  it("shows loading state while fetching", () => {
    mockedService.getPositions.mockImplementation(
      () =>
        new Promise(() => {
          // Keep pending promise to assert loading state.
        }),
    );

    render(
      <MemoryRouter>
        <Positions />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("positions-loading")).toBeTruthy();
    expect(screen.queryByRole("link", { name: "Ver proceso" })).toBeNull();
  });

  it("shows error alert when API fails", async () => {
    mockedService.getPositions.mockRejectedValue(new Error("api down"));

    render(
      <MemoryRouter>
        <Positions />
      </MemoryRouter>,
    );

    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(screen.getByText("api down")).toBeTruthy();
  });

  it("calls getPositions on mount", async () => {
    mockedService.getPositions.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <Positions />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockedService.getPositions).toHaveBeenCalledTimes(1);
    });
  });

  it("shows empty state when no positions are returned", async () => {
    mockedService.getPositions.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <Positions />
      </MemoryRouter>,
    );

    expect(await screen.findByTestId("positions-empty")).toBeTruthy();
  });
});
