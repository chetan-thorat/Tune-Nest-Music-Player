// src/components/Footer.js
import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../ThemeContext';
import twitter from '../assets/twitter.png';
import instagram from '../assets/instagram.png';
import facebook from '../assets/facebook.png';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background-color: ${({ colors }) => colors.footer};
  color: ${({ colors }) => colors.text};
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    padding: 1.2rem 1.5rem;
  }
`;

const LinkRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const LinkGroup = styled.div`
  min-width: 130px;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-top: -30px;

  h5 {
    font-size: 1rem;
    margin-bottom: 0.4rem;
  }
`;

const RouterLink = styled(Link)`
  color: ${({ colors }) => colors.text};
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
    transform: scale(1.05);
  }
`;

const LinkText = styled.a`
  color: ${({ colors }) => colors.text};
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
    transform: scale(1.05);
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 50px;

  img {
    width: 20px;
    height: 20px;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: ${({ colors }) => colors.text};
  opacity: 0.2;
  margin: 1.5rem 0;
`;

const FooterBottom = styled.div`
  font-size: 0.8rem;
  opacity: 0.6;
  text-align: left;
`;

export default function Footer() {
  const { colors } = useContext(ThemeContext);

  return (
    <FooterContainer colors={colors}>
      <LinkRow>
        <LinkGroup>
          <h5>Company</h5>
          <RouterLink to="/about" colors={colors}>About</RouterLink>
          <RouterLink to="/job" colors={colors}>Jobs</RouterLink>
          <RouterLink to="/record" colors={colors}>For the Record</RouterLink>
        </LinkGroup>

        <LinkGroup>
          <h5>Communities</h5>
          <RouterLink to="/artist" colors={colors}>For Artists</RouterLink>
          <RouterLink to="/developer" colors={colors}>Developers</RouterLink>
          <RouterLink to="/advertising" colors={colors}>Advertising</RouterLink>
          <RouterLink to="/investors" colors={colors}>Investors</RouterLink>
          <RouterLink to="/vendors" colors={colors}>Vendors</RouterLink>
        </LinkGroup>

        <LinkGroup>
          <h5>Useful Links</h5>
          <RouterLink to="/support" colors={colors}>Support</RouterLink>
        </LinkGroup>

        <LinkGroup>
          <h5>TuneNest Plans</h5>
           <RouterLink to="/premium" colors={colors}>Premium Individual</RouterLink>
           <RouterLink to="/premium" colors={colors}>Premium Duo</RouterLink>
           <RouterLink to="/premium" colors={colors}>Premium Family</RouterLink>
           <RouterLink to="/premium" colors={colors}>Premium Student</RouterLink>
        </LinkGroup>

        <SocialIcons>
          <a href="https://instagram.com"><img src={instagram} alt="Instagram" /></a>
          <a href="https://twitter.com"><img src={twitter} alt="Twitter" /></a>
          <a href="https://facebook.com"><img src={facebook} alt="Facebook" /></a>
        </SocialIcons>
      </LinkRow>

      <Divider colors={colors} />

      <FooterBottom colors={colors}>
        © 2025 Tune Nest
      </FooterBottom>
    </FooterContainer>
  );
}
