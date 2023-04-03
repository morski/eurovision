import { Component, FunctionComponent, useState } from "react";
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import "./footer.css";

const Footer: FunctionComponent = () => {

  const [value, setValue] = useState(0);

  return (
    <Paper sx={{
      position: 'sticky',
      bottom: 0,
      left: 0,
      right: 0,
      height: '80px',
      flexDirection: 'column',
      display: 'flex',
      justifyContent: 'center',
    }} elevation={3} >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction label="Vote" icon={<HowToVoteIcon />} />
        <BottomNavigationAction label="Result" icon={<StackedBarChartIcon />} />
      </BottomNavigation>
    </Paper >

  );
}

export default Footer;