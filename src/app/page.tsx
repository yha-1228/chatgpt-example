"use client";

import { type ChatCompletionCreateParamsStreaming } from "openai/resources.mjs";
import { type FormEvent, useRef, useState } from "react";

import { client } from "@/api-client/chatgpt";
import {
  Button,
  ChatMarkdownSpeech,
  type ChatMarkdownSpeechProps,
  Container,
  TextField,
} from "@/components";
import { useAsyncAction } from "@/hooks";
import { createId, delay, removeDuplicate } from "@/utils";

type ChatMessage = {
  id: string;
  text: string;
  sender: ChatMarkdownSpeechProps["sender"];
};

function useChatMessage(initialValue: ChatMessage[] = []) {
  const [chatMessageList, setChatMessageList] =
    useState<ChatMessage[]>(initialValue);

  const addChatMessage = (newChatMessage: ChatMessage) => {
    setChatMessageList((prev) => [...prev, newChatMessage]);
  };

  const upsertChatMessage = (newChatMessage: ChatMessage) => {
    setChatMessageList((prev) =>
      removeDuplicate([...prev, newChatMessage], "id")
    );
  };

  return [chatMessageList, addChatMessage, upsertChatMessage] as const;
}

// ----------------------------------------

type RequestMessages = ChatCompletionCreateParamsStreaming["messages"];

export default function Home() {
  const textFieldRef = useRef<HTMLInputElement | null>(null);
  const [inputText, setInputText] = useState("");

  const [totalRequestMessages, setTotalRequestMessages] =
    useState<RequestMessages>([]);

  const [chatMessageList, addChatMessage, upsertChatMessage] = useChatMessage();

  const [chatCreateState, chatCreateAction] = useAsyncAction({
    action: async () => {
      const nextTotalRequestMessages: RequestMessages = [
        ...totalRequestMessages,
        { role: "user", content: inputText },
      ];

      setTotalRequestMessages(nextTotalRequestMessages);

      // https://platform.openai.com/docs/guides/streaming-responses?api-mode=chat&lang=javascript
      const stream = await client.chat.completions.create({
        model: "gpt-4.1",
        // messages: [{ role: "user", content: inputText }],
        messages: nextTotalRequestMessages,
        stream: true,
      });

      const chatMessageId = createId();
      let totalContent = "";

      // for await (const content of mockContents) {
      //   await delay(50);
      for await (const chunk of stream) {
        const content = chunk.choices[0].delta.content;
        if (content === undefined) break;

        totalContent = totalContent + content;
        upsertChatMessage({
          id: chatMessageId,
          sender: "feedback",
          text: totalContent,
        });
      }
    },
    onSuccess: () => {
      setInputText("");
    },
    onError: (error) => {
      window.alert(`error.message: ${error.message}`);
    },
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    addChatMessage({ id: createId(), sender: "me", text: inputText });
    await chatCreateAction();
    await delay(10);
    textFieldRef.current?.focus();
  };

  return (
    <div className="flex flex-col">
      {/* height = 100svh - header height - input area height */}
      <div className="overflow-y-auto h-[calc(100svh-4rem-5rem)] sm:h-[calc(100svh-4rem-6rem)]">
        <Container className="pt-6 pb-10">
          <div className="space-y-6">
            {chatMessageList.map((chatMessage) => (
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

      <div className="h-20 sm:h-24 flex items-center bg-gray-100 border-t-2 border-t-gray-300">
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
