import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-hot-toast";
import { auth } from "../firebase";
import { useLoginMutation } from "../app/services/userAPI";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponse } from "../types/api-types";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const [login] = useLoginMutation();

  const loginHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      const res = await login({
        name: user.displayName!,
        email: user.email!,
        photo: user.photoURL!,
        gender,
        role: "user",
        dob: date,
        _id: user.uid,
      });

      if ("data" in res) {
        const successMessage = res.data?.message || "Login successful";
        toast.success(successMessage);
        navigate("/");
      } else {
        const error = res.error as FetchBaseQueryError;
        const message = error.data as MessageResponse | undefined;

        if (message) {
          toast.error(message.message);
        } else {
          toast.error("An unknown error occurred");
        }
      }

      console.log(user);
    } catch (error) {
      toast.error("Sign In Failed");
    }
  };

  return (
    <div className="login">
      <main>
        <h1 className="heading">Login</h1>

        <div>
          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label>Date of birth</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <p>Already Signed In Once</p>
          <button onClick={loginHandler}>
            <FcGoogle /> <span>Sign in with Google</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
