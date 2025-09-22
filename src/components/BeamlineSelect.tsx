import InputLabel from "@mui/material/InputLabel";
import {MenuItem as MuiMenuItem, styled} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useContext } from "react";
import BeamlineTreeStateContext from "../routes/MainPage";
import { FileContext, executeAction } from "@diamondlightsource/cs-web-lib";
import { CHANGE_BEAMLINE } from "../store";
import { Tooltip } from "@mui/material";

const MenuItem = styled(MuiMenuItem)({
    "&.Mui-disabled": {
      pointerEvents: "auto"
    }
});

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
          console.log(state.beamlines[beamline].loaded)
          return (
            <MenuItem disabled={!state.beamlines[beamline].loaded} key={beamline} value={beamline}>
              <Tooltip key={beamline} title={state.beamlines[beamline].loaded ? "" : `Unable to load JSON map for ${beamline}. Check file is available at ${state.beamlines[beamline].host + state.beamlines[beamline].entryPoint} and reload.`}>
                <span>{beamline}</span>
              </Tooltip>
            </MenuItem>  
          );
        })}
      </Select>
    </FormControl>
  );
}
