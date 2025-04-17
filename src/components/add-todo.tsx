'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AddTodo() {
  const [text, setText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      setText('');
      window.dispatchEvent(new Event('todos-updated')); // Trigger reload in TodoList
    }
  };

  return (
    <div className="flex gap-2 mb-4">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new todo"
        className="flex-1"
      />
      <Button onClick={handleSubmit}>Add Todo</Button>
    </div>
  );
}
