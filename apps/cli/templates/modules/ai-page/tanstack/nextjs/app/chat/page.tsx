import { Chat } from "@/components/chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ChatPage() {
  return (
    <main className="min-h-svh bg-muted px-6 py-16 sm:px-10">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <Chat />
        </CardContent>
      </Card>
    </main>
  );
}
