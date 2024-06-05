import { FaDownload, FaTimes } from "react-icons/fa";
import { useChatStore } from "../Lib/ChatStore";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Lib/Firebase";
import { useEffect, useState } from "react";

const ChatImages = () => {
  const { chatId } = useChatStore();
  const [fullImage, setFullImage] = useState(false);
  const [img, setImg] = useState({});

  const [images, setImages] = useState([]);

  useEffect(() => {
    const handleGetChatImages = async () => {
      const chatRef = doc(db, "chats", chatId);
      const chatSnapshot = await getDoc(chatRef);

      if (chatSnapshot.exists()) {
        const images = chatSnapshot.data().images;
        setImages(images);
      } else {
        console.log("Chat document not found");
        setImages([]);
      }
    };

    handleGetChatImages();
  }, [chatId]);

  const handleImageClick = (imageUrl) => {
    setImg({ url: imageUrl });
    setFullImage(true);
  };

  return (
    <div className="flex flex-col gap-3 items-center">
      {images?.map((imageUrl, index) => (
        <div key={index} className="flex items-center justify-between w-full">
          <img
            src={imageUrl}
            className="w-24 h-22 rounded-md object-cover"
            onClick={() => handleImageClick(imageUrl)}
          />
          <a
            href={imageUrl}
            download
            className="search p-2 rounded-full cursor-pointer"
          >
            <FaDownload size={14} />
          </a>
        </div>
      ))}

      {fullImage && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
          <img
            src={img.url}
            alt=""
            className="max-w-full max-h-full object-cover cursor-pointer rounded-md"
            onClick={() => setFullImage(false)}
          />

          <FaTimes
            size={28}
            className="absolute top-0 right-0 cursor-pointer"
            onClick={() => setFullImage(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ChatImages;
