import { Box, Button, Checkbox, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

/**
 * Lists all properties of the component with editable values
 */
export function PropertiesGrid() {
  const positionPropList = [
    {
      label: "X Position",
      component: (
        <TextField
          sx={{
            "& .MuiInputBase-input": { padding: "2px" },
            height: 20,
            lineHeight: "unset",
            padding: 0
          }}
          variant="outlined"
          value={0}
        />
      )
    },
    {
      label: "Y Position",
      component: (
        <TextField
          sx={{
            "& .MuiInputBase-input": { padding: "2px" },
            height: 20,
            lineHeight: "unset",
            padding: 0
          }}
          variant="outlined"
          value={0}
        />
      )
    },
    {
      label: "Width",
      component: (
        <TextField
          sx={{
            "& .MuiInputBase-input": { padding: "2px" },
            height: 20,
            lineHeight: "unset",
            padding: 0
          }}
          variant="outlined"
          value={0}
        />
      )
    },
    {
      label: "Height",
      component: (
        <TextField
          sx={{
            "& .MuiInputBase-input": { padding: "2px" },
            height: 20,
            lineHeight: "unset",
            padding: 0
          }}
          variant="outlined"
          value={0}
        />
      )
    }
  ];
  const widgetPropList = [
    {
      label: "Type",
      component: <Typography variant="body1">{""}</Typography>
    },
    {
      label: "Name",
      component: (
        <TextField
          sx={{
            "& .MuiInputBase-input": { padding: "2px" },
            height: 20,
            lineHeight: "unset",
            padding: 0
          }}
          variant="outlined"
          value={"Widget name"}
        />
      )
    },
    {
      label: "Class",
      component: <Typography>DEFAULT</Typography>
    },
    {
      label: "PV Name",
      component: (
        <TextField
          sx={{
            "& .MuiInputBase-input": { padding: "2px" },
            height: 20,
            lineHeight: "unset",
            padding: 0
          }}
          variant="outlined"
          value={"TEST-TEST-01:HELLO"}
        />
      )
    },
    {
      label: "Text",
      component: (
        <TextField
          sx={{
            "& .MuiInputBase-input": { padding: "2px" },
            height: 20,
            lineHeight: "unset",
            padding: 0
          }}
          variant="outlined"
          value={"Text on the widget"}
        />
      )
    }
  ];

  const displayPropList = [
    {
      label: "Visible",
      component: (
        <Checkbox
          defaultChecked
          sx={{ width: "20px", height: "20px", alignItems: "center" }}
        />
      )
    },
    {
      label: "Font",
      component: (
        <TextField
          sx={{
            "& .MuiInputBase-input": { padding: "2px" },
            height: 20,
            lineHeight: "unset",
            padding: 0
          }}
          variant="outlined"
          value={"Arial 14"}
        />
      )
    },
    {
      label: "Foreground Color",
      component: (
        <TextField
          sx={{
            "& .MuiInputBase-input": { padding: "2px" },
            height: 20,
            lineHeight: "unset",
            padding: 0
          }}
          variant="outlined"
          value={"RGB(100, 109, 199)"}
        />
      )
    },
    {
      label: "Background Color",
      component: (
        <TextField
          sx={{
            "& .MuiInputBase-input": { padding: "2px" },
            height: 20,
            lineHeight: "unset",
            padding: 0
          }}
          variant="outlined"
          value={"RGB(100, 199, 199)"}
        />
      )
    },
    {
      label: "Transparent",
      component: <Checkbox sx={{ width: "20px", height: "20px" }} />
    },
    {
      label: "Precision",
      component: (
        <TextField
          sx={{
            "& .MuiInputBase-input": { padding: "2px" },
            height: 20,
            lineHeight: "unset",
            padding: 0
          }}
          variant="outlined"
          value={"-1"}
        />
      )
    },
    {
      label: "Wrap Words",
      component: <Checkbox sx={{ width: "20px", height: "20px" }} />
    }
  ];

  const behaviourPropList = [
    {
      label: "Actions",
      component: (
        <Button variant="outlined" sx={{ width: "100%", padding: 0 }}>
          No actions
        </Button>
      )
    },
    {
      label: "Rules",
      component: (
        <Button variant="outlined" sx={{ width: "100%", padding: 0 }}>
          No rules
        </Button>
      )
    },
    {
      label: "Tool tip",
      component: (
        <TextField
          sx={{
            "& .MuiInputBase-input": { padding: "2px" },
            height: 20,
            lineHeight: "unset",
            padding: 0
          }}
          variant="outlined"
          value={"${pv_name}\n${pv_name}"}
        />
      )
    },
    {
      label: "Alarm Border",
      component: <Checkbox sx={{ width: "20px", height: "20px" }} />
    },
    {
      label: "Enabled",
      component: (
        <Checkbox sx={{ width: "20px", height: "20px" }} defaultChecked />
      )
    }
  ];

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          sx={{
            margin: "10px 0px 10px 0px",
            color: "black",
            backgroundColor: "#ffe4b5",
            paddingLeft: "5px",
            fontWeight: "bold"
          }}
        >
          Widget
        </Typography>
        <Box>
          {widgetPropList.map(item => (
            <Grid
              key={`editor_menu_item_widget_${item.label}`}
              container
              spacing={1}
              padding={"5px 5px 5px 5px"}
            >
              <Grid key={item.label} size={{ xs: 5 }}>
                {item.label}
              </Grid>
              <Grid
                key={item.label + "Field"}
                size={{ xs: 7 }}
                sx={{ justifyItems: "right" }}
              >
                {item.component}
              </Grid>
            </Grid>
          ))}
        </Box>
        <Typography
          sx={{
            margin: "10px 0px 10px 0px",
            color: "black",
            backgroundColor: "#ffe4b5",
            paddingLeft: "5px",
            fontWeight: "bold"
          }}
        >
          Position
        </Typography>
        <Box>
          {positionPropList.map(item => (
            <Grid
              key={`editor_menu_item_position_${item.label}`}
              container
              spacing={1}
              padding={"5px 5px 5px 5px"}
            >
              <Grid key={item.label} size={{ xs: 5 }}>
                {item.label}
              </Grid>
              <Grid
                key={item.label + "Field"}
                size={{ xs: 7 }}
                sx={{ justifyItems: "right" }}
              >
                {item.component}
              </Grid>
            </Grid>
          ))}
        </Box>
        <Typography
          sx={{
            margin: "10px 0px 10px 0px",
            color: "black",
            backgroundColor: "#ffe4b5",
            paddingLeft: "5px",
            fontWeight: "bold"
          }}
        >
          Display
        </Typography>
        <Box>
          {displayPropList.map(item => (
            <Grid
              key={`editor_menu_item_display_${item.label}`}
              container
              spacing={1}
              padding={"5px 5px 5px 5px"}
            >
              <Grid key={item.label} size={{ xs: 5 }}>
                {item.label}
              </Grid>
              <Grid
                key={item.label + "Field"}
                size={{ xs: 7 }}
                justifyContent={"center"}
                sx={{ display: "flex" }}
              >
                {item.component}
              </Grid>
            </Grid>
          ))}
        </Box>
        <Typography
          sx={{
            margin: "10px 0px 10px 0px",
            color: "black",
            backgroundColor: "#ffe4b5",
            paddingLeft: "5px",
            fontWeight: "bold"
          }}
        >
          Behaviour
        </Typography>
        <Box>
          {behaviourPropList.map(item => (
            <Grid
              key={`editor_menu_item_behaviour_${item.label}`}
              container
              spacing={1}
              padding={"5px 5px 5px 5px"}
            >
              <Grid key={item.label} size={{ xs: 5 }}>
                {item.label}
              </Grid>
              <Grid
                key={item.label + "Field"}
                size={{ xs: 7 }}
                justifyContent={"center"}
                sx={{ display: "flex" }}
              >
                {item.component}
              </Grid>
            </Grid>
          ))}
        </Box>
      </Box>
    </>
  );
}
