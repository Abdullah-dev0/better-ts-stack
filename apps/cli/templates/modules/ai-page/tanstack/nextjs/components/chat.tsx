"use client";

import { useState } from "react";

import { fetchServerSentEvents, useChat } from "@tanstack/ai-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Sends the conversation to /api/chat and shows the reply as it streams in.
// Stop aborts the request, and the route handler stops the model call
export function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, isLoading, stop, error } = useChat({
    connection: fetchServerSentEvents("/api/chat"),
    // Ties the requests of one conversation together on the server
    threadId: "chat",
  });

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-3" aria-live="polite">
        {messages.map((message) => (
          <li
            key={message.id}
            className={
              message.role === "user"
                ? "max-w-[85%] self-end rounded-lg bg-primary px-3 py-2 text-primary-foreground"
                : "max-w-[85%] self-start rounded-lg bg-muted px-3 py-2"
            }
          >
            {message.parts.map((part, index) =>
              part.type === "text" ? (
                <p key={index} className="whitespace-pre-wrap">
                  {part.content}
                </p>
              ) : null
            )}
          </li>
        ))}
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
          void sendMessage(input);
          setInput("");
        }}
      >
        <Input
          aria-label="Message"
          placeholder="Ask anything"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        {isLoading ? (
          <Button type="button" variant="outline" onClick={stop}>
            Stop
          </Button>
        ) : (
          <Button type="submit">Send</Button>
        )}
      </form>
    </div>
  );
}
