import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const decode_endpoint = "http://localhost:5000/decode";
const signout_endpoint = "http://localhost:5000/signout";

type UserInformation = {
  email?: string;
  username?: string;
};

const HomePage = () => {
  const auth = useContext(AuthContext);
  const [user_information, set_user_information] = useState<UserInformation>({});

  useEffect(() => {
    const fetch_user_information = async () => {
      try {
        const res = await fetch(decode_endpoint, {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data: UserInformation = await res.json();
          set_user_information(data);
        }
      } catch {
        console.error("Failed to fetch user information");
      }
    };

    if (auth?.active) {
      fetch_user_information();
    }
  }, [auth?.active]);

  if (!auth) return null;

  const handle_signout = async () => {
    await fetch(signout_endpoint, {
      method: "POST",
      credentials: "include",
    });
    auth.set_active(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-start px-6 py-10 space-y-16">
      

      <div className="relative flex items-center gap-8 p-8 md:p-12 border rounded-3xl shadow-[0_0_60px_rgba(188,19,254,0.3)] bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden animate-fade-in w-full max-w-4xl">
        <div className="absolute w-full h-[1px] bg-cyan-400 opacity-50 animate-[scan_3s_linear_infinite]"></div>

        <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0 animate-bounce-slow">
          <div className="absolute w-full h-full border-4 border-purple-600 rounded-xl shadow-purple shadow-[0_0_20px_rgba(188,19,254,0.5)] animate-[pulse-border_2s_infinite_alternate]"></div>
          <div className="absolute w-[85%] h-[85%] border-2 border-cyan-400 rounded-lg animate-spin-slow"></div>
          <div className="text-cyan-400 text-5xl font-extrabold z-10 drop-shadow-lg">&gt;_</div>
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="font-orbitron text-5xl md:text-7xl font-extrabold uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-400 drop-shadow-[0_0_15px_rgba(0,243,255,0.8)] animate-text-glow">
            PS CODERS
          </h1>
          <div className="font-jetbrains-mono text-sm md:text-base text-purple-500 font-bold mt-2 flex flex-wrap gap-2 animate-text-flicker">
            Nuit d'info <span className="mx-1 text-cyan-400">|</span>
            Nird challenge <span className="mx-1 text-cyan-400">|</span>
            Chamilo <span className="mx-1 text-cyan-400">|</span>
            Horizon School
          </div>
        </div>
      </div>

      <section className="flex flex-col items-center text-center max-w-3xl w-full space-y-8">
        <h2 className="text-4xl font-extrabold text-white mb-6">Welcome to n8-talent</h2>
        <p className="text-lg text-gray-300 mb-4">A beautiful description here</p>

        {auth.loading ? (
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg text-gray-400">Loading...</p>
          </div>
        ) : auth.active ? (
          <div className="bg-gray-800 shadow-xl rounded-2xl p-8 w-full text-center">
            <h2 className="text-2xl font-bold text-green-400 mb-4">Welcome back</h2>
            {user_information.username && (
              <div className="bg-gray-700 rounded-lg py-4 px-6 mb-6">
                <p className="text-white text-lg">{user_information.username}</p>
              </div>
            )}
            <button
              onClick={handle_signout}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link
            to="/signin"
            className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
            <span>Sign In</span>
          </Link>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {["Description I", "Description II", "Description III"].map((title, idx) => (
          <div key={idx} className="bg-gray-800 shadow-md rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-400">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, cumque!
            </p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {[1, 2, 3].map((idx) => (
          <div key={idx} className="bg-gray-800 shadow-md rounded-lg p-6">
            <p className="text-gray-400 mb-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, velit!
            </p>
            <p className="text-sm font-semibold text-white">— Someone {idx}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default HomePage;
