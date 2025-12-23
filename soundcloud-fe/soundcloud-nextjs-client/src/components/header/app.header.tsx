'use client';
import { useSession, signOut } from 'next-auth/react';
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import Container from '@mui/material/Container';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { fetchDefaultImages } from '@/utils/api';
import ActiveLink from './active.link';

// styled-component
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '400px',
        },
    },
}));

export default function AppHeader() {
    const { data: session } = useSession();

    const router = useRouter();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            id={menuId}
            keepMounted
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem>
                <ActiveLink href={`/profile/${session?.user._id}`}>
                    Profile
                </ActiveLink>
            </MenuItem>
            <MenuItem
                onClick={() => {
                    handleMenuClose();
                    signOut();
                }}
            >
                Logout
            </MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            {session ? (
                <>
                    <MenuItem
                        onClick={() => {
                            handleMobileMenuClose();
                            router.push('/playlist');
                        }}
                    >
                        Playlists
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            handleMobileMenuClose();
                            router.push('/like');
                        }}
                    >
                        Likes
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            handleMobileMenuClose();
                            router.push('/track/upload');
                        }}
                    >
                        Upload
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            handleMobileMenuClose();
                            router.push(`/profile/${session.user._id}`);
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="primary-search-account-menu"
                            aria-haspopup="true"
                            color="inherit"
                        >
                            <Image onClick={handleProfileMenuOpen} src={fetchDefaultImages(session.user.type)} alt="avatar" width={35} height={35} />
                        </IconButton>
                        <p>Profile</p>
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            handleMobileMenuClose();
                            signOut();
                        }}
                    >
                        Logout
                    </MenuItem>
                </>
            ) : (
                <MenuItem
                    onClick={() => {
                        handleMobileMenuClose();
                        router.push('/auth/signin');
                    }}
                >
                    Login
                </MenuItem>
            )}
        </Menu>
    );

    const handleRedirectHome = () => {
        router.push('/');
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ backgroundColor: '#333' }}>
                <Container>
                    <Toolbar>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ display: { xs: 'none', sm: 'block', cursor: 'pointer' } }}
                            onClick={handleRedirectHome}
                        >
                            MinhSoundcloud
                        </Typography>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                                onKeyDown={(e: any) => {
                                    if (e.key === 'Enter') {
                                        if (e?.target?.value) router.push(`/search?q=${e?.target?.value}`);
                                    }
                                }}
                            />
                        </Search>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                gap: '20px',
                                alignItems: 'center',
                                cursor: 'pointer',
                                '> a': {
                                    color: 'unset',
                                    textDecoration: 'unset',
                                },
                                '& .active': {
                                    background: '#3b4a59',
                                    color: '#cefaff',
                                    borderRadius: '5px',
                                },
                            }}
                        >
                            {session ? (
                                <>
                                    <ActiveLink href={'/playlist'}>Playlists</ActiveLink>
                                    <ActiveLink href={'/like'}>Likes</ActiveLink>
                                    <ActiveLink href={'/track/upload'}>Upload</ActiveLink>
                                    <Image
                                        onClick={handleProfileMenuOpen}
                                        src={fetchDefaultImages(session.user.type)}
                                        alt="avatar"
                                        width={35}
                                        height={35}
                                    />
                                </>
                            ) : (
                                <>
                                    <ActiveLink
                                        href={'/auth/signin'}
                                        // onClick={() => signIn()}
                                    >
                                        Login
                                    </ActiveLink>
                                </>
                            )}
                        </Box>
                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="show more"
                                aria-controls={mobileMenuId}
                                aria-haspopup="true"
                                onClick={handleMobileMenuOpen}
                                color="inherit"
                            >
                                <MoreIcon />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </Box>
    );
}
