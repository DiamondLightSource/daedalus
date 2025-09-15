import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useContext } from "react";
import BeamlineTreeStateContext from "../routes/MainPage";
import { FileContext, executeAction } from "@diamondlightsource/cs-web-lib";
import { CHANGE_BEAMLINE } from "../store";

export default function BeamlineSelect() {
  const { state, dispatch } = useContext(BeamlineTreeStateContext);
  const fileContext = useContext(FileContext);

  const handleChange = (event: SelectChangeEvent) => {
    dispatch({
      type: CHANGE_BEAMLINE,
      payload: { beamline: event.target.value }
    });
    // Load the toplevel screen for the beamline on click
    executeAction(
      {
        type: "OPEN_PAGE",
        dynamicInfo: {
          name: state.beamlines[event.target.value].topLevelScreen,
          location: "main",
          description: undefined,
          file: {
            path: state.beamlines[event.target.value].host + state.beamlines[event.target.value].topLevelScreen,
            macros: {},
            defaultProtocol: "ca"
          }
        }
      },
      fileContext,
      undefined,
      {},
      `/${event.target.value}`
    );
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Beamline</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={state.currentBeamline}
        label="Beamline"
        onChange={handleChange}
      >
        {Object.keys(state.beamlines).map(function (beamline) {
          return (
            <MenuItem key={beamline} value={beamline}>
              {beamline}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
