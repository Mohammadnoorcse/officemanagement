import { useState } from "react";
import GroupList from "./GroupList";
import ChatWindow from "./ChatWindow";

const ChatLayout = () => {
  const [group, setGroup] = useState(null);

  return (
    <div className="flex flex-col md:flex-row h-[80vh] bg-gray-100 rounded-xl shadow-lg overflow-hidden">
      <div className="md:w-1/4 border-r bg-white">
        <GroupList setGroup={setGroup} />
      </div>
      <div className="flex-1 bg-white">
        <ChatWindow group={group} />
      </div>
    </div>
  );
};

export default ChatLayout;
