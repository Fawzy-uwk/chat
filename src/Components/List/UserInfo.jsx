import { FaEdit, FaEllipsisH, FaVideo } from "react-icons/fa";
import { useUserStore } from "../Lib/UserStore";
function UserInfo() {
  const { currentUser } = useUserStore();
  return (
    <div className="flex items-center justify-between gap-2 flex-wrap p-3">
      <div className="flex items-center gap-4">
        <img
          src={
            currentUser.avatar ||
            "https://t3.ftcdn.net/jpg/05/53/79/60/360_F_553796090_XHrE6R9jwmBJUMo9HKl41hyHJ5gqt9oz.jpg "
          }
          alt="user"
          className="w-16 h-16 object-cover rounded-full"
        />
        <h2 className="tetx-2xl font-semibold">{currentUser.username}</h2>
      </div>
      <div className="flex items-center gap-3">
        <FaEllipsisH size={22} className="cursor-pointer" />
        <FaVideo size={22} className="cursor-pointer" />
        <FaEdit size={22} className="cursor-pointer" />
      </div>
    </div>
  );
}

export default UserInfo;
