import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useUserStore } from "../Lib/UserStore";
import { useChatStore } from "../Lib/ChatStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../Lib/Firebase";
import { toast } from "react-toastify";
import ChatImages from "./ChatImgs";
import { useState } from "react";

/*eslint-disable react/prop-types */
function Details() {
  const { user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
    useChatStore();
  const { currentUser } = useUserStore();

  const [up, setUp] = useState(false);

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.uid);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked
          ? arrayRemove(user.uid)
          : arrayUnion(user.uid),
      });
      changeBlock();
      toast.success(
        `${
          isReceiverBlocked || isCurrentUserBlocked
            ? "User unblocked 😊 "
            : "User bloked 😢 "
        }`
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className=" flex-[1] flex flex-col divide-y-[.5px] divide-sky-900">
        <div className="flex items-center flex-col justify-center gap-3 p-4 ">
          <img
            src={
              user?.avatar ||
              "https://t3.ftcdn.net/jpg/05/53/79/60/360_F_553796090_XHrE6R9jwmBJUMo9HKl41hyHJ5gqt9oz.jpg "
            }
            className="w-20 h-20 rounded-full object-cover"
          />
          <h2 className="text-xl font-semibold">{user?.username} </h2>
        </div>

        <div className="details p-4 py-8 flex flex-col gap-8 flex-[1] justify-between overflow-scroll">
          <div className="flex items-center justify-between ">
            <span className="text-md ">Chat Settings</span>
            <div className="search p-1 flex items-center justify-center rounded-full cursor-pointer">
              <FaAngleDown size={20} className="" />
            </div>
          </div>

          <div className="flex items-center justify-between ">
            <span className="text-md ">Privacy & help</span>
            <div className="search p-1 flex items-center justify-center rounded-full cursor-pointer">
              <FaAngleDown size={20} className="" />
            </div>
          </div>

          <div className="flex flex-col gap-4 ">
            <div className="flex items-center  justify-between ">
              <span className="text-md ">Shred Images</span>
              <div
                className="search p-1 flex items-center justify-center rounded-full cursor-pointer"
                onClick={() => setUp((prev) => !prev)}
              >
                {!up ? (
                  <FaAngleDown size={20} className="" />
                ) : (
                  <FaAngleUp size={20} className="" />
                )}
              </div>
            </div>

            {up && <ChatImages />}
          </div>

          <div className="flex items-center justify-between ">
            <span className="text-md ">Shred Files</span>
            <div className="search p-1 flex items-center justify-center rounded-full cursor-pointer ">
              <FaAngleDown size={20} className="" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full mt-auto p-4">
          <button
            onClick={handleBlock}
            className="p-3 font-semibold rounded-md bg-[#ff3c3c9e] hover:bg-[#912727]"
          >
            {isCurrentUserBlocked
              ? "You are Blocked!"
              : isReceiverBlocked
              ? "User blocked"
              : "Block User"}
          </button>
        </div>
      </div>
    </>
  );
}

export default Details;
