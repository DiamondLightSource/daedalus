import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ArchiverMenuBar from "../../components/ArchiverMenuBar";
import { BeamlineTreeStateContext } from "../../App";
import { BeamlineTreeState } from "../../store";

const mockContextValue = {
  state: {
    menuBarsOpen: {
      archiver: true,
      synoptic: false,
      traces: false
    }
  } as Partial<BeamlineTreeState> as BeamlineTreeState,
  dispatch: vi.fn()
};

describe("LinkCard", (): void => {
  const renderComponent = (contextValue = mockContextValue) => {
    return render(
      <BeamlineTreeStateContext.Provider value={contextValue}>
        <ArchiverMenuBar />
      </BeamlineTreeStateContext.Provider>
    );
  };
  it("successfully filters beamlines with regex", async (): Promise<void> => {
    const { getByLabelText, getAllByRole } = renderComponent();
    // The first element we find is the PV search
    const entry = getByLabelText("PV");

    expect(entry).toBeInTheDocument();
    await fireEvent.change(entry, { target: { value: "VAC" } });
    const tableRows = getAllByRole("rowheader");
    expect(tableRows.length).toBe(2);
    expect(tableRows[0]).toHaveTextContent("BL07-VAC-01");
    expect(tableRows[1]).toHaveTextContent("BL07-VAC-OLD-02");
  });

  it("swaps PV list for change in archiver selection", async (): Promise<void> => {
    const { getByLabelText, getByRole, getAllByRole } = renderComponent();
    // The first element we find is the PV search
    const select = getByLabelText("archiver-select");
    const combobox = getAllByRole("combobox")[0];

    expect(select).toBeInTheDocument();
    expect(select).toHaveTextContent("Primary");

    await fireEvent.mouseDown(combobox);

    // const popup = getByRole("button");

    // const listbox = within(popup).getByRole("listbox")

    // await fireEvent.click(within(popup).getByText("Standby"));
    const listbox = getByRole("listbox");

    const options = within(listbox).getAllByRole("option");
    await fireEvent.click(options[1]);

    expect(select).toHaveTextContent("Standby");
    const tableCells = getAllByRole("cell");
    expect(tableCells.length).toBe(5);
    expect(tableCells[0]).toHaveTextContent("Standby");
  });
});
