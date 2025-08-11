import React, { useRef, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Footer from "../components/footer";
import { ThemeContext } from "../ThemeContext";

const Wrapper = styled.div`
  padding: ${({ headerHeight }) => `${headerHeight}px`} 3rem 2rem;
  background: ${({ colors }) => colors.background};
  color: ${({ colors }) => colors.text};
  min-height: 100vh;
  transition: padding-top 0.3s ease;
`;

const Title = styled.h1`
  margin-bottom: 1rem;
`;

const TableOfContents = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
`;

const TocItem = styled.li`
  margin-bottom: 0.5rem;
  cursor: pointer;
  color: ${({ colors }) => colors.text};
  font-weight: 500;
  &:hover {
    text-decoration: underline;
  }
`;

const Content = styled.div`
  line-height: 1.6;
  h2 {
    margin-top: 2rem;
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

export default function CookiesPolicyPage() {
  const { colors } = useContext(ThemeContext);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(100);

  // Section refs
  const whatRef = useRef(null);
  const useRefCookies = useRef(null);
  const manageRef = useRef(null);
  const updatesRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setHeaderHeight(entry.contentRect.height);
    });
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <Header ref={headerRef} />
      <Wrapper colors={colors} headerHeight={headerHeight}>
        <Title>Spotify Cookie Policy</Title>

        {/* Table of Contents */}
        <TableOfContents colors={colors}>
          <TocItem colors={colors} onClick={() => scrollToSection(whatRef)}>
            1. What are cookies?
          </TocItem>
          <TocItem colors={colors} onClick={() => scrollToSection(useRefCookies)}>
            2. How do we use cookies?
          </TocItem>
          <TocItem colors={colors} onClick={() => scrollToSection(manageRef)}>
            3. Options for managing cookies and interest-based ads
          </TocItem>
          <TocItem colors={colors} onClick={() => scrollToSection(updatesRef)}>
            4. Updates to this Policy
          </TocItem>
          <TocItem colors={colors} onClick={() => scrollToSection(contactRef)}>
            5. How to contact us
          </TocItem>
        </TableOfContents>

        {/* Intro */}
        <Content>
          <p>
            Effective as of 29 May 2023 — This policy describes how Spotify uses cookies.
            From now on, we'll call it the 'Policy'. The purpose of this Policy is to
            provide you, a user of Spotify's services and/or websites (we'll collectively
            call these the 'Services'), with clear information about the purposes for
            which Spotify uses cookies and the choices you have when it comes to managing
            your cookie settings.
          </p>

          {/* Sections */}
          <h2 ref={whatRef}>1. What are cookies?</h2>
          <p>
            Cookies are small pieces of text which are downloaded to your device,
            for example, when you visit a website. Cookies are useful because they allow
            Spotify and our partners to uniquely recognise your device and support the
            continuity of your experience, for example by helping us to understand your
            preferences or past actions. You can find more general information about
            cookies at: www.allaboutcookies.org.
          </p>

          <h2 ref={useRefCookies}>2. How do we use cookies?</h2>
          <p>
            Cookies do lots of different jobs, like letting you navigate between pages
            efficiently, remembering your preferences, and generally improving your user
            experience. They can also help to ensure that ads you see online are more
            relevant to you and your interests.
          </p>
          <p>
            Spotify uses two main categories of cookie: (1) strictly necessary cookies; and
            (2) optional cookies:
          </p>
          <ul>
            <li>
              <strong>Strictly Necessary Cookies:</strong> These are essential for
              features like delivering content, setting preferences, logging in, making
              payments, or filling forms. Without them, the Services cannot be provided.
            </li>
            <li>
              <strong>Optional Cookies:</strong> May be first or third party, used for
              analytics, advertising, performance tracking, or functionality.
            </li>
          </ul>

          <h2 ref={manageRef}>3. Options for managing cookies and interest-based ads</h2>
          <p>
            You can use your web browser settings to accept, refuse and delete cookies.
            On mobile devices, your OS may provide settings to opt out of interest-based
            advertising. In Spotify, you can toggle 'Tailored ads' in your Privacy
            Settings.
          </p>
          <p>
            Certain ads may include the 'Ad Choices' icon, allowing you to opt out of
            interest-based advertising by participating companies.
          </p>

          <h2 ref={updatesRef}>4. Updates to this Policy</h2>
          <p>
            We may occasionally make changes to this Policy. When we make material
            changes, we'll provide you with prominent notice within the Services or via
            email.
          </p>

          <h2 ref={contactRef}>5. How to contact us</h2>
          <p>
            If you have questions about this Cookie Policy, please contact us mob no - 8329039180
            Chattrapati Sambhajinagar - 431001 
          </p>
        </Content>
      </Wrapper>

      <FooterWrapper colors={colors}>
        <Footer />
      </FooterWrapper>
    </>
  );
}
