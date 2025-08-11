import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

export default function DummyPaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { plan, price } = location.state || {};
  const [form, setForm] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name required';
    if (!/^\d{16}$/.test(form.cardNumber)) errs.cardNumber = 'Invalid card number';
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) {
      errs.expiry = 'Invalid format (MM/YY)';
    } else {
      const [mm, yy] = form.expiry.split('/').map(Number);
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;
      if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
        errs.expiry = 'Card expired';
      }
    }
    if (!/^\d{3,4}$/.test(form.cvv)) errs.cvv = 'Invalid CVV';
    return errs;
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      navigate('/payment-success', { state: { plan, price, receipt: { ...form, plan, price } } });
    }, 2000);
  };

  return (
    <Wrapper>
      <Container>
        <Heading>Enter Card Details</Heading>
        <Subheading>Plan: {plan || 'Unknown'} | Amount: {price || '₹0'}</Subheading>
        <Form onSubmit={handleSubmit}>
          <Input name="name" placeholder="Cardholder Name" value={form.name} onChange={handleChange} />
          {errors.name && <Error>{errors.name}</Error>}

          <Input name="cardNumber" placeholder="Card Number (16 digits)" value={form.cardNumber} onChange={handleChange} maxLength={16} />
          {errors.cardNumber && <Error>{errors.cardNumber}</Error>}

          <Input name="expiry" placeholder="Expiry (MM/YY)" value={form.expiry} onChange={handleChange} maxLength={5} />
          {errors.expiry && <Error>{errors.expiry}</Error>}

          <Input name="cvv" placeholder="CVV" value={form.cvv} onChange={handleChange} maxLength={4} />
          {errors.cvv && <Error>{errors.cvv}</Error>}

          <FakeButton type="submit" disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Make Payment'}
          </FakeButton>
        </Form>
      </Container>
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

const Container = styled.div`
  text-align: center;
  padding: 2rem;
  border-radius: 12px;
  background: ${({ theme }) => theme.cardBackground};
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 400px;
`;

const Heading = styled.h2`
  margin-bottom: 0.5rem;
`;

const Subheading = styled.p`
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Input = styled.input`
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.subtext};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
`;

const Error = styled.span`
  color: red;
  font-size: 0.8rem;
  text-align: left;
`;

const FakeButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.background};
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
