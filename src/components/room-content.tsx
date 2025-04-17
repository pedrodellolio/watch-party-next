"use client";

import { FormEvent, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useAuth } from "@/contexts/user-context";
import { useRoom } from "@/contexts/room-context";
import useWebSocket from "react-use-websocket";
import { Button } from "./ui/button";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

interface Props {
  data: Room;
}

export default function RoomContent({ data }: Props) {
  const [logs, setLogs] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [socketUrl, setSocketUrl] = useState<string | null>(null);

  const { setCurrentRoomCode } = useRoom();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setSocketUrl(
        `ws://localhost:5076/ws?room=${data.code}&userId=${user.id}`
      );
    }
  }, [user, data.code]);

  const {
    sendMessage,
    lastMessage: response,
    readyState,
  } = useWebSocket(socketUrl, {
    shouldReconnect: () => true,
    reconnectInterval: 3000,
  });

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
      console.debug(data);

      if (data.type == "COMMAND") {
        if (data.response == "/play") {
          if (data.content[0] !== "") setCurrentVideoUrl(data.content[0]);
          setIsPlaying(true);
        }
        if (data.response === "/pause") setIsPlaying(false);
        if (data.response === "/skip") {
          setCurrentVideoUrl(`${data.content[0]}?forceUpdate=${data.date}`);
          setIsPlaying(true);
        }
      }
      if (data.type == "SYSTEM") log(data);
      if (data.type == "MESSAGE") log(data);
    }
  }, [response]);

  useEffect(() => {
    setCurrentRoomCode(data.code);
  }, [data]);

  const log = (data: any) => {
    if (data.silent) return;
    let msg = `[${new Date(data.date).toLocaleTimeString()}]`;
    if (data.from) msg += ` ${data.from}:`;
    if (data.message) msg += ` ${data.message.replace(/\n/g, "<br>")}`;
    setLogs((prevState) => [...prevState, msg]);
  };

  const send = (action: string, message: string) => {
    sendMessage(
      JSON.stringify({
        action: action,
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

  const handlePlay = () => {
    if (!isPlaying) send("command", "/play");
  };

  return (
    <div className="p-6">
      <div className="flex flex-col-reverse flex-md-row justify-between gap-4">
        <div className="w-full w-md-[800px] relative border rounded-md p-6 text-sm text-muted-foreground">
          <Button
            size="sm"
            variant={"outline"}
            className="text-xs absolute top-4 right-6 z-10 h-6"
            onClick={() => setLogs([])}
          >
            Clear
          </Button>

          <div className="h-[540px] overflow-y-scroll mb-6 mt-8">
            {logs.map((log, i) => (
              <div key={i} dangerouslySetInnerHTML={{ __html: log }} />
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
        <div className="border min-w-64">
          <ReactPlayer
            key={currentVideoUrl}
            url={currentVideoUrl.split("?forceUpdate")[0]}
            width={"100%"}
            height={"600px"}
            // onPlay={handlePlay}
            playing={isPlaying}
            fallback={<p className="text-white">Loading...</p>}
            // muted={isMuted}
          />
        </div>
      </div>
    </div>
  );
}
