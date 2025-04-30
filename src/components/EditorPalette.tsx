import { styled } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import { IconButton, Typography, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid";
import PaletteIcon from "@mui/icons-material/Palette";
import { useState } from "react";
import {
  ActionButton,
  Arc,
  BoolButton,
  ChoiceButton,
  Color,
  Ellipse,
  Input,
  Label,
  Line,
  MenuButton,
  Polygon,
  Readback,
  RelativePosition,
  Shape
} from "@diamondlightsource/cs-web-lib";

const MenuBarHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1)
}));

export interface PaletteProps {}

export default function EditorPalette(props: PaletteProps) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <>
      <IconButton
        color="inherit"
        sx={{ zIndex: 10, top: "90%", left: "93%" }}
        onClick={toggleDrawer(true)}
      >
        <PaletteIcon
          sx={{
            width: "36px",
            height: "36px",
            color: theme.palette.primary.main
          }}
        />
      </IconButton>
      <Drawer
        open={open}
        variant="temporary"
        anchor="bottom"
        onClose={toggleDrawer(false)}
        PaperProps={{ sx: { height: "300px", width: "100%" } }}
      >
        <MenuBarHeader
          sx={{ textAlign: "left", justifyContent: "left", padding: "15px" }}
        >
          <Typography
            variant="h1"
            sx={{ alignContent: "Center", color: theme.palette.primary.main }}
            paddingRight={"10px"}
            paddingLeft={"10px"}
          >
            Palette{" "}
          </Typography>
          <PaletteIcon
            sx={{
              width: "36px",
              height: "36px",
              color: theme.palette.primary.main
            }}
          />
        </MenuBarHeader>
        <PaletteGrid togglePalette={setOpen} />
      </Drawer>
    </>
  );
}

/**
 * A grid of all components
 */
function PaletteGrid(props: { togglePalette: any }) {
  const { togglePalette } = props;
  // This includes a label for each, and then a basic implementation of it

  const handleDrag = () => {
    togglePalette(false);
  };

  const components = [
    {
      name: "Label",
      component: (
        <Label
          position={new RelativePosition("100%", "100%")}
          text="Label Text"
          backgroundColor={Color.GREY}
          textAlignV="bottom"
          transparent={false}
        />
      )
    },
    {
      name: "Text Entry",
      component: <Input position={new RelativePosition("100%", "100%")} />
    },
    {
      name: "Text Update",
      component: <Readback position={new RelativePosition("100%", "100%")} />
    },
    {
      name: "ComboBox",
      component: <MenuButton position={new RelativePosition("100%", "100%")} />
    },
    {
      name: "Action Button",
      component: (
        <ActionButton
          position={new RelativePosition("100%", "100%")}
          text="Action Button"
        />
      )
    },
    {
      name: "Boolean Button",
      component: (
        <BoolButton
          position={new RelativePosition("100%", "100%")}
          height={20}
        />
      )
    },
    {
      name: "Choice Button",
      component: (
        <ChoiceButton
          position={new RelativePosition("100%", "100%")}
          height={20}
        />
      )
    },
    {
      name: "Arc",
      component: (
        <Arc
          position={new RelativePosition("50px", "30px")}
          width={30}
          height={30}
          lineWidth={1}
        />
      )
    },
    {
      name: "Ellipse",
      component: <Ellipse position={new RelativePosition("70px", "20px")} />
    },
    {
      name: "Polygon",
      component: (
        <Polygon
          position={new RelativePosition("100%", "100%")}
          height={20}
          points={{
            values: [
              { x: 0, y: 20 },
              { x: 20, y: 0 },
              { x: 70, y: 0 },
              { x: 50, y: 20 }
            ]
          }}
        />
      )
    },
    {
      name: "Polyline",
      component: (
        <Line
          position={new RelativePosition("100%", "100%")}
          height={20}
          width={70}
          points={{
            values: [
              { x: 0, y: 10 },
              { x: 20, y: 0 },
              { x: 30, y: 10 },
              { x: 50, y: 0 },
              { x: 70, y: 10 }
            ]
          }}
        />
      )
    },
    {
      name: "Rectangle",
      component: <Shape position={new RelativePosition("100%", "100%")} />
    }
  ];

  return (
    <>
      <Grid container spacing={2} rowGap={3} padding={"15px"}>
        {components.map(item => (
          <>
            <Grid key={item.name} item xs={1}>
              {item.name}
            </Grid>
            <Grid
              key={item.name + "Field"}
              item
              xs={1}
              sx={{ justifyItems: "right" }}
            >
              <div draggable onDrag={handleDrag}>
                {item.component}
              </div>
            </Grid>
          </>
        ))}
      </Grid>
    </>
  );
}
