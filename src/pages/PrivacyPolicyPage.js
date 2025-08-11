import React, { useRef, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Footer from "../components/footer";
import { ThemeContext } from "../ThemeContext";

const Wrapper = styled.div`
  padding: ${({ headerHeight }) => `${headerHeight}px`} 3rem 2rem;
  background: ${({ colors }) => colors.background};
  color: ${({ colors }) => colors.text};
  min-height: 100vh;
  transition: padding-top 0.3s ease;
`;

const Title = styled.h1`
  margin-bottom: 1rem;
`;

const TableOfContents = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
`;

const TocItem = styled.li`
  margin-bottom: 0.5rem;
  cursor: pointer;
  color: ${({ colors }) => (colors.background === "#000000" ? "#ffffff" : "#000000")};
  &:hover {
    text-decoration: underline;
  }
`;

const Content = styled.div`
  line-height: 1.6;
  h2 {
    margin-top: 2rem;
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

export default function PrivacyPolicyPage() {
  const { colors } = useContext(ThemeContext);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(100);

  // Section references
  const aboutRef = useRef(null);
 
  const retentionRef = useRef(null);
  const transferRef = useRef(null);
  const safetyRef = useRef(null);
  const childrenRef = useRef(null);
  const changesRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setHeaderHeight(entry.contentRect.height);
    });
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <Header ref={headerRef} />
      <Wrapper colors={colors} headerHeight={headerHeight}>
        <Title>Spotify Privacy Policy</Title>

        {/* Table of Contents */}
        <TableOfContents colors={colors}>
          <TocItem colors={colors} onClick={() => scrollToSection(aboutRef)}>
            1. About this Policy
          </TocItem>
          <TocItem colors={colors} onClick={() => scrollToSection(retentionRef)}>
  2. Data retention
</TocItem>

          <TocItem colors={colors} onClick={() => scrollToSection(transferRef)}>
            3. Transfer to other countries
          </TocItem>
          <TocItem colors={colors} onClick={() => scrollToSection(safetyRef)}>
            4. Keeping your personal data safe
          </TocItem>
          <TocItem colors={colors} onClick={() => scrollToSection(childrenRef)}>
            5. Children
          </TocItem>
          <TocItem colors={colors} onClick={() => scrollToSection(changesRef)}>
            6. Changes to this Policy
          </TocItem>
          <TocItem colors={colors} onClick={() => scrollToSection(contactRef)}>
            7. How to contact us
          </TocItem>
        </TableOfContents>

        {/* Content Sections */}
        <Content>
          <h2 ref={aboutRef}>1. About this Policy</h2>
            <section>
            This Privacy Policy describes how we process your personal data at Spotify AB. From now on, we'll call it the 'Policy'.

It applies to your use of:

all Spotify streaming services as a user. For example this includes:
your use of Spotify on any device
the personalisation of your user experience. Watch our personalisation explainer video to learn more about this
the infrastructure required to provide our services
connection of your Spotify account with another application
both our free or paid streaming options (each a 'Service Option')
other Spotify services which include a link to this Policy. These include Spotify websites, Customer Service and the Community Site
From now on, we'll collectively call these the 'Spotify Service'.

From time to time, we may develop new or offer additional services. They'll also be subject to this Policy, unless stated otherwise when we introduce them.

This Policy is not...

the Spotify Terms of Use, which is a separate document. The Terms of Use outline the legal contract between you and Spotify for using the Spotify Service. It also describes the rules of Spotify and your user rights
about your use of other Spotify services which have their own privacy policy. Other Spotify services include Anchor, Soundtrap, Megaphone and the Spotify Live app
Other resources and settings

Key information about your personal data is right here in this Policy. However, you might want to take a look at our other privacy resources and controls:

Privacy Center: A user-friendly hub with summaries of key topics and helpful videos. It includes the 'Your Privacy Controls' video which shows you how to exercise your user rights and make choices about the way we process your data. See Section 2 'Your personal data rights and controls' for more on user rights.
Account Privacy: Control the processing of certain personal data, including tailored advertising.
Notification Settings: Set which marketing communications you get from Spotify.
Settings (found in the Desktop and Mobile versions of Spotify): Control certain aspects of the Spotify Service such as 'Social' or 'Explicit Content'. On the 'Social' setting, you can:
start a Private session
choose whether to share what you listen to on Spotify with your followers
choose whether to show your recently played artists on your public profile
            </section>
          <h2 ref={retentionRef}>2. Data retention</h2>
          <section>We keep your personal data only as long as necessary to provide you with the Spotify Service and for Spotify's legitimate and essential business purposes, such as:

maintaining the performance of the Spotify Service
making data-driven business decisions about new features and offerings
complying with our legal obligations
resolving disputes
Here are some of the categories of our retention periods, and the criteria we use to determine them:

Data retained until you remove it
It's your right to request that we delete certain of your personal data. See the section on 'Erasure' in Section 2 'Your personal data rights and controls' for more information, and the circumstances in which we can act on your request.
You can also delete certain personal data directly from the Spotify Service: for example, you can edit or delete your profile picture. Where users are able to see and update the personal data themselves, we keep the information for as long as the user chooses unless one of the limited purposes described below applies.
Data that expires after a specific period of time
We have set certain retention periods so that some data expires after a specific period of time. For example, personal data you may input as part of search queries is generally deleted after 90 days.
Data retained until your Spotify account is deleted
We keep some data until your Spotify account is deleted. Examples of this include your Spotify username and profile information. We also typically keep streaming history for the life of an account, for example, to provide retrospective playlists that users enjoy and personalised recommendations that take listening habits into account (for example, Your Time Capsule or Your Summer Rewind). When your Spotify account is deleted, this category of your data is deleted or de-identified.
Data retained for extended time periods for limited purposes
After your account is deleted, we keep some data for a longer time period but for very limited purposes. For example, we may be subject to legal or contractual obligations that require this. These may include mandatory data retention laws, government orders to preserve data relevant to an investigation, or data kept for the purposes of litigation. We may also keep data that has been removed from the Spotify Service for a limited period of time. This could be:
to help ensure user safety, or
to protect against harmful content on our platform.
This helps us investigate potential breaches of our User Guidelines and Platform Rules. On the other hand, we will remove unlawful content if the law requires us to do so.</section>

          <h2 ref={transferRef}>3. Transfer to other countries</h2>
          <section>Because of the global nature of our business, your personal data will be shared internationally among Spotify group companies, subcontractors and partners when carrying out the activities described in this Policy. They may process your data in countries whose data protection laws are not considered to be as strong as EU laws or the laws which apply where you live. For example, they may not give you the same rights over your data.

Whenever we transfer personal data internationally, we use tools to:

make sure the data transfer complies with applicable law
help to give your data the same level of protection as it has in the EU
To ensure each data transfer complies with applicable EU legislation, we use the following legal mechanisms:

Standard Contractual Clauses ('SCCs'). These clauses require the other party to protect your data and to provide you with EU-level rights and protections. For example, we use SCCs to transfer the personal data described in Section 3 'Personal data we collect about you' to our hosting provider which uses servers in the US. You can exercise your rights under the Standard Contractual Clauses by contacting us or the third party who processes your personal data.
Adequacy Decisions. This means that we transfer personal data to countries outside of the European Economic Area which have adequate laws to protect personal data, as determined by the European Commission. For example, we transfer the personal data described in Section 3 'Personal data we collect about you' to vendors based in the United Kingdom, Canada, Japan, Republic of Korea and Switzerland.
We also identify and use additional protections as appropriate for each data transfer. For example, we use:

technical protections, such as encryption and pseudonymisation
policies and processes to challenge disproportionate or unlawful government authority requests</section>

          <h2 ref={safetyRef}>4. Keeping your personal data safe</h2>
          <section> 
          We're committed to protecting our users' personal data. We put in place appropriate technical and organisational measures to help protect the security of your personal data. However, be aware that no system is ever completely secure.

We have put various safeguards in place including pseudonymisation, encryption such as Transport Layer Security (TLS) and AES, access, and retention policies to guard against unauthorised access and unnecessary retention of personal data in our systems. In addition, personal data stored in our computer systems are secured by physical security measures.

To protect your user account, we encourage you to:

use a strong password which you only use for your Spotify account
never share your password with anyone
limit access to your computer and browser
log out once you have finished using the Spotify Service on a shared device
read more detail on protecting your account
You can log out of Spotify in multiple places at once by using the 'Sign out everywhere' function on your account page.

If other individuals have access to your Spotify account, then they can access personal data, controls and the Spotify Service available in your account. For example, you might have allowed someone to use your account on a shared device.

It's your responsibility to only allow individuals to use your account where you're comfortable sharing this personal data with them. Anyone else's use of your Spotify account may impact your personalised recommendations and be included in your data download. </section>
          <h2 ref={childrenRef}>5. Children</h2>
          <section>Note This Policy doesn't apply to Spotify Kids unless the Spotify Kids Privacy Policy says so. Spotify Kids is a separate Spotify application.

The Spotify Service has a minimum 'Age Limit' in each country or region. The Spotify Service is not directed to children whose age:

is under the age of 13 years
makes it illegal to process their personal data, or
requires parental consent to process their personal data
We do not knowingly collect or use personal data from children under the applicable Age Limit. If you're under the Age Limit, do not use the Spotify Service, and do not provide any personal data to us. Instead, we recommend using a Spotify Kids account.

If you're a parent of a child under the Age Limit and become aware that your child has provided personal data to Spotify, contact us.

If we learn that we've collected the personal data of a child under the applicable Age Limit, we'll take reasonable steps to delete the personal data. This may require us to delete the Spotify account for that child.

When using a shared device on the main Spotify Service, be cautious about playing or recommending any inappropriate content to individuals under 18 years old.</section>

          <h2 ref={changesRef}>6. Changes to this Policy</h2>
          <section>  We may occasionally make changes to this Policy.

When we make material changes to this Policy, we'll provide you with prominent notice as appropriate under the circumstances. For example, we may display a prominent notice within the Spotify Service or send you an email or device notification.</section>
           

          <h2 ref={contactRef}>7. How to contact us</h2>
          <section>
          For any questions or concerns about this Policy, contact our Grievance Officer/Data Protection Officer any one of these ways:

email privacy@spotify.com
write to us at: Spotify, Regeringsgatan 19, 111 53 Stockholm, Sweden
For the purposes of the GDPR, Spotify AB is the data controller of personal data processed under this Policy.
          </section>
        </Content>
      </Wrapper>

      <FooterWrapper colors={colors}>
        <Footer />
      </FooterWrapper>
    </>
  );
}
