import {
  Button,
  ListSubheader,
  Menu,
  MenuItem as MuiMenuItem,
  styled
} from "@mui/material";
import { useContext, useState } from "react";
import { FileContext } from "@diamondlightsource/cs-web-lib";
import { Tooltip } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { BeamlineTreeStateContext } from "../../contexts/BeamlineTreeStateContext";
import { CHANGE_BEAMLINE } from "../../store";
import { executeOpenPageActionWithFileGuid } from "../../utils/csWebLibActions";

const MenuItem = styled(MuiMenuItem)({
  "&.Mui-disabled": {
    pointerEvents: "auto"
  }
});

export default function BeamlineSelect() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const buttonId = "beamline-select-button";
  const menuId = "beamline-select-menu";

  const { state, dispatch } = useContext(BeamlineTreeStateContext);
  const fileContext = useContext(FileContext);

  const handleChange = (beamline: string) => {
    dispatch({
      type: CHANGE_BEAMLINE,
      payload: { beamline: beamline }
    });

    const beamlineState = state.beamlines[beamline];

    executeOpenPageActionWithFileGuid(
      beamlineState,
      beamlineState.topLevelScreen,
      beamline,
      fileContext
    );
  };

  return (
    <>
      <Button
        id={buttonId}
        data-testid={buttonId}
        aria-controls={open ? menuId : undefined}
        aria-haspopup="true"
        aria-expanded={open}
        endIcon={<ExpandMore />}
        onClick={e => setAnchorEl(e.currentTarget)}
        color="inherit"
        variant="outlined"
        sx={{ borderColor: "currentColor", textTransform: "none" }}
      >
        {state.currentBeamline ? state.currentBeamline : "Select beamline"}
      </Button>
      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        slotProps={{ list: { "aria-labelledby": buttonId } }}
      >
        <ListSubheader>Available Beamlines</ListSubheader>
        {Object.keys(state.beamlines).map(function (beamline) {
          return (
            <MenuItem
              disabled={!state.beamlines[beamline].loaded}
              key={beamline}
              value={beamline}
              onClick={() => {
                setAnchorEl(null);
                if (beamline !== state.currentBeamline) handleChange(beamline);
              }}
            >
              <Tooltip
                key={beamline}
                title={
                  state.beamlines[beamline].loaded
                    ? ""
                    : `Unable to load JSON map for ${beamline}. Check file is available at ${state.beamlines[beamline].host + state.beamlines[beamline].entryPoint} and reload.`
                }
              >
                <span>{beamline}</span>
              </Tooltip>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
