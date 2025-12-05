import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import { useContext } from "react";
import { AuthContext } from "./auth/AuthContext";
import { UserPlusIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ProfileCard from "./pages/items/ProfileCard";
import ProjectsPage from "./pages/items/ProjectsPage";


const App = () => {
    const auth = useContext(AuthContext);
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <nav className="flex items-center justify-between 
                bg-white/80 dark:bg-gray-900/80 
                backdrop-blur-md shadow-lg 
                px-10 py-6 mb-6 border border-gray-200 dark:border-gray-700 border-r-0 border-l-0">

                <div className="flex items-center space-x-8">

                    {["Home", "About", "Contact", "Profile", "Projects"].map((item, idx) => (
                        ((item === "Profile" || item === "Projects") && !auth?.active) ? null : (
                            <Link
                                key={idx}
                                to={`/${item.toLowerCase()}`}
                                className="relative flex items-center text-lg font-medium 
                 text-gray-700 dark:text-gray-200 
                 hover:text-indigo-500 dark:hover:text-indigo-400 
                 transition-colors duration-300 group"
                            >
                                {item}
                                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-500 
                       transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        )
                    ))}
                </div>

                <div className="flex items-center space-x-6">
                    {!auth?.active && (
                        <>
                            <Link
                                to="/signup"
                                className="flex items-center space-x-2 text-lg font-semibold 
                     text-gray-700 dark:text-gray-200 
                     hover:text-green-500 dark:hover:text-green-400 
                     transition-colors duration-300"
                            >
                                <UserPlusIcon className="w-5 h-5" />
                                <span>Sign Up</span>
                            </Link>
                            <Link
                                to="/signin"
                                className="flex items-center space-x-2 text-lg font-semibold 
                     text-gray-700 dark:text-gray-200 
                     hover:text-blue-500 dark:hover:text-blue-400 
                     transition-colors duration-300"
                            >
                                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                <span>Sign In</span>
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            <main className="px-8">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/profile" element={<ProtectedRoute require_auth={true}><ProfileCard /></ProtectedRoute>} />
                    <Route path="/projects" element={<ProtectedRoute require_auth={true}><ProjectsPage /></ProtectedRoute>} />

                    <Route
                        path="/signup"
                        element={
                            <ProtectedRoute require_auth={false}>
                                <SignUpPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/signin"
                        element={
                            <ProtectedRoute require_auth={false}>
                                <SignInPage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </main>
            <footer className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 mt-12">
                <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col items-center text-center space-y-4">

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        © {new Date().getFullYear()} n8-talent. All rights reserved.
                    </p>
                    <div className="flex space-x-6">
                        <a
                            href="#"
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            Link I
                        </a>
                        <a
                            href="#"
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            Link II
                        </a>
                        <a
                            href="#"
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            Link III
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );

};

export default App;
