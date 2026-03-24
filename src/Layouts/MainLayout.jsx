import { useState, useEffect } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import {
  MdDashboard, MdTask, MdCalendarMonth,
  MdWork, MdSchool, MdPerson, MdFolderSpecial,
  MdMenu, MdClose
} from 'react-icons/md'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import styles from './mainlayout.module.css'

const navLinks = [
  { to: '/', label: 'Dashboard', icon: <MdDashboard /> },
  { to: '/vazifalar', label: 'Vazifalar', icon: <MdTask /> },
  { to: '/kalendar', label: 'Kalendar', icon: <MdCalendarMonth /> },
]

const categoryLinks = [
  { to: '/categories/ish', label: 'Ish', icon: <MdWork /> },
  { to: '/categories/uqish', label: "O'qish", icon: <MdSchool /> },
  { to: '/categories/shaxsiy', label: 'Shaxsiy', icon: <MdPerson /> },
  { to: '/categories/loyha', label: 'Loyha', icon: <MdFolderSpecial /> },
]

const MOBILE_BP = 768
const COLLAPSE_BP = 1200

const getMode = () => {
  if (window.innerWidth < MOBILE_BP) return 'mobile'
  if (window.innerWidth < COLLAPSE_BP) return 'icon'
  return 'full'
}

export default function MainLayout() {
  const [mode, setMode] = useState(getMode)          // 'full' | 'icon' | 'mobile'
  const [collapsed, setCollapsed] = useState(false)  // faqat 'full' mode uchun
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const onResize = () => {
      const m = getMode()
      setMode(m)
      if (m !== 'mobile') setDrawerOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Hozirgi sidebar holati
  const showLabels = mode === 'full' && !collapsed
  const sidebarWidth = mode === 'icon' ? 'icon' : collapsed ? 'icon' : 'full'

  const NavItems = ({ onClickLink }) => (
    <nav className={styles.nav}>
      <ul>
        {navLinks.map(({ to, label, icon }) => (
          <li key={to}>
            <NavLink
              to={to} end
              onClick={onClickLink}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''} ${sidebarWidth === 'icon' && mode !== 'mobile' ? styles.linkIcon : ''}`
              }
              title={sidebarWidth === 'icon' && mode !== 'mobile' ? label : undefined}
            >
              <span className={styles.icon}>{icon}</span>
              {(showLabels || mode === 'mobile') && <span className={styles.label}>{label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className={styles.section}>
        {(showLabels || mode === 'mobile') && (
          <p className={styles.sectionTitle}>Category</p>
        )}
        <ul>
          {categoryLinks.map(({ to, label, icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={onClickLink}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''} ${sidebarWidth === 'icon' && mode !== 'mobile' ? styles.linkIcon : ''}`
                }
                title={sidebarWidth === 'icon' && mode !== 'mobile' ? label : undefined}
              >
                <span className={styles.icon}>{icon}</span>
                {(showLabels || mode === 'mobile') && <span className={styles.label}>{label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )

  return (
    <div className={styles.wrapper}>

      {/* DESKTOP SIDEBAR — faqat tablet va kattaroq */}
      {mode !== 'mobile' && (
        <aside className={`${styles.sidebar} ${sidebarWidth === 'icon' ? styles.sidebarIcon : ''}`}>
          <div className={styles.logoRow}>
            {showLabels && <span className={styles.logoText}>Dashboard</span>}
            {mode === 'full' && (
              <button className={styles.toggleBtn} onClick={() => setCollapsed(p => !p)}>
                {collapsed ? <FaAngleRight /> : <FaAngleLeft />}
              </button>
            )}
          </div>
          <NavItems onClickLink={undefined} />
        </aside>
      )}

      {/* HAMBURGER — faqat mobile */}
      {mode === 'mobile' && (
        <button className={styles.hamburger} onClick={() => setDrawerOpen(true)}>
          <MdMenu />
        </button>
      )}

      {/* OVERLAY */}
      {mode === 'mobile' && drawerOpen && (
        <div className={styles.overlay} onClick={() => setDrawerOpen(false)} />
      )}

      {/* MOBILE DRAWER */}
      {mode === 'mobile' && (
        <aside className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ''}`}>
          <div className={styles.logoRow}>
            <span className={styles.logoText}>Dashboard</span>
            <button className={styles.toggleBtn} onClick={() => setDrawerOpen(false)}>
              <MdClose />
            </button>
          </div>
          <NavItems onClickLink={() => setDrawerOpen(false)} />
        </aside>
      )}

      {/* MAIN CONTENT */}
      <main className={`
        ${styles.main}
        ${mode === 'mobile' ? styles.mainMobile : ''}
        ${mode !== 'mobile' && sidebarWidth === 'icon' ? styles.mainIcon : ''}
        ${mode === 'full' && !collapsed ? styles.mainFull : ''}
      `}>
        <Outlet />
      </main>

    </div>
  )
}