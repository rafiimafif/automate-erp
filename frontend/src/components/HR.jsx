import React, { useState } from 'react';
import { Briefcase, Plus, Search, Edit, Trash2, X, DollarSign, Users, Clock, CheckCircle } from 'lucide-react';

const initialEmployees = [
  { id: 'EMP-001', name: 'Alex Rivera', role: 'Software Engineer', department: 'Engineering', email: 'alex@automateerp.com', salary: 95000, startDate: '2022-03-15', status: 'Active' },
  { id: 'EMP-002', name: 'Maria Santos', role: 'Sales Manager', department: 'Sales', email: 'maria@automateerp.com', salary: 78000, startDate: '2021-07-01', status: 'Active' },
  { id: 'EMP-003', name: 'James Parker', role: 'Finance Analyst', department: 'Finance', email: 'james@automateerp.com', salary: 72000, startDate: '2023-01-20', status: 'Active' },
  { id: 'EMP-004', name: 'Lisa Nguyen', role: 'HR Coordinator', department: 'HR', email: 'lisa@automateerp.com', salary: 64000, startDate: '2022-09-05', status: 'On Leave' },
  { id: 'EMP-005', name: 'David Kim', role: 'DevOps Engineer', department: 'Engineering', email: 'david@automateerp.com', salary: 105000, startDate: '2020-12-01', status: 'Active' },
];

const DEPARTMENTS = ['Engineering', 'Sales', 'Finance', 'HR', 'Operations', 'Marketing'];

const deptColors = {
  Engineering: 'bg-blue-100 text-blue-700 border-blue-200',
  Sales: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Finance: 'bg-amber-100 text-amber-700 border-amber-200',
  HR: 'bg-purple-100 text-purple-700 border-purple-200',
  Operations: 'bg-rose-100 text-rose-700 border-rose-200',
  Marketing: 'bg-indigo-100 text-indigo-700 border-indigo-200',
};

const avatarColors = ['bg-blue-100 text-blue-700', 'bg-indigo-100 text-indigo-700', 'bg-purple-100 text-purple-700', 'bg-emerald-100 text-emerald-700', 'bg-rose-100 text-rose-700', 'bg-amber-100 text-amber-700'];
const getAvatarColor = (name) => avatarColors[name.length % avatarColors.length];

export default function HR() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', role: '', department: 'Engineering', email: '', salary: '', startDate: '', status: 'Active' });

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const totalPayroll = employees.reduce((sum, e) => sum + Number(e.salary), 0);
  const activeCount = employees.filter(e => e.status === 'Active').length;
  const departments = [...new Set(employees.map(e => e.department))].length;

  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreate = () => { setFormData({ name: '', role: '', department: 'Engineering', email: '', salary: '', startDate: '', status: 'Active' }); setEditingId(null); setIsModalOpen(true); };
  const openEdit = (emp) => { setFormData({ name: emp.name, role: emp.role, department: emp.department, email: emp.email, salary: emp.salary, startDate: emp.startDate, status: emp.status }); setEditingId(emp.id); setIsModalOpen(true); };
  const handleDelete = (id) => setEmployees(employees.filter(e => e.id !== id));

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      setEmployees(employees.map(emp => emp.id === editingId ? { ...emp, ...formData } : emp));
    } else {
      setEmployees([{ id: `EMP-${String(employees.length + 1).padStart(3, '0')}`, ...formData }, ...employees]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 overflow-auto bg-slate-50 p-8 relative">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-inner">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">HR & Payroll</h1>
              <p className="text-sm text-slate-500 mt-0.5">Manage employees, roles, and payroll information.</p>
            </div>
          </div>
          <button onClick={openCreate} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center transition-all shadow-md hover:shadow-lg shadow-blue-500/20 active:scale-[0.98] whitespace-nowrap w-fit">
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </button>
        </div>

        {/* KPI Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-slate-500">Total Payroll / yr</span>
              <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><DollarSign className="w-4 h-4" /></span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-3">{formatCurrency(totalPayroll)}</h3>
            <p className="text-xs text-slate-400 font-medium mt-2">Across all {employees.length} employees</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-slate-500">Active Employees</span>
              <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle className="w-4 h-4" /></span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-3">{activeCount}</h3>
            <p className="text-xs text-slate-400 font-medium mt-2">{employees.length - activeCount} on leave or inactive</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-slate-500">Departments</span>
              <span className="p-1.5 bg-purple-50 text-purple-600 rounded-lg"><Users className="w-4 h-4" /></span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-3">{departments}</h3>
            <p className="text-xs text-slate-400 font-medium mt-2">Active organizational units</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search by name, department, or role..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-medium">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Annual Salary</th>
                  <th className="px-6 py-4">Start Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map(emp => (
                  <tr key={emp.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${getAvatarColor(emp.name)}`}>
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{emp.name}</p>
                          <p className="text-xs text-slate-400">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="text-sm text-slate-700 font-medium">{emp.role}</span></td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${deptColors[emp.department] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {emp.department}
                      </span>
                    </td>
                    <td className="px-6 py-4"><span className="text-sm font-bold text-slate-900">{formatCurrency(emp.salary)}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-300" />
                        {emp.startDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${emp.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(emp)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(emp.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Employee Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-spring-up">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                {editingId ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" required /></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Job Role</label><input type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Department</label><select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white">{DEPARTMENTS.map(d => <option key={d}>{d}</option>)}</select></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label><select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white"><option>Active</option><option>On Leave</option><option>Inactive</option></select></div>
              </div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Annual Salary ($)</label><input type="number" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" required /></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Start Date</label><input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" /></div>
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm active:scale-[0.98]">{editingId ? 'Save Changes' : 'Add Employee'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
