import {
  Card,
  CardContent,
  CardProps,
  Typography,
  CardActionArea,
  useTheme
} from "@mui/material";
import { useNavigate } from "react-router";
interface LinkCardProps extends CardProps {
  info: {
    name: string;
    route: string;
    text: string;
  };
}

export default function LinkCard(props: LinkCardProps) {
  const theme = useTheme();
  const navigate = useNavigate();

  const { info } = props;

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  return (
    <Card sx={{ height: "100%", width: "100%" }}>
      <CardActionArea onClick={() => handleCardClick(info.route)}>
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
          <Typography
            sx={{ textAlign: "center", color: theme.palette.info.main }}
          >
            <br />
            VISIT
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
