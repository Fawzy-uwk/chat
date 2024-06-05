import { useState } from "react";
import { FaMinus, FaPlus, FaSearch } from "react-icons/fa";
import AddUser from "./AddUser/AddUser";

/*eslint-disable react/prop-types */
function SearchBar({ input, setInput }) {
  const [addUser, setAddUser] = useState(false);

  const handleAddUser = () => {
    setAddUser((prev) => !prev);
  };
  return (
    <>
      <div className="flex items-center gap-2  px-3">
        <div className="search flex rounded-md items-center gap-2 w-full lg:w-[18rem] bg-black p-2">
          <FaSearch color="#dcdfe2" size={20} />
          <input
            name="search"
            placeholder="Search for Conversation"
            className="h-full bg-transparent placeholder:text-[#dcdfe2] py-2 outline-none text-lg text-[#dcdfe2] w-full"
            value={input}
            onChange={(e) => setInput( e.target.value)}
          />
        </div>
        <div
          className="search p-4 cursor-pointer rounded-md"
          onClick={handleAddUser}
        >
          {addUser ? <FaMinus size={22} /> : <FaPlus size={22} />}
        </div>
      </div>

      {addUser && <AddUser handleAddUser={handleAddUser} />}
    </>
  );
}

export default SearchBar;
