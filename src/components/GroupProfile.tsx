import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
`;

const GroupCard = styled.div`
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const PhotoGrid = styled.div`
  position: relative;
  aspect-ratio: 4/5;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
`;

const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PhotoIndicators = styled.div`
  position: absolute;
  bottom: 24px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 6px;
`;

const Indicator = styled.div<{ active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${(props) =>
    props.active ? "#FFFFFF" : "rgba(255, 255, 255, 0.5)"};
`;

const GroupInfo = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
`;

const GroupName = styled.h1`
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
`;

const ActiveStatus = styled.p`
  color: #2a5d00;
  font-size: 13px;
  font-weight: 500;
  margin: 2px 0 0 0;
`;

const Description = styled.p`
  font-size: 16px;
  line-height: 1.6;
  margin: 16px 0;
  color: #333;
`;

const MemberCard = styled.div`
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const MemberPhoto = styled.div`
  aspect-ratio: 1;
  overflow: hidden;
`;

const MemberInfo = styled.div`
  padding: 16px;
  border: 1.5px solid darkgray;
  border-top: none;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
`;

const MemberHeader = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 12px;
  margin-bottom: 16px;
  border-bottom: 1px solid #dddddd;
`;

const MemberName = styled.h2`
  font-size: 22px;
  font-weight: 600;
  color: #000;
  margin: 0 8px 0 0;
`;

const MemberAge = styled.span`
  font-size: 22px;
  color: #555;
  font-weight: 400;
`;

const MemberBio = styled.p`
  font-size: 16px;
  color: #000;
  line-height: 22px;
  margin: 0;
`;

const PromptCard = styled.div`
  position: relative;
  margin: 8px 0 16px 0;
  background-color: white;
  border-radius: 16px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
`;

const PromptShadow = styled.div`
  position: absolute;
  background-color: #cccccc;
  top: 4px;
  left: 0;
  right: 0;
  bottom: -4px;
  border-radius: 16px;
  z-index: -1;
`;

const QuestionSection = styled.div`
  width: 100%;
  padding: 16px 24px 8px;
`;

const QuestionText = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: black;
  margin: 0;
`;

const AnswerSection = styled.div`
  padding: 16px 24px;
  background-color: white;
`;

const AnswerText = styled.p`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  line-height: 32px;
  margin: 0 0 16px 0;
`;

const FriendInfo = styled.div`
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
  color: #666;
`;

const FooterCard = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: white;
  border-radius: 20px;
  padding: 10px 12px;
  margin: 16px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FooterButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
`;

const IconContainer = styled.div`
  width: 44px;
  height: 44px;
  background-color: #ededed;
  border-radius: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4px;
`;

const ShareIconContainer = styled.div`
  width: 50px;
  height: 50px;
  background-color: #fff5eb;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const ButtonText = styled.span<{ isShare?: boolean }>`
  font-size: 12px;
  color: ${(props) => (props.isShare ? "#ff8c00" : "#666")};
  font-weight: ${(props) => (props.isShare ? "700" : "600")};
`;

const CTAButton = styled.a`
  display: block;
  background-color: #ff8c00;
  color: white;
  text-align: center;
  padding: 15px 20px;
  border-radius: 8px;
  font-weight: bold;
  text-decoration: none;
  margin-top: 20px;

  &:hover {
    background-color: #e67e00;
  }
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
        // Use the actual API endpoint from your friendGroupRoutes.ts
        const response = await axios.get(
          `https://mixer-backend.cfd/api/friend-groups/${groupId}`
        );
        setGroupData(response.data.friendGroup);

        // Initialize selected photos
        if (response.data.friendGroup) {
          const group = response.data.friendGroup;
          const photoIndices = {
            group: 0,
            ...Object.fromEntries((group.members || []).map((m) => [m._id, 0])),
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

  if (loading) {
    return <Container>Loading group information...</Container>;
  }

  if (error) {
    return <Container>{error}</Container>;
  }

  if (!groupData) {
    return <Container>Group not found</Container>;
  }

  // Render a prompt card
  const renderPrompt = (prompt: any, aboutUser?: string) => {
    if (!prompt) return null;

    return (
      <PromptCard>
        <PromptShadow />
        <QuestionSection>
          <QuestionText>
            {prompt.question?.replace("{user}", aboutUser || "")}
          </QuestionText>
        </QuestionSection>
        <AnswerSection>
          <AnswerText>{prompt.answer}</AnswerText>
          <FriendInfo>
            <FriendPhoto
              src={prompt.submittedBy?.photos?.[0] || "/default-profile.jpg"}
              alt={prompt.submittedBy?.name || "Friend"}
            />
            <FriendName>- {prompt.submittedBy?.name || "Friend"}</FriendName>
          </FriendInfo>
        </AnswerSection>
      </PromptCard>
    );
  };

  return (
    <Container>
      {/* Group Card */}
      <GroupCard>
        <PhotoGrid>
          {groupData.photos && groupData.photos.length > 0 && (
            <>
              <Photo
                src={groupData.photos[selectedPhotos.group || 0].url}
                alt={groupData.name}
                onClick={() => {
                  const nextIndex =
                    (selectedPhotos.group + 1) % groupData.photos.length;
                  handlePhotoSelect("group", nextIndex);
                }}
              />
              {groupData.photos.length > 1 && (
                <PhotoIndicators>
                  {groupData.photos.map((_, index) => (
                    <Indicator
                      key={index}
                      active={index === selectedPhotos.group}
                      onClick={() => handlePhotoSelect("group", index)}
                    />
                  ))}
                </PhotoIndicators>
              )}
            </>
          )}
        </PhotoGrid>

        <GroupInfo>
          <GroupName>{groupData.name}</GroupName>
          <ActiveStatus>Active now</ActiveStatus>

          {groupData.description && (
            <Description>{groupData.description}</Description>
          )}
        </GroupInfo>
      </GroupCard>

      {/* Group Prompt */}
      {groupData.groupPrompt && renderPrompt(groupData.groupPrompt)}

      {/* Member Cards */}
      {groupData.members &&
        groupData.members.map((member, index) => {
          const memberPrompt = groupData.memberPrompts?.find(
            (mp) => mp.memberId === member._id
          )?.prompt;

          return (
            <div key={member._id || `member-${index}`}>
              <MemberCard>
                <MemberPhoto>
                  {member.photos && member.photos.length > 0 && (
                    <Photo
                      src={member.photos[selectedPhotos[member._id] || 0]}
                      alt={member.name}
                      onClick={() => {
                        const nextIndex =
                          (selectedPhotos[member._id] + 1) %
                          member.photos.length;
                        handlePhotoSelect(member._id, nextIndex);
                      }}
                    />
                  )}
                </MemberPhoto>

                <MemberInfo>
                  <MemberHeader>
                    <MemberName>{member.name}</MemberName>
                    {member.birthday && (
                      <MemberAge>
                        {new Date().getFullYear() -
                          new Date(member.birthday).getFullYear()}
                      </MemberAge>
                    )}
                  </MemberHeader>

                  {member.bio && <MemberBio>{member.bio}</MemberBio>}
                </MemberInfo>
              </MemberCard>

              {/* Member Prompt */}
              {memberPrompt && renderPrompt(memberPrompt, member.name)}
            </div>
          );
        })}

      <CTAButton href="https://apps.apple.com/us/app/mixer-dating-with-friends/id1671245143">
        Download Mixer to connect with {groupData.name}
      </CTAButton>
    </Container>
  );
}

export default GroupProfile;
