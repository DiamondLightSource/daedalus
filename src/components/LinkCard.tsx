import {
  Button as MuiButton,
  Card,
  CardActions,
  CardContent,
  CardProps,
  styled,
  Typography
} from "@mui/material";
import { useHistory } from "react-router-dom";

const Button = styled(MuiButton)(({ theme }) => ({
  backgroundColor: theme.palette.info.contrastText,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.info.main
}));

interface LinkCardProps extends CardProps {
  info: {
    name: string;
    route: string;
    text: string;
  };
}

export default function LinkCard(props: LinkCardProps) {
  const history = useHistory();
  const { info } = props;

  const handleLinkClick = (e: any) => {
    history.push(e.target.value);
  };

  return (
    <Card sx={{ height: "100%", width: "100%" }}>
      <CardContent>
        <Typography variant="h4" component="div">
          {info.name}
        </Typography>
        <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
          {info.route}
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
          <br />
          {info.text}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="medium" value={info.route} onClick={handleLinkClick}>
          VISIT
        </Button>
      </CardActions>
    </Card>
  );
}
