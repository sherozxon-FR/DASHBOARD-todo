import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

import styles from './mainlayout.module.css'

export default function MainLayout() {
  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}