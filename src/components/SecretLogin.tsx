import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Container = styled.div`
  background-color: #000;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 2s ease-in;
`;

const Title = styled.pre`
  font-size: 1rem;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px #00ff00;
  text-align: center;
  color: #00ff00;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  background-color: #000;
  border: 2px solid #00ff00;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  font-size: 1.5rem;
  padding: 0.5rem;
  margin-bottom: 1rem;
  text-align: center;
  width: 200px;
  &:focus {
    outline: none;
    box-shadow: 0 0 10px #00ff00;
  }
`;

const Button = styled.button`
  background-color: #000;
  border: 2px solid #00ff00;
  color: #00ff00;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  &:hover {
    background-color: #00ff00;
    color: #000;
  }
`;

const Message = styled.p<{ visible: boolean }>`
  font-size: 1.2rem;
  margin-top: 1rem;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.5s ease;
`;

interface SecretLoginProps {
  setIsAuthenticated: (value: boolean) => void;
}

const SecretLogin: React.FC<SecretLoginProps> = ({ setIsAuthenticated }) => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setMessage(''), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.toLowerCase() === 'kronos') {
      setMessage('Access granted. Redirecting...');
      localStorage.setItem('omnidashAuth', 'authenticated');
      setIsAuthenticated(true);
      console.log('Authentication successful, redirecting to dashboard');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else if (code.toLowerCase() === 'titan') {
      setMessage('Access granted. Redirecting...');
      localStorage.setItem('omnidashAuth', 'authenticated');
      setTimeout(() => {
        navigate('/terminal');
      }, 2000);
    } else {
      setMessage('Access denied. Try again.');
      setCode('');
    }
  };

  return (
    <Container>
      <Title>
{`
 __  __ _____  ________ _____    ____  __  __ _   _ _____ _____       _____ _    _ 
|  \\/  |_ _\\ \\/ / ___|  _ \\  / __ \\|  \\/  | \\ | |_   _|  __ \\ /\\   / ____| |  | |
| |\\/| || | \\  /|  _| | |_) || |  | | \\  / |  \\| | | | | |  | /  \\ | (___ | |__| |
| |  | || | /  \\| |___|  _ < | |  | | |\\/| | . \` | | | | |  |/ /\\ \\ \\___ \\|  __  |
|_|  |_|___/_/\\_\\_____|_| \\_\\ \\____/|_|  |_|_| \\_|_____|_____/    \\_\\_____/|_|  |_|
`}
      </Title>
      <form onSubmit={handleSubmit}>
        <InputContainer>
          <Input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter access code"
          />
          <Button type="submit">ACCESS</Button>
        </InputContainer>
      </form>
      <Message visible={!!message}>{message}</Message>
    </Container>
  );
};

export default SecretLogin;
