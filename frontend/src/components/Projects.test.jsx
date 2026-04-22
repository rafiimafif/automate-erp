import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Projects from './Projects';
import { api } from '../api/endpoints';
import React from 'react';

// Mock the API endpoints
vi.mock('../api/endpoints', () => ({
  api: {
    projects: {
      list: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    },
    tasks: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
  }
}));

describe('Projects Component', () => {
  const mockProjects = [
    { id: 1, name: 'Web App', description: 'React build', status: 'in_progress', progress: 40, end_date: '2024-12-31', tasks: [
      { id: 101, title: 'Fix Layout', status: 'To Do', priority: 'High', due_date: '2024-01-10' }
    ]}
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    api.projects.list.mockResolvedValue(mockProjects);
    vi.stubGlobal('confirm', vi.fn(() => true));
  });

  it('renders projects grid', async () => {
    render(<Projects />);
    expect(screen.getByText(/Synchronizing Project Workspace/i)).toBeDefined();
    await waitFor(() => expect(screen.queryByText(/Synchronizing Project Workspace/i)).toBeNull());
    expect(screen.getByText('Web App')).toBeDefined();
  });

  it('opens project and shows kanban board', async () => {
    render(<Projects />);
    await waitFor(() => expect(screen.getByText('Web App')).toBeDefined());
    
    fireEvent.click(screen.getByText('Web App'));
    
    expect(screen.getByText('Fix Layout')).toBeDefined();
  });

  it('opens and submits create project modal', async () => {
    api.projects.create.mockResolvedValue({ id: 2, name: 'New Project', description: 'Test', status: 'planning', progress: 0 });
    
    render(<Projects />);
    await waitFor(() => expect(screen.getAllByText(/New Project/i).length).toBeGreaterThan(0));
    
    // Pick the "New Project" button in the header
    const headerBtns = screen.getAllByRole('button', { name: /New Project/i });
    fireEvent.click(headerBtns[0]);
    
    fireEvent.change(screen.getByLabelText(/Project Name/i), { target: { value: 'New Project' } });
    
    const submitBtns = screen.getAllByRole('button', { name: /Create Project/i });
    fireEvent.click(submitBtns[submitBtns.length - 1]);
    
    await waitFor(() => {
      expect(api.projects.create).toHaveBeenCalled();
    });
  });

  it('adds a task to the project', async () => {
    api.tasks.create.mockResolvedValue({ id: 102, title: 'New Task', status: 'To Do', priority: 'Low' });
    
    render(<Projects />);
    await waitFor(() => expect(screen.getByText('Web App')).toBeDefined());
    fireEvent.click(screen.getByText('Web App'));
    
    await waitFor(() => expect(screen.getByText('Add Task')).toBeDefined());
    
    const addBtns = screen.getAllByRole('button', { name: /Add Task/i });
    fireEvent.click(addBtns[0]);
    
    fireEvent.change(screen.getByLabelText(/Task Title/i), { target: { value: 'New Task' } });
    
    const submitBtns = screen.getAllByRole('button', { name: /Add Task/i });
    fireEvent.click(submitBtns[submitBtns.length - 1]);
    
    await waitFor(() => {
      expect(api.tasks.create).toHaveBeenCalled();
    });
  });
});
