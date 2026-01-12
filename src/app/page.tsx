export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">FluxFinance</h1>
            <div className="text-sm text-gray-500">
              最終更新: {new Date().toLocaleString('ja-JP')}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            株価監視ダッシュボード
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            GRRR、S&P500、日経平均、USD/JPYの価格情報をリアルタイムで監視
          </p>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500">
              プロジェクトセットアップが完了しました。
              <br />
              次のタスクでAPI Routesとデータ統合を実装します。
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
