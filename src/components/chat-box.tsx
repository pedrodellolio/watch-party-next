"use client";

import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Commands } from "@/models/commands";
import { SendIcon } from "lucide-react";

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
    <div className="w-full xl:w-[800px] relative border rounded-md p-6 text-sm text-muted-foreground">
      <Button
        size="sm"
        variant={"outline"}
        className="text-xs absolute top-4 right-6 z-10 h-6 cursor-pointer"
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
        <div className="relative w-full">
          <Input
            type="text"
            className="placeholder:text-muted-foreground/50 h-12"
            placeholder="Send a message..."
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={() => setOptions([])}
            value={input}
          />
          <Button
            type="submit"
            variant="outline"
            size="icon"
            className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-white p-1.5 rounded-full hover:bg-gray-700 transition h-8 w-8"
          >
            <SendIcon className="mr-0.5" />
          </Button>
        </div>

        <ul
          className={`absolute bg-gray-800 w-32 p-1 px-2 rounded-md mt-1 overflow-scroll ${
            options.length === 0 && "hidden"
          }`}
        >
          {options.map((op, i) => (
            <li
              key={i}
              className={`mb-1 px-1 rounded ${
                i === currentSelectedIndex ? "bg-gray-600 text-white" : ""
              }`}
            >
              {op}
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
}
