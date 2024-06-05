import { useEffect } from "react";
import Chat from "./Components/Chats/Chat";
import Details from "./Components/Detail/Details";
import Lists from "./Components/List/Lists";
import Form from "./Components/Login/Form";
import Notification from "./Components/Notifications/Notification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Components/Lib/Firebase";
import { useUserStore } from "./Components/Lib/UserStore";
import { Oval } from "react-loader-spinner";
import { useChatStore } from "./Components/Lib/ChatStore";

/*eslint-disable react/prop-types */
function App() {
  const { isLoading, fetchUserInfo, currentUser } = useUserStore();
  const { chatId } = useChatStore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => unsub();
  }, [fetchUserInfo]);

  if (isLoading)
    return (
      <div className="container h-[91vh] w-[85vw] p-10 rounded-md flex items-center justify-center">
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
    <>
      <div className="container relative flex overflow-hidden h-[91vh] w-[85vw] text-white  divide-x-[.3px] overflow-x-scroll lg:overflow-hidden divide-sky-800">
        {currentUser ? (
          <>
            <Lists />
            {chatId && <Chat />}
            {chatId && <Details />}
          </>
        ) : (
          <Form />
        )}
      </div>
      <Notification />
    </>
  );
}

export default App;
