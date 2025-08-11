import React from 'react';
import styled, { useTheme } from 'styled-components';
import { FaFacebookF, FaApple } from 'react-icons/fa';
import { Link } from 'react-router-dom';


export default function SignUpPage() {
  const theme = useTheme();
  const isDark = theme.mode === 'dark';

  return (
    <Wrapper>
      <Content>
        <Logo isDark={isDark}>
          🎵 <span>Tune Nest</span>
        </Logo>

        <Heading>SignUp in to start listening</Heading>

        <Input placeholder="name@domain.com" />
        <AltLink href="#">Use phone number instead</AltLink>

        <PrimaryButton>Next</PrimaryButton>

        <Divider><span>or</span></Divider>

        <SocialButton>
          <GoogleIcon isDark={isDark} />
          <span>Continue with Google</span>
        </SocialButton>

        <Link to="/login">
  <FooterLink>Have an Account? Login here.</FooterLink>
</Link>

        <RecaptchaNote>This site is protected by reCAPTCHA and the Google.</RecaptchaNote>
      </Content>
    </Wrapper>
  );
}

const GoogleIcon = ({ isDark }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 533.5 544.3"
    xmlns="http://www.w3.org/2000/svg"
    style={isDark ? { filter: 'brightness(0) invert(1)' } : {}}
  >
    <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.1-4.7-50.4H272v95.3h146.9c-6.3 34.1-25.1 62.9-53.6 82.2v68.2h86.7c50.7-46.7 81.5-115.6 81.5-195.3z"/>
    <path fill="#34A853" d="M272 544.3c73.7 0 135.6-24.4 180.8-66.3l-86.7-68.2c-24.1 16.2-55 25.7-94.1 25.7-72.3 0-133.5-48.8-155.3-114.4H28.1v71.9C73.9 475.1 167.1 544.3 272 544.3z"/>
    <path fill="#FBBC05" d="M116.7 321.1c-10.2-30.1-10.2-62.6 0-92.7V156.5H28.1c-41.6 82.9-41.6 180.4 0 263.3l88.6-69.1z"/>
    <path fill="#EA4335" d="M272 107.7c39.3 0 74.6 13.5 102.4 39.9l76.6-76.6C407.6 24.4 345.7 0 272 0 167.1 0 73.9 69.2 28.1 156.5l88.6 71.9c21.8-65.6 83-114.4 155.3-114.4z"/>
  </svg>
);

const AppleIcon = styled(FaApple)`
  color: inherit;
`;

const FacebookIcon = styled(FaFacebookF)`
  color: ${({ theme }) => (theme.mode === 'dark' ? '#FFFFFF' : '#1877F2')};
`;

const Wrapper = styled.div`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;

  ${({ isDark }) =>
    isDark &&
    `
    filter: brightness(0) invert(1);
  `}
`;

const Heading = styled.h2`
  text-align: center;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 6px;
  border: none;
  background: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
`;

const AltLink = styled.a`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.accent};
  text-align: center;
  display: block;
  text-decoration: none;
  cursor: pointer;
  transition: text-decoration 0.2s ease;

  &:hover {
    text-decoration: underline;
  }
`;

const PrimaryButton = styled.button`
  padding: 0.75rem;
  background: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.background};
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.hoverBackground};
  }
`;

const Divider = styled.div`
  text-align: center;
  position: relative;
  margin: 1rem 0;

  span {
    background: ${({ theme }) => theme.background};
    padding: 0 1rem;
    position: relative;
    z-index: 1;
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: ${({ theme }) => theme.subtext};
    z-index: 0;
  }
`;

const SocialButton = styled.button`
  padding: 0.75rem;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.text};
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 0.95rem;

  &:hover {
    background: ${({ theme }) => theme.hoverBackground};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const FooterLink = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.subtext};
  text-align: center;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const RecaptchaNote = styled.p`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.subtext};
  text-align: center;
`;
