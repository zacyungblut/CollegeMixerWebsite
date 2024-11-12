import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
// import { connectTikTokAccount, postToTikTok, fetchConnectedAccounts } from '../api';

const Terminal = styled.div`
  background-color: #000;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
  overflow: auto;
  min-height: 100vh;
`;

const Title = styled.pre`
  color: #ffffff;
  text-align: center;
  margin-bottom: 20px;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  color: #00ffff;
  border-bottom: 1px solid #00ffff;
  padding-bottom: 5px;
`;

const Input = styled.input`
  background-color: #000;
  color: #00ff00;
  border: 1px solid #00ff00;
  padding: 5px;
  margin-right: 10px;
  width: 200px;
`;

const Button = styled.button`
  background-color: #000;
  color: #00ff00;
  border: 1px solid #00ff00;
  padding: 5px 10px;
  cursor: pointer;
  &:hover {
    background-color: #003300;
  }
`;

const AccountList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const AccountItem = styled.li`
  margin-bottom: 10px;
`;

const TextArea = styled.textarea`
  background-color: #000;
  color: #00ff00;
  border: 1px solid #00ff00;
  padding: 5px;
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
`;

const BurnerPortal: React.FC = () => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [newAccount, setNewAccount] = useState('');
  const [postContent, setPostContent] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);

  useEffect(() => {
    // fetchAccounts();
    initializeTikTokSDK();
  }, []);

  const initializeTikTokSDK = () => {
    const script = document.createElement('script');
    script.src = 'https://sf16-scmcdn-va.ibytedtos.com/goofy/tiktok-web-login-sdk/v2/static/js/sdk-v2.js';
    script.async = true;
    script.onload = () => {
      (window as any).TikTokLoginKit.init({
        clientKey: process.env.REACT_APP_TIKTOK_CLIENT_KEY,
        isSandbox: false,
        redirectUrl: `${window.location.origin}/tiktok-callback`,
        scope: 'user.info.profile,user.info.stats,video.list',
      });
    };
    document.body.appendChild(script);
  };

//   const fetchAccounts = async () => {
//     try {
//       const fetchedAccounts = await fetchConnectedAccounts();
//       setAccounts(fetchedAccounts);
//     } catch (error) {
//       console.error('Error fetching accounts:', error);
//     }
//   };

//   const handleConnectAccount = async () => {
//     try {
//       await connectSocialAccount(newAccount);
//       setNewAccount('');
//       fetchAccounts();
//     } catch (error) {
//       console.error('Error connecting account:', error);
//     }
//   };

//   const handleConnectTikTokAccount = async () => {
//     try {
//       window.TikTokLoginKit.login({
//         onSuccess: async (res: any) => {
//           const { code } = res;
//           await connectTikTokAccount(code);
//           fetchAccounts();
//         },
//         onCancel: () => console.log('TikTok login canceled'),
//         onError: (err: any) => console.error('TikTok login error:', err),
//       });
//     } catch (error) {
//       console.error('Error connecting TikTok account:', error);
//     }
//   };

//   const handlePost = async () => {
//     try {
//       for (const account of selectedAccounts) {
//         if (account.includes('tiktok.com')) {
//           await postToTikTok(account, postContent);
//         }
//         // Add logic for other platforms here
//       }
//       setPostContent('');
//       setSelectedAccounts([]);
//     } catch (error) {
//       console.error('Error posting content:', error);
//     }
//   };

//   const handleComment = async () => {
//     try {
//       await postToSocialMedia(selectedAccounts, commentContent, 'comment');
//       setCommentContent('');
//       setSelectedAccounts([]);
//     } catch (error) {
//       console.error('Error posting comment:', error);
//     }
//   };

  const toggleAccountSelection = (account: string) => {
    setSelectedAccounts(prev =>
      prev.includes(account)
        ? prev.filter(a => a !== account)
        : [...prev, account]
    );
  };

  return (
    <Terminal>
      <Title>
        {`
 ____                           ____            _        _ 
| __ ) _   _ _ __ _ __   ___ _ |  _ \\ ___  _ __| |_ __ _| |
|  _ \\| | | | '__| '_ \\ / _ \\ || |_) / _ \\| '__| __/ _\` | |
| |_) | |_| | |  | | | |  __/ ||  __/ (_) | |  | || (_| | |
|____/ \\__,_|_|  |_| |_|\\___|_||_|   \\___/|_|   \\__\\__,_|_|
        `}
      </Title>

      <Section>
        <SectionTitle>Connect New Account</SectionTitle>
        <Button onClick={() => {}}>Connect TikTok Account</Button>
      </Section>

      <Section>
        <SectionTitle>Connected Accounts</SectionTitle>
        <AccountList>
          {accounts.map((account, index) => (
            <AccountItem key={index}>
              <input
                type="checkbox"
                checked={selectedAccounts.includes(account)}
                onChange={() => toggleAccountSelection(account)}
              />
              {account}
            </AccountItem>
          ))}
        </AccountList>
      </Section>

      <Section>
        <SectionTitle>Create Post</SectionTitle>
        <TextArea
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="Enter your post content"
        />
        <Button>Post</Button>
      </Section>

      <Section>
        <SectionTitle>Create Comment</SectionTitle>
        <TextArea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="Enter your comment"
        />
        <Button>Comment</Button>
      </Section>
    </Terminal>
  );
};

export default BurnerPortal;
