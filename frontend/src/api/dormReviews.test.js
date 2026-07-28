import { api } from "./client";
import { dormReviewsApi } from "./dormReviews";

// Replace the real API client with fake Jest functions
// Prevents the test from contacting the backend
jest.mock("./client", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("Testing Scenario 1 - Submit a housing review", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("submits a dorm review with the correct information", async () => {
    // Arrange: fake information entered by the student
    const dormId = 1;

    const reviewData = {
      roomId: 2,
      semester: "Fall",
      semesterYear: 2026,
      body: "The dorm was clean and the residents were friendly.",
      cleanlinessRating: 5,
      noiseRating: 4,
      locationRating: 5,
      overallRating: 5,
    };

    // Fake response that would normally come from the backend
    const savedReview = {
      review_id: 101,
      dorm_id: dormId,
      reviewer_name: "Test Student",
      ...reviewData,
    };

    // Pretend that the backend successfully saved the review
    api.post.mockResolvedValue(savedReview);

    // Act: call the review submission function
    const result = await dormReviewsApi.create(dormId, reviewData);

    // Assert: the request should happen exactly once
    expect(api.post).toHaveBeenCalledTimes(1);

    // Assert: the correct endpoint, data, and authentication option should be used
    expect(api.post).toHaveBeenCalledWith(
      "/dorms/1/reviews",
      reviewData,
      { auth: true }
    );

    // Assert: the function should return the saved review
    expect(result).toEqual(savedReview);
  });
});