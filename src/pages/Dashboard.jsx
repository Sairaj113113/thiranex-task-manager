import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase/firebase";

export default function Dashboard() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);

  // Calculate stats dynamically from current state
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  
  // Get formatted date for header
  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const querySnapshot = await getDocs(collection(db, "tasks"));

    const taskList = [];

    querySnapshot.forEach((document) => {
      taskList.push({
        id: document.id,
        ...document.data(),
      });
    });

    setTasks(taskList);
  };

  const addTask = async (e) => {
    e.preventDefault();

    if (title.trim() === "") return;

    await addDoc(collection(db, "tasks"), {
      title: title,
      completed: false,
    });

    setTitle("");

    fetchTasks();
  };

  const toggleTask = async (task) => {
    await updateDoc(doc(db, "tasks", task.id), {
      completed: !task.completed,
    });

    fetchTasks();
  };

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));

    fetchTasks();
  };

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#03045E] via-[#0077B6] to-[#CAF0F8] bg-fixed font-sans antialiased pb-12">
      
      {/* Sticky Navbar with Glassmorphism */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#03045E]/95 border-b border-[#0077B6]/30 shadow-lg px-4 sm:px-8 py-4 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-[#00B4D8] to-[#90E0EF] p-2 rounded-xl shadow-md">
            <svg className="w-6 h-6 text-[#03045E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white bg-clip-text">
            Task<span className="text-[#00B4D8]">Manager</span>
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <span className="hidden md:inline-block text-sm font-medium text-[#CAF0F8]/80 bg-[#0077B6]/30 px-3 py-1.5 rounded-full border border-[#00B4D8]/20">
            {auth.currentUser?.email || "user@app.com"}
          </span>
          <button
            onClick={logout}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-5 py-2 rounded-xl shadow-md shadow-red-900/20 hover:shadow-red-900/40 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 text-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 animate-fade-in">
        
        {/* Welcome Header */}
        <header className="mb-8 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back!
            </h2>
            <p className="text-[#CAF0F8] text-sm font-medium mt-1">
              {todayStr}
            </p>
          </div>
        </header>

        {/* Statistic Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Total Tasks */}
          <div className="bg-white/80 backdrop-blur-sm border border-white/40 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group">
            <div>
              <p className="text-xs font-bold text-[#0077B6] uppercase tracking-wider">Total Tasks</p>
              <h3 className="text-3xl font-black text-[#03045E] mt-1">{totalTasks}</h3>
            </div>
            <div className="bg-[#CAF0F8] p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-[#03045E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="bg-white/80 backdrop-blur-sm border border-white/40 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group">
            <div>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Completed</p>
              <h3 className="text-3xl font-black text-[#03045E] mt-1">{completedTasks}</h3>
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white/80 backdrop-blur-sm border border-white/40 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group">
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending</p>
              <h3 className="text-3xl font-black text-[#03045E] mt-1">{pendingTasks}</h3>
            </div>
            <div className="bg-amber-50 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </section>

        {/* Task Input Area */}
        <section className="mb-8">
          <form
            onSubmit={addTask}
            className="flex flex-col sm:flex-row gap-3 bg-white/95 p-3 rounded-2xl shadow-xl border border-white/50"
          >
            <input
              type="text"
              placeholder="What needs to be done today?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 p-4 rounded-xl border border-gray-100 bg-gray-50/50 text-[#03045E] placeholder-gray-400 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0077B6] focus:border-transparent transition-all duration-200"
            />
            <button
              type="submit"
              className="bg-[#0077B6] hover:bg-[#03045E] text-white font-bold px-8 py-4 sm:py-2 rounded-xl shadow-lg shadow-[#0077B6]/20 hover:shadow-[#03045E]/30 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Task</span>
            </button>
          </form>
        </section>

        {/* Task List Section */}
        <section className="space-y-4">
          {tasks.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm border border-white/30 p-12 rounded-3xl shadow-xl text-center flex flex-col items-center justify-center">
              <div className="bg-[#CAF0F8] p-4 rounded-full text-[#0077B6] mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-[#03045E]">All clear!</h4>
              <p className="text-gray-500 font-medium mt-1">No tasks available. Add one above to get started.</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`group bg-white/95 rounded-2xl shadow-md border hover:shadow-xl transition-all duration-300 p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                    task.completed 
                      ? "border-transparent bg-white/70 opacity-80" 
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-4 flex-1 w-full sm:w-auto">
                    <button
                      onClick={() => toggleTask(task)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all duration-200 cursor-pointer ${
                        task.completed
                          ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20"
                          : "border-gray-300 hover:border-[#0077B6] bg-gray-50"
                      }`}
                    >
                      {task.completed && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-base sm:text-lg font-semibold truncate transition-all duration-200 ${
                          task.completed
                            ? "line-through text-gray-400 font-normal"
                            : "text-[#03045E]"
                        }`}
                      >
                        {task.title}
                      </h3>
                      <div className="mt-1 flex items-center space-x-2">
                        {task.completed ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/50">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100/80">
                    <button
                      onClick={() => toggleTask(task)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-200 ${
                        task.completed
                          ? "bg-gray-100 hover:bg-gray-200 text-gray-600"
                          : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {task.completed ? "Undo" : "Complete"}
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl transform hover:scale-105 active:scale-95 transition-all duration-200 group/btn"
                      title="Delete Task"
                    >
                      <svg className="w-5 h-5 transition-transform group-hover/btn:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}