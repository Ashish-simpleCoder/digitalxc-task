// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import './index.css'
import App from './App.tsx'

export const ApiQueryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
   // <StrictMode>   //disabled due to drag-drop does not work in developement
   <QueryClientProvider client={ApiQueryClient}>
      <App />
   </QueryClientProvider>
   // </StrictMode>
)
