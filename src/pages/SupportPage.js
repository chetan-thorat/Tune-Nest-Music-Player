import React, { useState, useContext, useRef, useEffect } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Footer from "../components/footer";
import { ThemeContext } from "../ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaCreditCard, FaMusic, FaShieldAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  padding: ${({ headerHeight }) => `${headerHeight}px`} 2rem;
  background: ${({ colors }) => colors.background};
  color: ${({ colors }) => colors.text};
  min-height: 100vh;
  transition: background 0.3s ease, color 0.3s ease;
`;

const Hero = styled(motion.div)`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const Categories = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const CategoryCard = styled(motion.div)`
  background: ${({ colors }) => colors.cardBackground || "#1f1f1f"};
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.25);
  }

  svg {
    margin-bottom: 1rem;
    color: ${({ colors }) => colors.primary || "#1DB954"};
    font-size: 2rem;
  }

  h3 {
    margin-bottom: 0.5rem;
  }
`;

const FAQSection = styled.div`
  margin-top: 3rem;
`;

const FAQItem = styled(motion.div)`
  background: ${({ colors }) => colors.cardBackground || "#1f1f1f"};
  border-radius: 12px;
  margin-bottom: 1rem;
  overflow: hidden;
`;

const FAQQuestion = styled.div`
  padding: 1rem;
  cursor: pointer;
  font-weight: 600;
  border-bottom: 1px solid ${({ colors }) => colors.border || "#333"};
`;

const FAQAnswer = styled(motion.div)`
  padding: 1rem;
`;

export default function SupportPage() {
  const { colors } = useContext(ThemeContext);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(100);
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      q: "How do I reset my password?",
      a: "Tap the “Forgot password?” or “Reset password” link, usually found below the password entry field. Enter the email address or username associated with your account. Follow the instructions sent to your email to create a new password. Use your new password to log in to the app."
    },
    {
      q: "Why is my music not playing?",
      a: "Volume is muted or turned down: Ensure your device’s volume is turned up and not muted. Internet connection problems: If you are streaming music, check that your device is connected to the internet. Poor or no connectivity can prevent playback. App not responding or crashed: Close the app completely and reopen it. Restarting the app can often fix temporary glitches. Music file issues: If playing local files, check that the files are not corrupted and are stored in a location the app can access. App permissions and settings: Ensure the app has the necessary permissions (storage, audio) and is not restricted by battery saver or data saver settings."
    },
    {
      q: "How do I upgrade to premium?",
      a: "Go to 'Plans' in your account settings and choose a subscription."
    }
  ];

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
        {/* Hero Section */}
        <Hero
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroTitle>How can we help you?</HeroTitle>
        </Hero>

        {/* Categories */}
        <Categories>
          {[
            {
              icon: <FaCreditCard />,
              title: "Payments",
              desc: "Manage billing and subscription.",
              link: "/premium"
            },
            {
              icon: <FaMusic />,
              title: "Music & Playlists",
              desc: "Organize and share playlists.",
              link: "/browse-album"
            },
            {
              icon: <FaShieldAlt />,
              title: "Privacy & Security",
              desc: "Control your data and privacy.",
              link: "/privacy-policy"
            }
          ].map((cat, index) => {
            const CardContent = (
              <CategoryCard
                key={index}
                colors={colors}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.15, duration: 0.4 }}
              >
                {React.cloneElement(cat.icon, { color: colors.text })}
                <h3>{cat.title}</h3>
                <p>{cat.desc}</p>
              </CategoryCard>
            );

            return cat.link ? (
              <Link
                key={index}
                to={cat.link}
                style={{
                  textDecoration: "none",
                  color: colors.text,
                  display: "block"
                }}
              >
                {CardContent}
              </Link>
            ) : (
              <div key={index}>{CardContent}</div>
            );
          })}
        </Categories>

        {/* FAQ Section */}
        <FAQSection>
          <h2>Frequently Asked Questions</h2>
          {faqs.map((item, index) => (
            <FAQItem
              key={index}
              colors={colors}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.4 }}
            >
              <FAQQuestion
                colors={colors}
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              >
                {item.q}
              </FAQQuestion>
              <AnimatePresence>
                {openFAQ === index && (
                  <FAQAnswer
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.a}
                  </FAQAnswer>
                )}
              </AnimatePresence>
            </FAQItem>
          ))}
        </FAQSection>
      </Wrapper>
      <Footer />
    </>
  );
}
