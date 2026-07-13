import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { CreateUser } from "./API";
import { useForm } from "react-hook-form";

const Register = ({ onClose }) => {
  const [fileName, setFileName] = useState("");
  // Inicializamos react-hook-form de forma estándar
  const { register, handleSubmit } = useForm();

  // El manejador del formulario recibe el objeto "data" de react-hook-form cuando todo es válido
  const handler = handleSubmit((formDataFromHook) => {
    async function Send() {
      try {
        // 1. Instanciamos el objeto FormData requerido para manejar imágenes/archivos
        const dataToSend = new FormData();

        // 2. Insertamos los campos de texto planos al FormData
        dataToSend.append("username", formDataFromHook.username);
        dataToSend.append("email", formDataFromHook.email);
        dataToSend.append("password", formDataFromHook.password);

        // 3. Extraemos el archivo real del Input File.
        // react-hook-form guarda los archivos como un FileList (un array).
        // Accedemos a la posición [0] que contiene el archivo multimedia seleccionado.
        if (formDataFromHook.image && formDataFromHook.image.length > 0) {
          dataToSend.append("image", formDataFromHook.image[0]);
        }

        // 4. Enviamos el dataToSend (FormData) al Backend a través de tu Axios/Fetch
        // ¡Importante! En tu función CreateUser de tu archivo API, asegúrate de pasarle este formData completo.
        const { data } = await CreateUser(dataToSend);

        // Si el login o el flujo requiere que el modal se cierre al completarse con éxito:
        if (onClose) onClose();
      } catch (error) {
        console.error("error: ", error.response);
        throw error; // Lanzamos el error para que toast.promise lo detecte y muestre el mensaje de error
      }
    }

    // Ejecuta y gestiona de forma interactiva el estado visual de la petición
    toast.promise(Send(), {
      error: "No se pudo crear el usuario",
      loading: "Cargando. . .",
      success: "Usuario creado!",
    });
  });

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <h1 className="text-4xl font-extrabold text-amber-100 text-center mb-2">
        Sign Up
      </h1>

      <form className="w-full flex flex-col gap-5" onSubmit={handler}>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            required
            className="w-full h-14 px-6 bg-white/20 border-2 border-amber-900 rounded-full text-lg text-amber-100 placeholder:text-amber-100/50 focus:outline-none focus:ring-2 focus:ring-amber-300 transition"
            {...register("username")}
          />

          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full h-14 px-6 bg-white/20 border-2 border-amber-900 rounded-full text-lg text-amber-100 placeholder:text-amber-100/50 focus:outline-none focus:ring-2 focus:ring-amber-300 transition"
            {...register("email")}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="w-full h-14 px-6 bg-white/20 border-2 border-amber-900 rounded-full text-lg text-amber-100 placeholder:text-amber-100/50 focus:outline-none focus:ring-2 focus:ring-amber-300 transition"
            {...register("password")}
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
              required
              // Registramos el input en el hook de formularios.
              // Pasamos el evento onChange dentro de las opciones del register para que react-hook-form
              // no sobrescriba ni inhabilite el renderizado dinámico de tu estado local "fileName".
              {...register("image", {
                onChange: (e) => {
                  if (e.target.files.length > 0) {
                    setFileName(e.target.files[0].name);
                  }
                },
              })}
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
