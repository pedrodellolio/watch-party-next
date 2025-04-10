"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { useAuth } from "@/contexts/user-context";
import VideoPlayer from "./youtube-player";
import { useRoom } from "@/contexts/room-context";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import useWebSocket from "react-use-websocket";
import { Button } from "./ui/button";

interface Props {
  data: Room;
}

interface User {
  name: string;
  avatarUrl: string;
}

enum ResponseType {
  DIRECT = "direct",
  BROADCAST = "broadcast",
  USER_LIST = "user_list",
  ERROR = "error",
  COMMAND = "command",
  SYSTEM = "system",
}

export default function RoomContent({ data }: Props) {
  const [usersJoined, setUsersJoined] = useState<User[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(
    "https://www.youtube.com/watch?v=-Lhx0yTjSac&pp=0gcJCX4JAYcqIYzv"
  );

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const { setCurrentRoomCode } = useRoom();
  const { user } = useAuth();
  const {
    sendMessage,
    lastMessage: response,
    readyState,
  } = useWebSocket(
    `ws://localhost:5076/ws?room=${data.code}${
      user && `&username=${user.email}&userId=${user.id}`
    }`,
    {
      shouldReconnect: () => true,
      reconnectInterval: 3000,
    }
  );

  useEffect(() => {
    const keepAliveInterval = setInterval(() => {
      if (readyState === WebSocket.OPEN) {
        send("keep_alive", "ping");
      }
    }, 20000);

    return () => clearInterval(keepAliveInterval);
  }, [readyState, sendMessage]);

  useEffect(() => {
    if (response !== null) {
      const data = JSON.parse(response.data);
      if (data.message) log(data);

      if (data.type === "CURRENT_VIDEO") {
        setCurrentVideoUrl(data.message);
        setIsPlaying(true);
      }
      if (data.type === "ROOM_INFO") setUsersJoined(data.users);
      if (data.type === "COMMAND") {
        if (data.message === "/play") setIsPlaying(true);
        if (data.message === "/pause") setIsPlaying(false);
      }
    }
  }, [response]);

  useEffect(() => {
    setCurrentRoomCode(data.code);
  }, [data]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollTop = bottomRef.current.scrollHeight;
    }
  }, [logs]);

  const log = (data: any) => {
    console.log(data.message);
    let msg = `[${new Date(data.date).toLocaleTimeString()}]`;
    if (data.from) msg += ` ${data.from}:`;
    msg += ` ${data.message}`;
    setLogs((prevState) => [...prevState, msg]);
  };

  const send = (action: string, message: string) => {
    sendMessage(
      JSON.stringify({
        action: action,
        roomCode: data.code,
        username: user?.email,
        userId: user?.id,
        message: message,
      })
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input === "") return;
    let action = "message";
    if (input.startsWith("/")) action = "command";
    send(action, input);
    setInput("");
  };
  return (
    <div className="p-6">
      <div className="flex justify-start items-center flex-row mb-8 gap-4">
        <p className="border rounded-md p-2 px-4 w-auto">{data.name}</p>

        <div className="flex flex-row">
          {usersJoined.map((u, i) => (
            <TooltipProvider key={i}>
              <Tooltip>
                <TooltipTrigger>
                  <Avatar className="cursor-pointer border-2 border-[#09090b] -mx-1">
                    <AvatarImage src="" alt="@shadcn" />
                    <AvatarFallback className="text-xs">
                      {u.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{u.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
          <Avatar className="border-2 border-[#09090b] -mx-1">
            <AvatarImage src="" alt="@shadcn" />
            <AvatarFallback className="text-xs">+2</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <VideoPlayer
        url={currentVideoUrl}
        socketRef={socketRef}
        playing={isPlaying}
        handleRequest={send}
      />
      {/* <Button
        onClick={() =>
          setCurrentVideoUrl("https://www.youtube.com/watch?v=YiFLwjFI4S4")
        }
      >
        Change video
      </Button> */}

      <div className="relative mt-8 border rounded-md p-6 text-sm text-muted-foreground">
        <Button
          size="sm"
          variant={"outline"}
          className="text-xs absolute top-4 right-10 z-10 h-6"
          onClick={() => setLogs([])}
        >
          Clear
        </Button>

        <div ref={bottomRef} className="h-48 overflow-y-scroll mb-4">
          {logs.map((log, i) => (
            <p key={i}>{log}</p>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            className="placeholder:text-muted-foreground/50"
            placeholder="Send a message..."
            onChange={handleChange}
            value={input}
          />
        </form>
      </div>
    </div>
  );
}
