// Default.tsx
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import EventBus from "../../common/EventBus";
import AuthService from "../../services/auth.service";
import IUser from "../../types/user.type";
import Home from "../Home/Home";
import Navbar from "../Navbar/Navbar";
import Room from "../Room/Room";
import Show from "../Show/Show";
import Admin from "../Admin/Admin";

function Default() {
    const [currentUser, setCurrentUser] = useState<IUser>({} as IUser);
    const [subCompetitions, setSubCompetitions] = useState<any[]>([]);
    const nav = useNavigate();
    const isAdmin = currentUser?.isAdmin ?? false;

    // Always fetch fresh active event from server, never from cache
    const [activeEvent, setActiveEvent] = useState<any>(null);

    useEffect(() => {
        const logout = () => {
            AuthService.logout();
        };
        const navigate = (e: any): void => {
            nav(e.detail);
        };
        EventBus.on("logout", logout);
        EventBus.on("navigate", navigate);
        setCurrentUser(AuthService.getCurrentUser());

        // Fetch active event fresh from server every time
        fetch("/api/eurovision/event/active/full")
            .then(r => r.json())
            .then(event => {
                setActiveEvent(event);
                // Fetch sub-competitions for this event
                return fetch(`/api/eurovision/subcompetitions/active`);
            })
            .then(r => r.json())
            .then(setSubCompetitions)
            .catch(() => { });

        return () => {
            EventBus.remove("logout", logout);
            EventBus.remove("navigate", navigate);
        };
    }, [nav]);

    console.log("subCompetitions:", subCompetitions);
    console.log("activeEvent:", activeEvent);


    return (
        <>
            {activeEvent && (
                <div>
                    <Navbar
                        user={currentUser}
                        year={activeEvent.year}
                        isAdmin={isAdmin}
                        subCompetitions={subCompetitions}
                    />
                    <Routes>
                        <Route path='*' element={<Home event={activeEvent} user={currentUser} />} />
                        {subCompetitions.map((sub: any, index: number) => (
                            <Route
                                key={sub.recordGuid}
                                path={`/show-${index + 1}`}
                                element={<Show key={index + 1} showType={index + 1} year={activeEvent.year} subCompetitionId={sub.recordGuid} />}
                            />
                        ))}
                        <Route path='/rooms' element={<Room />} />
                        {isAdmin && <Route path='/admin' element={<Admin />} />}
                    </Routes>
                </div>
            )}
        </>
    );
}

export default Default;