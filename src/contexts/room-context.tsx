import React, { createContext, Dispatch, useContext, useState } from "react";

interface RoomContextType {
  currentRoomCode: string | null;
  setCurrentRoomCode: Dispatch<React.SetStateAction<string | null>>;
  logs: string[];
  pushLog: (data: any) => void;
}

const RoomContext = createContext<RoomContextType>({} as RoomContextType);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [currentRoomCode, setCurrentRoomCode] = useState<string | null>(null);

  const pushLog = (data: any) => {
    if (data.silent) return;
    let msg = `[${new Date(data.date).toLocaleTimeString()}]`;
    if (data.from) msg += ` ${data.from}:`;
    if (data.message) msg += ` ${data.message.replace(/\n/g, "<br>")}`;
    setLogs((prevState) => [...prevState, msg]);
  };

  return (
    <RoomContext.Provider
      value={{ currentRoomCode, setCurrentRoomCode, logs, pushLog }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  return useContext(RoomContext);
};
