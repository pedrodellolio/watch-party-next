import React, {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useState,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

interface RoomContextType {
  currentRoomCode: string | null;
  setCurrentRoomCode: Dispatch<React.SetStateAction<string | null>>;
}

const RoomContext = createContext<RoomContextType>({} as RoomContextType);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentRoomCode, setCurrentRoomCode] = useState<string | null>(null);
  return (
    <RoomContext.Provider value={{ currentRoomCode, setCurrentRoomCode }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  return useContext(RoomContext);
};
