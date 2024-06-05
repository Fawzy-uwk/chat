import { signInWithEmailAndPassword } from "firebase/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { auth } from "../Lib/Firebase";
import { useState } from "react";
import { Oval } from "react-loader-spinner";

/*eslint-disable react/prop-types */
function Login({
  togglePasswordVisibilityIn,
  handleInPasswordChange,
  inPassword,
  showPasswordIn,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      await signInWithEmailAndPassword(auth, email, password);

      toast.success(`Welcome back 😃`);
      setIsLoading(false);
    } catch (err) {
      console.log(err.message);
      toast.error("Wrong email or password!");
      setIsLoading(false);
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
    <div className="flex items-center justify-center h-full gap-5 flex-col w-full">
      <h1 className="text-2xl text-center font-semibold">
        Welcome Back, Login
      </h1>
      <form
        className="flex items-center gap-8 flex-col w-full px-20"
        onSubmit={handleLogin}
      >
        <input
          className="search w-full  p-3 placeholder:text-[#dcdfe2] py-2 outline-none text-md text-[#dcdfe2] rounded-md"
          placeholder="Enter your email "
          name="email"
          type="text"
          required
        />

        <div className="search w-full p-3 rounded-md flex items-center">
          <input
            className=" placeholder:text-[#dcdfe2]  outline-none text-md text-[#dcdfe2] bg-transparent w-full"
            placeholder="Enter your password "
            name="password"
            type={showPasswordIn ? "text" : "password"}
            value={inPassword}
            onChange={handleInPasswordChange}
            required
          />
          {!showPasswordIn ? (
            <FaEye
              size={22}
              className="cursor-pointer"
              onClick={togglePasswordVisibilityIn}
            />
          ) : (
            <FaEyeSlash
              size={22}
              className="cursor-pointer"
              onClick={togglePasswordVisibilityIn}
            />
          )}
        </div>

        <button
          type="submit"
          className="rounded-md bg-blue-700 hover:bg-blue-900 cursor-pointer w-[50%] p-3"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
