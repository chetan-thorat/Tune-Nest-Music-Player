import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import HeadPage from './HeadPage';
import LeftSidebar from '../components/LeftSidebar';
import FooterBar from './FooterBar';
import { useTheme } from '../ThemeContext';

const LoginUser = () => {
  const { colors } = useTheme();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const header = document.getElementById('head-page');
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
  }, []);

  return (
    <PageWrapper colors={colors}>
      <HeaderWrapper id="head-page">
        <HeadPage />
      </HeaderWrapper>

      <SidebarWrapper headerHeight={headerHeight} colors={colors}>
        <LeftSidebar />
      </SidebarWrapper>

      <MainContent headerHeight={headerHeight} colors={colors}>
        <ContentArea>
          <SectionWrapper>
            <StickyHeader colors={colors}>
              <SectionTitle colors={colors}>Welcome Back</SectionTitle>
              <ShowAllButton colors={colors} onClick={() => setShowAlert(true)}>
                Show Alert
              </ShowAllButton>
            </StickyHeader>

            <ScrollContainer>
              <ScrollRow colors={colors}>
                {[...Array(5)].map((_, i) => (
                  <Card key={i} colors={colors}>
                    <Image src={`https://via.placeholder.com/100?text=User+${i + 1}`} />
                    <Name colors={colors}>User {i + 1}</Name>
                    <Artist colors={colors}>Artist</Artist>
                    <MusicIcon className="music-icon" colors={colors}>🎵</MusicIcon>
                  </Card>
                ))}
              </ScrollRow>
            </ScrollContainer>
          </SectionWrapper>
        </ContentArea>

        <FooterWrapper>
          <FooterBar />
        </FooterWrapper>
      </MainContent>

      {showAlert && (
        <StyledAlertOverlay>
          <AlertBox colors={colors}>
            <AlertText themeColor={colors.accent}>Are you sure?</AlertText>
            <AlertButtons>
              <CancelButton themeColor={colors.accent} onClick={() => setShowAlert(false)}>
                Cancel
              </CancelButton>
            </AlertButtons>
          </AlertBox>
        </StyledAlertOverlay>
      )}
    </PageWrapper>
  );
};

export default LoginUser;

//
// Styled Components
//

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${({ colors }) => colors?.background || '#111'};

  @media (min-width: 768px) {
    flex-direction: row;
    height: 100vh;
    overflow: hidden;
  }
`;

const HeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
`;

const SidebarWrapper = styled.div`
  background: ${({ colors }) => colors?.sidebarBackground || '#111'};
  z-index: 99;

  @media (max-width: 767px) {
    position: relative;
    width: 100%;
    margin-top: ${({ headerHeight }) => `${headerHeight}px`};
  }

  @media (min-width: 768px) {
    width: 350px;
    position: fixed;
    top: ${({ headerHeight }) => `${headerHeight}px`};
    bottom: 0;
    left: 0;
  }
`;

const MainContent = styled.div`
  flex: 1;
  margin-top: ${({ headerHeight }) => `${headerHeight}px`};
  margin-left: 0;
  background: ${({ colors }) => colors?.background};

  @media (min-width: 768px) {
    height: calc(100vh - ${({ headerHeight }) => `${headerHeight}px`});
    margin-left: 350px;
    overflow-y: auto;
  }
`;

const ContentArea = styled.div`
  padding: 1rem;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const FooterWrapper = styled.div`
  width: 100%;
`;

const SectionWrapper = styled.div`
  margin-bottom: 3rem;
`;

const StickyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: ${({ colors }) => colors?.background || '#000'};
  z-index: 5;
  padding: 0.5rem 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: ${({ colors }) => colors?.text};
`;

const ShowAllButton = styled.button`
  background: none;
  border: none;
  color: ${({ colors }) => colors?.text || '#fff'};
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ScrollContainer = styled.div`
  position: relative;
`;

const ScrollRow = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 1rem 0;
  scroll-snap-type: x mandatory;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ colors }) => colors?.hoverBackground || '#555'};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const Card = styled.div`
  position: relative;
  min-width: 160px;
  background-color: ${({ colors }) => colors?.cardBackground || '#222'};
  border-radius: 8px;
  padding: 0.5rem;
  text-align: center;
  flex-shrink: 0;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
  cursor: pointer;

  &:hover .music-icon {
    opacity: 1;
    transform: scale(1);
  }

  &:hover {
    background-color: ${({ colors }) => colors?.hoverBackground || '#333'};
  }
`;

const Image = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
  margin-bottom: 0.5rem;
`;

const Name = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ colors }) => colors?.text || '#fff'};
  margin-bottom: 0.25rem;
`;

const Artist = styled.div`
  font-size: 0.85rem;
  color: ${({ colors }) => colors?.subtext || '#aaa'};
`;

const MusicIcon = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  font-size: 1.2rem;
  color: ${({ colors }) => colors?.accent || '#1db954'};
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.3s ease, transform 0.3s ease;
`;

const StyledAlertOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const AlertBox = styled.div`
  background: ${({ colors }) => colors?.background || '#222'};
  color: ${({ colors }) => colors?.text || '#fff'};
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
`;

const AlertText = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${({ themeColor }) => themeColor};
`;

const AlertButtons = styled.div`
  display: flex;
  justify-content: center;
`;

const CancelButton = styled.button`
  background: transparent;
  color: ${({ themeColor }) => themeColor};
  border: 1px solid ${({ themeColor }) => themeColor};
  padding: 0.6rem 1.2rem;
  border-radius: 50px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ themeColor }) => themeColor}22;
  }
`;
