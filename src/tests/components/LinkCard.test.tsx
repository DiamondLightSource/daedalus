import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LinkCard from "../../components/LinkCard";
import { BrowserRouter } from "react-router-dom";

const mockHistoryPush = vi.fn();

vi.mock("react-router-dom", async importOriginal => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => mockHistoryPush
  };
});

describe("LinkCard", (): void => {
  it("successfully navigates to route on card click", async (): Promise<void> => {
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
    const card = getByText("Testing");
    expect(card).toBeInTheDocument();
    await fireEvent.click(card);
    expect(mockHistoryPush).toHaveBeenCalledExactlyOnceWith("/test");
  });
});
