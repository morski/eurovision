import IEurovisionEvent from '../types/event.type';
import authHeader from './auth-header';

const BASE_URL = process.env.REACT_APP_BASE_URL ?? "";
const API_URL = BASE_URL + 'api/fake/event/';


class EventService {
  getActiveEvent() {
    const event = localStorage.getItem("activeEvent");
    console.log("Do we have the event?" + event);
    if (event) {
      return JSON.parse(event);
    }
    else {
      return fetch(API_URL, {
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

  getEvent(year: number, showType: number) {
    return fetch(API_URL + year + '/' + showType, {
      headers: authHeader(),
      mode: "cors",
    });
  }

  saveEventToLocalStorage(event: IEurovisionEvent) {
    localStorage.setItem('activeEvent', JSON.stringify(event));
  }
}

export default new EventService();