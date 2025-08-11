import React, { useContext, useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaMusic, FaPlay, FaHeart, FaShare, FaDownload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../ThemeContext';
import { fetchTrendingTracks } from '../api/trackService';

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const Section = ({ title, items, themeColors, index }) => {
  return (
    <SectionWrapper index={index}>
      <StickyHeader colors={themeColors}>
        <SectionTitle colors={themeColors}>
          <SectionIcon colors={themeColors}>
            <FaMusic />
          </SectionIcon>
          {title}
        </SectionTitle>
        <ViewAllButton colors={themeColors}>View All</ViewAllButton>
      </StickyHeader>

      <ScrollContainer>
        <ScrollRow colors={themeColors}>
          {items.map((item, itemIndex) => (
            <Card key={itemIndex} colors={themeColors} index={itemIndex}>
              <CardImageContainer>
                <Image src={item.image} alt={item.name} />
                <CardOverlay>
                  <PlayButton colors={themeColors}>
                    <FaPlay />
                  </PlayButton>
                  <ActionButtons>
                    <ActionButton colors={themeColors}>
                      <FaHeart />
                    </ActionButton>
                    <ActionButton colors={themeColors}>
                      <FaShare />
                    </ActionButton>
                    <ActionButton colors={themeColors}>
                      <FaDownload />
                    </ActionButton>
                  </ActionButtons>
                </CardOverlay>
              </CardImageContainer>
              <CardContent>
                <Name colors={themeColors}>{item.name}</Name>
                <Artist colors={themeColors}>{item.artist}</Artist>
                <MusicIcon colors={themeColors}>
                  <FaMusic />
                </MusicIcon>
              </CardContent>
            </Card>
          ))}
        </ScrollRow>
      </ScrollContainer>
    </SectionWrapper>
  );
};

export default function GuestLayout() {
  const { colors } = useContext(ThemeContext);
  const [trendingTracks, setTrendingTracks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await fetch('http://localhost:5184/api/Song');
        const data = await res.json();
        const formattedSongs = data.map((song) => ({
          name: song.title,
          artist: song.artist,
          image: `http://localhost:5184${song.cover}`
        }));
        setTrendingTracks(formattedSongs);
      } catch (error) {
        console.error("Failed to fetch songs:", error);
      }
    };
    fetchSongs();
  }, []);

  // Redirect on any click
  const handleRedirect = () => {
    navigate('/login');
  };

  const handleLoginClick = (e) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    navigate('/login');
  };

  return (
    <GuestWrapper onClick={handleRedirect}>
      {/* Enhanced Login Section */}
      <LoginSection colors={colors}>
        <BackgroundPattern />
        <LoginContent>
          <LogoContainer>
            <AnimatedLogo colors={colors}>
              <FaMusic />
            </AnimatedLogo>
          </LogoContainer>
          <LoginTitle colors={colors}>Welcome to TuneNext</LoginTitle>
          <LoginSubtitle colors={colors}>
            Discover, create, and share your favorite music playlists with the world
          </LoginSubtitle>
          <FeatureHighlights>
            <FeatureItem>
              <FeatureIcon>🎵</FeatureIcon>
              <FeatureText>Create Playlists</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>🌟</FeatureIcon>
              <FeatureText>Discover Music</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>💫</FeatureIcon>
              <FeatureText>Share & Connect</FeatureText>
            </FeatureItem>
          </FeatureHighlights>
          <LoginButton onClick={handleLoginClick} colors={colors}>
            <ButtonIcon>🚀</ButtonIcon>
            Login to Continue
          </LoginButton>
        </LoginContent>
      </LoginSection>

      {/* Stats Section */}
      <StatsSection colors={colors}>
        <StatItem>
          <StatNumber>10M+</StatNumber>
          <StatLabel>Songs</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>5M+</StatNumber>
          <StatLabel>Users</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>1M+</StatNumber>
          <StatLabel>Playlists</StatLabel>
        </StatItem>
      </StatsSection>

      <ContentWrapper>
        <Section title="Trending Songs" items={trendingTracks} themeColors={colors} index={0} />
        <Section title="Popular Artists" items={trendingTracks} themeColors={colors} index={1} />
        <Section title="Popular Albums & Singles" items={trendingTracks} themeColors={colors} index={2} />
        <Section title="Popular Radio" items={trendingTracks} themeColors={colors} index={3} />
        <Section title="Featured Charts" items={trendingTracks} themeColors={colors} index={4} />
        <Section title="India's Best" items={trendingTracks} themeColors={colors} index={5} />
      </ContentWrapper>

      {/* Bottom CTA Section */}
      <BottomCTASection colors={colors}>
        <CTAContent>
          <CTATitle colors={colors}>Ready to Start Your Musical Journey?</CTATitle>
          <CTASubtitle colors={colors}>
            Join thousands of music lovers who are already creating amazing playlists
          </CTASubtitle>
          <CTAButton onClick={handleLoginClick} colors={colors}>
            Get Started Now
          </CTAButton>
        </CTAContent>
      </BottomCTASection>
    </GuestWrapper>
  );
}

// Enhanced Styled Components

const GuestWrapper = styled.div`
  background: ${({ theme }) => theme?.colors?.background || '#111'};
  min-height: 100vh;
  cursor: pointer;
  overflow-x: hidden;
`;

const LoginSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  padding: 5rem 2rem;
  text-align: center;
  margin-bottom: 0;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
  }
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%);
`;

const LoginContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  animation: ${fadeInUp} 1s ease-out;
`;

const LogoContainer = styled.div`
  margin-bottom: 2rem;
`;

const AnimatedLogo = styled.div`
  font-size: 4rem;
  color: white;
  animation: ${float} 3s ease-in-out infinite;
  display: inline-block;
  text-shadow: 0 4px 8px rgba(0,0,0,0.3);
`;

const LoginTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 900;
  color: white;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  background: linear-gradient(45deg, #ffffff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const LoginSubtitle = styled.p`
  font-size: 1.3rem;
  color: rgba(255,255,255,0.95);
  margin-bottom: 2.5rem;
  line-height: 1.6;
  font-weight: 300;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const FeatureHighlights = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  animation: ${fadeInUp} 1s ease-out 0.3s both;
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const FeatureText = styled.span`
  color: rgba(255,255,255,0.9);
  font-size: 0.9rem;
  font-weight: 500;
`;

const LoginButton = styled.button`
  background: linear-gradient(45deg, #ffffff, #f8f9fa);
  color: #667eea;
  border: none;
  padding: 1.2rem 3rem;
  font-size: 1.2rem;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin: 0 auto;
  animation: ${fadeInUp} 1s ease-out 0.6s both;

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 15px 35px rgba(0,0,0,0.3);
    background: linear-gradient(45deg, #f8f9fa, #ffffff);
  }

  &:active {
    transform: translateY(-1px) scale(1.01);
  }
`;

const ButtonIcon = styled.span`
  font-size: 1.1rem;
`;

// Stats Section
const StatsSection = styled.div`
  background: ${({ colors }) => colors?.cardBackground || '#1a1a1a'};
  padding: 3rem 2rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const StatItem = styled.div`
  text-align: center;
  animation: ${fadeInUp} 1s ease-out 0.9s both;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  color: ${({ colors }) => colors?.accent || '#1db954'};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: ${({ colors }) => colors?.subtext || '#aaa'};
  font-weight: 500;
`;

// Enhanced Content Wrapper
const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

// Enhanced Section Components
const SectionWrapper = styled.div`
  margin-bottom: 4rem;
  position: relative;
  animation: ${slideInLeft} 0.8s ease-out ${({ index }) => index * 0.1}s both;
`;

const StickyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, ${({ colors }) => colors?.cardBackground || '#222'}, ${({ colors }) => colors?.background || '#000'});
  z-index: 5;
  padding: 1rem 1.5rem;
  border-radius: 15px 15px 0 0;
  border-bottom: 2px solid ${({ colors }) => colors?.accent || '#1db954'};
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: ${({ colors }) => colors?.text};
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const SectionIcon = styled.div`
  color: ${({ colors }) => colors?.accent || '#1db954'};
  font-size: 1.5rem;
`;

const ViewAllButton = styled.button`
  background: linear-gradient(45deg, ${({ colors }) => colors?.accent || '#1db954'}, ${({ colors }) => colors?.accent || '#1db954'}dd);
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(29, 185, 84, 0.4);
  }
`;

const ScrollContainer = styled.div`
  position: relative;
  background: ${({ colors }) => colors?.cardBackground || '#222'};
  border-radius: 0 0 15px 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
`;

const ScrollRow = styled.div`
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding: 0.5rem 0;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, ${({ colors }) => colors?.accent || '#1db954'}, ${({ colors }) => colors?.accent || '#1db954'}dd);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ colors }) => colors?.background || '#000'};
    border-radius: 4px;
  }
`;

const Card = styled.div`
  min-width: 180px;
  height: 250px;
  background: linear-gradient(135deg, ${({ colors }) => colors?.cardBackground || '#222'}, ${({ colors }) => colors?.background || '#000'});
  border-radius: 15px;
  padding: 0.8rem;
  text-align: center;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  transition: all 0.3s ease;
  border: 1px solid ${({ colors }) => colors?.accent || '#1db954'}20;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 15px 35px rgba(0,0,0,0.3);
    border-color: ${({ colors }) => colors?.accent || '#1db954'}40;
  }
`;

const CardImageContainer = styled.div`
  position: relative;
  width: 140px;
  height: 140px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 0.8rem;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${Card}:hover & {
    transform: scale(1.1);
  }
`;

const CardOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${Card}:hover & {
    opacity: 1;
  }
`;

const PlayButton = styled.button`
  background: ${({ colors }) => colors?.accent || '#1db954'};
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    background: ${({ colors }) => colors?.accent || '#1db954'}dd;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: rgba(255,255,255,0.2);
  color: white;
  border: none;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255,255,255,0.3);
    transform: scale(1.1);
  }
`;

const CardContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Name = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ colors }) => colors?.text || '#fff'};
  margin-bottom: 0.3rem;
  line-height: 1.3;
`;

const Artist = styled.div`
  font-size: 0.9rem;
  color: ${({ colors }) => colors?.subtext || '#aaa'};
  font-weight: 400;
  margin-bottom: 0.5rem;
`;

const MusicIcon = styled.div`
  margin-top: auto;
  font-size: 1.1rem;
  color: ${({ colors }) => colors?.accent || '#1db954'};
  opacity: 0.7;
`;

// Bottom CTA Section
const BottomCTASection = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  padding: 4rem 2rem;
  text-align: center;
  margin-top: 3rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
  }
`;

const CTAContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const CTATitle = styled.h3`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${({ colors }) => colors?.text || '#fff'};
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CTASubtitle = styled.p`
  font-size: 1.2rem;
  color: ${({ colors }) => colors?.subtext || '#aaa'};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const CTAButton = styled.button`
  background: linear-gradient(45deg, ${({ colors }) => colors?.accent || '#1db954'}, ${({ colors }) => colors?.accent || '#1db954'}dd);
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(29, 185, 84, 0.3);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(29, 185, 84, 0.4);
  }
`;
