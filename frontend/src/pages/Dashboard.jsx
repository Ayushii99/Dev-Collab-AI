import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Bot, 
  LogOut, 
  Plus, 
  Sparkles, 
  Users, 
  TrendingUp 
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const [activeTab, setActiveTab] = useState('overview');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        headers: {
          'Authorization': `Bearer ${userInfo.token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setProjects(data);
      }
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = userInfo.token;
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description })
      });
      const data = await response.json();
      if (response.ok) {
        setIsModalOpen(false);
        setTitle('');
        setDescription('');
        fetchProjects();
        alert('Project created successfully!');
      } else {
        alert(data.message || 'Failed to create project');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
            <div className="bg-indigo-600 p-2 rounded-xl text-white">
              <Bot className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              DevCollab AI
            </span>
          </div>
          <nav className="p-4 space-y-2">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Overview</span>
            </button>
            <button 
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${activeTab === 'projects' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
            >
              <FolderKanban className="w-5 h-5" />
              <span>Projects</span>
            </button>
            <button 
              onClick={() => setActiveTab('tasks')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${activeTab === 'tasks' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
            >
              <CheckSquare className="w-5 h-5" />
              <span>AI Tasks</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-20 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 px-8 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back, {userInfo.name || 'Developer'}! 👋</h1>
            <p className="text-sm text-slate-400">Here's what's happening with your projects today.</p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-600/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-white shadow-md">
              {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'D'}
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Active Projects</p>
                <h3 className="text-3xl font-bold mt-1 text-slate-100">{projects.length}</h3>
                <span className="text-xs text-emerald-400 flex items-center mt-2 font-medium">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" /> +0% this month
                </span>
              </div>
              <div className="bg-indigo-500/10 p-4 rounded-xl text-indigo-400 border border-indigo-500/20">
                <FolderKanban className="w-7 h-7" />
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">AI Generated Tasks</p>
                <h3 className="text-3xl font-bold mt-1 text-slate-100">0</h3>
                <span className="text-xs text-indigo-400 flex items-center mt-2 font-medium">
                  <Sparkles className="w-3.5 h-3.5 mr-1" /> Ready to automate
                </span>
              </div>
              <div className="bg-cyan-500/10 p-4 rounded-xl text-cyan-400 border border-cyan-500/20">
                <Bot className="w-7 h-7" />
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Team Collaborators</p>
                <h3 className="text-3xl font-bold mt-1 text-slate-100">1</h3>
                <span className="text-xs text-slate-400 mt-2 block font-medium">Personal workspace</span>
              </div>
              <div className="bg-purple-500/10 p-4 rounded-xl text-purple-400 border border-purple-500/20">
                <Users className="w-7 h-7" />
              </div>
            </div>
          </div>

          {/* Recent Projects Section */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Your Projects</h2>
              <span className="text-sm text-indigo-400 cursor-pointer hover:underline">View all</span>
            </div>
            
            {projects.length === 0 ? (
              <div className="border-2 border-dashed border-slate-800 rounded-xl p-12 text-center flex flex-col items-center justify-center">
                <div className="bg-slate-800/60 p-4 rounded-full text-slate-400 mb-4">
                  <FolderKanban className="w-8 h-8" />
                </div>
                <h3 className="text-slate-200 font-medium mb-1">No projects created yet</h3>
                <p className="text-sm text-slate-400 max-w-sm mb-6">Get started by creating your first full-stack project workspace with AI task breakdown.</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-medium transition shadow-lg shadow-indigo-600/20"
                >
                  Create First Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((proj) => (
                  <div key={proj._id} className="bg-slate-950 border border-slate-800 p-5 rounded-xl hover:border-indigo-500/50 transition">
                    <h3 className="text-lg font-semibold text-slate-100 mb-1">{proj.title}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2">{proj.description}</p>
                    <div className="mt-4 flex justify-between items-center text-xs text-slate-500">
                      <span>Created recently</span>
                      <span className="text-indigo-400 font-medium">Active Workspace</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-100">Create New Project</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleCreateProject}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Project Title</label>
                  <input 
                    type="text" 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. E-Commerce Platform"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 semibold mb-1">Description</label>
                  <textarea 
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief overview of your project..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 transition font-medium text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl font-medium transition shadow-lg shadow-indigo-600/20 text-sm disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}