import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { dashboardRoutes } from './Routes/dashboardRoutes'

const router = createBrowserRouter([dashboardRoutes])

export default function App() {
  return <RouterProvider router={router} />
}