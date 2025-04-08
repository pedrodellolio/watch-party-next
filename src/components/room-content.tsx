"use client";

import { useEffect, useState } from "react";

interface Props {
  data: Room;
}
export default function RoomContent({ data }: Props) {
  const [usersJoined, setUsersJoined] = useState(0);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5025/ws");

    socket.onopen = () => {
      socket.send(JSON.stringify({ action: "join", room: data.code }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type == "userCountUpdate") setUsersJoined(message.userCount);
    };

    socket.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    return () => {
      socket.close();
    };
  }, [data]);

  return (
    <div>
      <p>Room name: {data.name}</p>
      <p>Room code: {data.code}</p>
      <p>Users: {usersJoined}</p>
    </div>
  );
}
