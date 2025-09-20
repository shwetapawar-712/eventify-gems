import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';

// Contract ABI and address
const CONTRACT_ADDRESS = '0xd9145CCE52D386f254917e481eB44e9943F39138';
const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "ERC721IncorrectOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "createSession",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "sessionId",
        "type": "uint256"
      }
    ],
    "name": "getAttendees",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "hasAttended",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "sessionId",
        "type": "uint256"
      }
    ],
    "name": "markAttendance",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "student",
        "type": "address"
      }
    ],
    "name": "mintBadge",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextSessionId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "sessions",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "createdAt",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "organizer",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "timestamps",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export interface Session {
  id: number;
  name: string;
  createdAt: number;
  organizer: string;
  exists: boolean;
  attendees?: string[];
}

export interface AttendanceRecord {
  address: string;
  timestamp: number;
  hasAttended: boolean;
}

interface Web3ContextType {
  account: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  contract: ethers.Contract | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  createSession: (name: string) => Promise<number | null>;
  markAttendance: (sessionId: number) => Promise<boolean>;
  getSession: (sessionId: number) => Promise<Session | null>;
  getAttendees: (sessionId: number) => Promise<string[]>;
  mintBadge: (address: string) => Promise<boolean>;
  getSessions: () => Promise<Session[]>;
  checkAttendance: (sessionId: number, address: string) => Promise<boolean>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof (window as any).ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0].address);
          setIsConnected(true);
          const signer = await provider.getSigner();
          const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
          setContract(contractInstance);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof (window as any).ethereum === 'undefined') {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to connect your wallet.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      setAccount(address);
      setIsConnected(true);
      
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(contractInstance);
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setContract(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  const createSession = async (name: string): Promise<number | null> => {
    if (!contract) return null;
    
    try {
      const tx = await contract.createSession(name);
      await tx.wait();
      
      const nextSessionId = await contract.nextSessionId();
      const sessionId = Number(nextSessionId) - 1;
      
      toast({
        title: "Event Created",
        description: `Successfully created "${name}"`,
      });
      
      return sessionId;
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const markAttendance = async (sessionId: number): Promise<boolean> => {
    if (!contract) return false;
    
    try {
      const tx = await contract.markAttendance(sessionId);
      await tx.wait();
      
      toast({
        title: "Attendance Marked",
        description: "Your attendance has been recorded!",
      });
      
      return true;
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast({
        title: "Attendance Failed",
        description: "Failed to mark attendance. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const getSession = async (sessionId: number): Promise<Session | null> => {
    if (!contract) return null;
    
    try {
      const session = await contract.sessions(sessionId);
      return {
        id: sessionId,
        name: session.name,
        createdAt: Number(session.createdAt),
        organizer: session.organizer,
        exists: session.exists,
      };
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  };

  const getAttendees = async (sessionId: number): Promise<string[]> => {
    if (!contract) return [];
    
    try {
      const attendees = await contract.getAttendees(sessionId);
      return attendees;
    } catch (error) {
      console.error('Error getting attendees:', error);
      return [];
    }
  };

  const mintBadge = async (address: string): Promise<boolean> => {
    if (!contract) return false;
    
    try {
      const tx = await contract.mintBadge(address);
      await tx.wait();
      
      toast({
        title: "Badge Minted",
        description: `Successfully minted badge for ${address.slice(0, 6)}...${address.slice(-4)}`,
      });
      
      return true;
    } catch (error) {
      console.error('Error minting badge:', error);
      toast({
        title: "Minting Failed",
        description: "Failed to mint badge. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const getSessions = async (): Promise<Session[]> => {
    if (!contract) return [];
    
    try {
      const nextSessionId = await contract.nextSessionId();
      const sessions: Session[] = [];
      
      for (let i = 0; i < Number(nextSessionId); i++) {
        const session = await getSession(i);
        if (session && session.exists) {
          sessions.push(session);
        }
      }
      
      return sessions;
    } catch (error) {
      console.error('Error getting sessions:', error);
      return [];
    }
  };

  const checkAttendance = async (sessionId: number, address: string): Promise<boolean> => {
    if (!contract) return false;
    
    try {
      const hasAttended = await contract.hasAttended(sessionId, address);
      return hasAttended;
    } catch (error) {
      console.error('Error checking attendance:', error);
      return false;
    }
  };

  const value: Web3ContextType = {
    account,
    isConnected,
    isConnecting,
    contract,
    connectWallet,
    disconnectWallet,
    createSession,
    markAttendance,
    getSession,
    getAttendees,
    mintBadge,
    getSessions,
    checkAttendance,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};