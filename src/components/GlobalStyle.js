// src/components/GlobalStyle.js
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  /* Reset and base styles */
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
    transition: background 0.3s ease, color 0.3s ease;
    line-height: 1.6;
  }

  a {
    color: ${({ theme }) => theme.accent};
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover {
    color: ${({ theme }) => theme.hoverBackground};
  }

  input, textarea, button {
    font-family: inherit;
    background-color: ${({ theme }) => theme.inputBackground};
    color: ${({ theme }) => theme.text};
    border: none;
    outline: none;
  }

  button {
    cursor: pointer;
    transition: background 0.2s ease;
  }

  /* Utility classes */
  .kszdWE {
    padding-top: 24.796875px;
  }

  .ujxdB {
    padding-top: 24.796875px;
  }

  /* Scrollbar styling (optional) */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.cardBackground};
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.subtext};
    border-radius: 4px;
  }
`;
