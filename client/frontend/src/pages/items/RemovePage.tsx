import React, { useState } from "react";

type Item = {
  id: number;
  title: string;
  desc: string;
  price: string;
  tags: string[];
  badge: string;
};

export default function RemovePage() {
  const [title, set_title] = useState<string>("");
  const [desc, set_desc] = useState<string>("");
  const [price, set_price] = useState<string>("");
  const [tags, set_tags] = useState<string>("");
  const [error, set_error] = useState<string | null>(null);
  const [saving, set_saving] = useState<boolean>(false);
  const [success, set_success] = useState<string | null>(null);

  function handle_submit(event: React.FormEvent) {
    event.preventDefault();
    set_error(null);
    set_success(null);

    if (!title.trim()) {
      set_error("Title is required");
      return;
    }

    const newItem: Item = {
      id: Date.now(),
      title: title.trim(),
      desc: desc.trim(),
      price: price.trim() || "Free",
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      badge: "New",
    };

    console.log(newItem);

    set_saving(true);

    setTimeout(() => {
      set_saving(false);
      set_title("");
      set_desc("");
      set_price("");
      set_tags("");
      set_success("Item created (placeholder)");
      setTimeout(() => set_success(null), 2500);
    }, 600);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Add New Item
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Fill the form and submit.
        </p>

        <form onSubmit={handle_submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => set_title(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              placeholder="Aurora Lamp"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Description
            </label>
            <textarea
              value={desc}
              onChange={(e) => set_desc(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              rows={3}
              placeholder="Soft ambient lighting with smart scheduling."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Price
              </label>
              <input
                value={price}
                onChange={(e) => set_price(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                placeholder="$49"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Tags (comma separated)
              </label>
              <input
                value={tags}
                onChange={(e) => set_tags(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                placeholder="Home, Lighting"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <div className="flex items-center justify-end space-x-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Remove Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
