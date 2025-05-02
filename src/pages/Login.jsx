
import React, { useContext, useEffect, useState, useCallback } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) => password.length >= 6;
const validateName = (name) => name.trim().length >= 2;

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = useCallback(
    async (event) => {
      event.preventDefault();

      // Client-side validation
      if (!validateEmail(email)) {
        toast.error("Please enter a valid email address.");
        return;
      }
      if (!validatePassword(password)) {
        toast.error("Password must be at least 6 characters.");
        return;
      }
      if (state === "Sign Up" && !validateName(name)) {
        toast.error("Name must be at least 2 characters.");
        return;
      }

      setLoading(true);
      try {
        if (state === "Sign Up") {
          const { data } = await axios.post(`${backendUrl}/api/user/register`, {
            name: name.trim(),
            email: email.trim(),
            password,
          });

          if (data.success) {
            sessionStorage.setItem("token", data.token);
            setToken(data.token);
            toast.success("Account created successfully!");
            setPassword(""); // Clear sensitive data
            navigate("/");
          } else {
            toast.error(data.message || "Failed to create account");
          }
        } else {
          const { data } = await axios.post(`${backendUrl}/api/user/login`, {
            email: email.trim(),
            password,
          });

          if (data.success) {
            sessionStorage.setItem("token", data.token);
            setToken(data.token);
            toast.success("Logged in successfully!");
            setPassword(""); // Clear sensitive data
            navigate("/");
          } else {
            toast.error(data.message || "Login failed");
          }
        }
      } catch (error) {
        console.error(error);
        setPassword(""); // Clear sensitive data on error
        if (error.response) {
          // Server responded with a status code outside 2xx
          toast.error(error.response.data?.message || "A server error occurred. Please try again.");
        } else if (error.request) {
          // Request was made but no response received
          toast.error("No response from server. Please check your connection or try again later.");
        } else {
          // Something else happened
          toast.error("An unexpected error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
    [state, name, email, password, backendUrl, setToken, navigate]
  );

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-[80vh] flex justify-center items-center px-4"
      aria-label={state === "Sign Up" ? "Sign Up Form" : "Login Form"}
    >
      <div className="flex flex-col gap-3 m-auto items-start p-8 w-full sm:w-96 bg-white rounded-md shadow-lg text-zinc-600 text-sm">
        <p className="text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p>
          Please {state === "Sign Up" ? "sign up" : "log in"} to book an
          appointment.
        </p>

        {state === "Sign Up" && (
          <div className="w-full">
            <label htmlFor="name-input">Full Name</label>
            <input
              id="name-input"
              className="w-full p-2 border border-gray-400 rounded-md"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              autoComplete="name"
            />
          </div>
        )}

        <div className="w-full">
          <label htmlFor="email-input">Email</label>
          <input
            id="email-input"
            className="w-full p-2 border border-gray-400 rounded-md"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="w-full">
          <label htmlFor="password-input">Password</label>
          <input
            id="password-input"
            className="w-full p-2 border border-gray-400 rounded-md"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete={state === "Sign Up" ? "new-password" : "current-password"}
          />
        </div>

        <button
          type="submit"
          className="bg-sky-500 text-white w-full py-2 rounded-md text-base hover:bg-sky-600 transition"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Processing..." : (state === "Sign Up" ? "Create Account" : "Login")}
        </button>

        {state === "Sign Up" ? (
          <p className="text-sm">
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-sky-500 underline cursor-pointer"
              tabIndex={0}
              role="button"
              aria-pressed={state === "Login"}
            >
              Login
            </span>{" "}
            here
          </p>
        ) : (
          <p className="text-sm">
            Don't have an account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-sky-500 underline cursor-pointer"
              tabIndex={0}
              role="button"
              aria-pressed={state === "Sign Up"}
            >
              Sign up
            </span>{" "}
            here
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
