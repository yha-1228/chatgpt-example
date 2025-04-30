"use client";

import { type FormEvent, useRef, useState } from "react";

import { Button, ChatMarkdownSpeech, Container, TextField } from "@/components";
import { useChatCreateAction } from "@/feature/chat";
import { delay } from "@/utils";

export default function Home() {
  const textFieldRef = useRef<HTMLInputElement | null>(null);
  const [inputText, setInputText] = useState("");

  const { chatMessages, chatCreateState, chatCreateAction } =
    useChatCreateAction({
      inputText,
      onSuccess: () => setInputText(""),
      onError: () => alert("Error!"),
    });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await chatCreateAction();
    await delay(10);
    textFieldRef.current?.focus();
  };

  return (
    <div className="flex flex-col">
      {/* height = 100svh - header height - input area height */}
      <div className="overflow-y-auto h-[calc(100svh-4rem-5rem)]">
        <Container className="pt-6 pb-10">
          <div className="space-y-6">
            {chatMessages.map((chatMessage) => (
              // TODO: チャット返答がくる毎に下にスクロールする
              <ChatMarkdownSpeech
                key={chatMessage.id}
                sender={chatMessage.sender}
              >
                {chatMessage.text}
              </ChatMarkdownSpeech>
            ))}
          </div>
        </Container>
      </div>

      <div className="h-20 flex items-center bg-gray-100 border-t-2 border-t-gray-400">
        <Container>
          <form onSubmit={handleSubmit} className="flex gap-x-2">
            <TextField
              value={inputText}
              onChange={(event) => setInputText(event.target.value)}
              ref={textFieldRef}
              placeholder="メッセージを入力..."
              disabled={chatCreateState.pending}
              className="flex-1"
            />
            <Button
              className="w-28"
              disabled={inputText.length === 0}
              loading={chatCreateState.pending}
            >
              送信する
            </Button>
          </form>
        </Container>
      </div>
    </div>
  );
}
