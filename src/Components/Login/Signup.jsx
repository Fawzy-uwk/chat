import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { auth, db } from "../Lib/Firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { Oval } from "react-loader-spinner";
import upload from "../Lib/Upload";

/*eslint-disable react/prop-types */
function Signup({
  togglePasswordVisibilityUp,
  handleUpPasswordChange,
  upPassword,
  showPasswordup,
  setUpPassword,
}) {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    // VALIDATE INPUTS
    if (!username || !email || !password)
      return toast.warn("Please enter inputs!");
    if (!avatar.file) return toast.warn("Please upload an avatar!");

    // // VALIDATE UNIQUE USERNAME
    // const usersRef = collection(db, "users");
    // // const q = query(usersRef, where("username", "==", username));
    // // const querySnapshot = await getDocs(q);
    // // if (!querySnapshot.empty) {
    // //   return toast.warn("Select another username");
    // // }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const imgUrl = await upload(avatar.file);

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        uid: res.user.uid,
        avatar: imgUrl,
        blocked: [],
      });

      await setDoc(doc(db, "userChats", res.user.uid), {
        chats: [],
      });

      e.target.reset();
      setAvatar({
        file: null,
        url: "",
      });
      setUpPassword("");

      toast.success("Account created successfuly 😄  ");
    } catch (err) {
      console.error(err);
      setAvatar({
        file: null,
        url: "",
      });
      setUpPassword("");

      if (err.code === "auth/email-already-in-use") {
        toast.error("Email already exists");
        setAvatar({
          file: null,
          url: "",
        });
        setUpPassword("");
      }
    }
    setIsLoading(false);
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
    <div className="flex items-center justify-center h-full gap-5 flex-col w-full">
      <h1 className="text-2xl text-center font-semibold">
        Welcome, Create your Account
      </h1>
      <form
        onSubmit={handleRegister}
        className="flex items-center gap-5 flex-col w-full px-20"
      >
        <div className="flex items-center gap-4  flex-row">
          <label
            htmlFor="file"
            className="flex items-center gap-4 cursor-pointer underline"
          >
            <img
              src={
                avatar.url ||
                "https://github.com/safak/react-firebase-chat/blob/completed/public/avatar.png?raw=true"
              }
              alt=""
              className=" h-20 rounded-md"
            />
            Upload an image
          </label>
          <input
            type="file"
            id="file"
            name="avatar"
            style={{ display: "none" }}
            onChange={handleAvatar}
            required
          />
        </div>

        <input
          className="search input w-full p-3 placeholder:text-[#dcdfe2] py-2 outline-none text-md text-[#dcdfe2] rounded-md"
          placeholder="Enter your name "
          type="text"
          name="username"
          required
        />
        <input
          className="search w-full p-3 placeholder:text-[#dcdfe2] py-2 outline-none text-md text-[#dcdfe2] rounded-md"
          placeholder="Enter your email "
          name="email"
          type="email"
          required
        />

        <div className="search w-full p-3 rounded-md flex items-center">
          <input
            className=" placeholder:text-[#dcdfe2]  outline-none text-md text-[#dcdfe2] bg-transparent w-full"
            placeholder="Enter your password "
            name="password"
            type={showPasswordup ? "text" : "password"}
            value={upPassword}
            onChange={handleUpPasswordChange}
            required
          />
          {!showPasswordup ? (
            <FaEye
              size={22}
              className="cursor-pointer"
              onClick={togglePasswordVisibilityUp}
            />
          ) : (
            <FaEyeSlash
              size={22}
              className="cursor-pointer"
              onClick={togglePasswordVisibilityUp}
            />
          )}
        </div>
        <button className="rounded-md bg-blue-700 hover:bg-blue-900 cursor-pointer w-[50%] p-3">
          Signup
        </button>
      </form>
    </div>
  );
}

export default Signup;
