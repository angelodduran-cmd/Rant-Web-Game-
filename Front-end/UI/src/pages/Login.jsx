import { useState } from "react";
import Logo from "/Logo.png";
import BG from "/Login_Background.png";
import { motion, AnimatePresence } from "motion/react";
import Modal from "../components/Modal";
import Register from "../components/Register";
import { useForm } from "react-hook-form";
import { DoLogin } from "../components/API";
import { toast } from "react-hot-toast";

const Login = () => {
  const [registro, setRegistro] = useState(false);
  const { register, handleSubmit } = useForm();

  const handler = handleSubmit((e) => {
    async function Send() {
      try {
        const { data } = await DoLogin(e);
        localStorage.setItem("token-access", data.access);
      } catch (error) {
        throw error;
      }
    }
    toast.promise(Send(), {
      error: "Verifique las credenciales",
      loading: "Cargando. . .",
    });
  });

  return (
    <>
      <div
        className={`h-screen flex antialiased text-amber-950 bg-amber-950 gap-2 transition-all duration-300 ${
          registro ? "blur-xl pointer-events-none" : ""
        }`}
      >
        <div
          id="Image"
          className="w-1/2 hidden lg:flex h-full flex-col justify-center items-center p-20 bg-linear-to-br from-amber-800 to-amber-950 relative "
        >
          <div
            className="absolute inset-0 bg-no-repeat bg-cover"
            style={{
              backgroundImage: `url(${BG})`,
              backgroundSize: "100%",
              backgroundPosition: "center",
            }}
          ></div>
        </div>

        <div
          id="Login-container"
          className="w-full lg:w-1/2 flex justify-center items-center h-full p-10 bg-linear-to-b from-gray-400 via-white to-gray-400"
        >
          <div
            id="Login-block"
            className="bg-amber-900/90 backdrop-blur-3xl border-2 border-amber-900 rounded-[30px] shadow-inner shadow-amber-950 flex flex-col items-center gap-10 p-16 w-full max-w-lg"
          >
            <div className="w-48 h-48 flex items-center justify-center p-4">
              <img
                src={Logo}
                alt="Logo"
                className="w-full h-auto object-contain bg-amber-900 rounded-2xl shadow-lg shadow-amber-300"
              />
            </div>

            <form className="w-full flex flex-col gap-6" onSubmit={handler}>
              <h1 className="text-4xl font-extrabold text-amber-100 text-center mb-4">
                Login
              </h1>

              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  required
                  placeholder="Username or Email"
                  className="w-full h-14 px-6 bg-white/20 border-2 border-amber-900 rounded-full text-lg text-amber-100 placeholder:text-amber-100/50 focus:outline-none focus:ring-2 focus:ring-amber-300 transition"
                  {...register("username")}
                />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  className="w-full h-14 px-6 bg-white/20 border-2 border-amber-900 rounded-full text-lg text-amber-100 placeholder:text-amber-100/50 focus:outline-none focus:ring-2 focus:ring-amber-300 transition"
                  {...register("password")}
                />
              </div>

              <button className="w-full h-14 mt-6 bg-amber-300 lg:bg-amber-300/80 text-amber-950 text-xl font-bold rounded-full hover:bg-amber-300 hover:shadow-sm hover:scale-[1.01] transition-all shadow-amber-300 active:scale-95">
                Log In
              </button>

              <div className="flex justify-center items-center mt-2 text-amber-100/80">
                <span>
                  Don't have an account?{" "}
                  <a
                    href="#"
                    className="font-bold text-amber-100 hover:text-amber-300 transition"
                    onClick={(e) => {
                      e.preventDefault();
                      setRegistro(true);
                    }}
                  >
                    Sign Up
                  </a>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {registro && (
          <Modal isOpen={registro} onClose={() => setRegistro(false)}>
            <Register onClose={() => setRegistro(false)} />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default Login;
