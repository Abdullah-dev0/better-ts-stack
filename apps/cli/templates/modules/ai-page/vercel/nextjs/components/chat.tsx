"use client";

import { useState } from "react";

import { useChat } from "@ai-sdk/react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Sends the conversation to /api/chat and shows the reply as it streams in.
// Stop aborts the request, and the route handler stops the model call
export function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, stop, error } = useChat();
  const isBusy = status === "submitted" || status === "streaming";
  // Dots until the first words of the reply arrive, as the model may take a
  // while to start
  const last = messages.at(-1);
  const isThinking =
    isBusy &&
    !(
      last?.role === "assistant" &&
      last.parts.some((part) => part.type === "text" && part.text !== "")
    );

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-3" aria-live="polite">
        {messages.map((message) => (
          <li
            key={message.id}
            className={
              message.role === "user"
                ? "bg-primary text-primary-foreground max-w-[85%] self-end rounded-lg px-3 py-2"
                : "bg-muted max-w-[85%] self-start rounded-lg px-3 py-2"
            }
          >
            {message.parts.map((part, index) =>
              part.type === "text" ? (
                <p key={index} className="whitespace-pre-wrap">
                  {part.text}
                </p>
              ) : null
            )}
          </li>
        ))}
        {isThinking ? (
          <li
            role="status"
            className="bg-muted flex items-center gap-1 self-start rounded-lg px-3 py-3.5"
          >
            <span className="sr-only">Thinking</span>
            <span className="bg-muted-foreground size-1.5 rounded-full motion-safe:animate-bounce" />
            <span className="bg-muted-foreground size-1.5 rounded-full motion-safe:animate-bounce motion-safe:[animation-delay:150ms]" />
            <span className="bg-muted-foreground size-1.5 rounded-full motion-safe:animate-bounce motion-safe:[animation-delay:300ms]" />
          </li>
        ) : null}
      </ul>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      ) : null}

      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (input.trim() === "") return;
          void sendMessage({ text: input });
          setInput("");
        }}
      >
        <Input
          aria-label="Message"
          placeholder="Ask anything"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        {isBusy ? (
          <Button type="button" variant="outline" onClick={() => void stop()}>
            Stop
          </Button>
        ) : (
          <Button type="submit">Send</Button>
        )}
      </form>
    </div>
  );
}
