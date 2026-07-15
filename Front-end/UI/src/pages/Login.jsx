import { useState } from "react";
import Logo from "/Logo.png";
import BG from "/portada.png";
import { AnimatePresence } from "motion/react";
import Modal from "../components/Modal";
import Register from "../components/Register";
import { useForm } from "react-hook-form";
import { DoLogin } from "../components/API";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

//Hola, Luis :v

const Login = () => {
  const [registro, setRegistro] = useState(false);
  const { register, handleSubmit } = useForm();
  const navi = useNavigate();

  const handler = handleSubmit((e) => {
    async function Send() {
      try {
        const { data } = await DoLogin(e);
        console.log(data);
        localStorage.setItem("token-access", data.access);
        localStorage.setItem("username", data.username);
        localStorage.setItem("image", data.image);
        navi("/Home");
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
        className={`h-screen flex antialiased text-amber-100/90 bg-stone-950 gap-2 transition-all duration-300 ${
          registro ? "blur-xl pointer-events-none" : ""
        }`}
      >
        <div
          id="Image"
          className="w-1/2 hidden lg:flex h-full flex-col justify-center items-center p-20 bg-linear-to-br from-amber-950 to-stone-950 relative border-r-2 border-amber-900/30"
        >
          <div
            className="absolute inset-0 bg-no-repeat bg-cover opacity-80"
            style={{
              backgroundImage: `url(${BG})`,
              backgroundSize: "100%",
              backgroundPosition: "center",
            }}
          ></div>
        </div>

        <div
          id="Login-container"
          className="w-full lg:w-1/2 flex justify-center items-center h-full p-10 bg-linear-to-b from-stone-950 via-amber-950/20 to-stone-950"
        >
          <div
            id="Login-block"
            className="bg-stone-900/60 backdrop-blur-3xl border-2 border-amber-900/50 rounded-[30px] shadow-2xl shadow-black/80 flex flex-col items-center gap-10 p-16 w-full max-w-lg"
          >
            <div className="w-48 h-48 flex items-center justify-center p-4">
              <img
                src={Logo}
                alt="Logo"
                className="w-full h-auto object-contain bg-amber-950/40 p-1 rounded-2xl border border-amber-600/30 shadow-lg shadow-amber-600/20"
              />
            </div>

            <form className="w-full flex flex-col gap-6" onSubmit={handler}>
              <h1 className="text-4xl font-black tracking-wider text-transparent bg-clip-text bg-linear-to-r from-amber-100 via-amber-300 to-amber-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-center mb-4">
                Login
              </h1>

              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  required
                  placeholder="Username or Email"
                  className="w-full h-14 px-6 bg-stone-950/40 border-2 border-amber-900/40 rounded-full text-lg text-amber-100 placeholder:text-amber-100/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition"
                  {...register("username")}
                />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  className="w-full h-14 px-6 bg-stone-950/40 border-2 border-amber-900/40 rounded-full text-lg text-amber-100 placeholder:text-amber-100/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition"
                  {...register("password")}
                />
              </div>

              <button className="w-full h-14 mt-6 bg-amber-300 lg:bg-amber-300/90 text-amber-950 text-xl font-bold rounded-full hover:bg-amber-400 hover:shadow-lg hover:scale-[1.01] transition-all shadow-amber-400/20 active:scale-95 cursor-pointer">
                Log In
              </button>

              <div className="flex justify-center items-center mt-2 text-amber-100/60 text-sm">
                <span>
                  Don't have an account?{" "}
                  <a
                    href="#"
                    className="font-bold text-amber-300 hover:text-amber-200 transition underline decoration-1 underline-offset-4"
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
