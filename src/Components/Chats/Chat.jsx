import { useEffect, useRef, useState } from "react";

import ChatInfo from "./ChatInfo";

import { useFullScreenStore, useUserStore } from "../Lib/UserStore";
import { useChatStore } from "../Lib/ChatStore";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../Lib/Firebase";
import upload from "../Lib/Upload";
import { toast } from "react-toastify";
import { format } from "timeago.js";
import { FaImage, FaSmileBeam, FaTimes } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";

/*eslint-disable react/prop-types */
function Chat() {
  const endRef = useRef(null);
  const [chats, setChats] = useState();
  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();
  const { isFullscreen, toggleFullscreen } = useFullScreenStore();
  const [emoji, setEmoji] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (chatId) {
      // Check if chatId is truthy (not null, undefined, etc.)
      const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
        setChats(res.data());
      });

      return () => {
        unSub();
      };
    }
  }, [chatId]);

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    if (text === "") return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.uid,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
        images: arrayUnion(imgUrl), // Add the image URL to the images array
      });

      const userIDs = [currentUser.uid, user.uid];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userChats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.uid ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setImg({
        file: null,
        url: "",
      });

      setText("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.keyCode === 13) {
      handleSend();
    }
  };

  const handleImageClick = (url) => {
    setImg({ ...img, url });
    toggleFullscreen();
  };
  return (
    <div className="flex-[2] flex flex-col divide-y-[.5px] divide-sky-900 relative">
      <ChatInfo />

      <div className="chatbox flex-[1] flex flex-col gap-2 p-4 overflow-scroll w-full">
        {chats?.messages?.map((message) => (
          <div
            key={message?.createdAt}
            className={`flex max-w-[75%] gap-2 ${
              message.senderId === currentUser.uid
                ? "self-end flex-row-reverse"
                : ""
            }`}
          >
            <img
              src={
                message.senderId !== currentUser?.uid
                  ? user?.avatar ||
                    "https://t3.ftcdn.net/jpg/05/53/79/60/360_F_553796090_XHrE6R9jwmBJUMo9HKl41hyHJ5gqt9oz.jpg"
                  : currentUser?.avatar ||
                    "https://t3.ftcdn.net/jpg/05/53/79/60/360_F_553796090_XHrE6R9jwmBJUMo9HKl41hyHJ5gqt9oz.jpg"
              }
              className="h-8  w-8 rounded-full object-cover"
            />
            <div className="mt-2">
              {message.img && (
                <img
                  src={message.img}
                  className=" w-full object-cover rounded-md h-80"
                  alt=""
                  onClick={() => handleImageClick(message.img)}
                />
              )}
              <p
                className={
                  message.senderId !== currentUser?.uid
                    ? "search p-3 text-[14px] rounded-md"
                    : "p-3 text-[14px] rounded-md bg-sky-800"
                }
              >
                {message.text}
              </p>
              <span className="text-xs font-light text-gray-300">
                {format(message?.createdAt?.toDate())}
              </span>
            </div>
          </div>
        ))}

        {img.url && (
          <div className=" self-end max-w-[75%] my-2 on">
            <div className="texts">
              <img
                src={img.url}
                alt=""
                className="object-cover h-80 rounded-md"
                onClick={() => handleImageClick(img.url)}
              />
            </div>
          </div>
        )}

        <div ref={endRef}></div>
      </div>

      {isFullscreen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
          <img
            src={img.url}
            alt=""
            className="max-w-full max-h-full object-cover cursor-pointer rounded-md"
            onClick={toggleFullscreen}
          />

          <FaTimes
            size={28}
            className="absolute top-0 right-0 cursor-pointer"
            onClick={toggleFullscreen}
          />
        </div>
      )}

      <div className=" flex items-center justify-between gap-4 px-4 mt-auto py-3">
        <div className="flex items-center gap-4">
          <label htmlFor="file">
            <FaImage size={22} className="cursor-pointer" />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
          />
        </div>

        <input
          name="search"
          placeholder={
            isReceiverBlocked || isCurrentUserBlocked
              ? "You can`t send Messages.."
              : "Send a message"
          }
          className="search rounded-md flex-[1] bg-transparent placeholder:text-[#dcdfe2] p-2 outline-none text-lg text-[#dcdfe2] disabled:cursor-not-allowed"
          onChange={(e) => setText(e.target.value)}
          value={text}
          onKeyDown={handleKeyPress}
          disabled={isReceiverBlocked || isCurrentUserBlocked}
        />
        <div className="relative">
          <FaSmileBeam
            className={
              isReceiverBlocked || isCurrentUserBlocked
                ? "cursor-not-allowed"
                : ""
            }
            size={22}
            onClick={() => setEmoji((prev) => !prev)}
          />
          {emoji && !isReceiverBlocked && !isCurrentUserBlocked ? (
            <div className={`absolute bottom-7 left-0`}>
              <EmojiPicker open={open} onEmojiClick={handleEmoji} />
            </div>
          ) : null}
        </div>

        <button
          className="p-2 rounded-md bg-blue-700 hover:bg-blue-900 cursor-pointer disabled:cursor-not-allowed disabled:bg-sky-950"
          onClick={handleSend}
          disabled={isReceiverBlocked || isCurrentUserBlocked}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
