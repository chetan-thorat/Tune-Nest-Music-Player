// src/pages/RecordPage.js
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
  padding-top: clamp(0.5rem, 4vh, 2.5rem); // 👈 Prevents sticking to top
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

export default function RecordPage() {
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
        <Title>For the Record</Title>
        <Columns>
          <Column>
            <p>“For the Record” is our way of sharing Tune Nest’s latest milestones, community highlights, and achievements with the world.</p>
            <p>We believe in transparency, inclusion, and innovation—every quarter we summarize the progress we’ve made and how we’re building the future of music.</p>
            <p><strong>Latest Highlights</strong></p>
            <p>- 2M new users joined in Q2</p>
            <p>- Expanded streaming access to 8 new countries</p>
            <p>- Launched AI-driven playlist generator</p>
            <p>- Partnered with 120+ indie artists</p>
          </Column>

          <Column>
            <p><strong>Behind the Scenes</strong></p>
            <p>Meet the team making magic behind Tune Nest. From engineers writing cutting-edge code to curators finding hidden gems, every role matters.</p>
            <p>Want to be featured in “For the Record”? Share your Tune Nest journey with us and inspire the global music community!</p>
            <p><strong>Contact</strong><br /> record@tunenest.com</p>
          </Column>
        </Columns>
      </Wrapper>
      <FooterWrapper colors={colors}>
        <Footer />
      </FooterWrapper>
    </>
  );
}
