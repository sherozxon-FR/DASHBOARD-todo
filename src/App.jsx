import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { dashboardRoutes } from './routes/dashboardRoutes'  // kichik r

const router = createBrowserRouter([dashboardRoutes])

export default function App() {
  return <RouterProvider router={router} />
}