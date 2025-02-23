import styled from 'styled-components';

const Button = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(to right, #00ffff, #ff00ff);
  border: none;
  border-radius: 25px;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
    transform: none;
  }
`;

export default Button; 