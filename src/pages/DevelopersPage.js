// src/pages/DevelopersPage.js
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

export default function DevelopersPage() {
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
        <Title>Developers Community</Title>
        <Columns>
          <Column>
            <p>Explore open-source projects, participate in hackathons, and collaborate in building new audio tools. Developers power the future of Tune Nest.</p>
            <p><strong>Key Links</strong>: API Docs, GitHub, Dev Blog</p>
          </Column>
          <Column>
            <p><strong>Engage With Us</strong></p>
            <p>Connect, learn, and grow through mentorship and cross-functional collaboration. Whether beginner or expert, you're part of the movement.</p>
            <p><strong>Contact</strong>: devs@tunenest.com</p>
          </Column>
        </Columns>
      </Wrapper>
      <FooterWrapper colors={colors}>
        <Footer />
      </FooterWrapper>
    </>
  );
}
