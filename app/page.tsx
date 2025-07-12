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

type User = {
  id: number;
  username: string;
  role: "ADMIN" | "VISITOR";
} | null;

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [user, setUser] = useState<User>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const fetchPosts = async (searchVal = "") => {
    setSearching(true);
    const res = await fetch(
      `/api/posts${searchVal ? `?search=${encodeURIComponent(searchVal)}` : ""}`
    );
    const data = await res.json();
    setPosts(data);
    setSearching(false);
  };

  // 获取当前用户
  const fetchUser = async () => {
    const res = await fetch("/api/auth");
    const data = await res.json();
    setUser(data.user);
  };

  useEffect(() => {
    fetchUser();
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

  // 登录
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: loginUsername,
        password: loginPassword,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setShowLogin(false);
      setLoginUsername("");
      setLoginPassword("");
      fetchUser();
    } else {
      setAuthError(data.error || "登录失败");
    }
  };

  // 注册
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: registerUsername,
        password: registerPassword,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setShowRegister(false);
      setRegisterUsername("");
      setRegisterPassword("");
      setShowLogin(true);
      setAuthError("注册成功，请登录");
    } else {
      setAuthError(data.error || "注册失败");
    }
  };

  // 登出
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setShowLogin(false);
    setShowRegister(false);
    setAuthError("");
    fetchPosts();
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
      {/* 用户栏 */}
      <div className="flex justify-end mb-4 gap-2">
        {user ? (
          <>
            <span className="text-gray-600">
              你好，{user.username}（{user.role === "ADMIN" ? "管理员" : "访客"}
              ）
            </span>
            <button
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm"
              onClick={handleLogout}
            >
              退出登录
            </button>
          </>
        ) : (
          <>
            <button
              className="px-3 py-1 rounded bg-blue-500 text-white text-sm hover:bg-blue-600"
              onClick={() => {
                setShowLogin(true);
                setAuthError("");
              }}
            >
              登录
            </button>
            <button
              className="px-3 py-1 rounded bg-purple-500 text-white text-sm hover:bg-purple-600"
              onClick={() => {
                setShowRegister(true);
                setAuthError("");
              }}
            >
              注册
            </button>
          </>
        )}
      </div>
      {/* 登录弹窗 */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <form
            onSubmit={handleLogin}
            className="bg-white rounded-xl shadow-lg p-8 w-80 space-y-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-2">登录</h2>
            <input
              className="border px-3 py-2 w-full rounded-lg"
              placeholder="用户名"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              required
            />
            <input
              className="border px-3 py-2 w-full rounded-lg"
              placeholder="密码"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
            {authError && (
              <div className="text-red-500 text-sm">{authError}</div>
            )}
            <div className="flex gap-2">
              <button
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                type="submit"
              >
                登录
              </button>
              <button
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                type="button"
                onClick={() => setShowLogin(false)}
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}
      {/* 注册弹窗 */}
      {showRegister && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <form
            onSubmit={handleRegister}
            className="bg-white rounded-xl shadow-lg p-8 w-80 space-y-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-2">注册</h2>
            <input
              className="border px-3 py-2 w-full rounded-lg"
              placeholder="用户名"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
              required
            />
            <input
              className="border px-3 py-2 w-full rounded-lg"
              placeholder="密码（至少6位）"
              type="password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
            />
            {authError && (
              <div className="text-red-500 text-sm">{authError}</div>
            )}
            <div className="flex gap-2">
              <button
                className="flex-1 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600"
                type="submit"
              >
                注册
              </button>
              <button
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                type="button"
                onClick={() => setShowRegister(false)}
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}
      {/* 发布表单，仅admin可见 */}
      {user && user.role === "ADMIN" && (
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
      )}
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
              {/* 仅admin显示编辑/删除按钮 */}
              {user && user.role === "ADMIN" && (
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
              )}
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
