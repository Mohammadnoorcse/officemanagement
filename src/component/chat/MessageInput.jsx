import { useState } from "react";
import api from "../../api/axios";

const MessageInput = ({ groupId, setMessages }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await api.post(`/group-chat/${groupId}/message`, { message: text });
      setMessages((prev) => [...prev, res.data]);
      setText("");
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="p-3 border-t flex gap-2 items-center">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type a message..."
        className="flex-1 border p-2 rounded shadow-inner resize-none h-10 md:h-12"
      />
      <button
        onClick={sendMessage}
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 transition"
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
};

export default MessageInput;
