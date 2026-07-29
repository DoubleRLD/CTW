import { validateMessage } from "../src/services/messageValidation.js";

describe("validateMessage", () => {
  test("returns true for a valid message", () => {
    // Setup: define the input and expected output
    const message = "Hello! Are you still looking for a roommate?";
    const expectedResult = true;

    // Call: execute the method being tested
    const actualResult = validateMessage(message);

    // Assertion: compare the actual result with the expected result
    expect(actualResult).toBe(expectedResult);
  });

  test("returns false for an empty message", () => {
    // Setup
    const message = "";
    const expectedResult = false;

    // Call
    const actualResult = validateMessage(message);

    // Assertion
    expect(actualResult).toBe(expectedResult);
  });

  test("returns false for a message containing only spaces", () => {
    // Setup
    const message = "     ";
    const expectedResult = false;

    // Call
    const actualResult = validateMessage(message);

    // Assertion
    expect(actualResult).toBe(expectedResult);
  });

  test("returns false for a message longer than 500 characters", () => {
    // Setup
    const message = "a".repeat(501);
    const expectedResult = false;

    // Call
    const actualResult = validateMessage(message);

    // Assertion
    expect(actualResult).toBe(expectedResult);
  });
});