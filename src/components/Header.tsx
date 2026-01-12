interface HeaderProps {
  lastUpdate?: Date | null;
}

function formatLastUpdate(date: Date | null | undefined): string {
  if (!date) return "取得中...";
  return date.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function Header({ lastUpdate }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            FluxFinance
          </h1>
          <time
            className="text-xs sm:text-sm text-gray-500"
            dateTime={lastUpdate?.toISOString()}
          >
            最終更新: {formatLastUpdate(lastUpdate)}
          </time>
        </div>
      </div>
    </header>
  );
}
