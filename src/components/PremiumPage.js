import React, { useContext, useEffect, useState } from 'react';
import styled, {keyframes} from 'styled-components';
import { ThemeContext } from '../ThemeContext';
import Footer from './footer';
import Header from './Header';
import { FaGooglePay } from 'react-icons/fa';
import { SiPhonepe, SiVisa } from 'react-icons/si';
import PlanCard from './PlanCard';
import { useNavigate } from 'react-router-dom';



export default function PremiumPage() {
  const { colors } = useContext(ThemeContext);
  const [imageUrl, setImageUrl] = useState('');
  const [loadingImage, setLoadingImage] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/premium-image')
      .then(res => res.json())
      .then(data => {
        setImageUrl(data.url);
        setLoadingImage(false);
      });
  }, []);

  const scrollToPlans = () => {
    document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const goToPayment = (plan, price) => {
    navigate('/payment', { state: { plan, price } });
  };

  return (
    <PageWrapper colors={colors}>
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>

      <HeroBanner colors={colors}>
        <HeroText>
          <LogoImage src="/assets/tunenest-logo.svg" alt="TuneNest Logo" />
          <HeroTitle colors={colors}>Listen without limits.</HeroTitle>
          <HeroOffer colors={colors}>Try 2 months of Premium for ₹299.</HeroOffer>
          <HeroSubtext colors={colors}>Only ₹299/month after. Cancel anytime.</HeroSubtext>
          <HeroButtons>
            <StyledButton colors={colors} onClick={() => goToPayment('Intro Offer', '₹299')}>
              Try 2 months for ₹299
            </StyledButton>
            <OutlineButton colors={colors} onClick={scrollToPlans}>
              View all plans
            </OutlineButton>
          </HeroButtons>
          <TermsText colors={colors}>
            ₹299 for 2 months, then ₹299/month after. Offer only available if you haven't tried Premium before. Terms apply.
          </TermsText>
        </HeroText>
        {loadingImage ? (
          <HeroImage src="/assets/placeholder-banner.jpg" alt="Loading banner" />
        ) : (
          <HeroImage src={imageUrl} alt="Premium Banner" />
        )}
      </HeroBanner>

      <PlansGrid id="plans-section">
        <PlansRow>
          <PlanCard
            title="Individual"
            color="pink"
            offer="₹119 for 2 months"
            monthly="₹119/month after"
            bullets={["1 Premium account", "Cancel anytime"]}
            terms="₹119 for 2 months, then ₹119/month after..."
            onClick={() => goToPayment('Individual', '₹119')}
          />
          <PlanCard
            title="Duo"
            color="yellow"
            offer="₹149 for 2 months"
            monthly="₹149/month after"
            bullets={["2 Premium accounts", "Cancel anytime"]}
            terms="₹149 for 2 months, then ₹149/month after..."
            onClick={() => goToPayment('Duo', '₹149')}
          />
          <PlanCard
            title="Family"
            color="blue"
            offer="₹179 for 2 months"
            monthly="₹179/month after"
            bullets={["Up to 6 accounts", "Explicit content control", "Cancel anytime"]}
            terms="₹179 for 2 months, then ₹179/month after..."
            onClick={() => goToPayment('Family', '₹179')}
          />
        </PlansRow>
        <PlansRowCenter>
          <PlanCard
            title="Student"
            color="purple"
            offer="₹59 for 2 months"
            monthly="₹59/month after"
            bullets={["1 verified account", "Student discount", "Cancel anytime"]}
            terms="₹59 for 2 months, then ₹59/month after..."
            onClick={() => goToPayment('Student', '₹59')}
          />
        </PlansRowCenter>
      </PlansGrid>

      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    </PageWrapper>
  );
}

// Styled Components
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AnimatedCard = styled.div`
  animation: ${fadeIn} 0.6s ease forwards;
`;

const PageWrapper = styled.div`
  background: ${({ colors }) => colors?.background || '#111'};
  min-height: 100vh;
`;

const HeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeroBanner = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  background: ${({ colors }) => colors?.cardBackground || '#222'};
  padding: 2rem;
  border-radius: 12px;
  margin: 2rem;
`;

const HeroText = styled.div`
  flex: 1;
  min-width: 280px;
`;

const LogoImage = styled.img`
  width: 160px;
  height: auto;
  margin-bottom: 1rem;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 2.5rem);
  font-weight: 700;
  color: ${({ colors }) => colors?.text};
`;

const HeroOffer = styled.p`
  font-size: 1.25rem;
  font-weight: 500;
  margin-top: 0.5rem;
  color: ${({ colors }) => colors?.accent};
`;

const HeroSubtext = styled.p`
  font-size: 1rem;
  color: ${({ colors }) => colors?.subtext};
  margin-top: 0.25rem;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const StyledButton = styled.button`
  background: ${({ colors }) => colors?.isDark ? '#fff' : '#000'};
  color: ${({ colors }) => colors?.isDark ? '#000' : '#fff'};
  border: 2px solid ${({ colors }) => colors?.isDark ? '#fff' : '#000'};
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    text-decoration: underline;
  }
`;

const OutlineButton = styled.button`
  background: transparent;
  color: ${({ colors }) => colors?.text};
  border: 2px solid ${({ colors }) => colors?.text};
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const TermsText = styled.p`
  font-size: 0.8rem;
  margin-top: 1rem;
  color: ${({ colors }) => colors?.subtext};
`;

const HeroImage = styled.img`
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 12px;
  margin-top: 1rem;
`;

const ComparisonSection = styled.div`
  background: ${({ colors }) => colors?.cardBackground || '#222'};
  margin: 2rem;
  padding: 2rem;
  border-radius: 12px;
`;

const ComparisonTitle = styled.h2`
  font-size: clamp(1.25rem, 4vw, 1.5rem);
  font-weight: 600;
  color: ${({ colors }) => colors?.text};
  margin-bottom: 1.5rem;
`;

const ComparisonTable = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;
`;

const TableHeader = styled.div`
  display: contents;
  font-weight: bold;
`;

const TableRow = styled.div`
  display: contents;
`;

const TableCell = styled.div`
  padding: 0.75rem;
  border-bottom: 1px solid ${({ colors }) => colors?.subtext};
  color: ${({ colors }) => colors?.text};
  font-size: 1rem;
`;

const PlansIntro = styled.div`
  margin-top: 2rem;
`;

const PlansHeading = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ colors }) => colors?.text};
`;

const PlansDescription = styled.p`
  font-size: 1rem;
  margin-top: 0.5rem;
  color: ${({ colors }) => colors?.subtext};
`;

const PlansFeatures = styled.div`
  margin-top: 2rem;
`;

const IconRowCentered = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 2rem;
`;

const BrandIcon = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: #fff;
  color: #000;
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 8px;
  padding: 0.25rem;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
`;

const FeatureRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 2rem;
  flex-wrap: wrap;
  margin-top: 2rem;
`;

const FeatureLabel = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  color: ${({ colors }) => colors?.accent || colors?.text};
  min-width: 200px;
  text-align: left;
  padding-top: 5.7rem;
`;

const FeatureListSide = styled.ul`
  list-style: none;
  padding-left: 0;
  color: ${({ colors }) => colors?.text};
  font-size: 1rem;

  li {
    margin-bottom: 0.75rem;
  }
`;

const PlansGrid = styled.div`
  margin-top: 3rem;
`;

const PlansRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
`;

const PlansRowCenter = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const FooterWrapper = styled.div`
  width: 100%;
  margin-top: 2rem;
`;

// ✅ FAQ Section Styles (Heading Centered, Dropdown Text Left-Aligned)
const FAQSection = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  background: ${({ colors }) => colors?.cardBackground || '#222'};
  border-radius: 12px;
`;

const FAQHeading = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ colors }) => colors?.text};
  margin-bottom: 0.25rem;
  text-align: center;
`;

const FAQSubtext = styled.p`
  font-size: 1rem;
  color: ${({ colors }) => colors?.subtext};
  margin-bottom: 2rem;
  text-align: center;
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FAQItem = styled.details`
  background: ${({ colors }) => colors?.background || '#111'};
  border: 1px solid ${({ colors }) => colors?.subtext};
  border-radius: 8px;
  padding: 1rem;
  color: ${({ colors }) => colors?.text};
  cursor: pointer;

  summary {
    font-weight: 500;
    font-size: 1rem;
    outline: none;
    cursor: pointer;
    text-align: left;
  }

  p {
    margin-top: 0.5rem;
    font-size: 0.95rem;
    color: ${({ colors }) => colors?.subtext};
    text-align: left;
  }

  &:hover {
    border-color: ${({ colors }) => colors?.accent};
  }
`;
