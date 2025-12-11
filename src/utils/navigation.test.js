import { createBackHandler, handleBackNavigation } from "./navigation";

describe("navigation back helpers", () => {
  const locationWithState = { state: { activeRing: "water" } };
  const locationWithoutState = {};

  test("createBackHandler preserves state when present", () => {
    const navigate = jest.fn();
    const handleBack = createBackHandler(navigate, locationWithState);
    handleBack();
    expect(navigate).toHaveBeenCalledWith("/", { state: locationWithState.state });
  });

  test("createBackHandler falls back to root when no state", () => {
    const navigate = jest.fn();
    const handleBack = createBackHandler(navigate, locationWithoutState);
    handleBack();
    expect(navigate).toHaveBeenCalledWith("/");
  });

  test("handleBackNavigation preserves state when present", () => {
    const navigate = jest.fn();
    handleBackNavigation(navigate, locationWithState, "/target");
    expect(navigate).toHaveBeenCalledWith("/target", { state: locationWithState.state });
  });

  test("handleBackNavigation falls back when no state", () => {
    const navigate = jest.fn();
    handleBackNavigation(navigate, locationWithoutState, "/target");
    expect(navigate).toHaveBeenCalledWith("/target");
  });
});
