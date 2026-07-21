import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../Home";

test("renders the home heading and main action links", () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  expect(
    screen.getByRole("heading", { name: /Find Housing and Roommates with DormScout/i })
  ).toBeInTheDocument();

  expect(screen.getByRole("link", { name: /Search Housing/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Find Roommates/i })).toBeInTheDocument();
});
