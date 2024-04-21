import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import EventBus from "../../common/EventBus";
import AuthService from "../../services/auth.service";
import EventService from "../../services/event.service";

import IEurovisionEvent from "../../types/event.type";
import IUser from "../../types/user.type";

<<<<<<< HEAD
import "./default.css";
import Admin from "../admin/admin";
import Room from "../room/room";
=======
import Home from "../Home/Home";
import Navbar from "../Navbar/Navbar";
import Profile from "../profile.component";
import Room from "../Room/Room";
import Show from "../Show/Show";
>>>>>>> 088ed8e (Changed components into JSX elements with function declaration. Renamed components. Organized imports.)

import "./Default.css";

function Default() {
  const [currentUser, setCurrentUser] = useState<IUser>({} as IUser);
<<<<<<< HEAD
  const [activeEvent, setActiveEvent] = useState<IEurovisionEvent | null>(null);
=======
  const [activeEvent, setActiveEvent] = useState<IEurovisionEvent>({
    year: 2024,
  } as IEurovisionEvent);
>>>>>>> 088ed8e (Changed components into JSX elements with function declaration. Renamed components. Organized imports.)
  const nav = useNavigate();

  useEffect(() => {
    setupEventListeners();
    setCurrentUser(AuthService.getCurrentUser());
    const getEvent = async () => {
      setActiveEvent(await EventService.getActiveEvent());
    };

    getEvent();
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
    {activeEvent &&
    <div>
      <Navbar user={currentUser} year={activeEvent.year} />
      <Routes>
        <Route
          path="*"
          element={<Home event={activeEvent} user={currentUser} />}
        />
        <Route
          path="/semi-final-1"
          element={<Show key={1} showType={1} year={activeEvent.year} />}
        />
        <Route
          path="/semi-final-2"
          element={<Show key={2} showType={2} year={activeEvent.year} />}
        />
        <Route
          path="/grand-final"
          element={<Show key={3} showType={3} year={activeEvent.year} />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/rooms" element={<Room />} />
      </Routes>
    </div>
    }
    </>
  );
}

export default Default;
