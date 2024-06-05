import { FaEllipsisH, FaInfoCircle, FaVideo } from "react-icons/fa";
import { useChatStore } from "../Lib/ChatStore";

function ChatInfo() {
  const { user } = useChatStore();

  return (
    <div className="flex items-center justify-between  sticky  p-3">
      <div className="flex items-center  gap-4">
        <img
          src={
            user?.avatar ||
            "https://t3.ftcdn.net/jpg/05/53/79/60/360_F_553796090_XHrE6R9jwmBJUMo9HKl41hyHJ5gqt9oz.jpg "
          }
          alt="user"
          className="w-16 h-16 object-cover rounded-full"
        />
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">{user?.username}</h2>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <FaEllipsisH size={22} className="cursor-pointer" />
        <FaVideo size={22} className="cursor-pointer" />
        <FaInfoCircle size={22} className="cursor-pointer" />
      </div>
    </div>
  );
}

export default ChatInfo;
