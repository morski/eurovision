import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useGetActiveEvent } from "../../hooks/useEvents";

import EventBus from "../../common/EventBus";
import AuthService from "../../services/auth.service";

import IUser from "../../types/user.type";

import Home from "../Home/Home";
import Navbar from "../Navbar/Navbar";
import Room from "../Room/Room";
import Show from "../Show/Show";

function Default() {
  const [currentUser, setCurrentUser] = useState<IUser>({} as IUser);
  const { data: activeEvent } = useGetActiveEvent();
  const nav = useNavigate();

  useEffect(() => {
    setupEventListeners();
    setCurrentUser(AuthService.getCurrentUser());
  }, []);

  const logout = () => {
    AuthService.logout();
  };

  const navigate = (e: CustomEvent): void => {
    nav(e.detail);
  };

  const setupEventListeners = () => {
    EventBus.on("logout", logout);
    EventBus.on("navigate", navigate);
  };

  return (
    <>
      {activeEvent && (
        <div>
          <Navbar user={currentUser} year={activeEvent.year} />
          <Routes>
            <Route path='*' element={<Home event={activeEvent} user={currentUser} />} />
            <Route path='/semi-final-1' element={<Show key={1} showType={1} year={activeEvent.year} />} />
            <Route path='/semi-final-2' element={<Show key={2} showType={2} year={activeEvent.year} />} />
            <Route path='/grand-final' element={<Show key={3} showType={3} year={activeEvent.year} />} />
            <Route path='/rooms' element={<Room />} />
          </Routes>
        </div>
      )}
    </>
  );
}

export default Default;
