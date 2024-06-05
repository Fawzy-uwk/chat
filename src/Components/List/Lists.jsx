import { useState } from "react";
import { auth } from "../Lib/Firebase";
import ChatList from "./ChatList";
import SearchBar from "./SearchBar";
import UserInfo from "./UserInfo";

function Lists() {
  const [input, setInput] = useState("");
  const [chats, setChats] = useState([]);
  

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );
  return (
    <div className="flex-[1] max-w-[22rem] flex flex-col border-r border-sky-900 gap-10 ">
      <UserInfo />
      <SearchBar input={input} setInput={setInput} />
      <ChatList
        chats={chats}
        setChats={setChats}
        filteredChats={filteredChats}
      />
      
      <button
        className="p-3 font-semibold w-80 m-auto rounded-md bg-blue-700 hover:bg-blue-900"
        onClick={() => auth.signOut()}
      >
        Logout
      </button>
    </div>
  );
}

export default Lists;
