"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import * as Ably from "ably";
import { AblyProvider } from "ably/react";
import { ChatClient, LogLevel } from "@ably/chat";
import { ChatClientProvider, ChatRoomProvider } from "@ably/chat/react";
import {
  useChatConnection,
  useMessages,
  usePresence,
  usePresenceListener,
  useRoom,
  useTyping,
} from "@ably/chat/react";
import { ChatMessageEvent, Message, ChatMessageEventType } from "@ably/chat";
import { Send } from "lucide-react";

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, "0");
  return `${displayHours}:${displayMinutes} ${ampm}`;
};

const getAvatarGradient = (username: string) => {
  const gradients = [
    "bg-gradient-to-br from-[#FFFFFF] to-[#CCCCCC]",
    "bg-gradient-to-br from-[#EAEAEA] to-[#999999]",
    "bg-gradient-to-br from-[#DDDDDD] to-[#888888]",
    "bg-gradient-to-br from-[#F5F5F5] to-[#AAAAAA]",
    "bg-gradient-to-br from-[#E0E0E0] to-[#777777]",
    "bg-gradient-to-br from-[#FFFFFF] to-[#AAAAAA]",
    "bg-gradient-to-br from-[#F0F0F0] to-[#999999]",
    "bg-gradient-to-br from-[#E5E5E5] to-[#666666]",
  ];
  const hash = username.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return gradients[Math.abs(hash) % gradients.length];
};

const getInitials = (username: string) => {
  return username.charAt(0).toUpperCase();
};

const Avatar = ({
  username,
  size = "md",
}: {
  username: string;
  size?: "sm" | "md" | "lg";
}) => {
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };

  return (
    <div
      className={`${sizeClasses[size]} ${getAvatarGradient(username)} rounded-full flex items-center justify-center font-bold text-whispr-bg-primary shadow-lg`}
    >
      {getInitials(username)}
    </div>
  );
};

const UsernameModal = ({
  onSubmit,
}: {
  onSubmit: (username: string) => void;
}) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();

    if (!trimmed) {
      setError("Username is required");
      return;
    }

    if (trimmed.includes(" ")) {
      setError("Username cannot contain spaces");
      return;
    }

    if (trimmed.length < 2) {
      setError("Username must be at least 2 characters");
      return;
    }

    if (trimmed.length > 20) {
      setError("Username must be less than 20 characters");
      return;
    }

    onSubmit(trimmed);
  };

  return (
    <div className="fixed inset-0 bg-whispr-bg-primary/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-whispr-bg-secondary backdrop-blur-2xl border border-whispr-border rounded-2xl p-12 max-w-md w-full shadow-2xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-whispr-text-primary mb-3 tracking-tight">
            Enter Username
          </h2>
          <p className="text-sm text-whispr-text-secondary tracking-wide">
            Choose your display name to join the conversation
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              placeholder="Username"
              className="w-full bg-whispr-bg-primary border border-whispr-border rounded-lg px-4 py-3.5 text-whispr-text-primary placeholder:text-whispr-text-muted outline-none focus:border-whispr-text-secondary focus:ring-2 focus:ring-whispr-text-muted/20 transition-all text-lg"
              autoFocus
            />
            {error && (
              <p className="text-whispr-error text-sm mt-3 font-medium">{error}</p>
            )}
            <p className="text-whispr-text-muted text-xs mt-3 tracking-wide">
              No spaces • 2-20 characters
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-whispr-accent text-whispr-bg-primary py-4 rounded-lg hover:bg-whispr-text-primary transition-all duration-200 text-sm uppercase tracking-[0.1em] font-semibold shadow-lg"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

const ConnectionStatus = () => {
  const { currentStatus } = useChatConnection();
  return (
    <div className="px-6 py-5 h-full bg-whispr-bg-secondary border-r border-whispr-border flex items-center">
      <div className="flex items-center gap-2.5">
        <div
          className={`w-2 h-2 rounded-full transition-all duration-300 ${currentStatus === "connected" ? "bg-whispr-accent shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "bg-whispr-text-secondary shadow-[0_0_10px_rgba(136,136,136,0.5)]"}`}
        />
        <span className="text-xs text-whispr-text-secondary font-semibold uppercase tracking-[0.1em]">
          {currentStatus}
        </span>
      </div>
    </div>
  );
};

const RoomStatus = ({ roomId }: { roomId: string }) => {
  const router = useRouter();
  const [currentRoomStatus, setCurrentRoomStatus] = useState("");
  const { roomName } = useRoom({
    onStatusChange: (status) => {
      setCurrentRoomStatus(status.current);
    },
  });

  return (
    <div className="px-6 py-5 h-full bg-whispr-bg-secondary flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-xs text-whispr-text-muted uppercase tracking-[0.1em] font-semibold">
          Room
        </span>
        <span className="text-sm text-whispr-text-primary font-mono truncate bg-whispr-bg-primary px-3 py-1.5 rounded-md">
          {roomId}
        </span>
      </div>
      <button
        onClick={() => router.push("/")}
        className="px-4 py-2 bg-whispr-border hover:bg-whispr-accent hover:text-whispr-bg-primary hover:scale-105 text-xs text-whispr-text-primary transition-all duration-200 uppercase tracking-[0.1em] font-semibold rounded-lg shadow-sm hover:shadow-md"
      >
        Exit
      </button>
    </div>
  );
};

const EmptyState = ({ roomId }: { roomId: string }) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-md px-6">
        <h2 className="text-2xl font-bold text-whispr-text-primary mb-3">
          Welcome to room {roomId}!
        </h2>
        <p className="text-sm text-whispr-text-secondary leading-relaxed mb-4">
          Be the first to say something. Start a conversation and invite others
          to join.
        </p>
        <p className="text-xs text-whispr-text-muted italic">
          Messages are automatically deleted after 24 hours
        </p>
      </div>
    </div>
  );
};

const ChatBox = ({
  username,
  roomId,
}: {
  username: string;
  roomId: string;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { sendMessage, updateMessage, historyBeforeSubscribe } = useMessages({
    listener: (event: ChatMessageEvent) => {
      const message = event.message;
      switch (event.type) {
        case ChatMessageEventType.Created: {
          setMessages((prevMessages) => [...prevMessages, message]);
          break;
        }
        case ChatMessageEventType.Updated: {
          setMessages((prevMessages) => {
            const index = prevMessages.findIndex((other) =>
              message.isSameAs(other),
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
        default: {
          console.error("Unhandled event", event);
        }
      }
    },
  });

  const { currentlyTyping, keystroke, stop } = useTyping();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        if (!historyBeforeSubscribe) {
          return;
        }
        const history = await historyBeforeSubscribe({ limit: 100 });
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

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage({ text: inputValue.trim() }).catch((err) =>
      console.error("Error sending message", err),
    );
    setInputValue("");
    stop().catch((err) => console.error("Error stopping typing", err));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (newValue.trim().length > 0) {
      keystroke().catch((err) => console.error("Error starting typing", err));
    } else {
      stop().catch((err) => console.error("Error stopping typing", err));
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-whispr-bg-primary">
      <div className="flex-1 px-6 pt-6 pb-3 overflow-y-auto">
        {messages.length === 0 ? (
          <EmptyState roomId={roomId} />
        ) : (
          messages.map((msg: Message, idx: number) => {
            const isMine = msg.clientId === username;
            const prevMsg = idx > 0 ? messages[idx - 1] : null;
            const nextMsg =
              idx < messages.length - 1 ? messages[idx + 1] : null;

            const isFirstInGroup =
              !prevMsg || prevMsg.clientId !== msg.clientId;
            const isLastInGroup = !nextMsg || nextMsg.clientId !== msg.clientId;
            const isMiddleInGroup = !isFirstInGroup && !isLastInGroup;

            let borderRadius = "rounded-2xl";
            if (isFirstInGroup && !isLastInGroup) {
              borderRadius = isMine
                ? "rounded-2xl rounded-br-md"
                : "rounded-2xl rounded-bl-md";
            } else if (isMiddleInGroup) {
              borderRadius = isMine
                ? "rounded-2xl rounded-br-md rounded-tr-md"
                : "rounded-2xl rounded-bl-md rounded-tl-md";
            } else if (!isFirstInGroup && isLastInGroup) {
              borderRadius = isMine
                ? "rounded-2xl rounded-tr-md"
                : "rounded-2xl rounded-tl-md";
            }

            return (
              <div
                key={idx}
                className={`flex ${isMine ? "justify-end" : "justify-start"} ${isFirstInGroup ? "mt-6" : "mt-0.5"} animate-in fade-in slide-in-from-bottom-2 duration-200`}
                onMouseEnter={() => setHoveredMessage(msg.serial)}
                onMouseLeave={() => setHoveredMessage(null)}
              >
                <div
                  className={`flex gap-3 max-w-[75%] ${isMine ? "flex-row-reverse" : "flex-row"}`}
                >
                  {!isMine && (
                    <div
                      className={`flex-shrink-0 w-6 ${isFirstInGroup ? "" : "invisible"}`}
                    >
                      <Avatar username={msg.clientId} size="sm" />
                    </div>
                  )}

                  <div className="flex flex-col flex-1 min-w-0">
                    {isFirstInGroup && (
                      <div
                        className={`flex items-baseline gap-2 mb-1.5 ${isMine ? "justify-end" : "justify-start"}`}
                      >
                        <span className="text-xs text-[var(--whispr-text-primary)] font-semibold">
                          {msg.clientId}
                        </span>
                        {msg.timestamp && (
                          <span className="text-[10px] text-[var(--whispr-text-muted)]">
                            {formatTime(new Date(msg.timestamp).getTime())}
                          </span>
                        )}
                      </div>
                    )}

                    <div
                      onClick={() => onUpdateMessage(msg)}
                      className={`px-4 py-2.5 ${
                        isMine
                          ? "bg-[var(--whispr-accent)] text-[var(--whispr-bg-primary)] cursor-pointer hover:bg-[var(--whispr-text-primary)] hover:shadow-lg hover:scale-[1.02]"
                          : "bg-[var(--whispr-bg-secondary)] text-[var(--whispr-text-primary)] hover:bg-[var(--whispr-bg-tertiary)]"
                      } transition-all duration-200 ${borderRadius} shadow-sm group-hover:shadow-md`}
                    >
                      <p className="text-sm leading-relaxed break-words">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="px-6 pb-3 h-8 flex items-center">
        {(() => {
          const othersTyping = Array.from(currentlyTyping).filter(
            (id) => id !== username,
          );
          return (
            othersTyping.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span
                    className="w-1.5 h-1.5 bg-whispr-accent rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-whispr-accent rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-whispr-accent rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
                <p className="text-xs text-whispr-text-secondary font-medium">
                  {othersTyping.join(", ")}{" "}
                  {othersTyping.length === 1 ? "is" : "are"} typing...
                </p>
              </div>
            )
          );
        })()}
      </div>

      <div className="border-t border-whispr-border bg-whispr-bg-secondary">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3 mb-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-whispr-bg-primary border-2 border-whispr-border rounded-lg px-4 py-3 text-whispr-text-primary placeholder:text-whispr-text-muted outline-none focus:border-whispr-text-muted focus:ring-2 focus:ring-whispr-text-muted/20 transition-all duration-200 text-sm"
              value={inputValue}
              onChange={handleChange}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSend();
                }
              }}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="bg-whispr-accent text-whispr-bg-primary p-3 rounded-full hover:bg-whispr-text-primary hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-90"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[10px] text-whispr-text-muted italic text-center">
            like a real whisper, these messages fade away in 24 hours
          </p>
        </div>
      </div>
    </div>
  );
};

const PresenceStatus = ({ currentUsername }: { currentUsername: string }) => {
  const [isRoomAttached, setIsRoomAttached] = useState(false);
  const { enter } = usePresence();
  const { presenceData } = usePresenceListener();

  useRoom({
    onStatusChange: (change) => {
      if (change.current === "attached") {
        setIsRoomAttached(true);
      }
    },
  });

  useEffect(() => {
    if (isRoomAttached) {
      enter().catch((err) => console.error("Error entering presence:", err));
    }
  }, [isRoomAttached, enter]);

  return (
    <div className="flex flex-col bg-whispr-bg-primary w-full h-full px-6 py-6">
      <div className="mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-whispr-text-muted">
          Online · {presenceData.length}
        </h3>
      </div>
      <div className="flex-1 flex-col flex flex-nowrap items-start gap-3 overflow-y-auto">
        {presenceData.map((member, idx) => {
          const isCurrentUser = member.clientId === currentUsername;
          return (
            <div
              key={idx}
              className="flex items-center gap-3 w-full group cursor-pointer transition-all duration-200 hover:bg-whispr-bg-secondary px-2 py-1.5 rounded-lg -mx-2"
            >
              <div className="relative">
                <Avatar username={member.clientId} size="md" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-whispr-accent rounded-full border-2 border-whispr-bg-primary shadow-[0_0_6px_rgba(255,255,255,0.5)]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-whispr-text-primary group-hover:text-white transition-colors font-medium">
                  {member.clientId}
                </span>
                {isCurrentUser && (
                  <span className="text-xs text-whispr-text-muted">(you)</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-whispr-border">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-whispr-text-muted mb-3">
          Coming Soon
        </h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-whispr-text-muted" />
            <span className="text-xs text-whispr-text-secondary">Password protected rooms</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-whispr-text-muted" />
            <span className="text-xs text-whispr-text-secondary">Room roles (owner, admin)</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-whispr-text-muted" />
            <span className="text-xs text-whispr-text-secondary">System messages for joins/leaves</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const RoomContent = ({
  roomId,
  username,
}: {
  roomId: string;
  username: string;
}) => {
  return (
    <ChatRoomProvider name={roomId}>
      <div className="flex flex-col w-full max-w-7xl h-[calc(100vh-3rem)] overflow-hidden mx-auto bg-whispr-bg-primary border border-whispr-border rounded-2xl shadow-2xl">
        <div className="flex flex-row w-full border-b border-whispr-border">
          <div className="flex-1 border-r border-whispr-border">
            <ConnectionStatus />
          </div>
          <div className="flex-1">
            <RoomStatus roomId={roomId} />
          </div>
        </div>

        <div className="flex flex-1 flex-row overflow-hidden">
          <div className="flex flex-col w-72 border-r border-whispr-border">
            <div className="flex-1 overflow-y-auto">
              <PresenceStatus currentUsername={username} />
            </div>
          </div>

          <div className="flex flex-col flex-1">
            <ChatBox username={username} roomId={roomId} />
          </div>
        </div>
      </div>
    </ChatRoomProvider>
  );
};

const RoomPage = () => {
  const params = useParams();
  const roomId = params.id as string;
  const [username, setUsername] = useState<string | null>(null);
  const [realtimeClient, setRealtimeClient] = useState<Ably.Realtime | null>(
    null,
  );
  const [chatClient, setChatClient] = useState<ChatClient | null>(null);

  useEffect(() => {
    if (!username) return;

    const config: Ably.ClientOptions = {
      clientId: username,
      authCallback: async (tokenParams, callback) => {
        try {
          const response = await fetch(
            `/whispr/api?clientId=${encodeURIComponent(username)}`,
          );
          if (!response.ok) {
            throw new Error("Failed to get token");
          }
          const tokenRequest = await response.json();
          callback(null, tokenRequest);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Authentication failed";
          callback(errorMessage, null);
        }
      },
    };

    const realtime = new Ably.Realtime(config);
    const chat = new ChatClient(realtime, {
      logLevel: LogLevel.Info,
    });

    setRealtimeClient(realtime);
    setChatClient(chat);

    return () => {
      chat.rooms.release(roomId).catch(console.error);
      realtime.close();
    };
  }, [username, roomId]);

  return (
    <div className="min-h-screen bg-whispr-bg-primary flex items-center justify-center p-6">
      <div className="w-full h-full flex items-center justify-center">
        {!username ? (
          <UsernameModal onSubmit={setUsername} />
        ) : !realtimeClient || !chatClient ? (
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-whispr-border border-t-whispr-accent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-sm text-whispr-text-secondary uppercase tracking-[0.15em] font-semibold">
              Connecting to room...
            </p>
          </div>
        ) : (
          <AblyProvider client={realtimeClient}>
            <ChatClientProvider client={chatClient}>
              <RoomContent roomId={roomId} username={username} />
            </ChatClientProvider>
          </AblyProvider>
        )}
      </div>
    </div>
  );
};

export default RoomPage;
