export default function ListPage() {
    const items = [
        { id: 1, title: "Aurora Lamp", desc: "Soft ambient lighting with smart scheduling.", badge: "New", price: "$49", tags: ["Home", "Lighting"] },
        { id: 2, title: "Nimbus Headphones", desc: "Active noise cancelation with 40h battery.", badge: "Hot", price: "$129", tags: ["Audio", "Travel"] },
        { id: 3, title: "Pixel Organizer", desc: "Minimal task manager with cloud sync.", badge: "Update", price: "$12/mo", tags: ["Productivity", "Cloud"] },
        { id: 4, title: "Terra Bottle", desc: "Insulated steel, keeps drinks perfect for hours.", badge: "Eco", price: "$29", tags: ["Wellness", "Outdoor"] },
        { id: 5, title: "Velo Tracker", desc: "Compact GPS tracker with geofencing.", badge: "Pro", price: "$79", tags: ["Security", "IoT"] },
        { id: 6, title: "Quartz Wallet", desc: "Secure multi-currency digital wallet.", badge: "Secure", price: "Free", tags: ["Finance", "Security"] },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-between px-6 py-10">
            <header className="w-full max-w-6xl flex items-center justify-between mb-12">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                    Flaceholder
                </h1>
            </header>

            <section className="w-full max-w-6xl mb-16">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Browse items</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {item.title}
                                </h4>
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                                    {item.badge}
                                </span>
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 mb-4">{item.desc}</p>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {item.price}
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {item.tags.map((t) => (
                                        <span
                                            key={t}
                                            className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                                <button className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors">
                                    View
                                </button>
                                <button className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg shadow-sm dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 transition-colors">
                                    Save
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
