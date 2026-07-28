import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../Dashboard";
import Home from "../Home";
import Navbar from "../../components/Navbar";

jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { name: "Test User" },
    checkingAuth: false,
  }),
}));

jest.mock("../../context/ToastContext", () => ({
  useToast: () => ({ showToast: jest.fn() }),
}));

jest.mock("../../assets/dormscout-logo.png", () => "logo.png");

describe("Dashboard navigation", () => {
  test("goes to home screen from dashboard via the navbar", async () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Home"));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Find Housing and Roommates with DormScout/i })
      ).toBeInTheDocument();
    });
  });
});
