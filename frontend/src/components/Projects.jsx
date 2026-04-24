import React, { useState, useEffect } from 'react';
import {
  FolderKanban, Plus, Search, Edit, Trash2, X, ChevronRight,
  Users, Calendar, CheckCircle, Clock, AlertCircle, Loader2,
  ArrowLeft
} from 'lucide-react';
import { api } from '../api/endpoints';

const STAGES = ['To Do', 'In Progress', 'Review', 'Done'];

const stageConfig = {
  'To Do':      { color: 'bg-slate-100 text-slate-600',   dot: 'bg-slate-400',   border: 'border-slate-200' },
  'In Progress':{ color: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500',    border: 'border-blue-200' },
  'Review':     { color: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-500',   border: 'border-amber-200' },
  'Done':       { color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-200' },
};

const priorityConfig = {
  'High':   'text-red-600 bg-red-50 border-red-200',
  'Medium': 'text-amber-600 bg-amber-50 border-amber-200',
  'Low':    'text-slate-500 bg-slate-50 border-slate-200',
};

const avatarColors = [
  'bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700',
  'bg-emerald-100 text-emerald-700', 'bg-rose-100 text-rose-700',
  'bg-amber-100 text-amber-700', 'bg-sky-100 text-sky-700',
];
const getAvatarColor = (name) => avatarColors[(name || '').length % avatarColors.length];

const statusConfig = {
  'planning':    'bg-amber-100 text-amber-700 border-amber-200',
  'in_progress': 'bg-blue-100 text-blue-700 border-blue-200',
  'on_hold':     'bg-slate-100 text-slate-600 border-slate-200',
  'completed':   'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const colorOptions = [
  { value: 'bg-blue-500', label: 'Blue' },
  { value: 'bg-emerald-500', label: 'Green' },
  { value: 'bg-violet-500', label: 'Purple' },
  { value: 'bg-rose-500', label: 'Rose' },
  { value: 'bg-amber-500', label: 'Amber' },
  { value: 'bg-sky-500', label: 'Sky' },
];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openProjectId, setOpenProjectId] = useState(null);

  // Project Modal
  const [isProjectModal, setIsProjectModal] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectForm, setProjectForm] = useState({ name: '', description: '', status: 'planning', end_date: '', progress: 0 });

  // Task Modal
  const [isTaskModal, setIsTaskModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'Medium', due_date: '', status: 'To Do' });

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const data = await api.projects.list();
      setProjects(data);
    } catch (err) {
      setError('Failed to sync project dashboard.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openProject = projects.find(p => p.id === openProjectId);

  // ─── PROJECT CRUD ────────────────────────────────────────────
  const openCreateProject = () => {
    setProjectForm({ name: '', description: '', status: 'planning', end_date: new Date().toISOString().split('T')[0], progress: 0 });
    setEditingProjectId(null);
    setIsProjectModal(true);
  };

  const openEditProject = (p, e) => {
    e.stopPropagation();
    setProjectForm({ name: p.name, description: p.description, status: p.status, end_date: p.end_date, progress: p.progress });
    setEditingProjectId(p.id);
    setIsProjectModal(true);
  };

  const deleteProject = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this project and all its tasks?')) return;
    try {
      await api.projects.delete(id);
      setProjects(projects.filter(p => p.id !== id));
      if (openProjectId === id) setOpenProjectId(null);
    } catch (err) {
      alert('Failed to delete project.');
    }
  };

  const saveProject = async (e) => {
    e.preventDefault();
    try {
      if (editingProjectId) {
        const updated = await api.projects.update(editingProjectId, projectForm);
        setProjects(projects.map(p => p.id === editingProjectId ? updated : p));
      } else {
        const created = await api.projects.create({ ...projectForm, start_date: new Date().toISOString().split('T')[0] });
        setProjects([created, ...projects]);
      }
      setIsProjectModal(false);
    } catch (err) {
      alert('Failed to save project.');
    }
  };

  // ─── TASK CRUD ───────────────────────────────────────────────
  const openCreateTask = (status = 'To Do') => {
    setTaskForm({ title: '', description: '', priority: 'Medium', due_date: new Date().toISOString().split('T')[0], status });
    setEditingTaskId(null);
    setIsTaskModal(true);
  };

  const openEditTask = (task) => {
    setTaskForm({ title: task.title, description: task.description, priority: task.priority, due_date: task.due_date, status: task.status });
    setEditingTaskId(task.id);
    setIsTaskModal(true);
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.tasks.delete(taskId);
      setProjects(projects.map(p => p.id === openProjectId 
        ? { ...p, tasks: p.tasks.filter(t => t.id !== taskId) } 
        : p
      ));
    } catch (err) {
      alert('Failed to delete task.');
    }
  };

  const saveTask = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...taskForm, project: openProjectId };
      if (editingTaskId) {
        const updated = await api.tasks.update(editingTaskId, payload);
        setProjects(projects.map(p => p.id === openProjectId 
          ? { ...p, tasks: p.tasks.map(t => t.id === editingTaskId ? updated : t) } 
          : p
        ));
      } else {
        const created = await api.tasks.create(payload);
        setProjects(projects.map(p => p.id === openProjectId 
          ? { ...p, tasks: [...(p.tasks || []), created] } 
          : p
        ));
      }
      setIsTaskModal(false);
    } catch (err) {
      alert('Failed to save task.');
    }
  };

  const filteredProjects = projects.filter(p =>
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-medium">Synchronizing Project Workspace...</p>
        </div>
      </div>
    );
  }

  // ─── KANBAN BOARD VIEW ───────────────────────────────────────
  if (openProject) {
    const projectTasks = openProject.tasks || [];
    const tasksByStage = STAGES.reduce((acc, stage) => {
      acc[stage] = projectTasks.filter(t => t.status === stage);
      return acc;
    }, {});

    return (
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 animate-in fade-in transition-all">
        {/* Project Header */}
        <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-4">
            <button onClick={() => setOpenProjectId(null)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className={`w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm`}>
              <FolderKanban className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">{openProject.name}</h1>
              <p className="text-sm text-slate-500">{projectTasks.length} tasks · {openProject.progress}% complete</p>
            </div>
          </div>
          <button
            onClick={() => openCreateTask()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center transition-all shadow-md hover:shadow-lg shadow-blue-500/20 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 mr-2" />Add Task
          </button>
        </div>

        {/* Kanban Columns */}
        <div className="flex-1 overflow-x-auto p-6">
          <div className="flex space-x-4 min-w-max h-full">
            {STAGES.map(stage => {
              const cfg = stageConfig[stage];
              const stageTasks = tasksByStage[stage];
              return (
                <div key={stage} className="w-72 flex flex-col">
                  {/* Column Header */}
                  <div className={`flex items-center justify-between mb-3 px-1`}>
                    <div className="flex items-center space-x-2">
                       <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`}></div>
                      <span className="text-sm font-bold text-slate-700">{stage}</span>
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{stageTasks.length}</span>
                    </div>
                    <button onClick={() => openCreateTask(stage)} className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Task Cards */}
                  <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                    {stageTasks.map(task => (
                      <div
                        key={task.id}
                        onClick={() => openEditTask(task)}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openEditTask(task)}
                        role="button"
                        tabIndex={0}
                        className={`bg-white rounded-xl border ${cfg.border} p-4 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group relative`}
                      >
                        {/* Priority */}
                        <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full border mb-2.5 ${priorityConfig[task.priority] || priorityConfig.Medium}`}>
                          {task.priority}
                        </span>

                        <p className="text-sm font-semibold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">{task.title}</p>

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center text-xs text-slate-400">
                            <Calendar className="w-3 h-3 mr-1" />
                            {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}
                          </div>
                          <div className="flex items-center space-x-1.5 transition-all">
                             <button
                              onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                              className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Empty column CTA */}
                    {stageTasks.length === 0 && (
                      <button
                        onClick={() => openCreateTask(stage)}
                        className="w-full border-2 border-dashed border-slate-200 rounded-xl p-4 text-sm text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-colors text-center"
                      >
                        + Add task
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Task Modal */}
        {isTaskModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
              onClick={() => setIsTaskModal(false)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsTaskModal(false)}
              role="button"
              tabIndex={-1}
              aria-label="Close modal"
            ></div>
            <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-spring-up">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800">{editingTaskId ? 'Edit Task' : 'Add New Task'}</h2>
                <button onClick={() => setIsTaskModal(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={saveTask} className="p-6 space-y-4">
                <div>
                  <label htmlFor="task-title" className="block text-sm font-semibold text-slate-700 mb-1.5">Task Title</label>
                  <input id="task-title" type="text" value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" required placeholder="e.g. Design homepage mockup" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                  <textarea value={taskForm.description || ''} onChange={e => setTaskForm({...taskForm, description: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm resize-none" rows={2} placeholder="Optional task details..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Due Date</label>
                    <input type="date" value={taskForm.due_date} onChange={e => setTaskForm({...taskForm, due_date: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white" />
                  </div>
                   <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Priority</label>
                    <select value={taskForm.priority} onChange={e => setTaskForm({...taskForm, priority: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white">
                      <option>High</option><option>Medium</option><option>Low</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Stage</label>
                  <select value={taskForm.status} onChange={e => setTaskForm({...taskForm, status: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white">
                    {STAGES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="pt-4 flex justify-end space-x-3">
                  <button type="button" onClick={() => setIsTaskModal(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm active:scale-[0.98]">{editingTaskId ? 'Save Changes' : 'Add Task'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── PROJECTS GRID VIEW ──────────────────────────────────────
  return (
    <div className="flex-1 overflow-auto bg-slate-50 p-8 relative">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600 shadow-inner">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Project Management</h1>
              <p className="text-sm text-slate-500 mt-0.5">{projects.length} active projects across all teams.</p>
            </div>
          </div>
          <button onClick={openCreateProject} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center transition-all shadow-md hover:shadow-lg shadow-blue-500/20 active:scale-[0.98] whitespace-nowrap w-fit">
            <Plus className="w-4 h-4 mr-2" />New Project
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center text-red-700">
            <AlertCircle className="w-5 h-5 mr-3" />
            <p className="font-medium">{error}</p>
            <button onClick={fetchProjects} className="ml-auto underline font-bold">Retry</button>
          </div>
        )}

        {/* KPI Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Projects', value: projects.length, icon: FolderKanban, color: 'text-violet-600 bg-violet-50' },
            { label: 'Total Tasks', value: projects.reduce((s, p) => s + (p.tasks?.length || 0), 0), icon: CheckCircle, color: 'text-blue-600 bg-blue-50' },
            { label: 'In Progress', value: projects.filter(p => p.status === 'in_progress').length, icon: Clock, color: 'text-amber-600 bg-amber-50' },
            { label: 'Avg Progress', value: projects.length ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length) + '%' : '0%', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
          ].map((kpi, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500 font-medium">{kpi.label}</span>
                <div className={`p-1.5 rounded-lg ${kpi.color}`}><kpi.icon className="w-4 h-4" /></div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search projects..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map(project => {
            const taskCount = project.tasks?.length || 0;
            return (
              <div
                key={project.id}
                onClick={() => setOpenProjectId(project.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setOpenProjectId(project.id)}
                role="button"
                tabIndex={0}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all cursor-pointer group overflow-hidden"
              >
                <div className={`h-1.5 w-full bg-blue-600`}></div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                        <FolderKanban className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors capitalize">{project.name}</h3>
                        <span className={`inline-flex text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${statusConfig[project.status] || statusConfig.planning}`}>{project.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
                      <button onClick={e => openEditProject(project, e)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={e => deleteProject(project.id, e)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>

                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-5">{project.description}</p>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-semibold text-slate-500">Progress</span>
                      <span className="text-xs font-bold text-slate-700">{taskCount} tasks</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className={`h-2 rounded-full bg-blue-600 transition-all`} style={{ width: `${project.progress}%` }}></div>
                    </div>
                    <p className="text-xs font-bold text-right mt-1 text-slate-400">{project.progress}%</p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex -space-x-2">
                       <div className={`w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500`}>A</div>
                    </div>
                    <div className="flex items-center text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      Due {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'N/A'}
                      <ChevronRight className="w-4 h-4 ml-1 text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* New Project CTA Card */}
          <button onClick={openCreateProject} className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center space-y-3 hover:border-blue-300 hover:bg-blue-50/30 transition-all group min-h-48">
            <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
              <Plus className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <p className="text-sm font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">Create New Project</p>
          </button>
        </div>
      </div>

      {/* Project Modal */}
      {isProjectModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            onClick={() => setIsProjectModal(false)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsProjectModal(false)}
            role="button"
            tabIndex={-1}
            aria-label="Close modal"
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-spring-up">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center"><FolderKanban className="w-5 h-5 mr-2 text-blue-600" />{editingProjectId ? 'Edit Project' : 'New Project'}</h2>
              <button onClick={() => setIsProjectModal(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={saveProject} className="p-6 space-y-4">
              <div>
                <label htmlFor="project-name" className="block text-sm font-semibold text-slate-700 mb-1.5">Project Name</label>
                <input id="project-name" type="text" value={projectForm.name} onChange={e => setProjectForm({...projectForm, name: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" required placeholder="e.g. Website Redesign" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea value={projectForm.description || ''} onChange={e => setProjectForm({...projectForm, description: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm resize-none" rows={2} placeholder="Brief project description..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
                  <select value={projectForm.status} onChange={e => setProjectForm({...projectForm, status: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white">
                    <option value="planning">Planning</option>
                    <option value="in_progress">In Progress</option>
                    <option value="on_hold">On Hold</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-1.5">Progress (%)</label>
                   <input type="number" min="0" max="100" value={projectForm.progress} onChange={e => setProjectForm({...projectForm, progress: Number.parseInt(e.target.value) || 0})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">End Date</label>
                <input type="date" value={projectForm.end_date} onChange={e => setProjectForm({...projectForm, end_date: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white" />
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsProjectModal(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm active:scale-[0.98]">{editingProjectId ? 'Save Changes' : 'Create Project'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
