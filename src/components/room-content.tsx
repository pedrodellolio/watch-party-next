"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/user-context";
import { useRoom } from "@/contexts/room-context";
import useWebSocket from "react-use-websocket";
import ChatBox from "./chat-box";
import VideoPlayer from "./video-player";
import RoomHeader from "./room-header";

interface Props {
  data: Room;
}

export default function RoomContent({ data }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Video>();
  const [socketUrl, setSocketUrl] = useState<string | null>(null);
  const [users, setUsers] = useState<string[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);

  const { setCurrentRoomCode, logs, pushLog } = useRoom();
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
        if (data.response === "/users") setUsers(data.content);
        if (data.response === "/play") {
          if (data.content[0] !== "")
            setCurrentVideo(JSON.parse(data.content[0]));
          setIsPlaying(true);
        }
        if (data.response === "/pause") setIsPlaying(false);
        if (data.response === "/skip") {
          if (data.content.length > 0) {
            const video = JSON.parse(data.content[0]);
            video.url += `?forceUpdate=${data.date}`;
            setCurrentVideo(video);
            setIsPlaying(true);
          }
        }
      }
      if (data.type === "SYSTEM") pushLog(data);
      if (data.type === "MESSAGE") pushLog(data);
    }
  }, [response]);

  useEffect(() => {
    setCurrentRoomCode(data.code);
  }, [data]);

  const send = (action: string, message: string) => {
    sendMessage(
      JSON.stringify({
        action: action,
        message: message,
      })
    );
  };

  return (
    <div className="p-6">
      <RoomHeader users={users} roomName={data.name} />
      <div className="mt-6 flex flex-col-reverse xl:flex-row-reverse justify-between gap-4">
        <ChatBox logs={logs} setLogs={pushLog} send={send} />
        <VideoPlayer
          currentProgress={currentProgress}
          setCurrentProgress={setCurrentProgress}
          isPlaying={isPlaying}
          video={currentVideo}
          send={send}
        />
      </div>
    </div>
  );
}
