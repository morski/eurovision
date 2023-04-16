import { FunctionComponent, useState, useEffect } from "react";

import EventService from "../../services/event.service";
import EventBus from "../../common/EventBus";
import IEurovisionEvent from "../../types/event.type";
import "./show.css";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Container from '@mui/material/Container';
import Footer from "./footer/footer";
import Participant from "../participant/participant";
import Filters from "../filters/filters";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Box from "@mui/material/Box";

type IShowProps = {
  showType: number,
  year: number
};

const Show: FunctionComponent<IShowProps> = ({ showType, year }) => {
  const [event, setEvent] = useState<IEurovisionEvent>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const breakpoints = {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920
  }

  const getColumns = (width: number) => {
    if (width < breakpoints.md) {
      return 1
    } else if (width < breakpoints.lg) {
      return 2
    } else if (width < breakpoints.xl) {
      return 3
    } else {
      return 3
    }
  }

  const [columns, setColumns] = useState(getColumns(window.innerWidth))
  const updateDimensions = () => {
    setColumns(getColumns(window.innerWidth))
  }

  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    console.log('We here');
    console.log(year);
    console.log(showType);
    console.log(loaded);
    if (year && showType && !loaded) {
      console.log('Fetching show');
      EventService.getEvent(year, showType)
        .then(response => response.json())
        .then(response => {
          console.log(response);
          setEvent(response);
          setLoaded(true);
        })
        .catch(
          error => {
            if (error.response && error.response.status === 401) {
              EventBus.dispatch("logout");
            }
            return (error.response &&
              error.response.data &&
              error.response.data.message) ||
              error.message ||
              error.toString();
          }
        );
    }
  }, [year]);

  return (
    <Container maxWidth="md" className="main-content" sx={{
      display: 'flex',
    }}>
      <header className="jumbotron">
        <h1>{event?.location}</h1>
      </header>
      <div className="filters">
        <Filters/>
      </div>
      <Box className="participants-container">
        {event && event.shows && (<Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          {event!.shows[0].participants.sort((a, b) => a.order! - b.order!).map((item, index) =>
            <Participant key={index} participant={item} eventYear={year} expanded={expanded} setExpanded={handleChange} index={index} />
          )}
        </Box>)}
      </Box>
    </Container>
  );
}

export default Show;