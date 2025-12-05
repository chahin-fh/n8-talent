import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../auth/AuthContext";

export default function ProfileCard() {
  const auth = useContext(AuthContext);
  const [info, setInfo] = useState({ compt: "", lang: "" });

  const [newCompt, setNewCompt] = useState("");
  const [newLang, setNewLang] = useState("");

  const fetchInfo = async () => {
    try {
      const res = await fetch("http://localhost:5000/get_info", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const data = await res.json();
      setInfo(data);
    } catch (err) {
      console.error("Failed to fetch info", err);
    }
  };

  useEffect(() => {
    if (auth?.active) fetchInfo();
  }, [auth]);

  const handleAddCompt = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!newCompt.trim()) return;

    try {
      await fetch("http://localhost:5000/add_compt", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ compt: newCompt }),
      });

      setNewCompt("");
      fetchInfo();
    } catch (err) {
      console.error("Failed to add competence", err);
    }
  };

  const handleAddLang = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!newLang.trim()) return;

    try {
      await fetch("http://localhost:5000/add_lang", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang: newLang }),
      });

      setNewLang("");
      fetchInfo();
    } catch (err) {
      console.error("Failed to add language", err);
    }
  };

  const comptList = info.compt ? info.compt.split(";") : [];
  const langList = info.lang ? info.lang.split(";") : [];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full rounded-2xl shadow-xl bg-white dark:bg-gray-800 p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Adam
          </h2>
        </div>

        <div className="space-y-10 text-center">
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-3 font-semibold text-lg">
              Skills
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {comptList.map((c, idx) => (
                <span
                  key={idx}
                  className="px-4 py-1.5 bg-indigo-50 text-indigo-700 dark:bg-indigo-700 dark:text-indigo-100 rounded-full text-sm font-medium shadow-sm hover:scale-105 transition-transform"
                >
                  {c.trim()}
                </span>
              ))}
            </div>

            <form onSubmit={handleAddCompt} className="flex gap-2 justify-center">
              <input
                type="text"
                placeholder="Add a skill"
                value={newCompt}
                onChange={(e) => setNewCompt(e.target.value)}
                className="px-3 py-1.5 rounded-lg border dark:bg-gray-700 dark:text-gray-200"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
              >
                Add
              </button>
            </form>
          </div>

          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-3 font-semibold text-lg">
              Languages
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {langList.map((l, idx) => (
                <span
                  key={idx}
                  className="px-4 py-1.5 bg-green-50 text-green-700 dark:bg-green-700 dark:text-green-100 rounded-full text-sm font-medium shadow-sm hover:scale-105 transition-transform"
                >
                  {l.trim()}
                </span>
              ))}
            </div>

            {/* Add Language Form */}
            <form onSubmit={handleAddLang} className="flex gap-2 justify-center">
              <input
                type="text"
                placeholder="Add a language"
                value={newLang}
                onChange={(e) => setNewLang(e.target.value)}
                className="px-3 py-1.5 rounded-lg border dark:bg-gray-700 dark:text-gray-200"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
