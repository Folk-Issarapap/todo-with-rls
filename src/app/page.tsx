'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddTodo from '@/components/add-todo';
import TodoList from '@/components/todo-list';
import { authClient } from '@/lib/auth-client';

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/sign-in');
    }
  }, [session, isPending, router]);

  if (isPending) return <div>Loading...</div>;
  if (!session) return null;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Todo List</h1>
        <button
          onClick={() =>
            authClient.signOut({
              fetchOptions: { onSuccess: () => router.push('/sign-in') },
            })
          }
          className="text-sm text-red-600 hover:underline"
        >
          Sign Out
        </button>
      </div>
      <AddTodo />
      <TodoList />
    </div>
  );
}
