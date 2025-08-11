import React, { useContext, useRef, forwardRef, useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../ThemeContext';
import logo from '../assets/logo.png';
import homeLight from '../assets/home-light.png';
import homeDark from '../assets/home-dark.png';
import browseLight from '../assets/browse-light.png';
import browseDark from '../assets/browse-dark.png';
import { FaBars } from 'react-icons/fa';

const HeaderComponent = forwardRef(function Header(
  { logoSrc = logo, iconSpacing = '0.5rem', onNavigate },
  ref
) {
  const { mode, toggleTheme } = useContext(ThemeContext);
  const homeIcon = mode === 'light' ? homeLight : homeDark;
  const browseIcon = mode === 'light' ? browseLight : browseDark;
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(prev => !prev);

  const goHome = () => {
    navigate('/home');
    onNavigate?.('home');
  };

  const goBrowse = () => {
    navigate('/home');
    onNavigate?.('browse');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('email');
    navigate('/guest'); // ✅ Redirect to GuestLayout or landing page
  };

  return (
    <HeaderContainer ref={ref}>
      <TopGroup>
        <LeftGroup gap={iconSpacing}>
          <Logo
            src={logoSrc}
            alt="App Logo"
            title="Go to Home"
            onClick={goHome}
          />
          <Icon
            src={homeIcon}
            alt="Home Icon"
            title="Home"
            onClick={goHome}
          />
          <BrowseIcon
            src={browseIcon}
            alt="Browse Icon"
            title="Browse Albums"
            onClick={goBrowse}
          />
        </LeftGroup>

        <NavRight>
          <NavButton to="/about">About</NavButton>
          <NavButton to="/premium">Premium</NavButton>
          <NavButton to="/support">Support</NavButton>
          <ThemeButton
            title="Toggle theme"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {mode === 'light' ? '🌙' : '🌞'}
          </ThemeButton>
          <HamburgerIcon onClick={toggleMenu}>
            <FaBars />
          </HamburgerIcon>

          {menuOpen && (
            <DropdownMenu>
              <DropdownItem onClick={() => navigate('/account')}>Account</DropdownItem>
              <DropdownItem onClick={() => navigate('/settings')}>Settings</DropdownItem>
              <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
            </DropdownMenu>
          )}
        </NavRight>
      </TopGroup>
    </HeaderContainer>
  );
});

export default HeaderComponent;


 
// Styled Components
const HeaderContainer = styled.header`
  position: relative;
  background: ${({ theme }) => theme.header};
  padding: 0.5rem 1rem;
  z-index: 10;
  width: 100%;
  transition: height 0.3s ease;
`;

const TopGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const LeftGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ gap }) => gap};
`;

const Logo = styled.img`
  height: 40px;
  width: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
    transform: scale(1.05);
  }
`;

const Icon = styled.img`
  height: 40px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
    transform: scale(1.05);
  }
`;

const BrowseIcon = styled.img`
  height: 22px;
  width: 22px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
    transform: scale(1.1);
  }
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    justify-content: center;
  }
`;

const NavButton = styled(Link)`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  cursor: pointer;
  padding: 0.4rem 0.8rem;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
    transform: scale(1.05);
  }
`;

const ThemeButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
    transform: scale(1.2);
  }
`;

const HamburgerIcon = styled.div`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    opacity: 0.8;
  }

  @media (max-width: 600px) {
    margin-left: auto;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 60px;
  right: 1rem;
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.text};
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  z-index: 100;
  min-width: 160px;
  padding: 0.5rem;
`;

const DropdownItem = styled.div`
  padding: 0.5rem 1rem;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) =>
      theme.text === '#000000' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'};
  }
`;
