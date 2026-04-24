import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Projects from '../../components/Projects';
import { api } from '../../api/endpoints';
import React from 'react';

// Mock the API endpoints
vi.mock('../../api/endpoints', () => ({
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
    {
      id: 1, name: 'Web App', description: 'React build', status: 'in_progress', progress: 40, end_date: '2024-12-31',
      tasks: [
        { id: 101, title: 'Fix Layout', description: 'Fix the layout bug', status: 'To Do', priority: 'High', due_date: '2024-01-10' },
        { id: 102, title: 'Write Tests', description: 'Add unit tests', status: 'In Progress', priority: 'Medium', due_date: '2024-01-15' },
        { id: 103, title: 'Code Review', description: 'Review PR', status: 'Review', priority: 'Low', due_date: '2024-01-20' },
        { id: 104, title: 'Deploy v1', description: 'Deploy to prod', status: 'Done', priority: 'High', due_date: '2024-01-25' },
      ]
    },
    {
      id: 2, name: 'Mobile App', description: 'Flutter project', status: 'planning', progress: 10, end_date: '2024-06-30',
      tasks: []
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    api.projects.list.mockResolvedValue(mockProjects);
    vi.stubGlobal('confirm', vi.fn(() => true));
    vi.stubGlobal('alert', vi.fn());
  });

  it('renders loading state then projects grid', async () => {
    render(<Projects />);
    expect(screen.getByText(/Synchronizing Project Workspace/i)).toBeDefined();
    await waitFor(() => expect(screen.queryByText(/Synchronizing Project Workspace/i)).toBeNull());
    expect(screen.getByText('Web App')).toBeDefined();
    expect(screen.getByText('Mobile App')).toBeDefined();
  });

  it('shows KPI stats correctly', async () => {
    render(<Projects />);
    await waitFor(() => expect(screen.getByText('Web App')).toBeDefined());
    // Total Projects = 2
    expect(screen.getByText('2')).toBeDefined();
    // In Progress = 1
    expect(screen.getByText('In Progress')).toBeDefined();
  });

  it('filters projects by search term', async () => {
    render(<Projects />);
    await waitFor(() => expect(screen.getByText('Web App')).toBeDefined());

    const searchInput = screen.getByPlaceholderText(/Search projects/i);
    fireEvent.change(searchInput, { target: { value: 'Mobile' } });

    expect(screen.queryByText('Web App')).toBeNull();
    expect(screen.getByText('Mobile App')).toBeDefined();
  });

  it('opens project and shows kanban board with all stages', async () => {
    render(<Projects />);
    await waitFor(() => expect(screen.getByText('Web App')).toBeDefined());

    fireEvent.click(screen.getByText('Web App'));

    // All stages should be visible
    expect(screen.getByText('To Do')).toBeDefined();
    expect(screen.getByText('In Progress')).toBeDefined();
    expect(screen.getByText('Review')).toBeDefined();
    expect(screen.getByText('Done')).toBeDefined();

    // Tasks should be visible
    expect(screen.getByText('Fix Layout')).toBeDefined();
    expect(screen.getByText('Write Tests')).toBeDefined();
    expect(screen.getByText('Code Review')).toBeDefined();
    expect(screen.getByText('Deploy v1')).toBeDefined();
  });

  it('navigates back from kanban to projects grid', async () => {
    render(<Projects />);
    await waitFor(() => expect(screen.getByText('Web App')).toBeDefined());

    fireEvent.click(screen.getByText('Web App'));
    expect(screen.getByText('Fix Layout')).toBeDefined();

    // Click the back arrow button
    const backBtns = screen.getAllByRole('button');
    const backBtn = backBtns.find(b => b.querySelector('.lucide-arrow-left'));
    if (backBtn) fireEvent.click(backBtn);

    await waitFor(() => expect(screen.getByText('Project Management')).toBeDefined());
  });

  it('opens and submits create project modal', async () => {
    api.projects.create.mockResolvedValue({ id: 3, name: 'New Project', description: 'Test', status: 'planning', progress: 0, tasks: [] });

    render(<Projects />);
    await waitFor(() => expect(screen.getAllByText(/New Project/i).length).toBeGreaterThan(0));

    const headerBtns = screen.getAllByRole('button', { name: /New Project/i });
    fireEvent.click(headerBtns[0]);

    fireEvent.change(screen.getByLabelText(/Project Name/i), { target: { value: 'New Project' } });

    const submitBtns = screen.getAllByRole('button', { name: /Create Project/i });
    fireEvent.click(submitBtns[submitBtns.length - 1]);

    await waitFor(() => {
      expect(api.projects.create).toHaveBeenCalled();
    });
  });

  it('opens edit project modal and saves', async () => {
    api.projects.update.mockResolvedValue({ ...mockProjects[0], name: 'Updated App' });

    render(<Projects />);
    await waitFor(() => expect(screen.getByText('Web App')).toBeDefined());

    // Find and click the Edit button - it's a small button with hover:text-blue-600 class
    const allBtns = screen.getAllByRole('button');
    const editBtns = allBtns.filter(b => b.className.includes('hover:text-blue-600') && b.className.includes('p-1.5'));
    fireEvent.click(editBtns[0]);

    // Modal should show "Edit Project"
    expect(screen.getByText('Edit Project')).toBeDefined();

    fireEvent.change(screen.getByLabelText(/Project Name/i), { target: { value: 'Updated App' } });

    const saveBtns = screen.getAllByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveBtns[saveBtns.length - 1]);

    await waitFor(() => {
      expect(api.projects.update).toHaveBeenCalledWith(1, expect.objectContaining({ name: 'Updated App' }));
    });
  });

  it('deletes a project', async () => {
    api.projects.delete.mockResolvedValue(true);

    render(<Projects />);
    await waitFor(() => expect(screen.getByText('Web App')).toBeDefined());

    const allBtns = screen.getAllByRole('button');
    const deleteBtns = allBtns.filter(b => b.className.includes('hover:text-red-600') && b.className.includes('p-1.5'));
    fireEvent.click(deleteBtns[0]);

    await waitFor(() => {
      expect(api.projects.delete).toHaveBeenCalledWith(1);
    });
  });

  it('adds a task to the project kanban', async () => {
    api.tasks.create.mockResolvedValue({ id: 105, title: 'New Task', status: 'To Do', priority: 'Low', due_date: '2024-02-01' });

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

  it('opens edit task modal by clicking a task card', async () => {
    api.tasks.update.mockResolvedValue({ id: 101, title: 'Updated Task', status: 'To Do', priority: 'High', due_date: '2024-01-10' });

    render(<Projects />);
    await waitFor(() => expect(screen.getByText('Web App')).toBeDefined());
    fireEvent.click(screen.getByText('Web App'));

    await waitFor(() => expect(screen.getByText('Fix Layout')).toBeDefined());

    // Click on a task card to open edit modal
    fireEvent.click(screen.getByText('Fix Layout'));

    expect(screen.getByText('Edit Task')).toBeDefined();

    fireEvent.change(screen.getByLabelText(/Task Title/i), { target: { value: 'Updated Task' } });
    const saveBtns = screen.getAllByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveBtns[saveBtns.length - 1]);

    await waitFor(() => {
      expect(api.tasks.update).toHaveBeenCalled();
    });
  });

  it('deletes a task from kanban board', async () => {
    api.tasks.delete.mockResolvedValue(true);

    render(<Projects />);
    await waitFor(() => expect(screen.getByText('Web App')).toBeDefined());
    fireEvent.click(screen.getByText('Web App'));

    await waitFor(() => expect(screen.getByText('Fix Layout')).toBeDefined());

    // Find and click the trash icon on a task card
    const allBtns = screen.getAllByRole('button');
    const trashBtns = allBtns.filter(b => b.className.includes('hover:text-red-500'));
    if (trashBtns.length > 0) {
      fireEvent.click(trashBtns[0]);
    }

    await waitFor(() => {
      expect(api.tasks.delete).toHaveBeenCalled();
    });
  });

  it('handles API error on load', async () => {
    api.projects.list.mockRejectedValue(new Error('Network error'));

    render(<Projects />);
    await waitFor(() => expect(screen.getByText(/Failed to sync project dashboard/i)).toBeDefined());
  });

  it('handles project save error', async () => {
    api.projects.create.mockRejectedValue(new Error('Server error'));

    render(<Projects />);
    await waitFor(() => expect(screen.getAllByText(/New Project/i).length).toBeGreaterThan(0));

    const headerBtns = screen.getAllByRole('button', { name: /New Project/i });
    fireEvent.click(headerBtns[0]);

    fireEvent.change(screen.getByLabelText(/Project Name/i), { target: { value: 'Fail Project' } });
    const submitBtns = screen.getAllByRole('button', { name: /Create Project/i });
    fireEvent.click(submitBtns[submitBtns.length - 1]);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Failed to save project.');
    });
  });
});
