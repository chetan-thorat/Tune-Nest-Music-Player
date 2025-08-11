// src/pages/ArtistPage.js
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
  transition: padding-top 0.3s ease;

  @media (max-width: 768px) {
    padding: 0rem 2rem;
  }
`;

const Title = styled.h1`
  margin-bottom: 1.5rem;
  padding-top: clamp(0.5rem, 4vh, 2.5rem);
`;

const Content = styled.div`
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

export default function ArtistPage() {
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
        <Title>Featured Artists</Title>
        <Content>
          <p>Discover rising talents and legendary voices curated for you.</p>
          <p>Each artist featured here brings a unique sound and story — from independent creators to global icons.</p>
          <p>We support artists through personalized playlists, editorial features, and exposure to millions of listeners.</p>
        </Content>
      </Wrapper>
      <FooterWrapper colors={colors}>
        <Footer />
      </FooterWrapper>
    </>
  );
}
