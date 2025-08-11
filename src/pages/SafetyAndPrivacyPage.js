import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Footer from '../components/footer';
import { ThemeContext } from '../ThemeContext';

const Wrapper = styled.div`
  padding: ${({ headerHeight }) => `${headerHeight}px`} 3rem 2rem;
  background: ${({ colors }) => colors.background};
  color: ${({ colors }) => colors.text};
  min-height: 100vh;
  box-sizing: border-box;
  transition: padding-top 0.3s ease;

  @media (max-width: 768px) {
    padding: ${({ headerHeight }) => `${headerHeight}px`} 1.5rem 1.5rem;
  }
`;

const Title = styled.h1`
  margin-bottom: 1.5rem;
  padding-top: clamp(0.5rem, 4vh, 2.5rem);
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const ToggleButton = styled.button`
  background: ${({ colors }) =>
    colors.background === '#000000' ? '#000000' : '#FFFFFF'};
  color: ${({ colors }) =>
    colors.background === '#000000' ? '#FFFFFF' : '#000000'};
  border: 2px solid
    ${({ colors }) =>
      colors.background === '#000000' ? '#FFFFFF' : '#000000'};
  padding: 0.6rem 1.2rem;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const Content = styled.div`
  line-height: 1.6;

  h1, h2 {
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 1rem;
  }
`;

const FooterWrapper = styled.div`
  width: 100vw;
  position: relative;
  left: 0;
`;

export default function SafetyAndPrivacyPage() {
  const { colors } = useContext(ThemeContext);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(100);
  const [activeSection, setActiveSection] = useState("safety");

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setHeaderHeight(entry.contentRect.height);
    });

    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  const safetyContent = (
    <>
      <h1>Spotify Platform Rules</h1>
      <p>Spotify's mission is to unlock the potential of human creativity – by giving a million creative artists the opportunity to live off their art and billions of fans the opportunity to enjoy and be inspired by it...</p>
      <h2>What are the rules?</h2>
      <p>Whether you are a musician, podcaster, or other contributor, it is important to be aware of what is not allowed...</p>
      <h2>Dangerous Content</h2>
      <p>Don't promote violence, incite hatred, harass, bully, or engage in other behavior that may place people at risk...</p>
      {/* You can paste the full safety text you gave here, broken into sections */}
    </>
  );

  const privacyContent = (
    <>
      <h1>Privacy</h1>
      <h2>Collecting your personal data</h2>
      <p>It is very important to us that you understand what personal data we collect about you, how we collect it, and why it's necessary...</p>
      <h2>Protecting your personal data</h2>
      <p>We're committed to protecting our users' personal data. We implement appropriate technical and organisational measures...</p>
      <h2>Privacy Resources</h2>
      <ul>
        <li>Our Privacy Policy contains further detail...</li>
        <li>Our Cookie Policy contains information...</li>
        <li>Our guide to Spotify for parents and guardians...</li>
        <li>Our Safety & Privacy Spotify Support pages...</li>
      </ul>
      {/* Paste full privacy text here */}
    </>
  );

  return (
    <>
      <Header ref={headerRef} />
      <Wrapper colors={colors} headerHeight={headerHeight}>
        <Title>Safety & Privacy Center</Title>

        <ButtonRow>
          <ToggleButton colors={colors} onClick={() => setActiveSection("safety")}>
            Safety
          </ToggleButton>
          <ToggleButton colors={colors} onClick={() => setActiveSection("privacy")}>
            Privacy
          </ToggleButton>
        </ButtonRow>

        <Content>
          {activeSection === "safety" ? safetyContent : privacyContent}
        </Content>
      </Wrapper>

      <FooterWrapper colors={colors}>
        <Footer />
      </FooterWrapper>
    </>
  );
}
