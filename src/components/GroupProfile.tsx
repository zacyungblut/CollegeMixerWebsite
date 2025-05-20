import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import MixerLogo from "../assets/mixer_logo.png"; // Make sure this path is correct

const Container = styled.div`
  background-color: #121212;
  min-height: 100vh;
  padding-bottom: 80px;
  width: 100%;
`;

const GroupHeader = styled.div`
  background-color: #121212;
  padding: 10px 16px;
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const GroupTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const IconButton = styled.button`
  padding: 8px;
  background: none;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  height: 40px;
  width: 40px;
`;

const ContentContainer = styled.div`
  background: linear-gradient(to bottom, #121212, #303030);
  padding-bottom: 20px;
`;

const GroupCard = styled.div`
  position: relative;
  margin-bottom: 8px;
`;

const Photo = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const SkipButtonContainer = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
`;

const ShadedCircleButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: rgba(100, 100, 100, 0.4);
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: white;
  font-size: 28px;
`;

const PromptCard = styled.div`
  background-color: #1e1e1e;
  border-radius: 16px;
  overflow: hidden;
  margin: 8px 12px;
  border: 1px solid #333333;
  position: relative;
`;

const PromptShadow = styled.div`
  position: absolute;
  background-color: #333333;
  top: 4px;
  left: 0;
  right: 0;
  bottom: -4px;
  border-radius: 16px;
  z-index: -1;
`;

const QuestionSection = styled.div`
  padding: 16px 24px 8px;
`;

const QuestionText = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: #e0e0e0;
  margin: 0;
`;

const AnswerSection = styled.div`
  padding: 16px 24px;
  background-color: #1e1e1e;
`;

const AnswerText = styled.p`
  font-size: 24px;
  font-weight: 700;
  color: #e0e0e0;
  line-height: 32px;
  margin: 0 0 16px 0;
`;

const FriendInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FriendDetails = styled.div`
  display: flex;
  align-items: center;
`;

const FriendPhoto = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  margin-right: 8px;
`;

const FriendName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #bbbbbb;
`;

const InterestsCard = styled.div`
  margin: 12px 16px 20px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const InterestsContainer = styled.div`
  background: linear-gradient(to bottom, #2a2a2a, #1e1e1e);
  border-radius: 20px;
  border: 1px solid #333333;
`;

const InterestsHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 18px;
  margin-bottom: 14px;
`;

const InterestIconContainer = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #4a90e2;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const InterestIcon = styled.span`
  font-size: 18px;
  color: #ffffff;
`;

const InterestTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.3px;
  margin: 0;
`;

const InterestsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0 18px 22px;
`;

const InterestPill = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 8px 16px;
  margin: 0 8px 10px 0;
  font-size: 14px;
  color: #e0e0e0;
  font-weight: 500;
`;

const MembersTitleContainer = styled.div`
  padding: 16px;
`;

const MembersTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`;

const MemberRow = styled.div`
  display: flex;
  margin: 0 16px 16px;
  gap: 16px;
`;

const MemberColumnItem = styled.div`
  flex: 1;
`;

const MemberPhotoThumbnail = styled.div`
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 2/3;
  position: relative;
  cursor: pointer;
`;

const MemberPhoto = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const GradientOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(255, 255, 255, 0.2),
    white
  );
  z-index: 1;
`;

const NameOverlay = styled.div`
  position: absolute;
  bottom: 40px;
  left: 0;
  right: 0;
  padding: 8px;
  z-index: 2;
`;

const NameText = styled.span`
  color: white;
  font-weight: 700;
  font-size: 20px;
  padding-bottom: 4px;
`;

const AgeText = styled.span`
  color: white;
  font-weight: 500;
`;

const PhotoCountBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 600;
  z-index: 5;
`;

// Add a logo container
const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px 0;
  background-color: #121212;
`;

const Logo = styled.img`
  width: 120px;
  height: auto;
`;

// Add a download button container
const DownloadButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
  background-color: #1e1e1e;
  margin-top: 40px;
`;

const DownloadButton = styled.a`
  background: linear-gradient(45deg, #ff8c00, #ff5f1f);
  color: white;
  font-weight: 700;
  font-size: 16px;
  padding: 14px 24px;
  border-radius: 30px;
  text-decoration: none;
  display: inline-block;
  margin-top: 16px;
  box-shadow: 0 4px 12px rgba(255, 140, 0, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255, 140, 0, 0.4);
  }
`;

const DownloadText = styled.p`
  color: #e0e0e0;
  font-size: 18px;
  margin-bottom: 8px;
  text-align: center;
`;

interface GroupPhotoType {
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

interface GroupData {
  _id: string;
  name: string;
  description: string;
  photos: GroupPhotoType[];
  emoji: string;
  idealFirstDate?: string;
  members: {
    _id: string;
    name: string;
    birthday?: string;
    bio?: string;
    photos: string[];
  }[];
  groupPrompt?: {
    _id: string;
    question: string;
    answer: string;
    submittedBy?: {
      name: string;
      photos: string[];
    };
  };
  interests?: string[];
  memberPrompts?: {
    memberId: string;
    prompt: {
      _id: string;
      question: string;
      answer: string;
      submittedBy?: {
        name: string;
        photos: string[];
      };
    };
  }[];
}

function GroupProfile() {
  const { groupId } = useParams();
  const [searchParams] = useSearchParams();
  const sharer = searchParams.get("sharer");

  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://mixer-backend.cfd/api/friend-groups/${groupId}`
        );
        setGroupData(response.data.friendGroup);

        // Initialize selected photos
        if (response.data.friendGroup) {
          const group = response.data.friendGroup;
          const photoIndices = {
            group: 0,
            ...Object.fromEntries(
              (group.members || []).map((m: { _id: string }) => [m._id, 0])
            ),
          };
          setSelectedPhotos(photoIndices);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching group data:", err);
        setError("Failed to load group information");
        setLoading(false);
      }
    };

    if (groupId) {
      fetchGroupData();
    }
  }, [groupId]);

  const handlePhotoSelect = (id: string, index: number) => {
    setSelectedPhotos((prev) => ({ ...prev, [id]: index }));
  };

  // Helper function to get appropriate emoji for each interest
  const getEmojiForInterest = (interest: string): string => {
    const emojiMap: { [key: string]: string } = {
      Fortnite: "🎮",
      "House parties": "🏠",
      Travel: "✈️",
      Investing: "💰",
      Reading: "📚",
      Cooking: "🍳",
      Photography: "📷",
      Hiking: "🥾",
      Movies: "🎬",
      Gaming: "🎲",
    };

    return emojiMap[interest] || "🔍"; // Default emoji if not found
  };

  // Calculate age from birthday
  const getAge = (birthday: string): number => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const renderGroupContent = () => {
    if (!groupData) return null;

    const content = [];
    const memberPrompts = [];

    // Add first group photo
    if (groupData.photos && groupData.photos.length > 0) {
      const firstPhoto =
        typeof groupData.photos[0] === "string"
          ? groupData.photos[0]
          : groupData.photos[0].url;

      content.push(
        <GroupCard key="first-group-photo">
          <Photo src={firstPhoto} alt={groupData.name} />
          <SkipButtonContainer>
            <ShadedCircleButton>
              <i className="fa fa-close" style={{ fontSize: "28px" }}></i>
            </ShadedCircleButton>
          </SkipButtonContainer>
        </GroupCard>
      );
    }

    // Add group prompt if it exists (no boilerplate)
    if (groupData.groupPrompt) {
      content.push(
        <PromptCard key="group-prompt">
          <PromptShadow />
          <QuestionSection>
            <QuestionText>{groupData.groupPrompt.question}</QuestionText>
          </QuestionSection>
          <AnswerSection>
            <AnswerText>{groupData.groupPrompt.answer}</AnswerText>
            <FriendInfo>
              <FriendDetails>
                <FriendPhoto
                  src={
                    groupData.groupPrompt.submittedBy?.photos?.[0] ||
                    "/default-profile.jpg"
                  }
                  alt={groupData.groupPrompt.submittedBy?.name || "Friend"}
                />
                <FriendName>
                  - {groupData.groupPrompt.submittedBy?.name || "Friend"}
                </FriendName>
              </FriendDetails>
            </FriendInfo>
          </AnswerSection>
        </PromptCard>
      );
    }

    // Add interests card if interests exist
    if (groupData.interests && groupData.interests.length > 0) {
      content.push(
        <InterestsCard key="interests-card">
          <InterestsContainer>
            <InterestsHeader>
              <InterestIconContainer>
                <InterestIcon>🔍</InterestIcon>
              </InterestIconContainer>
              <InterestTitle>Interests</InterestTitle>
            </InterestsHeader>
            <InterestsGrid>
              {groupData.interests.map((interest, index) => (
                <InterestPill key={`interest-${index}`}>
                  {interest}
                </InterestPill>
              ))}
            </InterestsGrid>
          </InterestsContainer>
        </InterestsCard>
      );
    }

    // Add remaining photos (if any)
    if (groupData.photos && groupData.photos.length > 1) {
      for (let i = 1; i < groupData.photos.length; i++) {
        const photo =
          typeof groupData.photos[i] === "string"
            ? groupData.photos[i]
            : groupData.photos[i].url;

        content.push(
          <GroupCard key={`group-photo-${i}`}>
            <Photo src={photo as string} alt={groupData.name} />
          </GroupCard>
        );
      }
    }

    // Add member cards
    if (groupData.members && groupData.members.length > 0) {
      content.push(
        <MembersTitleContainer key="members-title">
          <MembersTitle>
            Members ({groupData.members?.length || 0})
          </MembersTitle>
        </MembersTitleContainer>
      );

      // Process members in pairs
      for (let i = 0; i < groupData.members.length; i += 2) {
        const firstMember = groupData.members[i];
        const secondMember = groupData.members[i + 1];

        content.push(
          <MemberRow key={`member-row-${i}`}>
            <MemberColumnItem>
              <MemberPhotoThumbnail>
                <MemberPhoto
                  src={firstMember.photos?.[0] || "/default-profile.jpg"}
                  alt={firstMember.name}
                />
                {firstMember.photos && firstMember.photos.length > 1 && (
                  <PhotoCountBadge>
                    +{firstMember.photos.length - 1}
                  </PhotoCountBadge>
                )}
                <GradientOverlay />
                <NameOverlay>
                  <NameText>
                    {firstMember.name}
                    {firstMember.birthday && (
                      <AgeText> {getAge(firstMember.birthday)}</AgeText>
                    )}
                  </NameText>
                </NameOverlay>
              </MemberPhotoThumbnail>
            </MemberColumnItem>

            {secondMember ? (
              <MemberColumnItem>
                <MemberPhotoThumbnail>
                  <MemberPhoto
                    src={secondMember.photos?.[0] || "/default-profile.jpg"}
                    alt={secondMember.name}
                  />
                  {secondMember.photos && secondMember.photos.length > 1 && (
                    <PhotoCountBadge>
                      +{secondMember.photos.length - 1}
                    </PhotoCountBadge>
                  )}
                  <GradientOverlay />
                  <NameOverlay>
                    <NameText>
                      {secondMember.name}
                      {secondMember.birthday && (
                        <AgeText> {getAge(secondMember.birthday)}</AgeText>
                      )}
                    </NameText>
                  </NameOverlay>
                </MemberPhotoThumbnail>
              </MemberColumnItem>
            ) : (
              // Empty placeholder to maintain grid layout when odd number of members
              <MemberColumnItem />
            )}
          </MemberRow>
        );

        // Add member prompts if they exist
        if (groupData.memberPrompts) {
          // First member prompt
          const firstMemberPrompt = groupData.memberPrompts.find(
            (mp) => mp.memberId === firstMember._id
          )?.prompt;

          if (firstMemberPrompt) {
            memberPrompts.push(
              <PromptCard key={`${firstMember._id}-prompt`}>
                <PromptShadow />
                <QuestionSection>
                  <QuestionText>
                    {firstMemberPrompt.question.replace(
                      "{user}",
                      firstMember.name
                    )}
                  </QuestionText>
                </QuestionSection>
                <AnswerSection>
                  <AnswerText>{firstMemberPrompt.answer}</AnswerText>
                  <FriendInfo>
                    <FriendDetails>
                      <FriendPhoto
                        src={
                          firstMemberPrompt.submittedBy?.photos?.[0] ||
                          "/default-profile.jpg"
                        }
                        alt={firstMemberPrompt.submittedBy?.name || "Friend"}
                      />
                      <FriendName>
                        - {firstMemberPrompt.submittedBy?.name || "Friend"}
                      </FriendName>
                    </FriendDetails>
                  </FriendInfo>
                </AnswerSection>
              </PromptCard>
            );
          }

          // Second member prompt (if exists)
          if (secondMember) {
            const secondMemberPrompt = groupData.memberPrompts.find(
              (mp) => mp.memberId === secondMember._id
            )?.prompt;

            if (secondMemberPrompt) {
              memberPrompts.push(
                <PromptCard key={`${secondMember._id}-prompt`}>
                  <PromptShadow />
                  <QuestionSection>
                    <QuestionText>
                      {secondMemberPrompt.question.replace(
                        "{user}",
                        secondMember.name
                      )}
                    </QuestionText>
                  </QuestionSection>
                  <AnswerSection>
                    <AnswerText>{secondMemberPrompt.answer}</AnswerText>
                    <FriendInfo>
                      <FriendDetails>
                        <FriendPhoto
                          src={
                            secondMemberPrompt.submittedBy?.photos?.[0] ||
                            "/default-profile.jpg"
                          }
                          alt={secondMemberPrompt.submittedBy?.name || "Friend"}
                        />
                        <FriendName>
                          - {secondMemberPrompt.submittedBy?.name || "Friend"}
                        </FriendName>
                      </FriendDetails>
                    </FriendInfo>
                  </AnswerSection>
                </PromptCard>
              );
            }
          }
        }
      }
    }

    // Add all member prompts after all member thumbnails
    return [...content, ...memberPrompts];
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!groupData) {
    return <div>No group found</div>;
  }

  return (
    <Container>
      {/* Add Logo at the top */}
      <LogoContainer>
        <Logo src={MixerLogo} alt="Mixer Logo" />
      </LogoContainer>

      {/* Group Header */}
      <GroupHeader>
        <GroupTitle>{groupData.name}</GroupTitle>
        <ActionButtonsContainer>
          <IconButton>
            <i className="fa fa-share" style={{ fontSize: "20px" }}></i>
          </IconButton>
          <IconButton>
            <i className="fa fa-ellipsis-h" style={{ fontSize: "24px" }}></i>
          </IconButton>
        </ActionButtonsContainer>
      </GroupHeader>

      {/* Group Content */}
      <ContentContainer>{renderGroupContent()}</ContentContainer>

      {/* Download Button */}
      <DownloadButtonContainer>
        <DownloadText>Want to match with {groupData.name}?</DownloadText>
        <DownloadButton
          href="https://apps.apple.com/us/app/mixer-dating-with-friends/id1671245143"
          target="_blank"
          rel="noopener noreferrer">
          Download Mixer
        </DownloadButton>
      </DownloadButtonContainer>
    </Container>
  );
}

export default GroupProfile;
