import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../ThemeContext';
import Header from '../components/Header';
import Footer from '../components/footer';

const SettingsPage = () => {
  const { colors } = useContext(ThemeContext);

  return (
    <>
      <Header />
      <Wrapper colors={colors}>
        <Title>Settings</Title>
        <SettingsGrid>
          <Section colors={colors}>
            <SectionTitle>Account</SectionTitle>
            <Item>
              <Label>Email</Label>
              <Value>krishna@tunenest.com</Value>
            </Item>
            <Item>
              <Label>Subscription</Label>
              <Value>Premium</Value>
            </Item>
            <Item>
              <Label>Change Password</Label>
              <ActionButton colors={colors}>Update</ActionButton>
            </Item>
          </Section>

          <Section colors={colors}>
            <SectionTitle>Language</SectionTitle>
            <Item>
              <Label>App Language</Label>
              <Select colors={colors}>
                <option>English</option>
                <option>Hindi</option>
                <option>Spanish</option>
              </Select>
            </Item>
          </Section>

          <Section colors={colors}>
            <SectionTitle>Audio Quality</SectionTitle>
            <Item>
              <Label>Streaming Quality</Label>
              <Select colors={colors}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </Select>
            </Item>
            <Item>
              <Label>Download Quality</Label>
              <Select colors={colors}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </Select>
            </Item>
          </Section>

          <Section colors={colors}>
            <SectionTitle>Display</SectionTitle>
            <Item>
              <Label>Theme</Label>
              <Value>{colors.background === '#ffffff' ? 'Light' : 'Dark'}</Value>
            </Item>
            <Item>
              <Label>Layout</Label>
              <Select colors={colors}>
                <option>Compact</option>
                <option>Spacious</option>
              </Select>
            </Item>
          </Section>
        </SettingsGrid>
      </Wrapper>
      <Footer />
    </>
  );
};

export default SettingsPage;
const Wrapper = styled.div`
  padding: 2rem 3rem;
  background: ${({ colors }) => colors.background};
  color: ${({ colors }) => colors.text};
  min-height: 100vh;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
`;

const Section = styled.div`
  background: ${({ colors }) => colors.card || 'rgba(255,255,255,0.05)'};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: background 0.3s ease;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const Item = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.p`
  font-size: 0.9rem;
  opacity: 0.7;
  margin-bottom: 0.3rem;
`;

const Value = styled.p`
  font-size: 1rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid ${({ colors }) => colors.text};
  background-color: ${({ colors }) =>
    colors.background === '#ffffff' ? '#f0f0f0' : '#1e1e1e'};
  color: ${({ colors }) => colors.text};
  outline: none;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ colors }) =>
      colors.background === '#ffffff' ? '#e0e0e0' : '#2a2a2a'};
  }

  &:focus {
    border-color: ${({ colors }) => colors.text};
    box-shadow: 0 0 0 2px
      ${({ colors }) =>
        colors.background === '#ffffff' ? '#cccccc' : '#333333'};
  }

  option {
    background-color: ${({ colors }) =>
      colors.background === '#ffffff' ? '#ffffff' : '#1e1e1e'};
    color: ${({ colors }) => colors.text};
  }
`;


const ActionButton = styled.button`
  padding: 0.4rem 0.8rem;
  background: ${({ colors }) =>
    colors.background === '#ffffff' ? '#000000' : '#ffffff'};
  color: ${({ colors }) =>
    colors.background === '#ffffff' ? '#ffffff' : '#000000'};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.85;
    transform: scale(1.02);
  }
`;
