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

type IShowProps = {
  showType: number,
  year: number
};

const Show: FunctionComponent<IShowProps> = ({ showType, year }) => {
  const [event, setEvent] = useState<IEurovisionEvent>();
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
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
    <Container maxWidth="xl">
      <div className="container final-container">
        <header className="jumbotron">
          <h3>{event?.location}</h3>
        </header>
        <div className="participant-container">
          {event?.shows && event.shows[0].participants.sort((a, b) => a.order! - b.order!).map((participant, index) =>
            <Accordion key={index} className="participant-item glass-container" sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.28)',
              borderRadius: '4px',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '20px',
              color: '#FFF',
              textTransform: 'uppercase',
              textAlign: 'center',
              width: '90%',
              maxWidth: '600px'
            }}>

              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <img width="80" height="80" src={`/images/flag/hearts/${participant.country && participant.country.toLowerCase().replace(" ", "_")}.svg`} alt="flag" />
                <div className="text-container">
                  <span className="name">{participant.name}</span>
                  <span className="song">{participant.song}</span>
                  <span className="country">{participant.country}</span>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                Here you can vote
              </AccordionDetails>
            </Accordion>
          )}
        </div>
        <Footer />
      </div>
    </Container>

  );
}

export default Show;