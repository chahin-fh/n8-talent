import { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

const signin_endpoint = "http://localhost:5000/signin";

const SignInPage = () => {
    const [email, set_email] = useState("");
    const [password, set_password] = useState("");
    const [message, set_message] = useState("");
    const auth = useContext(AuthContext);

    const handle_signin = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const res = await fetch(signin_endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ electronic_mail: email, password }),
                credentials: "include",
            });
            const data = await res.json();
            set_message(data.msg || data.error_message);

            if (res.ok && auth) {
                auth.set_active(true);
            }
        } catch {
            set_message("Signin failed");
            if (auth) auth.set_active(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-6">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
                    Sign In
                </h2>

                <form onSubmit={handle_signin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="john.smith@domain.com"
                        value={email}
                        onChange={(event) => set_email(event.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 dark:text-gray-100 dark:bg-gray-700"
                    />

                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(event) => set_password(event.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 dark:text-gray-100 dark:bg-gray-700"
                    />

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        Sign In
                    </button>
                </form>

                {message && (
                    <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default SignInPage;
