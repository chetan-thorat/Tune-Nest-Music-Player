import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';

export default function PaymentSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan, price, receipt } = location.state || {};

  useEffect(() => {
    // Persist payment to backend
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        const payload = {
          email,
          plan: plan || receipt?.plan,
          price: price || receipt?.price,
          name: receipt?.name || '',
          last4: receipt?.cardNumber ? String(receipt.cardNumber).slice(-4) : undefined
        };
        await fetch('http://localhost:5184/api/Payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify(payload)
        });
      } catch {}
    })();

    const timer = setTimeout(() => {
      navigate('/');
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(18);
    doc.text('🎵 Tune Nest Payment Receipt', 20, 20);

    doc.setFontSize(14);
    doc.text('Buyer Details:', 20, 35);
    doc.text(`Name: ${receipt?.name}`, 20, 45);
    doc.text(`Card Number: **** **** **** ${receipt?.cardNumber?.slice(-4)}`, 20, 55);

    doc.text('Plan Details:', 20, 70);
    doc.text(`Plan: ${receipt?.plan}`, 20, 80);
    doc.text(`Amount Paid: ${receipt?.price}`, 20, 90);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 100);

    doc.setFontSize(16);
    doc.setTextColor(30, 150, 80);
    doc.text('Thank you for purchasing the Tune Nest plan!', 20, 120);

    doc.save('TuneNest_Receipt.pdf');
  };

  return (
    <Wrapper>
      <Message>
        ✅ Payment Successful (Simulated)<br />
        Thank you for purchasing the <strong>{plan}</strong> plan.<br />
        Amount Paid: <strong>{price}</strong><br />
        <PDFButton onClick={handleDownloadPDF}>Download PDF Receipt</PDFButton><br />
        Redirecting to homepage...
      </Message>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Message = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  line-height: 2.2rem;
`;

const PDFButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.background};
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
`;
