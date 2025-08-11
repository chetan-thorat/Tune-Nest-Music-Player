import React, { useContext, useRef, forwardRef } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeContext } from '../ThemeContext';
import logo from '../assets/logo.png';
import homeLight from '../assets/home-light.png';
import homeDark from '../assets/home-dark.png';
import searchLight from '../assets/search-light.png';
import searchDark from '../assets/search-dark.png';
import browseLight from '../assets/browse-light.png';
import browseDark from '../assets/browse-dark.png';

const HeadPage = forwardRef(({ onNavigate }, ref) => {
  const { mode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const icons = {
    home: mode === 'light' ? homeLight : homeDark,
    search: mode === 'light' ? searchLight : searchDark,
    browse: mode === 'light' ? browseLight : browseDark,
  };

  const handleNav = (target) => {
    if (target === 'home') navigate('/');
    if (target === 'browse') navigate('/browse-album');
    onNavigate?.(target);
  };

  return (
    <Wrapper ref={ref}>
      <LeftBlock>
        <Logo src={logo} alt="Logo" onClick={() => handleNav('home')} />
        <NavIcon src={icons.home} alt="Home" onClick={() => handleNav('home')} />
        <SearchBox>
          <NavIcon
            src={icons.search}
            alt="Search"
            onClick={() => searchRef.current?.focus()}
          />
          <SearchInput
            ref={searchRef}
            placeholder="Search your vibe..."
            aria-label="Search"
          />
          <Divider />
          <NavIcon
            src={icons.browse}
            alt="Browse"
            onClick={() => handleNav('browse')}
          />
        </SearchBox>
      </LeftBlock>

      <RightBlock>
        {['About', 'Premium', 'Support', 'Sign-Up', 'Login'].map((label) => (
          <NavLink key={label} to={`/${label.toLowerCase()}`}>
            {label}
          </NavLink>
        ))}
        <ThemeToggle onClick={toggleTheme} title="Toggle theme">
          {mode === 'light' ? '🌙' : '🌞'}
        </ThemeToggle>
      </RightBlock>
    </Wrapper>
  );
});

export default HeadPage;
const Wrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 1rem;
  background-color: ${({ theme }) => theme.header};
  flex-wrap: wrap;
  z-index: 100;
`;

const LeftBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const Logo = styled.img`
  height: 42px;
  width: 42px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const NavIcon = styled.img`
  height: 28px;
  width: 28px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.text};
  border-radius: 20px;
  padding: 0 0.6rem;
  background: transparent;
  gap: 0.4rem;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.text};
    opacity: 0.6;
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 60%;
  background-color: ${({ theme }) =>
    theme.text === '#000000' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'};
`;

const RightBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  font-size: 1rem;
  padding: 0.4rem 0.6rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  font-size: 1.4rem;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.2);
  }
`;
