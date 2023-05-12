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
import Admin from "../admin/admin";
import IRoom from "../../types/room.type";
import RoomService from "../../services/room.service";
import Room from "../room/room";

const Default: FunctionComponent = () => {

  const [currentUser, setCurrentUser] = useState<IUser>({} as IUser);
  const [activeEvent, setActiveEvent] = useState<IEurovisionEvent>({ year: 2023 } as IEurovisionEvent);
  const nav = useNavigate();

  useEffect(() => {
    setupEventListeners();
    setCurrentUser(AuthService.getCurrentUser());
    const getEvent = async () => {
      setActiveEvent(await EventService.getActiveEvent());
    }
    
    getEvent();
  }, []);

  const logout = () => {
    console.log('in the logout');
    AuthService.logout();
  }

  const navigate = (e: CustomEvent): void => {
    console.log(e);
    nav(e.detail);
  }

  const setupEventListeners = () => {
    EventBus.on("logout", logout);
    EventBus.on("navigate", navigate);
  }

  return (
    <div>
      <Navbar user={currentUser} year={activeEvent.year} />
      <Routes>
        <Route path="*" element={<Home event={activeEvent} user={currentUser} />} />
        <Route path="/semi-final-1" element={<Show key={1} showType={1} year={activeEvent.year} />} />
        <Route path="/semi-final-2" element={<Show key={2} showType={2} year={activeEvent.year} />} />
        <Route path="/grand-final" element={<Show key={3} showType={3} year={activeEvent.year} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/rooms" element={<Room />} />
      </Routes>
    </div>
  );
}

export default Default;