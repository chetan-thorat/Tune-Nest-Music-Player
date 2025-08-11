// src/pages/AdvertisingPage.js
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Footer from '../components/footer';
import { ThemeContext } from '../ThemeContext';

const Wrapper = styled.div`
  padding: 0rem 2rem;
  background: ${({ colors }) => colors.background};
  color: ${({ colors }) => colors.text};
  min-height: 100vh;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0rem 2rem;
  }
`;

const Title = styled.h1`
  margin-bottom: 1.5rem;
  padding-top: clamp(0.5rem, 4vh, 2.5rem);
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
`;

export default function AdvertisingPage() {
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
        <Title>Advertising with Tune Nest</Title>
        <Columns>
          <Column>
            <p>Reach millions of listeners with audio ads, sponsored playlists, and branded experiences. Tune Nest offers targeting tools to connect you with your audience.</p>
            <p><strong>Opportunities</strong>: Pre-roll ads, Podcasts, Custom Campaigns</p>
          </Column>
          <Column>
            <p><strong>Partner With Us</strong></p>
            <p>Our media team will help shape campaigns that resonate. Discover native integration and real-time analytics to maximize impact.</p>
            <p><strong>Contact</strong>: advertising@tunenest.com</p>
          </Column>
        </Columns>
      </Wrapper>
      <FooterWrapper colors={colors}>
        <Footer />
      </FooterWrapper>
    </>
  );
}
