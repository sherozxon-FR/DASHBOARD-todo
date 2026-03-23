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

const checkMobile = () => window.innerWidth <= 768
const checkCollapsed = () => window.innerWidth <= 1200

export default function MainLayout() {
  const [isMobile, setIsMobile] = useState(checkMobile)
  const [open, setOpen] = useState(!checkCollapsed())
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const mobile = checkMobile()
      setIsMobile(mobile)
      if (mobile) {
        setOpen(false)
        setMobileOpen(false)
      } else {
        setOpen(!checkCollapsed())
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const closeMobile = () => setMobileOpen(false)

  const SidebarContent = ({ mobile = false }) => (
    <>
      <div className={styles.logoRow}>
        {(open || mobile) && (
          <span className={styles.logoText}>Dashboard</span>
        )}
        {mobile ? (
          <button className={styles.toggleBtn} onClick={closeMobile}>
            <MdClose />
          </button>
        ) : (
          <button className={styles.toggleBtn} onClick={() => setOpen(p => !p)}>
            {open ? <FaAngleLeft /> : <FaAngleRight />}
          </button>
        )}
      </div>

      <nav className={styles.nav}>
        <ul>
          {navLinks.map(({ to, label, icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end
                onClick={mobile ? closeMobile : undefined}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`
                }
              >
                <span className={styles.icon}>{icon}</span>
                {(open || mobile) && (
                  <span className={styles.label}>{label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className={styles.section}>
          {(open || mobile) && (
            <p className={styles.sectionTitle}>Category</p>
          )}
          <ul>
            {categoryLinks.map(({ to, label, icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={mobile ? closeMobile : undefined}
                  className={({ isActive }) =>
                    `${styles.link} ${isActive ? styles.active : ''}`
                  }
                >
                  <span className={styles.icon}>{icon}</span>
                  {(open || mobile) && (
                    <span className={styles.label}>{label}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  )

  return (
    <div className={styles.wrapper}>

      {/* Desktop sidebar */}
      {!isMobile && (
        <aside className={`${styles.sidebar} ${!open ? styles.closed : ''}`}>
          <SidebarContent mobile={false} />
        </aside>
      )}

      {/* Mobile hamburger */}
      {isMobile && !mobileOpen && (
        <button className={styles.hamburger} onClick={() => setMobileOpen(true)}>
          <MdMenu />
        </button>
      )}

      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div className={styles.overlay} onClick={closeMobile} />
      )}

      {/* Mobile sidebar */}
      {isMobile && (
        <aside className={`${styles.mobileSidebar} ${mobileOpen ? styles.mobileOpen : ''}`}>
          <SidebarContent mobile={true} />
        </aside>
      )}

      {/* Main */}
      <main className={`
        ${styles.main}
        ${!isMobile && !open ? styles.mainClosed : ''}
        ${isMobile ? styles.mainMobile : ''}
      `}>
        <Outlet />
      </main>

    </div>
  )
}