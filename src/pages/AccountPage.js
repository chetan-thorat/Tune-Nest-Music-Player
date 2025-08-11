import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../ThemeContext';
import Header from '../components/Header';
import Footer from '../components/footer';

const AccountPage = () => {
  const { colors } = useContext(ThemeContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulate fetching user data from API
    setTimeout(() => {
      setUser({
        name: 'Taarak Mehta',
        email: 'Taarak@tunenest.com',
        joined: 'March 2024',
        favoriteGenre: 'Lo-fi Chill',
        playlists: 12,
        totalListeningHours: 342,
        profileImage: 'https://your-api.com/images/krishna.jpg', // dynamic image URL
      });
    }, 800);
  }, []);

  return (
    <>
      <Header />
      <Wrapper colors={colors}>
        <Title>My Account</Title>
        {user ? (
          <Card colors={colors}>
            <ProfileSection>
              <ProfileImage
                src={user.profileImage}
                alt="User Profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/default-profile.png'; // fallback image
                }}
                colors={colors}
              />
              <UserInfo>
                <Name>{user.name}</Name>
                <Email>{user.email}</Email>
                <Joined>Member since {user.joined}</Joined>
              </UserInfo>
            </ProfileSection>

            <StatsSection>
              <StatBox colors={colors}>
                <StatLabel>Playlists</StatLabel>
                <StatValue>{user.playlists}</StatValue>
              </StatBox>
              <StatBox colors={colors}>
                <StatLabel>Listening Hours</StatLabel>
                <StatValue>{user.totalListeningHours}</StatValue>
              </StatBox>
              <StatBox colors={colors}>
                <StatLabel>Favorite Genre</StatLabel>
                <StatValue>{user.favoriteGenre}</StatValue>
              </StatBox>
            </StatsSection>
          </Card>
        ) : (
          <Loading>Loading your profile...</Loading>
        )}
      </Wrapper>
      <Footer />
    </>
  );
};

export default AccountPage;
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

const Card = styled.div`
  background: ${({ colors }) => colors.card || 'rgba(255,255,255,0.05)'};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  max-width: 900px;
  margin: 0 auto;
  transition: background 0.3s ease;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${({ colors }) => colors.text};
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Name = styled.h2`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const Email = styled.p`
  font-size: 1rem;
  opacity: 0.8;
`;

const Joined = styled.p`
  font-size: 0.9rem;
  opacity: 0.6;
`;

const StatsSection = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

const StatBox = styled.div`
  background: ${({ colors }) => colors.statBox || 'rgba(255,255,255,0.08)'};
  padding: 1rem 2rem;
  border-radius: 12px;
  text-align: center;
  min-width: 150px;
  flex: 1;
`;

const StatLabel = styled.p`
  font-size: 0.9rem;
  opacity: 0.7;
`;

const StatValue = styled.h3`
  font-size: 1.5rem;
  margin-top: 0.5rem;
`;

const Loading = styled.p`
  text-align: center;
  font-size: 1.2rem;
  margin-top: 3rem;
`;
