import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  HiPlus, 
  HiMicrophone, 
  HiPaperAirplane, 
  HiTrash, 
  HiCheck,
  HiChat,
  HiSearch,
  HiArrowLeft,
  HiUpload
} from 'react-icons/hi';
import { createCharacter, getCharacters, getConversations, createConversation, sendTerminalMessage, getConversationMessages } from '../api';
import { HexColorPicker } from 'react-colorful';

// Add this constant at the top of the file, after the imports
const CONVERSATIONS_LIMIT = 20;

// Animations
const scanline = keyframes`
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(100vh);
  }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
`;

// Add this new animation
const shimmer = keyframes`
  0%, 100% { color: #61bb46; }
  20% { color: #fdb827; }
  40% { color: #f5821f; }
  60% { color: #e03a3e; }
  80% { color: #963d97; }
`;

// Container and Global Styles
const TerminalContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #0A0E17;
  color: #39FF14;
  min-height: 100vh;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.15) 0px,
      rgba(0, 0, 0, 0.15) 1px,
      transparent 1px,
      transparent 2px
    );
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: linear-gradient(
      rgba(58, 255, 20, 0.1) 0%,
      transparent 3px
    );
    animation: ${scanline} 8s linear infinite;
    pointer-events: none;
  }
`;

const Header = styled.div`
  background-color: #0F1623;
  padding: 1rem 2rem;
  border-bottom: 2px solid #39FF14;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 0 15px rgba(57, 255, 20, 0.2);
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

// Update TitleText to handle letter animations
const TitleText = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
  display: flex;
  gap: 1px;
`;

const AnimatedLetter = styled.span<{ delay: number; isSpace?: boolean }>`
  animation: ${shimmer} 4s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  ${props => props.isSpace && `
    margin: 0 0.5rem; // Add space for space characters
  `}
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #39FF14;
`;

const LiveDot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #FF3B30; // Deep red color
  border-radius: 50%;
  animation: ${pulse} 2s ease-in-out infinite;
`;

// Main Content Styles
const MainContent = styled.div`
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  height: calc(100vh - 80px);
  overflow: hidden;
  flex-direction: row-reverse;
`;

// Left Panel Styles
const LeftPanel = styled.div`
  flex: 0 0 300px;
  background-color: #0F1623;
  border: 1px solid #39FF14;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 10px rgba(57, 255, 20, 0.1);
  height: calc(100vh - 120px);
  overflow: hidden;
`;

const PanelHeader = styled.div`
  background-color: #1A2332;
  padding: 1rem;
  border-bottom: 1px solid #39FF14;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PanelTitle = styled.h2`
  margin: 0;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const CharacterList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  height: calc(100vh - 230px);

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #0F1623;
  }

  &::-webkit-scrollbar-thumb {
    background: #39FF14;
    border-radius: 4px;
  }
`;

const Character = styled.div<{ selected?: boolean }>`
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.selected ? '#39FF14' : '#1C3F1C'};
  border-radius: 6px;
  margin-bottom: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s ease;
  background-color: ${props => props.selected ? '#1C3F1C' : 'transparent'};

  &:hover {
    border-color: #39FF14;
    background-color: #1C3F1C;
  }
`;

const CharacterAvatar = styled.div<{ photoUrl?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #1A2332;
  border: 1px solid #39FF14;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  overflow: hidden;
  ${props => props.photoUrl && `
    background-image: url(${props.photoUrl});
    background-size: cover;
    background-position: center;
  `}
`;

const CharacterInfo = styled.div`
  flex: 1;
`;

const CharacterName = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const CharacterDetails = styled.div`
  font-size: 0.75rem;
  color: #39FF14;
  opacity: 0.7;
`;

const AddButton = styled.button`
  background-color: #1C3F1C;
  color: #39FF14;
  border: 1px solid #39FF14;
  padding: 1rem;
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &:hover {
    background-color: #2C5F2C;
  }
`;

// Chat Section Styles
const ChatSection = styled.div`
  flex: 1;
  background-color: #0F1623;
  border: 1px solid #39FF14;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 10px rgba(57, 255, 20, 0.1);
  overflow: hidden;
  height: calc(100vh - 120px);
`;

const ChatHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #39FF14;
  display: flex;
  gap: 1rem;
  align-items: center;
  background-color: #1A2332;
`;

// const ParticipantBadge = styled.div`
//   padding: 0.5rem 1rem;
//   background-color: #1C3F1C;
//   border: 1px solid #39FF14;
//   border-radius: 4px;
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
//   font-size: 0.875rem;
// `;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  max-height: calc(100vh - 250px);

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #0F1623;
  }

  &::-webkit-scrollbar-thumb {
    background: #39FF14;
    border-radius: 4px;
  }

  justify-content: flex-start;
  min-height: 0;
`;

const MessageGroup = styled.div<{ sent?: boolean }>`
  align-self: ${props => props.sent ? 'flex-end' : 'flex-start'};
  max-width: 70%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MessageSender = styled.div`
  font-size: 0.75rem;
  color: #39FF14;
  opacity: 0.7;
  margin-bottom: 0.25rem;
`;

const Message = styled.div<{ sent?: boolean; color?: string }>`
  background-color: ${props => props.sent ? 
    props.color ? `${props.color}15` : '#1C3F1C' : // Add 15 for 15% opacity
    '#1A2332'};
  border: 1px solid ${props => props.sent ? 
    props.color || '#39FF14' : 
    '#39FF14'};
  border-radius: 6px;
  padding: 1rem;
  position: relative;
  color: ${props => props.sent ? 
    props.color || '#39FF14' : 
    '#39FF14'};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    ${props => props.sent ? 'right: 0;' : 'left: 0;'}
    width: 2px;
    height: 100%;
    background-color: ${props => props.sent ? 
      props.color || '#39FF14' : 
      '#39FF14'};
  }
`;

const AudioVisualizer = styled.div`
  height: 40px;
  margin-top: 0.75rem;
  border: 1px solid #39FF14;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      #39FF14 0%,
      #2EBF0F 20%,
      #39FF14 40%,
      #2EBF0F 60%,
      #39FF14 80%,
      #2EBF0F 100%
    );
    opacity: 0.3;
  }
`;

const AudioControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const AudioButton = styled.button`
  background: none;
  border: 1px solid #39FF14;
  color: #39FF14;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.75rem;
  
  &:hover {
    background-color: #1C3F1C;
  }
`;

const InputSection = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #39FF14;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #1A2332;
`;

const InputControls = styled.div`
  display: flex;
  gap: 1rem;
`;

const CharacterSelector = styled.select<{ senderColor?: string }>`
  background-color: ${props => props.senderColor ? `${props.senderColor}15` : '#0F1623'};
  color: ${props => props.senderColor || '#39FF14'};
  border: 1px solid ${props => props.senderColor || '#39FF14'};
  padding: 0.75rem 1rem;
  font-family: inherit;
  border-radius: 4px;
  width: 200px;
  cursor: pointer;

  option {
    background-color: #0F1623;
    color: ${props => props.senderColor || '#39FF14'};
  }
`;

const MessageInput = styled.textarea`
  flex: 1;
  background-color: #0F1623;
  color: #39FF14;
  border: 1px solid #39FF14;
  padding: 0.75rem 1rem;
  font-family: inherit;
  resize: none;
  border-radius: 4px;
  min-height: 60px;

  &::placeholder {
    color: #39FF14;
    opacity: 0.5;
  }
`;

const ActionButton = styled.button`
  background-color: #1C3F1C;
  color: #39FF14;
  border: 1px solid #39FF14;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #2C5F2C;
  }
`;

// Add these new styled components for conversation management
const ConversationSelector = styled.div`
  display: flex;
  gap: 1.5rem;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
`;

const SearchInput = styled.input`
  flex: 1;
  background-color: #0F1623;
  color: #39FF14;
  border: 1px solid #39FF14;
  padding: 1rem;
  font-family: inherit;
  border-radius: 4px;

  &::placeholder {
    color: #39FF14;
    opacity: 0.5;
  }
`;

// Replace ConversationGrid with ConversationList
const ConversationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  overflow-y: auto;
  padding-right: 0.5rem;
  height: calc(100vh - 200px);

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #0F1623;
  }

  &::-webkit-scrollbar-thumb {
    background: #39FF14;
    border-radius: 4px;
  }
`;

// Update ConversationCard for better layout
const ConversationCard = styled.div`
  background-color: #0F1623;
  border: 1px solid #39FF14;
  border-radius: 6px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &:hover {
    background-color: #1C3F1C;
    transform: translateX(4px);
  }
`;

// Update the top section of the card
const CardTopSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

// Update LastMessage styling
const LastMessage = styled.div`
  display: flex;
  align-items: center;
  color: #39FF14;
  opacity: 0.8;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
`;

const CardTimestamp = styled.span`
  font-size: 0.8rem;
  opacity: 0.7;
  min-width: 100px;
  text-align: right;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #39FF14;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  font-family: inherit;
  font-size: 1rem;

  &:hover {
    opacity: 0.8;
  }
`;

// Add this interface for our conversation type
interface Conversation {
  id: string;
  title: string;
  participants: {
    id: string;
    name: string;
    initials: string;
    photoUrl?: string;
    sendColor?: string;
  }[];
  lastMessage?: string;
  lastMessageTime?: string;
  messages?: Message[];
}

// Add this interface for characters
interface Character {
  id: string;
  name: string;
  initials: string;
  details: string;
  sendColor: string;
  photoUrl?: string;
}

// Add new styled components for the character modal
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #0F1623;
  border: 1px solid #39FF14;
  border-radius: 6px;
  padding: 2rem;
  width: 400px;
  max-width: 90%;
`;

const ModalHeader = styled.h2`
  color: #39FF14;
  margin: 0 0 1.5rem 0;
  font-size: 1.2rem;
`;

const Input = styled.input`
  width: 100%;
  background-color: #1A2332;
  color: #39FF14;
  border: 1px solid #39FF14;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  font-family: inherit;

  &::placeholder {
    color: #39FF14;
    opacity: 0.5;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

// Add Stats styled component
const Stats = styled.div`
  display: flex;
  gap: 2rem;
  margin-left: 2rem;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
`;

const ColorPickerContainer = styled.div`
  margin-bottom: 1rem;
`;

const ColorPickerLabel = styled.div`
  color: #39FF14;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ColorOption = styled.button<{ color: string; isSelected: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${props => props.color};
  border: 2px solid ${props => props.isSelected ? '#39FF14' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const PhotoUploadContainer = styled.div`
  margin-bottom: 1rem;
`;

const PhotoPreview = styled.div<{ hasImage: boolean; isDragging?: boolean }>`
  width: 100%;
  height: 200px;
  border: 2px dashed ${props => 
    props.isDragging ? '#39FF14' : 
    props.hasImage ? 'transparent' : '#39FF14'
  };
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  overflow: hidden;
  background-color: #1A2332;
  position: relative;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: #39FF14;
    background-color: ${props => props.hasImage ? '#1A2332' : '#1C3F1C'};
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UploadButton = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #1C3F1C;
  color: #39FF14;
  border: 1px solid #39FF14;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: #2C5F2C;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

// Add these new styled components
const AudioUploadZone = styled.div<{ isDragging: boolean }>`
  background-color: #0F1623;
  border: 2px dashed ${props => props.isDragging ? '#39FF14' : '#1C3F1C'};
  border-radius: 4px;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  min-height: 80px;
  margin-bottom: 1rem;

  &:hover {
    border-color: #39FF14;
    background-color: #1A2332;
  }
`;

const AudioUploadText = styled.div`
  color: #39FF14;
  opacity: 0.7;
  font-size: 0.9rem;
  text-align: center;
`;

const AudioFileName = styled.div`
  color: #39FF14;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AudioFileSize = styled.span`
  opacity: 0.7;
  font-size: 0.8rem;
`;

const ColorPickerPopover = styled.div`
  position: absolute;
  z-index: 100;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background: #0F1623;
  padding: 1rem;
  border: 1px solid #39FF14;
  border-radius: 6px;
  box-shadow: 0 0 20px rgba(57, 255, 20, 0.2);

  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 12px;
    height: 12px;
    background: #0F1623;
    border-right: 1px solid #39FF14;
    border-bottom: 1px solid #39FF14;
  }
`;

const CustomColorOption = styled(ColorOption)`
  position: relative;
  background: linear-gradient(
    45deg,
    #ff0000 0%,
    #ffff00 25%,
    #00ff00 50%,
    #00ffff 75%,
    #ff00ff 100%
  );
`;

// Update the color options array with more colors
const colorOptions = [
    // Reds
    '#FF6B6B', '#FF8787', '#FF4444', '#CC0000',
    // Oranges
    '#FFA07A', '#FF7F50', '#FF6347', '#FF4500',
    // Yellows
    '#FFD93D', '#FFE156', '#FFDB58', '#FFD700',
    // Greens
    '#98FB98', '#90EE90', '#32CD32', '#228B22',
    // Teals
    '#4ECDC4', '#40E0D0', '#48D1CC', '#20B2AA',
    // Blues
    '#87CEEB', '#00BFFF', '#1E90FF', '#0000FF',
    // Purples
    '#DCD6F7', '#B19CD9', '#9370DB', '#8A2BE2',
    // Pinks
    '#FFB6C1', '#FF69B4', '#FF1493', '#C71585',
    // Custom color picker will be added as the last option
];

// Add this new interface
interface NewConversationModalProps {
  onClose: () => void;
  characters: Character[];
  onCreateConversation: (participantIds: string[]) => void;
}

const NewConversationModal: React.FC<NewConversationModalProps> = ({
  onClose,
  characters,
  onCreateConversation
}) => {
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = () => {
    if (selectedCharacters.length >= 2) {
      onCreateConversation(selectedCharacters);
    }
  };

  const toggleCharacter = (characterId: string) => {
    setSelectedCharacters(prev => 
      prev.includes(characterId)
        ? prev.filter(id => id !== characterId)
        : [...prev, characterId]
    );
  };

  const filteredCharacters = characters.filter(char => 
    char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    char.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>Create New Conversation</ModalHeader>
        
        <SearchInput
          placeholder="Search characters..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ marginBottom: '1rem' }}
        />

        <ColorPickerLabel>Select Characters (min 2)</ColorPickerLabel>
        <CharacterList style={{ maxHeight: '300px', overflow: 'auto' }}>
          {filteredCharacters.map(character => (
            <Character
              key={character.id}
              selected={selectedCharacters.includes(character.id)}
              onClick={() => toggleCharacter(character.id)}
            >
              <CharacterAvatar photoUrl={character.photoUrl}>
                {!character.photoUrl && character.initials}
              </CharacterAvatar>
              <CharacterInfo>
                <CharacterName>{character.name}</CharacterName>
                <CharacterDetails>{character.details}</CharacterDetails>
              </CharacterInfo>
              {selectedCharacters.includes(character.id) && (
                <HiCheck color="#39FF14" />
              )}
            </Character>
          ))}
        </CharacterList>

        <ModalButtons>
          <ActionButton onClick={onClose}>
            Cancel
          </ActionButton>
          <ActionButton
            onClick={handleSubmit}
            style={{ 
              opacity: selectedCharacters.length >= 2 ? 1 : 0.5 
            }}
            disabled={selectedCharacters.length < 2}
          >
            Create Conversation
          </ActionButton>
        </ModalButtons>
      </ModalContent>
    </Modal>
  );
};

// Add these new interfaces
interface Message {
  id: string;
  text: string;
  audio?: string;
  sender: string;
  createdAt: string;
  conversation: string;
}

// Add this with the other styled components, near ConversationSelector and SearchBar
const RightContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: calc(100vh - 120px);
  overflow: hidden;
`;

// Add this with the other styled components
const InputPanel = styled.div`
  width: 300px;
  background-color: #0F1623;
  border: 1px solid #39FF14;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  box-shadow: 0 0 10px rgba(57, 255, 20, 0.1);
  height: fit-content;
  
  h3 {
    margin: 0;
  }
`;

// Add this with the other styled components
const ParticipantsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
`;

// Also add this to handle overflow better
const ParticipantBadge = styled.div`
  padding: 0.5rem 1rem;
  background-color: #1C3F1C;
  border: 1px solid #39FF14;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  white-space: nowrap;
`;

// Add this new styled component near the other styled components
const CharacterSearchInput = styled(SearchInput)`
  margin-bottom: 1rem;
  font-size: 0.875rem;
  padding: 0.75rem;
`;

const ContentTerminal = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAddCharacterModal, setShowAddCharacterModal] = useState(false);
  const [newCharacterName, setNewCharacterName] = useState('');
  const [newCharacterDetails, setNewCharacterDetails] = useState('');
  const [isPhotoDragging, setIsPhotoDragging] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([
    { 
      id: '1', 
      name: 'Peter Griffin', 
      initials: 'PG', 
      details: 'Family Guy • Rhode Island',
      sendColor: '#FF6B6B' // Red for Peter
    },
    { 
      id: '2', 
      name: 'Taylor Swift', 
      initials: 'TS', 
      details: 'Pop Star • Nashville',
      sendColor: '#FFD93D' // Gold for Taylor
    },
    { 
      id: '3', 
      name: 'Bruce Wayne', 
      initials: 'BW', 
      details: 'Vigilante • Gotham City',
      sendColor: '#FFE156' // Yellow for Batman
    },
  ]);

  // Add these state declarations at the top of the ContentTerminal component, with the other states
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);
  const [selectedSender, setSelectedSender] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        const response = await getConversations();
        if (response.data.success) {
          setConversations(response.data.conversations);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Remove the mock conversations array since we're now using real data
  const filteredConversations = useMemo(() => {
    return conversations
      .sort((a, b) => {
        // Sort by last message time, fallback to conversation creation time
        const aTime = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
        const bTime = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
        return bTime - aTime; // Most recent first
      })
      .filter(conv =>
        !searchQuery || // Show all if no search query
        conv.participants.some(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
      .slice(0, searchQuery ? undefined : CONVERSATIONS_LIMIT); // Limit only when not searching
  }, [conversations, searchQuery]);

  const handlePhotoDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsPhotoDragging(true);
  };

  const handlePhotoDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsPhotoDragging(false);
  };

  const handlePhotoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsPhotoDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      const file = files[0];
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateNewConversation = async (participantIds: string[]) => {
    try {
      setIsLoading(true);
      const response = await createConversation({
        participantIds
      });

      if (response.data.success) {
        setConversations(prev => [response.data.conversation, ...prev]);
        setShowNewConversationModal(false);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const [selectedColor, setSelectedColor] = useState('#FF6B6B');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);



  // Handle photo upload
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add loading state
  const [isLoading, setIsLoading] = useState(false);

  // Fetch characters on mount
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setIsLoading(true);
        const response = await getCharacters();
        if (response.data.success) {
          setCharacters(response.data.characters);
        }
      } catch (error) {
        console.error('Error fetching characters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  // Update handleAddCharacter
  const handleAddCharacter = async () => {
    if (newCharacterName.trim()) {
      try {
        setIsLoading(true);
        
        const response = await createCharacter({
          name: newCharacterName,
          details: newCharacterDetails || 'New Character',
          sendColor: selectedColor,
          photo: photoPreview || undefined
        });

        if (response.data.success) {
          setCharacters(prev => [...prev, response.data.character]);
          setNewCharacterName('');
          setNewCharacterDetails('');
          setSelectedColor('#FF6B6B');
          setPhotoFile(null);
          setPhotoPreview(null);
          setShowAddCharacterModal(false);
        }
      } catch (error) {
        console.error('Error creating character:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Update the header to include the time and stats
  const renderHeader = () => (
    <Header>
      <Title>
        {selectedConversation ? (
          <BackButton onClick={() => setSelectedConversation(null)}>
            <HiArrowLeft size={20} />
            Back to Conversations
          </BackButton>
        ) : (
          <>
            <TitleText>
              {'MIXER CONTENT TERMINAL'.split('').map((letter, index) => (
                <AnimatedLetter 
                  key={index} 
                  delay={index * 0.1} // Each letter starts 0.1s after the previous
                  isSpace={letter === ''} // Check if the character is a space
                >
                  {letter === ' ' ? '\u00A0' : letter} {/* Use non-breaking space for spaces */}
                </AnimatedLetter>
              ))}
            </TitleText>
            <StatusIndicator>
              <LiveDot />
              <span style={{ color: '#FF3B30' }}>LIVE</span> {/* Make LIVE text red too */}
            </StatusIndicator>
            <Stats>
              <StatItem>
                <StatValue>{conversations.length}</StatValue>
                <StatLabel>Total Conversations</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>3</StatValue>
                <StatLabel>Last 3 Hours</StatLabel>
              </StatItem>
            </Stats>
          </>
        )}
      </Title>
      <StatusIndicator>
        {currentTime.toLocaleString()} | v1.0.1
      </StatusIndicator>
    </Header>
  );

  // Move renderColorPicker inside the component
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowCustomPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update renderColorPicker to use the state from parent
  const renderColorPicker = () => (
    <ColorPickerContainer>
      <ColorPickerLabel>Message Color</ColorPickerLabel>
      <ColorGrid>
        {colorOptions.map(color => (
          <ColorOption
            key={color}
            color={color}
            isSelected={selectedColor === color}
            onClick={() => setSelectedColor(color)}
          />
        ))}
        <CustomColorOption
          as="div"
          color="transparent"
          isSelected={!colorOptions.includes(selectedColor)}
          onClick={() => setShowCustomPicker(prev => !prev)}
        />
      </ColorGrid>
      
      {showCustomPicker && (
        <ColorPickerPopover ref={pickerRef}>
          <HexColorPicker
            color={selectedColor}
            onChange={setSelectedColor}
          />
        </ColorPickerPopover>
      )}
    </ColorPickerContainer>
  );

  // Add Character Modal
  const renderAddCharacterModal = () => (
    <Modal onClick={() => setShowAddCharacterModal(false)}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>Add New Character</ModalHeader>
        
        <PhotoUploadContainer>
          <ColorPickerLabel>Character Photo</ColorPickerLabel>
          <PhotoPreview 
            hasImage={!!photoPreview}
            isDragging={isPhotoDragging}
            onClick={() => document.getElementById('photo-upload')?.click()}
            onDragOver={handlePhotoDragOver}
            onDragLeave={handlePhotoDragLeave}
            onDrop={handlePhotoDrop}
          >
            {photoPreview ? (
              <PreviewImage src={photoPreview} alt="Character preview" />
            ) : (
              <UploadButton as="div">
                <HiUpload size={24} />
                {isPhotoDragging ? 'Drop photo here' : 'Click or drag photo here'}
              </UploadButton>
            )}
          </PhotoPreview>
          <HiddenInput
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
          />
        </PhotoUploadContainer>

        <Input
          placeholder="Character Name"
          value={newCharacterName}
          onChange={e => setNewCharacterName(e.target.value)}
        />
        
        <Input
          placeholder="Character Details (e.g., Show • Location)"
          value={newCharacterDetails}
          onChange={e => setNewCharacterDetails(e.target.value)}
        />

        {renderColorPicker()}

        <ModalButtons>
          <ActionButton onClick={() => setShowAddCharacterModal(false)}>
            Cancel
          </ActionButton>
          <ActionButton onClick={handleAddCharacter}>
            Add Character
          </ActionButton>
        </ModalButtons>
      </ModalContent>
    </Modal>
  );

  // Update the character list to show photos
  const renderCharacterList = () => {
    const [characterSearchQuery, setCharacterSearchQuery] = useState('');

    const filteredCharacters = characters.filter(char =>
      char.name.toLowerCase().includes(characterSearchQuery.toLowerCase()) ||
      char.details.toLowerCase().includes(characterSearchQuery.toLowerCase())
    );

    return (
      <CharacterList>
        <CharacterSearchInput
          placeholder="Search characters..."
          value={characterSearchQuery}
          onChange={(e) => setCharacterSearchQuery(e.target.value)}
        />
        
        <AddButton onClick={() => setShowAddCharacterModal(true)} style={{ marginBottom: '1rem' }}>
          <HiPlus size={20} />
          Add New Character
        </AddButton>

        {filteredCharacters.map(character => (
          <Character 
            key={character.id}
            selected={false}
          >
            <CharacterAvatar photoUrl={character.photoUrl}>
              {!character.photoUrl && character.initials}
            </CharacterAvatar>
            <CharacterInfo>
              <CharacterName>{character.name}</CharacterName>
              <CharacterDetails>{character.details}</CharacterDetails>
            </CharacterInfo>
          </Character>
        ))}
      </CharacterList>
    );
  };

  // Move these states to the top level
  const [isDragging, setIsDragging] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Move these handlers to the top level
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
        setSelectedAudio(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
        setSelectedAudio(file);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Add this effect to fetch messages when a conversation is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedConversation) {
        try {
          setIsLoading(true);
          const response = await getConversationMessages(selectedConversation.id);
          if (response.data.success) {
            // Sort messages chronologically (oldest to newest)
            const sortedMessages = response.data.messages.sort(
              (a: Message, b: Message) => 
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
            setMessages(sortedMessages);
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchMessages();
  }, [selectedConversation]);

  // Update handleSendMessage to add new messages in the right order
  const handleSendMessage = async () => {
    if (!selectedConversation || !selectedSender || !selectedAudio) {
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Data = (reader.result as string).split(',')[1];
          const isVideo = selectedAudio.type.startsWith('video/');

          console.log('Sending message:', {
            conversationId: selectedConversation.id,
            senderId: selectedSender,
            isVideo,
            fileType: selectedAudio.type,
            fileSize: selectedAudio.size
          });

          const response = await sendTerminalMessage(
            selectedConversation.id,
            selectedSender,
            base64Data,
            isVideo
          );

          if (response.data.success) {
            setMessages(prev => [...prev, response.data.message]); // Add to end instead of beginning
            setSelectedAudio(null);
          }
        } catch (error: any) {
          console.error('Error sending message:', error);
          console.error('Error response:', error.response?.data);
          // Add user feedback here if needed
        }
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };

      reader.readAsDataURL(selectedAudio);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
    }
  };

  // Update renderMessages to not reverse the order
  const renderMessages = () => (
    <MessagesContainer>
      {messages.map(message => {
        const sender = selectedConversation?.participants.find(p => p.id === message.sender);
        const isCurrentUser = message.sender === selectedSender;

        return (
          <MessageGroup key={message.id} sent={isCurrentUser}>
            <MessageSender>{sender?.name}</MessageSender>
            <Message 
              sent={isCurrentUser}
              color={sender?.sendColor}
            >
              {message.text}
              {message.audio && (
                <>
                  <AudioVisualizer />
                  <AudioControls>
                    <AudioButton onClick={() => {
                      const audio = new Audio(message.audio);
                      audio.play();
                    }}>
                      Play
                    </AudioButton>
                  </AudioControls>
                </>
              )}
            </Message>
          </MessageGroup>
        );
      })}
    </MessagesContainer>
  );

  // Update the input section
  const renderInputSection = () => (
    <InputSection>
      <InputControls>
        <CharacterSelector 
          value={selectedSender || ''}
          onChange={(e) => setSelectedSender(e.target.value)}
          senderColor={selectedConversation?.participants.find(p => p.id === selectedSender)?.sendColor}
        >
          <option value="">Select Character</option>
          {selectedConversation?.participants.map(participant => (
            <option key={participant.id} value={participant.id}>
              {participant.name}
            </option>
          ))}
        </CharacterSelector>
        
        <AudioUploadZone
          isDragging={isDragging}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,video/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          
          {selectedAudio ? (
            <AudioFileName>
              <HiMicrophone size={16} />
              {selectedAudio.name}
              <AudioFileSize>({formatFileSize(selectedAudio.size)})</AudioFileSize>
            </AudioFileName>
          ) : (
            <AudioUploadText>
              {isDragging ? 
                'Drop audio/video here' : 
                'Click or drag file here'
              }
            </AudioUploadText>
          )}
        </AudioUploadZone>
      </InputControls>
      
      <InputControls>
        <ActionButton 
          onClick={handleSendMessage}
          disabled={!selectedAudio || !selectedSender}
          style={{ opacity: selectedAudio && selectedSender ? 1 : 0.5 }}
        >
          <HiPaperAirplane size={20} />
          Send Message
        </ActionButton>
      </InputControls>
    </InputSection>
  );

  // Main render logic
  return (
    <TerminalContainer>
      {renderHeader()}
      
      {selectedConversation ? (
        <MainContent>
          <ChatSection>
            <ChatHeader>
              {selectedConversation.participants.map(participant => (
                <ParticipantBadge key={participant.id}>
                  <CharacterAvatar photoUrl={participant.photoUrl}>
                    {!participant.photoUrl && participant.initials}
                  </CharacterAvatar>
                  {participant.name}
                </ParticipantBadge>
              ))}
            </ChatHeader>

            {renderMessages()}
          </ChatSection>

          <InputPanel>
            <div>
              <h3 style={{ 
                color: '#39FF14', 
                marginBottom: '1rem',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Send Message As
              </h3>
              <CharacterSelector 
                value={selectedSender || ''}
                onChange={(e) => setSelectedSender(e.target.value)}
                senderColor={selectedConversation?.participants.find(p => p.id === selectedSender)?.sendColor}
              >
                <option value="">Select Character</option>
                {selectedConversation?.participants.map(participant => (
                  <option key={participant.id} value={participant.id}>
                    {participant.name}
                  </option>
                ))}
              </CharacterSelector>
            </div>

            <div>
              <h3 style={{ 
                color: '#39FF14', 
                marginBottom: '1rem',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Upload Audio
              </h3>
              <AudioUploadZone
                isDragging={isDragging}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*,video/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                
                {selectedAudio ? (
                  <AudioFileName>
                    <HiMicrophone size={16} />
                    {selectedAudio.name}
                    <AudioFileSize>({formatFileSize(selectedAudio.size)})</AudioFileSize>
                  </AudioFileName>
                ) : (
                  <AudioUploadText>
                    {isDragging ? 
                      'Drop audio/video here' : 
                      'Click or drag file here'
                    }
                  </AudioUploadText>
                )}
              </AudioUploadZone>

              <ActionButton 
                onClick={handleSendMessage}
                disabled={!selectedAudio || !selectedSender}
                style={{ 
                  opacity: selectedAudio && selectedSender ? 1 : 0.5,
                  width: '100%'
                }}
              >
                <HiPaperAirplane size={20} />
                Send Message
              </ActionButton>
            </div>
          </InputPanel>
        </MainContent>
      ) : (
        <ConversationSelector>
          {/* Left side - Character Database */}
          <LeftPanel style={{ flex: '0 0 300px' }}>
            <PanelHeader>
              <PanelTitle>Character Database</PanelTitle>
            </PanelHeader>
            {renderCharacterList()}
          </LeftPanel>

          {/* Right side - Conversations */}
          <RightContent>
            <SearchBar>
              <SearchInput
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <ActionButton onClick={() => setShowNewConversationModal(true)}>
                <HiPlus size={20} />
                New Conversation
              </ActionButton>
            </SearchBar>

            <ConversationList>
              {filteredConversations.map(conversation => (
                <ConversationCard 
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <CardTopSection>
                    <ParticipantsList>
                      {conversation.participants.map(participant => (
                        <ParticipantBadge key={participant.id}>
                          <CharacterAvatar photoUrl={participant.photoUrl}>
                            {!participant.photoUrl && participant.initials}
                          </CharacterAvatar>
                          {participant.name}
                        </ParticipantBadge>
                      ))}
                    </ParticipantsList>

                    <CardTimestamp>
                      {conversation.lastMessageTime ? 
                        new Date(conversation.lastMessageTime).toLocaleDateString() :
                        'No messages'
                      }
                    </CardTimestamp>
                  </CardTopSection>

                  {conversation.lastMessage && (
                    <LastMessage>
                      <HiChat size={16} style={{ marginRight: '0.5rem', flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {conversation.lastMessage}
                      </span>
                    </LastMessage>
                  )}
                </ConversationCard>
              ))}
              {!searchQuery && conversations.length > CONVERSATIONS_LIMIT && (
                <div style={{ 
                  textAlign: 'center', 
                  color: '#39FF14',
                  opacity: 0.7,
                  padding: '1rem'
                }}>
                  Use search to find older conversations
                </div>
              )}
            </ConversationList>
          </RightContent>
        </ConversationSelector>
      )}

      {showAddCharacterModal && renderAddCharacterModal()}
      {showNewConversationModal && (
        <NewConversationModal
          onClose={() => setShowNewConversationModal(false)}
          characters={characters}
          onCreateConversation={handleCreateNewConversation}
        />
      )}
    </TerminalContainer>
  );
};

export default ContentTerminal;
