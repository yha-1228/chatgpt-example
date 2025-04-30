import { type ChatCompletionCreateParamsStreaming } from "openai/resources.mjs";
import { useState } from "react";

import { client } from "@/api-client/chatgpt";
import { type ChatMarkdownSpeechProps } from "@/components";
import {
  useAsyncAction,
  type UseAsyncActionProps,
} from "@/hooks/use-async-action";
import { createId } from "@/utils";

type ChatMessage = {
  id: string;
  text: string;
  sender: ChatMarkdownSpeechProps["sender"];
};

export function useChatCreateAction(
  inputText: string,
  callback?: Pick<UseAsyncActionProps, "onSuccess" | "onError">
) {
  const [totalRequestMessages, setTotalRequestMessages] = useState<
    ChatCompletionCreateParamsStreaming["messages"]
  >([]);

  const [chatMessageList, setChatMessageList] = useState<ChatMessage[]>([]);

  const [chatCreateState, chatCreateAction] = useAsyncAction({
    action: async () => {
      // 自分のメッセージを追加する
      setChatMessageList((prev) => [
        ...prev,
        { id: createId(), sender: "me", text: inputText },
      ]);

      // 自分のメッセージをこれまでのリクエストに加える
      const nextTotalRequestMessages = [
        ...totalRequestMessages,
        { role: "user", content: inputText },
      ] as const satisfies ChatCompletionCreateParamsStreaming["messages"];

      setTotalRequestMessages(nextTotalRequestMessages);

      // APIをリクエストする
      // @see https://platform.openai.com/docs/guides/streaming-responses?api-mode=chat&lang=javascript
      const stream = await client.chat.completions.create({
        model: "gpt-4.1",
        messages: nextTotalRequestMessages,
        stream: true,
      });

      // ストリームを読み取り、逐次テキストを返答側のメッセージにセットする
      const chatMessageId = createId();
      setChatMessageList((prev) => [
        ...prev,
        { id: chatMessageId, sender: "feedback", text: "" },
      ]);

      let totalContent = "";

      for await (const chunk of stream) {
        const content = chunk.choices[0].delta.content;
        if (content === undefined) break;

        totalContent = totalContent + content;
        setChatMessageList((prev) =>
          prev.map((chatMessage) => {
            if (chatMessage.id === chatMessageId) {
              return { ...chatMessage, text: totalContent };
            } else {
              return chatMessage;
            }
          })
        );
      }
    },
    onSuccess: callback?.onSuccess,
    onError: callback?.onError,
  });

  return {
    chatMessageList,
    chatCreateState,
    chatCreateAction,
  };
}
