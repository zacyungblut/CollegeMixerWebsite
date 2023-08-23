import React, { createContext, useState } from "react";

interface ProcessedEmail {
    _id: string;
    ownerEmail: string;
    subject: string;
    body: string;
    googleId?: string;
    outlookId?: string;
    fromEmail: string;
    fromName: string;
    toEmail: string;
    responseId?: string;
    isStarred: boolean;
    isOpened: boolean;
    summary: string;
    emojiSummary: string;
    timestamp: Date;
    category: string;
    pertinence: number;
    hasResponse: boolean;
    responseOptions: string[];
    defaultResponses: string[];
    isResponse: boolean;
    intent: string;
    emailAccountId: string;
    profilePic: string;
    autoInboundId: string;
    provider: string;
    id?: string;
    threadId?: string;
    parentEmailId?: string | null;
  }

interface ProcessedEmailsContextState {
  emails: ProcessedEmail[];
  setEmails: React.Dispatch<React.SetStateAction<ProcessedEmail[]>>;
  newsletterEmails: ProcessedEmail[];
  setNewsletterEmails: React.Dispatch<React.SetStateAction<ProcessedEmail[]>>;
  selectedGlobalEmail: ProcessedEmail | null;
  setSelectedGlobalEmail: React.Dispatch<React.SetStateAction<ProcessedEmail | null>>;
  nextGlobalEmail: ProcessedEmail | null;
  setNextGlobalEmail: React.Dispatch<React.SetStateAction<ProcessedEmail | null>>;
  isStartScreen: boolean;
  setIsStartScreen: React.Dispatch<React.SetStateAction<boolean>>;
  isFinishedScreen: boolean;
  setIsFinishedScreen: React.Dispatch<React.SetStateAction<boolean>>;
  isBreakdownMode: boolean;
  setIsBreakdownMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ProcessedEmailsContext = createContext<ProcessedEmailsContextState | undefined>(undefined);

export const ProcessedEmailsProvider: any = ({ children }: any) => {
    const [emails, setEmails] = useState<ProcessedEmail[]>([]);
    const [newsletterEmails, setNewsletterEmails] = useState<ProcessedEmail[]>([]);
    const [selectedGlobalEmail, setSelectedGlobalEmail] = useState<ProcessedEmail | null>(null);
    const [nextGlobalEmail, setNextGlobalEmail] = useState<ProcessedEmail | null>(null);
    const [isStartScreen, setIsStartScreen] = useState<boolean>(true);
    const [isFinishedScreen, setIsFinishedScreen] = useState<boolean>(false);
    const [isBreakdownMode, setIsBreakdownMode] = useState<boolean>(true);

  
    return (
      <ProcessedEmailsContext.Provider value={{ emails, setEmails, newsletterEmails,  setNewsletterEmails, selectedGlobalEmail, setSelectedGlobalEmail, nextGlobalEmail, setNextGlobalEmail, isStartScreen, setIsStartScreen, isFinishedScreen, setIsFinishedScreen, isBreakdownMode, setIsBreakdownMode }}>
        {children}
      </ProcessedEmailsContext.Provider>
    );
  };
  