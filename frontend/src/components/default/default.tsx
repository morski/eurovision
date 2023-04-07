import { FunctionComponent, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
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

  const [currentUser, setCurrentUser] = useState<IUser>({} as IUser);
  const [activeEvent, setActiveEvent] = useState<IEurovisionEvent>({} as IEurovisionEvent);
  const nav = useNavigate();

  useEffect(() => {
    setupEventListeners();
    setCurrentUser(AuthService.getCurrentUser());
    setActiveEvent(EventService.getActiveEvent());
  }, []);

  const logout = () => {
    console.log('in the logout');
    AuthService.logout();
  }

  const navigate = (e: CustomEvent):void => {
    console.log(e);
    nav(e.detail);
  }

  const setupEventListeners = () => {
    EventBus.on("logout", logout);
    EventBus.on("navigate", navigate);
  }

  return (
    <div>
      <Navbar user={currentUser} year={activeEvent.year!} />

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