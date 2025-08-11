// src/pages/AboutPage.js
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Footer from '../components/footer';
import { ThemeContext } from '../ThemeContext';

const Wrapper = styled.div`
  padding-top: 0rem;
  padding-left: 3rem;
  padding-right: 3rem;
  padding-bottom: 2rem;
  background: ${({ colors }) => colors.background};
  color: ${({ colors }) => colors.text};
  min-height: 100vh;
  box-sizing: border-box;
  transition: padding-top 0.3s ease;

  @media (max-width: 768px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    padding-bottom: 1.5rem;
  }
`;

const Title = styled.h1`
  margin-bottom: 1.5rem;
  padding-top: 0;
`;

const Columns = styled.div`
  display: flex;
  gap: 3rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const Column = styled.div`
  flex: 1;
  min-width: 300px;

  p {
    margin-bottom: 1rem;
    line-height: 1.6;
  }
`;

const FooterWrapper = styled.div`
  width: 100vw;
  position: relative;
  left: 0;
`;

export default function AboutPage() {
  const { colors } = useContext(ThemeContext);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(100);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setHeaderHeight(entry.contentRect.height);
    });

    if (headerRef.current) observer.observe(headerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header ref={headerRef} />
      <Wrapper colors={colors} headerHeight={headerHeight}>
        <Title>About Us</Title>
        <Columns>
          <Column>
            <p>With TuneNest, discovering the perfect sound for every moment is effortless — whether you're on your phone, desktop, tablet, or smart device.</p>
            <p>Explore thousands of tracks, curated playlists, and exclusive audio experiences. Whether you're driving, working out, chilling, or creating, TuneNest brings the right vibe to your fingertips.</p>
            <p><strong>Customer Service and Support</strong></p>
            <p>Need help? Our support center, community forums, and contact options are all accessible directly from the app or website. Whatever you need, we’ve got your back.</p>
          </Column>

          <Column>
            <p><strong>TuneNest HQ</strong><br />TuneNest Inc.<br />Harmony Tower<br />New York, NY 10001, USA</p>
            <p><strong>TuneNest around the world</strong></p>
            <p>India, Japan, Brazil, UK...<br />Plus regional hubs across Asia, Europe, and the Americas.</p>
          </Column>
        </Columns>
      </Wrapper>
      <FooterWrapper colors={colors}>
        <Footer />
      </FooterWrapper>
    </>
  );
}
