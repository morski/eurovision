import { Component, FunctionComponent, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import IUser from '../../types/user.type';
import IEurovisionEvent from "../../types/event.type";

import Home from "../home/home";
import Profile from "../profile.component";
import Show from "../show/show";

import EventBus from "../../common/EventBus";
import AuthService from "../../services/auth.service";
import EventService from "../../services/event.service";

import Navbar from "../navbar/navbar";

import "./default.css";

const Default: FunctionComponent = () => {

  const [currentUser, setCurrentUser] = useState<IUser | undefined>();
  const [activeEvent, setActiveEvent] = useState<IEurovisionEvent>({} as IEurovisionEvent);
  const [showAdminBoard, setShowAdminBoard] = useState<boolean>(false);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    } else {
      window.history.pushState({}, "", "/login");
      window.location.reload();
    }

    let event = EventService.getEventFromLocalStorage();
    if (event) {
      setActiveEvent(event);
    } else {
      EventService.getActiveEvent()
        .then(response => response.json())
        .then(response => {
          setActiveEvent(response);
          EventService.saveEventToLocalStorage(response);
        });
    }

    EventBus.on("logout", logout);
  }, []);

  const logout = () => {
    AuthService.logout();
    setShowAdminBoard(false);
    setCurrentUser(undefined);

    window.history.pushState({}, "", "/login");
    window.location.reload();
  }

  return (
    <div>
      <Navbar />

      <div className="main-container">
        <div className="container mt-3 content-container">
          <Routes>
            <Route path="*" element={<Home event={activeEvent} />} />
            <Route path="/semi-final-1" element={<Show showType={1} year={activeEvent.year!} />} />
            <Route path="/semi-final-2" element={<Show showType={2} year={activeEvent.year!} />} />
            <Route path="/grand-final" element={<Show showType={3} year={activeEvent.year!} />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Default;