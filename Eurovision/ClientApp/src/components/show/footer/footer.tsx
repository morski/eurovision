import HowToVoteIcon from "@mui/icons-material/HowToVote";
import StackedBarChartIcon from "@mui/icons-material/StackedBarChart";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";

import "./Footer.css";

type IFooterProps = {
  view: number;
  setView: React.Dispatch<React.SetStateAction<number>>;
};

function Footer({ view, setView }: IFooterProps) {
  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "60px",
        flexDirection: "column",
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#0043ff",
        color: "white",
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={view}
        onChange={(event, newValue) => {
          setView(newValue);
        }}
        sx={{ backgroundColor: "#0043ff", color: "white" }}
      >
        <BottomNavigationAction
          label='VOTE'
          icon={<HowToVoteIcon />}
          sx={{
            color: "white",
            fontFamily: "gotham-book",
            ".MuiBottomNavigationAction-label": {
              "&.Mui-selected": { fontSize: "16px", fontWeight: "600" },
              fontFamily: "gotham-book",
            },
            "&.Mui-selected": { color: "#ff0087", textDecoration: "underline" },
          }}
        />
        <BottomNavigationAction
          label='RESULT'
          icon={<StackedBarChartIcon />}
          sx={{
            color: "white",
            ".MuiBottomNavigationAction-label": {
              "&.Mui-selected": { fontSize: "16px", fontWeight: "600" },
              fontFamily: "gotham-book",
            },
            "&.Mui-selected": { color: "#ff0087", textDecoration: "underline" },
          }}
        />
      </BottomNavigation>
    </Paper>
  );
}

export default Footer;
