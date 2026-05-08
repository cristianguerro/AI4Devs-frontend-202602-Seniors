import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Positions from "./Positions";

describe("Positions", () => {
  it("renders Ver proceso links to position detail route", () => {
    render(
      <MemoryRouter>
        <Positions />
      </MemoryRouter>,
    );

    const links = screen.getAllByRole("link", { name: "Ver proceso" });

    expect(links).toHaveLength(3);
    expect(links[0].getAttribute("href")).toBe("/positions/1/process");
    expect(links[1].getAttribute("href")).toBe("/positions/2/process");
    expect(links[2].getAttribute("href")).toBe("/positions/3/process");
  });
});
