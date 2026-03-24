import { lazy, Suspense } from 'react'
import MainLayout from '../Layouts/MainLayout'

const Dashboard = lazy(() => import('../pages/Dashboard'))
const Vazifalar = lazy(() => import('../pages/Vazifalar'))
const Kalendar = lazy(() => import('../pages/CalendarApp'))

const Ish = lazy(() => import('../pages/categories/Ish'))
const Uqish = lazy(() => import('../pages/categories/uqish'))
const Shaxsiy = lazy(() => import('../pages/categories/Shaxsiy'))
const Loyha = lazy(() => import('../pages/categories/loyha'))

export const dashboardRoutes = {
    path: '/',
    element: (
        <Suspense fallback={<div>Yuklanmoqda...</div>}>
            <MainLayout />
        </Suspense>
    ),
    children: [
        { index: true, element: <Dashboard /> },
        { path: 'vazifalar', element: <Vazifalar /> },
        { path: 'kalendar', element: <Kalendar /> },
        { path: 'categories/ish', element: <Ish /> },
        { path: 'categories/uqish', element: <Uqish /> },
        { path: 'categories/shaxsiy', element: <Shaxsiy /> },
        { path: 'categories/loyha', element: <Loyha /> },
    ]
}