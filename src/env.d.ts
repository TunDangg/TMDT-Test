/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_BASE_URL: string
  // Thêm các biến khác nếu bạn có khai báo trong file .env
  readonly VITE_BANK_ID: string
  readonly VITE_BANK_ACCOUNT_NO: string
  readonly VITE_BANK_ACCOUNT_NAME: string
  readonly VITE_VIETQR_TEMPLATE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
