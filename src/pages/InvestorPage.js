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

export default function InvestorPage() {
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
        <Title>Investor Relations</Title>
        <Columns>
          <Column>
            <p>We’re building the future of digital commerce — and strategic investment drives our momentum. Our platform is optimized for growth, revenue, and long-term innovation.</p>
            <p>From user retention to partner expansion, every metric reflects our commitment to excellence. Investors gain access to quarterly reports, strategic roadmaps, and a seat at the table.</p>
          </Column>

          <Column>
            <p><strong>Performance Highlights</strong></p>
            <p>Year-over-year growth, a loyal user base, and scalable infrastructure make us a compelling opportunity.</p>
            <p><strong>Vision Forward</strong></p>
            <p>We're expanding into emerging markets and launching new product lines that unlock exponential value.</p>
          </Column>
        </Columns>
      </Wrapper>
      <FooterWrapper colors={colors}>
        <Footer />
      </FooterWrapper>
    </>
  );
}
