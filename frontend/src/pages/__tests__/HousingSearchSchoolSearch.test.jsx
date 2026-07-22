import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HousingSearch from "../HousingSearch";
import { dormsApi } from "../../api/dorms";
import { listingsApi } from "../../api/listings";
import { favoritesApi } from "../../api/favorites";

jest.mock("../../api/dorms", () => ({
  dormsApi: {
    list: jest.fn(),
  },
}));

jest.mock("../../api/listings", () => ({
  listingsApi: {
    list: jest.fn(),
  },
}));

jest.mock("../../api/favorites", () => ({
  favoritesApi: {
    list: jest.fn(),
    add: jest.fn(),
    remove: jest.fn(),
  },
}));

jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ isAuthenticated: false }),
}));

jest.mock("../../context/ToastContext", () => ({
  useToast: () => ({ showToast: jest.fn() }),
}));

const dorms = [
  {
    dorm_id: 1,
    name: "Georgia Hall",
    school_name: "Georgia State University",
    avg_rating: 4.5,
  },
  {
    dorm_id: 2,
    name: "Peachtree Plaza",
    school_name: "Georgia State University",
    avg_rating: 3.0,
  },
];

const listings = [
  {
    listing_id: 101,
    name: "The Midtown Loft",
    address: "123 Peachtree St",
    school_names: "Georgia Tech",
    bedrooms: 2,
    monthly_rent: 1200,
    avg_rating: 4.0,
  },
];

describe("HousingSearch school search behavior", () => {
  beforeEach(() => {
    dormsApi.list.mockResolvedValue(dorms);
    listingsApi.list.mockResolvedValue(listings);
    favoritesApi.list.mockResolvedValue([]);
  });

  test("filters housing results by school name search", async () => {
    render(
      <MemoryRouter>
        <HousingSearch />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Georgia Hall")).toBeDefined();
      expect(screen.getByText("Peachtree Plaza")).toBeDefined();
      expect(screen.getByText("The Midtown Loft")).toBeDefined();
    });

    fireEvent.change(
      screen.getByPlaceholderText("Search by school or housing name"),
      { target: { value: "Georgia State" } }
    );

    expect(screen.getByText("Georgia Hall")).toBeDefined();
    expect(screen.getByText("Peachtree Plaza")).toBeDefined();
    expect(screen.queryByText("The Midtown Loft")).toBeNull();
  });
});
