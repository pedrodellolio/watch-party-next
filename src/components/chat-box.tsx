"use client";

import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Commands } from "@/models/commands";
import { SendIcon } from "lucide-react";
import { Card } from "./ui/card";

type Props = {
  logs: string[];
  setLogs: Dispatch<SetStateAction<string[]>>;
  send: (action: string, message: string) => void;
};

const SUGGESTIONS = Object.values(Commands);

export default function ChatBox({ logs, setLogs, send }: Props) {
  const [input, setInput] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [currentSelectedIndex, setCurrentSelectedIndex] = useState(-1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setCurrentSelectedIndex(-1);

    if (value === "") {
      setOptions([]);
      return;
    }

    const _suggestions = SUGGESTIONS.filter((op) => op.startsWith(value));
    setOptions(_suggestions);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown")
      setCurrentSelectedIndex((prev) => (prev + 1) % options.length);
    else if (e.key === "ArrowUp")
      setCurrentSelectedIndex(
        (prev) => (prev - (1 % options.length)) % options.length
      );
    else if (e.key === "Enter" && currentSelectedIndex >= 0) {
      e.preventDefault();
      setInput(options[currentSelectedIndex]);
      setOptions([]);
      setCurrentSelectedIndex(-1);
    }
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
    <Card className="w-full xl:w-[800px] relative p-6 text-sm">
      <Button
        size="sm"
        variant={"default"}
        className="text-xs absolute top-4 right-6 z-10 cursor-pointer"
        onClick={() => setLogs([])}
      >
        Clear
      </Button>

      <div className="h-[540px] overflow-y-scroll mb-6 mt-8">
        {logs.map((log, i) => (
          <div
            className="text-foreground"
            key={i}
            dangerouslySetInnerHTML={{ __html: log }}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="w-full flex flex-row items-center gap-2">
          <Input
            type="text"
            placeholder="Send a message..."
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={() => setOptions([])}
            value={input}
          />
          <Button type="submit" size="icon">
            <SendIcon className="mr-0.5" />
          </Button>
        </div>

        <Card
          className={`absolute bg-main w-32 p-1 px-2 rounded-md mt-1 overflow-scroll ${
            options.length === 0 && "hidden"
          }`}
        >
          <ul>
            {options.map((op, i) => (
              <li
                key={i}
                className={`mb-1 px-1 rounded text-main-foreground ${
                  i === currentSelectedIndex ? "bg-secondary-background/25 text-main-foreground" : ""
                }`}
              >
                {op}
              </li>
            ))}
          </ul>
        </Card>
      </form>
    </Card>
  );
}
