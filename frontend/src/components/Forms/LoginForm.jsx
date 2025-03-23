import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../utils/APIs";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
});

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const submitHandler = async ({ email, password }) => {
    setErrorMessage("");
    const { data, error } = await loginUser(email, password);
    if (error) {
      setErrorMessage(error);
      return;
    }
    localStorage.setItem("authToken", data.token);
    navigate("/file-upload");
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="w-6/12 text-start bg-background mx-auto my-10 p-10 rounded-2xl space-y-4"
    >
      <div>
        <input {...register("email")} type="email" placeholder="Email" className="w-full p-2 border rounded" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email?.message}</p>}
      </div>
      <div>
        <input {...register("password")} type="password" placeholder="Password" className="w-full p-2 border rounded" />
        {errors.password && <p className="text-red-500 text-sm">{errors.password?.message}</p>}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
    </form>
  );
};

export default LoginForm;
