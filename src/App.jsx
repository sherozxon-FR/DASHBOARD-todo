import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { dashboardRoutes } from './routes/dashboardroutes'  // kichik r

const router = createBrowserRouter([dashboardRoutes])

export default function App() {
  return <RouterProvider router={router} />
}