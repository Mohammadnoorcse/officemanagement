import { useEffect, useState, useRef } from "react";
import api from "../../api/axios";
import MessageInput from "./MessageInput";

const ChatWindow = ({ group }) => {
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/user"); // returns {id, name, email}
        setCurrentUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, []);

  // Fetch messages
  useEffect(() => {
    if (!group) return;
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/group-chat/${group.id}/messages`);
        setMessages(res.data);
        scrollToBottom();
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };
    fetchMessages();
  }, [group]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  if (!group)
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a group
      </div>
    );

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b font-semibold text-lg bg-gray-100">
        {group.name}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
        {messages.map((m) => {
          const isSender = currentUser && m.user_id === currentUser.id;
          return (
            <div
              key={m.id}
              className={`flex flex-col ${
                isSender ? "items-end" : "items-start"
              }`}
            >
              {/* Sender */}
              <p className="text-xs text-gray-500 mb-1">
                {isSender ? "You" : m.user_name}
              </p>

              {/* Message bubble */}
              <div
                className={`p-2 max-w-xs rounded-lg shadow ${
                  isSender ? "bg-purple-600 text-white" : "bg-white text-gray-800"
                }`}
              >
                <p className="text-sm">{m.message}</p>
                <p className="text-[10px] text-gray-400 mt-1 text-right">
                  {new Date(m.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <MessageInput groupId={group.id} setMessages={setMessages} />
    </div>
  );
};

export default ChatWindow;
