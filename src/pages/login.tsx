import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useCookies } from "react-cookie";
import Image from "next/image";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [_, setCookies] = useCookies(["access_token"]); // first element is an object containing the cookie values, and the second element is a function to update the cookies. But here only needs the setCookies function to update the access_token

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault(); // prevent page refresh to interrupt the login process
    try {
      const res = await axios.post("/api/auth/auth?action=login", {
        username,
        password,
      });
      console.log(res.data, res.data.message);
      setCookies("access_token", res.data.token); // token stored in a cookie named 'access_token'
      window.localStorage.setItem("userID", res.data.userID); // userId stored in window.localstorage
      window.location.replace("/");
    } catch (err) {
      console.log(err);
      setError(true);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="relative ">
      <Image
        src="/bao6.jpeg"
        alt="login"
        fill
        quality={10}
        className="inset-0 -z-10 opacity-80 absolute object-cover"
      />
      <div className="bg-gray-100/70 min-h-screen flex flex-col justify-start py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center font-medium text-3xl mb-4 md:mt-20">
            <h1 className="text-gray-900">登入帳號</h1>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow-lg px-4 py-6">
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-gray-700 font-bold mb-2 "
                >
                  帳號名稱(全小寫)
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                  placeholder="Your username.."
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-bold mb-2"
                >
                  密碼
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                  placeholder="Your password.."
                />
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="mt-12 group relative w-full flex justify-center py-2 px-4 border border-transparent text-lg font-medium rounded-full hover:bg-teal-980 hover:text-gray-100 text-slate-600 bg-blue-980 focus:outline-none "
                >
                  點我登入
                </button>
              </div>

              {error && (
                <div className="mt-4 text-center">
                  <span className="text-red-500">
                    Something went wrong. Please try again.
                  </span>
                </div>
              )}
            </div>
          </form>
          <div className="mt-12 text-xl text-center">
            <span className="text-gray-500">如果你還沒有帳號 </span>
            <Link href="/register">
              <p className="text-blue-500 hover:text-blue-700 hover:text-2xl mt-4">
                點這裡註冊
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
