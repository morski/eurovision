import EventBus from '../common/EventBus';
import IEurovisionEvent from '../types/event.type';
import ISubcompetition from '../types/subcompetition.type';
import { authHeader } from './auth-header';
import authService from './auth.service';

const BASE_URL = process.env.REACT_APP_BASE_URL ?? "";
const API_URL = BASE_URL + 'api/eurovision/';


class EventService {
  getActiveEvent() {
    const event = localStorage.getItem("activeEvent");
    console.log("Do we have the event?" + event);
    if (event) {
      return JSON.parse(event);
    }
    else {
      return fetch(API_URL + "event/active", {
        headers: authHeader(),
        mode: "cors",
      })
        .then(response => response.json())
        .then(response => {
          this.saveEventToLocalStorage(response as IEurovisionEvent);
          return response;
        });
    }
  }

  getEvent(year: number): Promise<IEurovisionEvent> {
    return fetch(API_URL + "event/" + year, {
      headers: authHeader(),
      mode: "cors",
    })
    .then(async response => {
      if(response.ok) {
          return response.json();
      }
      else {
          return await authService.refreshToken()
          .then(async response => {
              if(response) {
                  return await this.getEvent(year);
              }
          });
      }
    })
    .then(response => {
      return response;
    });
  }

  getSubcompetition = (year: number, showType: number): Promise<ISubcompetition> => {
    return fetch(API_URL + "subcompetition/" + year + '/' + showType + "?includeVotes=true", {
      headers: authHeader(),
      mode: "cors",
    })
    .then(async response => {
      if(response.ok) {
          return response.json();
      }
      else {
        return await authService.refreshToken()
        .then(async response => {
            if(response) {
                return await this.getSubcompetition(year, showType);
            }
        });
      }
    })
    .then(response => {
      return response;
    });
  }

  getSubCompetitionResults = (year: number, showType: number): Promise<ISubcompetition> => {
    return fetch(API_URL + "subcompetition/" + year + '/' + showType + "/result", {
      headers: authHeader(),
      mode: "cors",
    })
    .then(async response => {
      if(response.ok) {
          return response.json();
      }
      else {
        return await authService.refreshToken()
        .then(async response => {
            if(response) {
                return await this.getSubCompetitionResults(year, showType);
            }
        });
      }
    })
    .then(response => {
      return response;
    });
  }

  saveEventToLocalStorage(event: IEurovisionEvent) {
    localStorage.setItem('activeEvent', JSON.stringify(event));
  }

  
}

export default new EventService();