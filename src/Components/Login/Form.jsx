import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

function Form() {
  const [showPasswordIn, setShowPasswordIn] = useState(false);
  const [showPasswordUp, setShowPasswordUp] = useState(false);
  const [inPassword, setInPassword] = useState("");
  const [upPassword, setUpPassword] = useState("");

  const togglePasswordVisibilityIn = () => {
    setShowPasswordIn((prev) => !prev);
  };

  const togglePasswordVisibilityUp = () => {
    setShowPasswordUp((prev) => !prev);
  };

  const handleInPasswordChange = (event) => {
    setInPassword(event.target.value);
  };
  const handleUpPasswordChange = (event) => {
    setUpPassword(event.target.value);
  };

  return (
    <div className="flex items-center center p-6 divide-x divide-sky-900 w-full">
      <Login
        togglePasswordVisibilityIn={togglePasswordVisibilityIn}
        handleInPasswordChange={handleInPasswordChange}
        inpassword={inPassword}
        showPasswordIn={showPasswordIn}
      />
      <Signup
        togglePasswordVisibilityUp={togglePasswordVisibilityUp}
        handleUpPasswordChange={handleUpPasswordChange}
        upPassword={upPassword}
        setUpPassword={setUpPassword}
        showPasswordup={showPasswordUp}
      />
    </div>
  );
}

export default Form;
