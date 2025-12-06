export default function Contact() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center px-6 py-12">
            <div className="w-full max-w-3xl bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-10">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
                    Contact Us
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 text-center">
                    Have questions or feedback? We’d love to hear from you.
                </p>

                <form className="space-y-6">
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Name</label>
                        <input
                            type="text"
                            className="w-full focus:outline-none px-4 py-2 rounded-lg dark:bg-gray-700 dark:text-gray-200 border-0"
                            placeholder="Your name"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full focus:outline-none px-4 py-2 rounded-lg dark:bg-gray-700 dark:text-gray-200 border-0"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Message</label>
                        <textarea
                            rows={5}
                            className="w-full focus:outline-none px-4 py-2 rounded-lg dark:bg-gray-700 dark:text-gray-200 border-0"
                            placeholder="Write your message..."
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105"
                    >
                        Send Message
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        Or reach us directly at <span className="font-medium">support@flaceholder.com</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
