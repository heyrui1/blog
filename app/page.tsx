"use client";
import { useEffect, useState } from "react";

type Post = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const fetchPosts = async () => {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (editId === null) {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
    } else {
      await fetch("/api/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editId, title, content }),
      });
    }
    setTitle("");
    setContent("");
    setEditId(null);
    setLoading(false);
    fetchPosts();
  };

  const handleDelete = async (id: number) => {
    await fetch("/api/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchPosts();
  };

  const handleEdit = (post: Post) => {
    setEditId(post.id);
    setTitle(post.title);
    setContent(post.content);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setTitle("");
    setContent("");
  };

  const handleSearch = async () => {
    const res = await fetch(`/api/posts?search=${encodeURIComponent(search)}`);
    const data = await res.json();
    setPosts(data);
  };

  return (
    <main className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-700 drop-shadow">
        我的博客
      </h1>
      <form
        onSubmit={handleSubmit}
        className="mb-10 bg-white rounded-lg shadow p-6 space-y-4"
      >
        <input
          className="border border-gray-300 px-3 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="border border-gray-300 px-3 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="内容"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={4}
        />
        <div className="flex space-x-2">
          <button
            className={`px-6 py-2 rounded text-white font-semibold transition ${
              loading
                ? "bg-blue-300"
                : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
            }`}
            type="submit"
            disabled={loading}
          >
            {loading
              ? editId === null
                ? "发布中..."
                : "保存中..."
              : editId === null
              ? "发布"
              : "保存"}
          </button>
          {editId !== null && (
            <button
              className="px-6 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition"
              type="button"
              onClick={handleCancelEdit}
            >
              取消
            </button>
          )}
        </div>
      </form>
      <div className="mb-6 flex">
        <input
          type="text"
          placeholder="搜索文章"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          className="border px-2 py-1 rounded flex-1"
        />
        <button
          onClick={() => handleSearch()}
          className="ml-2 px-3 py-1 bg-blue-500 text-white rounded"
        >
          搜索
        </button>
      </div>
      <ul className="space-y-6">
        {posts.map((post) => (
          <li
            key={post.id}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">{post.title}</h2>
              <div className="space-x-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => handleEdit(post)}
                >
                  编辑
                </button>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => handleDelete(post.id)}
                >
                  删除
                </button>
              </div>
            </div>
            <p className="mt-3 text-gray-700 whitespace-pre-line">
              {post.content}
            </p>
            <div className="text-gray-400 text-xs mt-4 text-right">
              {new Date(post.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
      <footer className="mt-12 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} 我的博客 | Powered by Next.js & Prisma
      </footer>
    </main>
  );
}
