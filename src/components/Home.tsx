interface App {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface HomeProps {
  onSelectApp: (appId: string) => void;
}

export function Home({ onSelectApp }: HomeProps) {
  const apps: App[] = [
    {
      id: 'night-routine',
      title: '🌜 ナイトルーティン',
      description: '夜のタスク記録',
      icon: '🌜',
      color: 'bg-slate-700',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            アプリコレクション
          </h1>
          <p className="text-slate-600">
            毎日のタスク管理をシンプルに
          </p>
        </div>

        {/* アプリグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {apps.map(app => (
            <div
              key={app.id}
              onClick={() => onSelectApp(app.id)}
              className="group cursor-pointer"
            >
              <div
                className={`${app.color} rounded-xl shadow p-8 text-white h-full flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
              >
                <div className="text-6xl mb-4 transform transition-transform duration-300 group-hover:scale-110">
                  {app.icon}
                </div>
                <h2 className="text-xl font-bold mb-2">
                  {app.title}
                </h2>
                <p className="text-sm opacity-90 mb-4">
                  {app.description}
                </p>
                <div className="mt-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  ▶ 開く
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* フッター */}
        <div className="mt-12 text-center text-slate-500">
          <p className="text-xs">
            v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
