import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LinkCard from "../../components/LinkCard";
import { BrowserRouter } from "react-router-dom";

const mockHistoryPush = vi.fn();

vi.mock("react-router-dom", async importOriginal => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useHistory: () => ({
      push: mockHistoryPush
    })
  };
});

describe("LinkCard", (): void => {
  it("successfully navigates to route on button click", async (): Promise<void> => {
    const info = {
      name: "Testing",
      route: "/test",
      text: "A test."
    };
    const { getByText } = render(
      <BrowserRouter>
        <LinkCard info={info} />
      </BrowserRouter>
    );
    expect(getByText("Testing")).toBeInTheDocument();
    const button = await getByText("VISIT");
    await fireEvent.click(button);
    expect(mockHistoryPush).toHaveBeenCalledExactlyOnceWith("/test");
  });
});
