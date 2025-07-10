"use client";
import { useEffect, useState } from "react";

// 时间友好显示
function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000;
  if (diff < 60) return "刚刚";
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}天前`;
  return date.toLocaleString();
}

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
  const [searching, setSearching] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  const fetchPosts = async (searchVal = "") => {
    setSearching(true);
    const res = await fetch(
      `/api/posts${searchVal ? `?search=${encodeURIComponent(searchVal)}` : ""}`
    );
    const data = await res.json();
    setPosts(data);
    setSearching(false);
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
    fetchPosts(search);
  };

  const handleDelete = async (id: number) => {
    await fetch("/api/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchPosts(search);
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
    fetchPosts(search);
  };

  // 动画类
  // 在 app/globals.css 里加：
  // @keyframes fade-in { from { opacity: 0; transform: translateY(-20px);} to { opacity: 1; transform: translateY(0);} }
  // .animate-fade-in { animation: fade-in 1s ease; }

  return (
    <main className="max-w-2xl mx-auto py-6 px-2 sm:px-4 animate-fade-in">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in select-none">
        rui的博客
      </h1>
      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white rounded-2xl shadow p-4 sm:p-6 space-y-4"
      >
        <input
          className="border border-gray-300 px-3 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
          placeholder="标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="border border-gray-300 px-3 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
          placeholder="内容"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={4}
        />
        <div className="flex space-x-2">
          <button
            className={`px-6 py-2 rounded-lg text-white font-semibold transition text-base shadow ${
              loading
                ? "bg-blue-300"
                : "bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 active:scale-95"
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
              className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition text-base shadow"
              type="button"
              onClick={handleCancelEdit}
            >
              取消
            </button>
          )}
        </div>
      </form>
      {/* 搜索框 */}
      <div className="mb-6 flex items-center gap-2">
        <span className="text-gray-400">
          <svg
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="10" cy="10" r="7" />
            <line x1="15" y1="15" x2="20" y2="20" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="搜索文章"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          className="border px-3 py-2 rounded-lg flex-1 shadow focus:ring-2 focus:ring-blue-400 transition text-base"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow hover:scale-105 transition text-base"
        >
          搜索
        </button>
      </div>
      {/* 加载动画 */}
      {searching && (
        <div className="text-center text-blue-500 animate-pulse py-4">
          加载中...
        </div>
      )}
      {/* 文章列表 */}
      <ul className="space-y-6">
        {posts.length === 0 && !searching && (
          <div className="text-center text-gray-400 py-8">暂无文章</div>
        )}
        {posts.map((post) => (
          <li
            key={post.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition p-5 sm:p-6 cursor-pointer select-text"
            onClick={() => setExpanded(expanded === post.id ? null : post.id)}
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 break-all">
                {post.title}
              </h2>
              <div className="space-x-2 flex-shrink-0">
                <button
                  className="text-blue-600 hover:underline text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(post);
                  }}
                >
                  编辑
                </button>
                <button
                  className="text-red-500 hover:underline text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(post.id);
                  }}
                >
                  删除
                </button>
              </div>
            </div>
            <p className="mt-2 text-gray-700 whitespace-pre-line break-words text-base min-h-[24px]">
              {expanded === post.id
                ? post.content
                : post.content.length > 100
                ? post.content.slice(0, 100) + "... (点击展开)"
                : post.content}
            </p>
            <div className="text-gray-400 text-xs mt-4 text-right">
              {formatTime(post.createdAt)}
            </div>
          </li>
        ))}
      </ul>
      <footer className="mt-12 text-center text-gray-400 text-sm select-none">
        © {new Date().getFullYear()} rui的博客 | Powered by Next.js & Prisma
      </footer>
    </main>
  );
}
