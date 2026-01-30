import { useState, useEffect, useRef } from 'react';

interface Task {
  id: number;
  name: string;
  completed: boolean;
  completedAt?: string | null;
}

interface NightRoutineAppProps {
  onBack: () => void;
}

export function NightRoutineApp({ onBack }: NightRoutineAppProps) {
  const STORAGE_KEY = 'nightRoutineApp.tasks';

  const defaultTasks: Task[] = [
    { id: 1, name: '鍵の施錠', completed: false, completedAt: null },
    { id: 2, name: '歯磨き', completed: false, completedAt: null },
    { id: 3, name: '水分補給', completed: false, completedAt: null },
    { id: 4, name: '明日の服の準備', completed: false, completedAt: null },
  ];

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Task[];
        return parsed.map(p => ({
          id: p.id,
          name: p.name,
          completed: !!p.completed,
          completedAt: p.completedAt ?? null,
        }));
      }
    } catch (e) {
      // ignore parse errors and fall back to defaults
    }
    return defaultTasks;
  });

  const [newTaskName, setNewTaskName] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ visible: boolean; taskId: number | null }>({
    visible: false,
    taskId: null,
  });
  const dialogRef = useRef<HTMLDialogElement>(null);

  // persist to localStorage whenever tasks change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      // ignore quota errors
    }
  }, [tasks]);

  // manage dialog modal
  useEffect(() => {
    if (deleteModal.visible && deleteModal.taskId !== null) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [deleteModal.visible, deleteModal.taskId]);

  const toggleTask = (id: number) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id !== id) return task;
        if (!task.completed) {
          // mark completed and set timestamp
          return { ...task, completed: true, completedAt: new Date().toISOString() };
        }
        // unmark and clear timestamp
        return { ...task, completed: false, completedAt: null };
      })
    );
  };

  const addTask = () => {
    const name = newTaskName.trim();
    if (!name) return;
    setTasks(prev => {
      const nextId = prev.length ? Math.max(...prev.map(t => t.id)) + 1 : 1;
      return [...prev, { id: nextId, name, completed: false, completedAt: null }];
    });
    setNewTaskName('');
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    dialogRef.current?.close();
    setDeleteModal({ visible: false, taskId: null });
  };

  const closeDeleteModal = () => {
    dialogRef.current?.close();
    setDeleteModal({ visible: false, taskId: null });
  };

  const clearAllTasks = () => {
    setTasks(prev =>
      prev.map(task => ({
        ...task,
        completed: false,
        completedAt: null,
      }))
    );
  };

  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
        {/* ヘッダー - グラスモーフィズム */}
        <div className="sticky top-0 z-10 backdrop-blur-md bg-white/5 border-b border-white/10">
          <div className="max-w-2xl mx-auto px-6 py-6 flex items-center justify-between">
            <button
              onClick={onBack}
              className="text-white/80 hover:text-white hover:bg-white/10 transition-all text-3xl font-bold rounded-xl p-2"
            >
              ←
            </button>
            <h1 className="text-3xl font-bold text-white tracking-tight">🌜 ナイトルーティン</h1>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {/* メインカード - グラスモーフィズム */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
              {/* 説明文 + 進捗 */}
              <p className="text-center text-white/70 mb-6 text-lg font-light">毎日のタスク実行を記録</p>
              <div className="mb-8 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-white/60">進捗</span>
                  <span className="text-sm font-bold text-indigo-400">{completedCount} / {tasks.length}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-400 to-indigo-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${tasks.length ? (completedCount / tasks.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* タスクリスト */}
              <div className="space-y-4 max-h-96 overflow-y-auto mb-6 scrollbar-hide">
                {tasks.map(task => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-4 p-5 rounded-2xl transition-all backdrop-blur-sm ${
                      task.completed
                        ? 'bg-indigo-500/20 border border-indigo-400/50'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-6 h-6 rounded-lg accent-indigo-400 cursor-pointer flex-shrink-0"
                    />
                    <div className="flex-1 flex flex-col min-w-0">
                      <span
                        className={`font-medium transition-all ${
                          task.completed ? 'text-white/40 line-through' : 'text-white font-semibold'
                        }`}
                      >
                        {task.name}
                      </span>
                      {task.completed && task.completedAt && (
                        <span className="text-xs text-indigo-300 mt-2 font-light">
                          ✓ {new Date(task.completedAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setDeleteModal({ visible: true, taskId: task.id })}
                      className="text-white/40 hover:text-red-400 transition-colors text-lg font-bold p-1 flex-shrink-0"
                      title="削除"
                    >
                      ✕
                    </button>
                    {task.completed && (
                      <span className="text-lg text-indigo-400 flex-shrink-0">✓</span>
                    )}
                  </div>
                ))}
              </div>

              {/* 完了メッセージ */}
              {tasks.length > 0 && completedCount === tasks.length && (
                <div className="mb-6 p-5 bg-indigo-500/20 border border-indigo-400/50 rounded-2xl">
                  <p className="text-indigo-200 font-semibold text-center">
                    🎉 すべてのタスク完了！おやすみなさい
                  </p>
                </div>
              )}

              {/* タスク追加フォーム */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addTask();
                }}
                className="flex items-center gap-3 pt-6 border-t border-white/10"
              >
                <input
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="新しいタスクを追加..."
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/15 transition-all text-sm"
                  aria-label="新しいタスク名"
                />
                <button
                  type="submit"
                  onClick={addTask}
                  className="px-5 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all font-semibold text-sm shadow-lg"
                >
                  追加
                </button>
              </form>
              <div className="pt-4 mt-4 border-t border-white/6">
                <button
                  onClick={clearAllTasks}
                  className="w-full px-4 py-3 bg-white/5 text-white/80 rounded-xl hover:bg-white/10 transition-all text-sm font-semibold"
                  title="すべてのチェックをオフ"
                >
                  すべてのチェックをオフ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 削除確認モーダル - dialog要素を使用 */}
      <dialog
        ref={dialogRef}
        className="rounded-3xl shadow-2xl p-0 backdrop:bg-black/50 backdrop:backdrop-blur-lg max-w-sm w-full"
        onCancel={() => closeDeleteModal()}
      >
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-3">タスクを削除</h2>
          <p className="text-white/60 mb-8 text-sm font-light">
            この操作は取り消せません。
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => closeDeleteModal()}
              className="px-5 py-2.5 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all font-medium text-sm"
            >
              キャンセル
            </button>
            <button
              onClick={() => deleteTask(deleteModal.taskId!)}
              className="px-5 py-2.5 bg-red-500/80 hover:bg-red-600 text-white rounded-xl transition-all font-medium text-sm shadow-lg"
            >
              削除
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
