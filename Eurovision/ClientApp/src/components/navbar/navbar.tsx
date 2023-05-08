import { FunctionComponent, useState } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import EventBus from "../../common/EventBus";
import IUser from "../../types/user.type";

type INavbarProps = {
    user: IUser,
    year: number
};

const Navbar: FunctionComponent<INavbarProps> = ({ user, year }) => {

    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const navigateToPage = (page: string) => {
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
        <AppBar position="sticky" sx={{backgroundColor: '#0043ff'}}>
            <Container maxWidth="md">
                <Toolbar disableGutters>
                    <Box
                        component="img"
                        sx={{
                            height: 64,
                            display: { xs: 'none', md: 'flex' },
                            mr: 1,
                            mt: 1,
                            mb: 1,
                            cursor: 'pointer'
                        }}
                        alt="Your logo."
                        src={`/images/${year}/logo/ESC2023_Ukraine_LIVERPOOL_RGB_White.png`}
                        onClick={() => navigateToPage("/")}

                    />
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            <MenuItem key={'Home'} onClick={() => navigateToPage("/")}>
                                <Typography textAlign="center">{'Home'}</Typography>
                            </MenuItem>
                            <MenuItem key={'First Semi-Final'} onClick={() => navigateToPage("/semi-final-1")}>
                                <Typography textAlign="center">{'First Semi-Final'}</Typography>
                            </MenuItem>
                            <MenuItem key={'Second Semi-Final'} onClick={() => navigateToPage("/semi-final-2")}>
                                <Typography textAlign="center">{'Second Semi-Final'}</Typography>
                            </MenuItem>
                            <MenuItem key={'Grand Final'} onClick={() => navigateToPage("/grand-final")}>
                                <Typography textAlign="center">{'Grand Final'}</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                    <Box
                        component="div"
                        sx={{
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            mr: 1
                        }}>
                        <Box
                            component="img"
                            sx={{
                                height: 64,
                                mr: 1,
                                mt: 1,
                                mb: 1,
                            }}
                            alt="Eurovision Logo"
                            src={`/images/${year}/logo/ESC2023_Ukraine_LIVERPOOL_RGB_White.png`}
                        />
                    </Box>


                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <Button
                            key={'First Semi-Final'}
                            onClick={() => navigateToPage("/semi-final-1")}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            {'First Semi-Final'}
                        </Button>
                        <Button
                            key={'Second Semi-Final'}
                            onClick={() => navigateToPage("/semi-final-2")}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            {'Second Semi-Final'}
                        </Button>
                        <Button
                            key={'Grand Final'}
                            onClick={() => navigateToPage("/grand-final")}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            {'Grand Final'}
                        </Button>
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Menu">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar sx={{backgroundColor: '#FF0087', fontFamily: 'gotham-book', fontWeight: '600'}} alt={user.username?.toUpperCase()} src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem key={'logout'} onClick={() => EventBus.dispatch("logout")}>
                                <Typography textAlign="center">Logout</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navbar;