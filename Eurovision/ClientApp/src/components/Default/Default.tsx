// Default.tsx
// This is the main layout component that wraps the entire app after login.
// It sets up the navigation bar, routes, and global event listeners.

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
import Admin from "../Admin/Admin";

function Default() {
    // currentUser holds the logged-in user's data (name, token, etc.)
    const [currentUser, setCurrentUser] = useState<IUser>({} as IUser);

    // Fetches the currently active Eurovision event (e.g. Eurovision 2026)
    const { data: activeEvent } = useGetActiveEvent();

    // nav is used to programmatically navigate to different pages
    const nav = useNavigate();

    const isAdmin = currentUser?.isAdmin ?? false;

    useEffect(() => {
        // Called once when the component first loads.
        // Sets up global event listeners and loads the current user from local storage.

        // Handles logout events triggered from anywhere in the app via EventBus
        const logout = () => {
            AuthService.logout();
        };

        // Handles navigation events triggered from anywhere in the app via EventBus
        const navigate = (e: CustomEvent): void => {
            nav(e.detail);
        };

        // EventBus is a global event system that allows different parts of the app
        // to communicate without being directly connected to each other.
        // For example, if the JWT token expires, any component can fire a "logout"
        // event and this listener will handle it.
        EventBus.on("logout", logout);
        EventBus.on("navigate", navigate);

        // Load the current user from local storage (saved there during login)
        setCurrentUser(AuthService.getCurrentUser());
    }, [nav]); // Empty array means this runs only once when the component mounts

    return (
        <>
            {/* Only render the app if there is an active event.
          If no event is set up in the database, nothing will show. */}
            {activeEvent && (
                <div>
                    {/* Navbar shows the top navigation bar with the user's name and event year */}
                    <Navbar user={currentUser} year={activeEvent.year} isAdmin={isAdmin} />

                    {/* Routes define which component to show based on the URL path.
              showType corresponds to: 1 = Semi Final 1, 2 = Semi Final 2, 3 = Grand Final */}
                    <Routes>
                        <Route path='*' element={<Home event={activeEvent} user={currentUser} />} />
                        <Route path='/semi-final-1' element={<Show key={1} showType={1} year={activeEvent.year} />} />
                        <Route path='/semi-final-2' element={<Show key={2} showType={2} year={activeEvent.year} />} />
                        <Route path='/grand-final' element={<Show key={3} showType={3} year={activeEvent.year} />} />
                        <Route path='/rooms' element={<Room />} />
                        {isAdmin && <Route path='/admin' element={<Admin />} />}
                    </Routes>
                </div>
            )}
        </>
    );
}

export default Default;