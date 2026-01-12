# Next.js & React コーディングガイドライン 2026 年版

## 概要

このガイドラインは、2026 年最新版の Next.js 16+と React 19+を使用した開発における標準的なプラクティスを定義します。

## 技術スタック

### 必須技術

- **Next.js**: 16.0+ (App Router 必須)
- **React**: 19.0+ (Server Components、Concurrent Features 対応)
- **TypeScript**: 5.6+
- **Node.js**: 22.0+ (LTS 推奨)

### 推奨ライブラリ

- **スタイリング**: Tailwind CSS 4.0+
- **フォーム**: React Hook Form 7.0+ + Zod
- **UI コンポーネント**: Radix UI + shadcn/ui
- **データフェッチング**: TanStack Query v5 (クライアント側)
- **テスト**: Vitest + Testing Library
- **リンター**: Biome

## プロジェクト構造

```
src/
├── app/                    # App Router (Next.js 16+)
│   ├── (auth)/            # Route Groups
│   ├── api/               # API Routes
│   ├── globals.css        # グローバルスタイル
│   ├── layout.tsx         # ルートレイアウト
│   └── page.tsx           # ホームページ
├── components/            # 再利用可能コンポーネント
│   ├── ui/               # 基本UIコンポーネント
│   └── features/         # 機能別コンポーネント
├── lib/                  # ユーティリティ・設定
│   ├── utils.ts          # 汎用ユーティリティ
│   ├── validations.ts    # Zodスキーマ
│   └── db.ts            # データベース設定
├── hooks/               # カスタムフック
├── types/               # TypeScript型定義
└── constants/           # 定数
```

## コーディング規約

### 1. ファイル命名規則

```typescript
// コンポーネント: PascalCase
UserProfile.tsx;
LoginForm.tsx;

// フック: camelCase with use prefix
useUserData.ts;
useLocalStorage.ts;

// ユーティリティ: camelCase
formatDate.ts;
apiClient.ts;

// 型定義: PascalCase with Type suffix
UserType.ts;
ApiResponseType.ts;
```

### 2. コンポーネント定義

```typescript
// ✅ 推奨: Server Component (デフォルト)
interface UserProfileProps {
  userId: string;
}

export default async function UserProfile({ userId }: UserProfileProps) {
  const user = await fetchUser(userId);

  return (
    <div className="p-4">
      <h1>{user.name}</h1>
    </div>
  );
}

// ✅ 推奨: Client Component (必要な場合のみ)
("use client");

import { useState } from "react";

interface InteractiveButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export function InteractiveButton({
  onClick,
  children,
}: InteractiveButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      {children}
    </button>
  );
}
```

### 3. App Router パターン

```typescript
// app/dashboard/page.tsx - Server Component
export default async function DashboardPage() {
  const data = await fetchDashboardData();

  return (
    <div>
      <DashboardHeader />
      <DashboardContent data={data} />
    </div>
  );
}

// app/dashboard/loading.tsx - ローディングUI
export default function Loading() {
  return <div className="animate-pulse">Loading...</div>;
}

// app/dashboard/error.tsx - エラーUI
("use client");

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="text-center p-4">
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### 4. データフェッチング

```typescript
// ✅ Server Component でのデータフェッチング
async function fetchUser(id: string) {
  const res = await fetch(`${process.env.API_URL}/users/${id}`, {
    next: { revalidate: 3600 }, // 1時間キャッシュ
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return res.json();
}

// ✅ Client Component でのデータフェッチング (TanStack Query)
("use client");

import { useQuery } from "@tanstack/react-query";

export function UserProfile({ userId }: { userId: string }) {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{user?.name}</div>;
}
```

### 5. フォーム処理

```typescript
// ✅ React Hook Form + Zod
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  age: z.number().min(18, "Must be 18 or older"),
});

type UserFormData = z.infer<typeof userSchema>;

export function UserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      await createUser(data);
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          {...register("name")}
          placeholder="Name"
          className="w-full p-2 border rounded"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {isSubmitting ? "Creating..." : "Create User"}
      </button>
    </form>
  );
}
```

### 6. スタイリング (Tailwind CSS)

```typescript
// ✅ コンポーネント内でのクラス定義
import { cn } from "@/lib/utils";

interface ButtonProps {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "font-medium rounded-lg transition-colors",
        {
          "bg-blue-500 hover:bg-blue-600 text-white": variant === "primary",
          "bg-gray-200 hover:bg-gray-300 text-gray-900":
            variant === "secondary",
          "bg-red-500 hover:bg-red-600 text-white": variant === "danger",
        },
        {
          "px-2 py-1 text-sm": size === "sm",
          "px-4 py-2": size === "md",
          "px-6 py-3 text-lg": size === "lg",
        }
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

### 7. API Routes

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createUserSchema.parse(body);

    const user = await createUser(validatedData);

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "10");

  const users = await getUsers({ page, limit });

  return NextResponse.json(users);
}
```

## パフォーマンス最適化

### 1. 画像最適化

```typescript
import Image from "next/image";

// ✅ Next.js Image コンポーネント使用
export function UserAvatar({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={40}
      height={40}
      className="rounded-full"
      priority={false} // Above the fold でない場合
    />
  );
}
```

### 2. 動的インポート

```typescript
// ✅ 重いコンポーネントの遅延読み込み
import dynamic from "next/dynamic";

const HeavyChart = dynamic(() => import("./HeavyChart"), {
  loading: () => <div>Loading chart...</div>,
  ssr: false, // クライアントサイドのみ
});

export function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <HeavyChart />
    </div>
  );
}
```

### 3. メモ化

```typescript
// ✅ React.memo for component memoization
import { memo } from "react";

interface ExpensiveComponentProps {
  data: ComplexData[];
  onUpdate: (id: string) => void;
}

export const ExpensiveComponent = memo(function ExpensiveComponent({
  data,
  onUpdate,
}: ExpensiveComponentProps) {
  return (
    <div>
      {data.map((item) => (
        <ComplexItem key={item.id} item={item} onUpdate={onUpdate} />
      ))}
    </div>
  );
});

// ✅ useMemo for expensive calculations
import { useMemo } from "react";

export function DataVisualization({ rawData }: { rawData: RawData[] }) {
  const processedData = useMemo(() => {
    return rawData
      .filter((item) => item.isValid)
      .map((item) => processComplexCalculation(item))
      .sort((a, b) => b.score - a.score);
  }, [rawData]);

  return <Chart data={processedData} />;
}
```

## テスト戦略

### 1. コンポーネントテスト

```typescript
// __tests__/UserProfile.test.tsx
import { render, screen } from "@testing-library/react";
import { UserProfile } from "@/components/UserProfile";

describe("UserProfile", () => {
  it("displays user information correctly", () => {
    const mockUser = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
    };

    render(<UserProfile user={mockUser} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("shows loading state when user is undefined", () => {
    render(<UserProfile user={undefined} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
```

### 2. API テスト

```typescript
// __tests__/api/users.test.ts
import { POST } from "@/app/api/users/route";
import { NextRequest } from "next/server";

describe("/api/users", () => {
  it("creates a user successfully", async () => {
    const request = new NextRequest("http://localhost:3000/api/users", {
      method: "POST",
      body: JSON.stringify({
        name: "John Doe",
        email: "john@example.com",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toHaveProperty("id");
    expect(data.name).toBe("John Doe");
  });
});
```

## セキュリティ

### 1. 環境変数

```typescript
// ✅ 環境変数の型安全な管理
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

### 2. 認証・認可

```typescript
// ✅ Server Action での認証チェック
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function updateUser(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // ユーザー更新処理
}

// ✅ Middleware での認証
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token");

  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
```

## エラーハンドリング

```typescript
// ✅ グローバルエラーハンドリング
// app/global-error.tsx
"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
            <button
              onClick={reset}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

// ✅ カスタムエラークラス
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}
```

## 開発ツール設定

### Biome 設定 (biome.json)

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": false,
    "ignore": ["node_modules/**", ".next/**", "dist/**", "build/**"]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80
  },
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "style": {
        "noVar": "error",
        "useConst": "error"
      },
      "suspicious": {
        "noExplicitAny": "warn"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "es5",
      "semicolons": "always"
    }
  },
  "typescript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "es5",
      "semicolons": "always"
    }
  }
}
```

### TypeScript 設定 (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## まとめ

このガイドラインに従うことで、2026 年最新版の Next.js 16+と React 19+を使用した、保守性が高く、パフォーマンスに優れたアプリケーションを開発できます。

### 重要なポイント

1. **Server Components 優先**: デフォルトで Server Component を使用し、必要な場合のみ Client Component
2. **型安全性**: TypeScript + Zod で完全な型安全性を確保
3. **パフォーマンス**: 適切なメモ化と遅延読み込みで UX を向上
4. **テスト**: 単体テストとプロパティベーステストの両方を実装
5. **セキュリティ**: 認証・認可とデータ検証を徹底
6. **開発効率**: Biome による高速なリンティングとフォーマット

定期的にこのガイドラインを見直し、最新のベストプラクティスを反映させることを推奨します。
