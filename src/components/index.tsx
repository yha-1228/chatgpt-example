import { type ComponentPropsWithRef } from "react";
import { CgSpinner } from "react-icons/cg";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { type Replace } from "@/types";
import { cn } from "@/utils";

export function Container(props: ComponentPropsWithRef<"div">) {
  const { className, ...restProps } = props;
  return (
    <div
      className={cn("container max-w-screen-sm mx-auto px-4", className)}
      {...restProps}
    />
  );
}

export function TextField(props: ComponentPropsWithRef<"input">) {
  const { className, ...restProps } = props;
  return (
    <input
      className={cn(
        "h-10 bg-white border-2 border-gray-900 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-500 px-2.5 py-2 focus:outline-3 focus:outline-solid focus:outline-indigo-300",
        className
      )}
      {...restProps}
    />
  );
}

export type ButtonProps = ComponentPropsWithRef<"button"> & {
  loading?: boolean;
};

export function Button(props: ButtonProps) {
  const { loading, disabled, children, className, ...restProps } = props;
  return (
    <button
      className={cn(
        "transition-colors bg-indigo-600 text-white h-10 px-4 cursor-pointer hover:bg-indigo-700 active:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-gray-400 focus:outline-indigo-300 focus:outline-solid focus:outline-3",
        loading && "inline-flex justify-center items-center",
        className
      )}
      disabled={loading || disabled}
      {...restProps}
    >
      {loading ? <CgSpinner className="size-[24px] animate-spin" /> : children}
    </button>
  );
}

export type ChatMarkdownSpeechProps = Replace<
  ComponentPropsWithRef<"div">,
  { children: string | undefined }
> & { sender: "me" | "feedback" };

export function ChatMarkdownSpeech(props: ChatMarkdownSpeechProps) {
  const { sender, className, children, ...restProps } = props;

  const senderClassMap = {
    me: cn("bg-indigo-600 text-white/90 font-bold border border-transparent"),
    feedback: cn("bg-gray-100 border border-gray-400"),
  } as const satisfies Record<ChatMarkdownSpeechProps["sender"], string>;

  return (
    <div className={cn(senderClassMap[sender], className)} {...restProps}>
      <div
        className={cn(
          "px-6 py-2",
          "[&>h2]:text-2xl [&>h2]:font-bold [&>h2]:my-6",
          "[&>h3]:text-xl [&>h3]:font-bold [&>h3]:my-5",
          "[&>h4]:text-lg [&>h4]:font-bold  [&>h4]:my-4",
          "[&>ul]:list-inside [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:my-5",
          "[&>ol]:list-inside [&>ol]:list-decimal [&>ol]:pl-4 [&>ol]:my-5",
          "[&>ul>li]:-indent-5 [&>ul>li]:pl-3",
          "[&>ul>ol]:-indent-5 [&>ul>ol]:pl-3",
          "[&>hr]:my-6 [&>hr]:h-0.5 [&>hr]:bg-gray-300 [&>hr]:border-0",
          "[&>p]:my-4"
        )}
      >
        <Markdown remarkPlugins={[remarkGfm]}>{children}</Markdown>
      </div>
    </div>
  );
}
