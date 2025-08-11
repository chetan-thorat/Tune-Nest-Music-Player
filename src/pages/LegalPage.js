// src/pages/LegalPage.js
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

export default function LegalPage() {
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
        <Title>Legal, Terms & Policies</Title>
        <Content>
          {/* --- Terms of Use --- */}
          <h1>Spotify Terms of Use</h1>
          <h2>1. Introduction</h2>
          <p>
            By using Spotify’s streaming services, websites, and applications ("Spotify Service"), you agree to these Terms of Use.
          </p>

          <h2>2. The Spotify Service</h2>
          <p>
            Spotify provides free and paid service options, subject to eligibility, personal use, and geographic restrictions.
          </p>

          <h2>3. Your Access to the Spotify Service</h2>
          <p>
            Access is limited, non-exclusive, revocable, for personal use only. Spotify retains all rights and may terminate for breach.
          </p>

          <h2>4. Content & Intellectual Property Rights</h2>
          <p>
            All content and Spotify brand assets are property of Spotify or its licensors. Unauthorized redistribution is prohibited.
          </p>

          <h2>5. Support, Questions & Complaints</h2>
          <p>
            If you have issues or complaints, contact Spotify customer support as outlined in Spotify documentation.
          </p>

          <h2>6. Problems and Disputes</h2>
          <p>
            Disputes are resolved individually, not via class action; arbitration may apply depending on your jurisdiction.
          </p>

          {/* --- Privacy Policy --- */}
          <h1>Spotify Privacy Policy</h1>
          <h2>1. About this Policy</h2>
          <p>
            Effective as of June 2025, this Privacy Policy explains how Spotify AB processes your personal data when you use Spotify’s services.
          </p>

          <h2>2. Your Personal Data Rights & Controls</h2>
          <p>
            You have rights under GDPR/CCPA such as access, correction, deletion, portability, objection, and withdrawal of consent.
          </p>

          <h2>3. Personal Data We Collect</h2>
          <p>
            We collect User Data (e.g. name, email, phone), Usage Data (e.g. playlists, streaming, device info), and optionally Voice or Payment Data.
          </p>

          <h2>4. Purpose of Processing</h2>
          <p>
            Personal data is used for providing the Spotify Service, personalisation, analytics, security, and advertising.
          </p>

          <h2>5. Sharing Your Personal Data</h2>
          <p>
            Spotify may share data within group companies and third-party partners for service delivery and analytics purposes.
          </p>

          <h2>6. Data Retention</h2>
          <p>
            Data is retained until account closure or purpose fulfillment, subject to legal or business need retention periods.
          </p>

          <h2>7. International Data Transfers</h2>
          <p>
            Your data may be processed internationally; Spotify ensures protection via contractual and technical safeguards.
          </p>

          <h2>8. Data Security</h2>
          <p>
            Spotify implements organizational and technical safeguards such as encryption, pseudonymization, and retention policies.
          </p>

          <h2>9. Children</h2>
          <p>
            Spotify is not directed at children under local minimum age; parental consent required if younger minors use it.
          </p>

          <h2>10. Changes to Policy</h2>
          <p>
            Spotify may update this Privacy Policy and will notify users of material changes.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            For privacy-related questions, contact privacy@spotify.com or write to Spotify AB in Stockholm or Spotify USA Inc. in New York.
          </p>

          {/* --- Cookies Policy --- */}
          <h1>Spotify Cookies Policy</h1>
          <h2>1. What Are Cookies?</h2>
          <p>
            Cookies are small files stored on your device to recognize it and support features like login, preferences, and forms.
          </p>

          <h2>2. How We Use Cookies</h2>
          <p>
            Spotify uses strictly necessary cookies essential for service delivery, and optional cookies for performance, analytics, and advertising.
          </p>

          <h2>3. Managing Cookies</h2>
          <p>
            Users can manage or withdraw consent for optional cookies through browser settings or Spotify’s cookie preferences page.
          </p>

          <h2>4. Updates to This Policy</h2>
          <p>
            Spotify may update this Cookies Policy from time to time. Changes will be effective as of the “Effective Date” at the top.
          </p>

          <h2>5. Contact Information</h2>
          <p>
            For cookie-related inquiries, contact Spotify through official legal or privacy support channels.
          </p>
        </Content>
      </Wrapper>
      <FooterWrapper colors={colors}>
        <Footer />
      </FooterWrapper>
    </>
  );
}
