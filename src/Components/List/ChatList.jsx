import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../Lib/Firebase";
import { useUserStore } from "../Lib/UserStore";
import { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import { useChatStore } from "../Lib/ChatStore";
import { toast } from "react-toastify";

/*eslint-disable react/prop-types */
function ChatList({ chats, setChats, filteredChats }) {
  const { currentUser } = useUserStore();
  const { changeChat } = useChatStore();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userChats", currentUser.uid),
      async (res) => {
        const items = res.data()?.chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();

          return { ...item, user };
        });

        const chatData = await Promise.all(promises);

        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      setIsLoading(false);
      unSub();
    };
  }, [currentUser.uid, setChats]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const {  ...rest } = item;
      return rest;
    });
  
    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );
  
    userChats[chatIndex].isSeen = true;
  
    const userChatsRef = doc(db, "userChats", currentUser.uid);
  
    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
  
      // Retrieve the images array from the chat document
      const chatRef = doc(db, "chats", chat.chatId);
      const chatSnapshot = await getDoc(chatRef);
      const images = chatSnapshot.data().images;
  
      // Pass the images array as a prop to the component that will display the images
      changeChat(chat.chatId, chat.user, images);
    } catch (err) {
      console.log(err);
      toast("Something went wrong");
    }
  };

  if (isLoading)
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Oval
          visible={true}
          height="80"
          width="80"
          color="#1c9cb0"
          secondaryColor="#006574"
          ariaLabel="oval-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );

  return (
    <div className="chat flex-[1] overflow-scroll  flex flex-col divide-sky-800 divide-y-[.1px] ">
      {filteredChats.map((chat) => (
        <div
          className={`flex items-center gap-3 p-3 rounded-md cursor-pointer ${
            chat.isSeen ? "transparent" : "bg-[#051a3590]"
          }`}
          key={chat.chatId}
          onClick={() => handleSelect(chat)}
        >
          <img
            src={
              chat.user.blocked.includes(currentUser.uid)
                ? "https://t3.ftcdn.net/jpg/05/53/79/60/360_F_553796090_XHrE6R9jwmBJUMo9HKl41hyHJ5gqt9oz.jpg"
                : chat?.user?.avatar ||
                  "https://t3.ftcdn.net/jpg/05/53/79/60/360_F_553796090_XHrE6R9jwmBJUMo9HKl41hyHJ5gqt9oz.jpg"
            }
            className="rounded-full h-14 w-14 object-cover"
          />
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">
              {chat.user.blocked.includes(currentUser.uid)
                ? "User"
                : chat.user.username}
            </h2>
            <p className="text-gray-300 font-light text-md">
              {chat?.lastMessage}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatList;
