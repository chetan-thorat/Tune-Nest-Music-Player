import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../ThemeContext';

export default function PlanCard({
  title,
  color,
  offer,
  monthly,
  bullets,
  terms,
  onTryClick // 🔹 New prop for alert
}) {
  const { colors } = useContext(ThemeContext);

  return (
    <CardWrapper colors={colors} color={color}>
      <OfferBanner color={color} colors={colors}>
        {offer}
      </OfferBanner>

      <CardHeader>
        <PremiumLabel colors={colors}>Premium</PremiumLabel>
        <TitleBadge color={color}>{title}</TitleBadge>
      </CardHeader>

      <MonthlyText colors={colors}>{monthly}</MonthlyText>

      <BulletList colors={colors}>
        {bullets.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </BulletList>

      <ActionButton
        color={color}
        colors={colors}
        onClick={onTryClick} // 🔹 Alert on click
        aria-label={`Try Premium ${title} plan`}
      >
        Try 2 months for {offer}
      </ActionButton>

      <TermsText colors={colors}>{terms}</TermsText>
    </CardWrapper>
  );
}

// Styled Components
const CardWrapper = styled.div`
  background: ${({ colors }) => colors?.cardBackground || '#222'};
  border: 3px solid ${({ color }) => getColor(color)};
  border-radius: 16px;
  padding: 1.5rem;
  width: 260px;
  text-align: left;
  position: relative;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const OfferBanner = styled.div`
  background: ${({ color }) => getColor(color)};
  color: ${({ colors }) => colors?.text};
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.4rem 1rem;
  border-radius: 8px;
  position: absolute;
  top: -12px;
  left: 12px;
`;

const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
`;

const PremiumLabel = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ colors }) => colors?.accent};
  margin-bottom: 0.25rem;
`;

const TitleBadge = styled.div`
  background: ${({ color }) => getColor(color)}33;
  color: ${({ color }) => getColor(color)};
  font-weight: 600;
  font-size: 1.1rem;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
`;

const MonthlyText = styled.p`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: ${({ colors }) => colors?.text};
`;

const BulletList = styled.ul`
  list-style: disc;
  padding-left: 1.2rem;
  margin-bottom: 1.5rem;
  color: ${({ colors }) => colors?.text};
  font-size: 0.95rem;

  li {
    margin-bottom: 0.5rem;
  }
`;

const ActionButton = styled.button`
  background: ${({ color }) => getColor(color)};
  color: ${({ colors }) => colors?.text};
  border: none;
  padding: 1rem;
  width: 100%;
  border-radius: 999px;
  font-weight: bold;
  font-size: 0.95rem;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const TermsText = styled.p`
  font-size: 0.75rem;
  margin-top: 1rem;
  color: ${({ colors }) => colors?.subtext};
`;

// Helper function for color mapping
function getColor(color) {
  switch (color) {
    case 'pink': return '#ff69b4';
    case 'yellow': return '#fdd835';
    case 'blue': return '#42a5f5';
    case 'purple': return '#ab47bc';
    default: return '#888';
  }
}
