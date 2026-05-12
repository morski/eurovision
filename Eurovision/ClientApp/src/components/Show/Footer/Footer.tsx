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
        color: "white",
      }}
      className="footer"
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={view}
        onChange={(event, newValue) => {
          setView(newValue);
        }}
        sx={{ background: "rgba(0, 0, 0, 0.82)", color: "white", height: "60px", backdropFilter: "blur(12px)" }}
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
            "&.Mui-selected": { color: "var(--esc-cyan)" },
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
            "&.Mui-selected": { color: "var(--esc-cyan)" },
          }}
        />
      </BottomNavigation>
    </Paper>
  );
}

export default Footer;
