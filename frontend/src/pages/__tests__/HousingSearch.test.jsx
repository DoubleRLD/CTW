import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import HousingSearch from "../HousingSearch";
import { dormsApi } from "../../api/dorms";
import { listingsApi } from "../../api/listings";

vi.mock("../../api/dorms", () => ({
  dormsApi: {
    list: vi.fn(),
  },
}));

vi.mock("../../api/listings", () => ({
  listingsApi: {
    list: vi.fn(),
  },
}));

vi.mock("../../api/favorites", () => ({
  favoritesApi: {
    list: vi.fn(),
    add: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ isAuthenticated: false }),
}));

vi.mock("../../context/ToastContext", () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

test("allows a user to search housing by school name", async () => {
  dormsApi.list.mockResolvedValue([
    {
      dorm_id: 1,
      name: "Hibbard Hall",
      school_name: "Georgia State University",
      avg_rating: 4.5,
    },
  ]);
  listingsApi.list.mockResolvedValue([]);

  render(
    <MemoryRouter>
      <HousingSearch />
    </MemoryRouter>
  );

  const searchInput = await screen.findByPlaceholderText(/Search by school or housing name/i);
  fireEvent.change(searchInput, { target: { value: "Georgia State" } });

  expect(await screen.findByText("Georgia State University")).toBeInTheDocument();
  expect(screen.getByText("Hibbard Hall")).toBeInTheDocument();
});
