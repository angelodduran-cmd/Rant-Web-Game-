import React, { useState } from "react";

const Register = ({ onClose }) => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <h1 className="text-4xl font-extrabold text-amber-100 text-center mb-2">
        Sign Up
      </h1>

      <form
        className="w-full flex flex-col gap-5"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full h-14 px-6 bg-white/20 border-2 border-amber-900 rounded-full text-lg text-amber-100 placeholder:text-amber-100/50 focus:outline-none focus:ring-2 focus:ring-amber-300 transition"
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full h-14 px-6 bg-white/20 border-2 border-amber-900 rounded-full text-lg text-amber-100 placeholder:text-amber-100/50 focus:outline-none focus:ring-2 focus:ring-amber-300 transition"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full h-14 px-6 bg-white/20 border-2 border-amber-900 rounded-full text-lg text-amber-100 placeholder:text-amber-100/50 focus:outline-none focus:ring-2 focus:ring-amber-300 transition"
          />

          <div
            className={`relative w-full h-14 border-2 border-dashed rounded-full flex items-center justify-center transition cursor-pointer ${
              fileName
                ? "bg-amber-300/20 border-amber-300 text-amber-300"
                : "bg-white/20 border-amber-900 text-amber-100/60 hover:bg-white/30"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
            <span className="text-base font-medium px-6 truncate">
              {fileName ? fileName : "Choose Profile Picture 📷"}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-14 mt-4 bg-amber-300 text-amber-950 text-xl font-bold rounded-full hover:bg-amber-300 hover:shadow-sm hover:scale-[1.01] transition-all shadow-amber-300 active:scale-95"
        >
          Create Account
        </button>

        <div className="text-center text-amber-100/80 text-sm mt-2">
          <span>
            Already have an account?{" "}
            <a
              href="#"
              className="font-bold hover:text-amber-100 underline decoration-2 underline-offset-4"
              onClick={(e) => {
                e.preventDefault();
                if (onClose) onClose();
              }}
            >
              Log In
            </a>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Register;
