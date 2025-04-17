'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Todo {
  id: number;
  text: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const fetchTodos = async () => {
    const response = await fetch('/api/todos');
    if (response.ok) {
      const data = await response.json();
      setTodos(data);
    }
  };

  useEffect(() => {
    fetchTodos();
    const handleTodosUpdated = () => fetchTodos();
    window.addEventListener('todos-updated', handleTodosUpdated);
    return () =>
      window.removeEventListener('todos-updated', handleTodosUpdated);
  }, []);

  const handleEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleSave = async (id: number) => {
    if (editText.trim()) {
      await fetch('/api/todos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, text: editText }),
      });
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, text: editText } : todo
        )
      );
      setEditingId(null);
      setEditText('');
      window.dispatchEvent(new Event('todos-updated'));
    }
  };

  const handleDelete = async (id: number) => {
    await fetch('/api/todos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setTodos(todos.filter((todo) => todo.id !== id));
    window.dispatchEvent(new Event('todos-updated'));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Task</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {todos.map((todo) => (
          <TableRow key={todo.id.toString()}>
            <TableCell>
              {editingId === todo.id ? (
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full"
                />
              ) : (
                todo.text
              )}
            </TableCell>
            <TableCell className="text-right">
              {editingId === todo.id ? (
                <Button onClick={() => handleSave(todo.id)} size="sm">
                  Save
                </Button>
              ) : (
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(todo)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(todo.id)}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
