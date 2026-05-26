import { useState } from "react";

import MenuIcon from "@mui/icons-material/Menu";
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Container,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";

import EventBus from "../../common/EventBus";
import IUser from "../../types/user.type";

import "./Navbar.css";

type INavbarProps = {
    user: IUser;
    year: number;
    isAdmin?: boolean;
    subCompetitions?: any[];
};

function Navbar({ user, year, isAdmin, subCompetitions = [] }: INavbarProps) {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const navigateToPage = (page: string) => {
        setAnchorElNav(null);
        setAnchorElUser(null);
        EventBus.dispatch("navigate", page);
    };

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position='sticky' className="appbar">
            <Container maxWidth='md'>
                <Toolbar disableGutters>
                    <Box
                        component='img'
                        sx={{
                            height: 58,
                            display: { xs: "none", md: "flex" },
                            mr: 3,
                            mt: 1,
                            mb: 1,
                            cursor: "pointer",
                        }}
                        alt='Your logo.'
                        src={`/images/${year}/logo/eurovision_${year}_white.png`}
                        onClick={() => navigateToPage("/")}
                    />
                    <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                        <IconButton
                            size='large'
                            aria-label='account of current user'
                            aria-controls='menu-appbar'
                            aria-haspopup='true'
                            onClick={handleOpenNavMenu}
                            color='inherit'
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id='menu-appbar'
                            anchorEl={anchorElNav}
                            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                            keepMounted
                            transformOrigin={{ vertical: "top", horizontal: "left" }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: "block", md: "none" } }}
                        >
                            <MenuItem key={"Home"} onClick={() => navigateToPage("/")}>
                                <Typography textAlign='center' fontFamily='gotham-book' fontWeight='700' textTransform="uppercase">Home</Typography>
                            </MenuItem>
                            {subCompetitions.map((sub: any, index: number) => (
                                <MenuItem key={sub.recordGuid} onClick={() => navigateToPage(`/show-${index + 1}`)}>
                                    <Typography textAlign='center' fontFamily='gotham-book' fontWeight='700' textTransform="uppercase">
                                        {sub.name}
                                    </Typography>
                                </MenuItem>
                            ))}
                            {isAdmin && (
                                <MenuItem key={"Admin"} onClick={() => navigateToPage("/admin")}>
                                    <Typography textAlign='center' fontFamily='gotham-book' fontWeight='700' textTransform="uppercase">Admin</Typography>
                                </MenuItem>
                            )}
                        </Menu>
                    </Box>
                    <Box
                        component='div'
                        sx={{ display: { xs: "flex", md: "none" }, flexGrow: 1, mr: 1 }}
                    >
                        <Box
                            component='img'
                            sx={{ height: 54, mr: 1, mt: 1, mb: 1 }}
                            alt='Eurovision Logo'
                            src={`/images/${year}/logo/eurovision_${year}_white.png`}
                        />
                    </Box>

                    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                        {subCompetitions.map((sub: any, index: number) => (
                            <Button
                                key={sub.recordGuid}
                                onClick={() => navigateToPage(`/show-${index + 1}`)}
                                sx={{ my: 2, color: "white", display: "block", fontFamily: 'gotham-book', fontWeight: 700 }}
                            >
                                {sub.name}
                            </Button>
                        ))}
                        {isAdmin && (
                            <Button
                                key={"Admin"}
                                onClick={() => navigateToPage("/admin")}
                                sx={{ my: 2, color: "var(--esc-cyan)", display: "block", fontFamily: 'gotham-book', fontWeight: 700 }}
                            >
                                Admin
                            </Button>
                        )}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title='Menu'>
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar
                                    sx={{
                                        background: "linear-gradient(135deg, var(--esc-pink), var(--esc-cyan))",
                                        border: "2px solid rgba(255, 255, 255, 0.84)",
                                        fontFamily: "gotham-book",
                                        fontWeight: "700",
                                    }}
                                    alt={user.username?.toUpperCase()}
                                    src='/static/images/avatar/2.jpg'
                                />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: "45px" }}
                            id='menu-appbar'
                            anchorEl={anchorElUser}
                            anchorOrigin={{ vertical: "top", horizontal: "right" }}
                            keepMounted
                            transformOrigin={{ vertical: "top", horizontal: "right" }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {isAdmin && (
                                <MenuItem key={"admin"} onClick={() => navigateToPage("/admin")}>
                                    <Typography textAlign='center'>Admin Panel</Typography>
                                </MenuItem>
                            )}
                            <MenuItem key={"rooms"} onClick={() => navigateToPage("/rooms")}>
                                <Typography textAlign='center'>Rooms</Typography>
                            </MenuItem>
                            <MenuItem key={"logout"} onClick={() => EventBus.dispatch("logout")}>
                                <Typography textAlign='center'>Logout</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navbar;
