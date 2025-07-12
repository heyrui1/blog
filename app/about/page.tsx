"use client";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          关于这个博客
        </h1>
        <p className="text-xl text-gray-600">分享技术、生活和想法的地方</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">技术栈</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Next.js 14 - React 框架
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              TypeScript - 类型安全
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
              Tailwind CSS - 样式框架
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
              Prisma - 数据库 ORM
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
              SQLite - 数据库
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            功能特性
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
              用户认证系统
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
              文章发布和管理
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
              实时搜索功能
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
              响应式设计
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-gray-500 rounded-full mr-3"></span>
              现代化 UI 界面
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg mb-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          关于作者
        </h2>
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">R</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Rui Zhang</h3>
          <p className="text-gray-600 mb-4">
            全栈开发者 | 技术爱好者 | 终身学习者
          </p>
          <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
            热爱编程和技术，喜欢探索新的技术栈和解决方案。
            这个博客是我分享技术心得、学习笔记和生活感悟的地方。
            希望能通过文字与大家交流，共同成长。
          </p>
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          返回首页
        </Link>
      </div>
    </main>
  );
}
