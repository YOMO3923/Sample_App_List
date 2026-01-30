import { useState } from 'react';

interface TaskAddFormProps {
  onAdd: (name: string) => void;
}

export function TaskAddForm({ onAdd }: TaskAddFormProps) {
  const [newTaskName, setNewTaskName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newTaskName.trim();
    if (name) {
      onAdd(name);
      setNewTaskName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        value={newTaskName}
        onChange={(e) => setNewTaskName(e.target.value)}
        placeholder="新しい項目を追加"
        className="w-full px-4 py-3 bg-white border border-gray-300 rounded text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base mb-3"
        aria-label="新しいタスク名"
      />
      <button
        type="submit"
        className="w-full py-3 bg-blue-800 text-white rounded hover:bg-blue-900 transition font-medium text-base shadow"
      >
        追加
      </button>
    </form>
  );
}
