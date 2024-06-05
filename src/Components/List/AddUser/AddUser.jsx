import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { db } from "../../Lib/Firebase";
import { useState } from "react";
import { Oval } from "react-loader-spinner";
import { useUserStore } from "../../Lib/UserStore";

/*eslint-disable react/prop-types */
function AddUser({ handleAddUser }) {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");

      // Create a query against the collection.
      const q = query(userRef, where("username", "==", username));

      const querySanpShot = await getDocs(q);

      if (!querySanpShot.empty) {
        setUser(querySanpShot.docs[0].data());
      }
    } catch (err) {
      console.log(err.message);
      toast.error("User doesn`t exist ⛔ ");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userChats");

    try {
      // Check if the user is already added
      const userChatsDoc = await getDoc(doc(userChatsRef, currentUser.uid));
      const userChatsData = userChatsDoc.data();
      const isUserAdded = userChatsData.chats.some(
        (chat) => chat.receiverId === user.uid
      );

      if (isUserAdded) {
        toast.error("User is already added");
        return;
      }

      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatsRef, user.uid), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.uid,
          updatedAt: Date.now(),
          images: [],
        }),
      });

      await updateDoc(doc(userChatsRef, currentUser.uid), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.uid,
          updatedAt: Date.now(),
          images: [],
        }),
      });
      {
        toast.success("User added successfuly 😍");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.log(err);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-[1]">
      <div className="relative flex flex-col gap-12 shadow-sm shadow-slate-400 rounded-md bg-[#0e0c30af] p-12 z-[30]">
        {isLoading ? (
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
        ) : (
          <>
            <h2 className="text-2xl font-semibold ">Add New User</h2>
            <form className="flex items-center gap-4 " onSubmit={handleSearch}>
              <input
                className="bg-gray-100 p-3 rounded-md outline-none text-gray-500 font-semibold "
                type="text"
                name="username"
                placeholder="Enter username"
              />
              <button className="bg-blue-700 hover:bg-blue-900 text-white p-3 rounded-md">
                Search
              </button>
            </form>
          </>
        )}

        {user && (
          <div className="flex items-center justify-between gap-3 w-full ">
            <div className="flex items-center gap-3">
              <img
                src={
                  user.avatar ||
                  "https://t3.ftcdn.net/jpg/05/53/79/60/360_F_553796090_XHrE6R9jwmBJUMo9HKl41hyHJ5gqt9oz.jpg"
                }
                alt=""
                className="h-10 w-10 rounded-full object-cover"
              />

              <span className="text-sm font-light text-gray-200">
                {user.username}
              </span>
            </div>
            <button
              className="bg-blue-700 hover:bg-blue-900 text-white p-1.5 rounded-lg"
              onClick={handleAdd}
            >
              Add friend
            </button>
          </div>
        )}
        <FaTimes
          size={28}
          className="absolute top-2 right-2 cursor-pointer"
          onClick={handleAddUser}
        />
      </div>
    </div>
  );
}

export default AddUser;
