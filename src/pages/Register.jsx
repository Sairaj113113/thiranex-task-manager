import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      alert("Registration Successful!");

      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-gradient-to-b from-[#CAF0F8] via-[#90E0EF] to-[#00B4D8]">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

        <h1 className="text-3xl font-bold text-center text-[#03045E]">
          Task Manager
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Create Your Account
        </p>

        <form onSubmit={registerUser} className="mt-8">

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 mb-4 rounded-xl border border-gray-300 focus:outline-none focus:border-[#0077B6]"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 rounded-xl border border-gray-300 focus:outline-none focus:border-[#0077B6]"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-6 rounded-xl border border-gray-300 focus:outline-none focus:border-[#0077B6]"
            required
          />

          <button
            type="submit"
            className="w-full bg-[#0077B6] hover:bg-[#03045E] text-white py-3 rounded-xl font-semibold transition"
          >
            Register
          </button>

        </form>

        <p className="text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-[#0077B6] font-semibold"
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}