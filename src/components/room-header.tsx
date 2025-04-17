import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type Props = {
  roomName: string;
  users: string[];
};

export default function RoomHeader({ users, roomName }: Props) {
  return (
    <div className="flex flex-row items-center justify-between gap-10 border rounded-md p-4 px-6">
      <p>{roomName}</p>
      <div className="flex flex-row-reverse">
        {users.slice(0, 4).map((u, i) => (
          <TooltipProvider key={i}>
            <Tooltip>
              <TooltipTrigger>
                <Avatar className="cursor-pointer border-2 border-[#09090b] -mx-1 w-9 h-9">
                  <AvatarImage src="" alt="@shadcn" />
                  <AvatarFallback className="text-md">
                    {u[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{u}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}

        {users.length > 4 && (
          <Avatar className="border-2 border-[#09090b] -mx-1">
            <AvatarImage src="" alt="@shadcn" />
            <AvatarFallback className="text-xs">
              +{users.length - 4}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}
