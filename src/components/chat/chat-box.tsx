"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useMessages, usePresenceListener } from "@ably/chat/react";
import { ChatMessageEvent, Message, ChatMessageEventType } from "@ably/chat";
import { EmptyState } from "./empty-state";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { MESSAGE_HISTORY_LIMIT } from "@/lib/constants";
import type { MessageItem, SystemMessage } from "@/lib/types";

interface ChatBoxProps {
  username: string;
  roomId: string;
}

export function ChatBox({ username, roomId }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [allItems, setAllItems] = useState<MessageItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
    }, 0);
  };

  usePresenceListener({
    listener: (event) => {
      if (event.type === "present" || event.type === "update") {
        return;
      }

      const timestamp = new Date(event.member.updatedAt).getTime();
      const isCurrentUser = event.member.clientId === username;

      const systemMessage: SystemMessage = {
        type: "system",
        systemType: event.type === "enter" ? "join" : "leave",
        username: isCurrentUser ? "You" : event.member.clientId,
        timestamp,
        id: `system-${event.member.clientId}`,
      };

      setAllItems((prev) => [...prev, systemMessage]);
    },
  });

  useEffect(() => {
    const chatMessages: MessageItem[] = messages.map((msg) => ({
      type: "message" as const,
      data: msg,
    }));

    setAllItems((prev) => {
      const systemMsgs = prev.filter((item) => item.type === "system");
      return [...systemMsgs, ...chatMessages].sort((a, b) => {
        const aTime = a.type === "system" ? a.timestamp : a.data.timestamp || 0;
        const bTime = b.type === "system" ? b.timestamp : b.data.timestamp || 0;
        return aTime - bTime;
      });
    });
  }, [messages, username]);

  const { sendMessage, updateMessage, deleteMessage, historyBeforeSubscribe } =
    useMessages({
      listener: (event: ChatMessageEvent) => {
        const message = event.message;
        switch (event.type) {
          case ChatMessageEventType.Created: {
            setMessages((prevMessages) => [...prevMessages, message]);
            break;
          }
          case ChatMessageEventType.Updated: {
            setMessages((prevMessages) => {
              const index = prevMessages.findIndex(
                (other) => other.serial === message.serial,
              );
              if (index === -1) {
                return prevMessages;
              }
              const updatedArray = prevMessages.slice();
              updatedArray[index] = message;
              return updatedArray;
            });
            break;
          }
          case ChatMessageEventType.Deleted: {
            setMessages((prevMessages) =>
              prevMessages.filter((msg) => msg.serial !== message.serial),
            );
            break;
          }
          default: {
            console.error("Unhandled event:", event);
          }
        }
      },
    });

  useEffect(() => {
    scrollToBottom();
  }, [allItems]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        if (!historyBeforeSubscribe) {
          return;
        }
        const history = await historyBeforeSubscribe({
          limit: MESSAGE_HISTORY_LIMIT,
        });
        setMessages(history.items.reverse());
      } catch (error) {
        console.error("Error loading message history:", error);
      }
    };
    loadHistory();
  }, [historyBeforeSubscribe]);

  const onUpdateMessage = useCallback(
    (message: Message) => {
      if (message.clientId !== username) {
        return;
      }
      // TODO: Replace browser prompt with a proper modal/dialog component for better UX
      const newText = prompt("Enter new text");
      if (!newText) {
        return;
      }
      updateMessage(message.serial, {
        text: newText,
        metadata: message.metadata,
        headers: message.headers,
      }).catch((error: unknown) => {
        console.warn("Failed to update message", error);
      });
    },
    [updateMessage, username],
  );

  const onDeleteMessage = useCallback(
    (message: Message) => {
      if (message.clientId !== username) {
        return;
      }
      if (confirm("Are you sure you want to delete this message?")) {
        deleteMessage(message.serial, {
          description: "Message deleted by user",
        }).catch((error: unknown) => {
          console.warn("Failed to delete message", error);
        });
      }
    },
    [deleteMessage, username],
  );

  const handleSendMessage = useCallback(
    async (text: string) => {
      await sendMessage({ text });
    },
    [sendMessage],
  );

  return (
    <div className="flex flex-col w-full h-full bg-whispr-bg-primary">
      <main
        ref={messagesContainerRef}
        className="flex-1 px-3 md:px-6 pt-4 md:pt-6 pb-3 overflow-y-auto"
        aria-label="Chat messages"
      >
        {allItems.length === 0 ? (
          <EmptyState roomId={roomId} />
        ) : (
          <MessageList
            items={allItems}
            currentUsername={username}
            onUpdateMessage={onUpdateMessage}
            onDeleteMessage={onDeleteMessage}
          />
        )}
        <div ref={messagesEndRef} style={{ height: "1px" }} />
      </main>

      <MessageInput username={username} onSendMessage={handleSendMessage} />
    </div>
  );
}
