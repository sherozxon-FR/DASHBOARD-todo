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

// 425px va undan kichik barcha o'lchamlar MOBILE deb hisoblanadi
const checkMobile = () => window.innerWidth <= 425
const checkCollapsed = () => window.innerWidth <= 1200

export default function MainLayout() {
  const [isMobile, setIsMobile] = useState(checkMobile())
  const [open, setOpen] = useState(!checkCollapsed())
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const mobile = checkMobile()
      setIsMobile(mobile)

      if (mobile) {
        // Mobil rejimda desktop sidebar render bo'lmasligi kerak
        setOpen(true)
      } else {
        setOpen(!checkCollapsed())
        setMobileOpen(false)
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

      {/* 1. DESKTOP SIDEBAR - Faqat mobil bo'lmaganda render bo'ladi */}
      {!isMobile && (
        <aside className={`${styles.sidebar} ${!open ? styles.closed : ''}`}>
          <SidebarContent mobile={false} />
        </aside>
      )}

      {/* 2. HAMBURGER ICON - Faqat mobil rejimda ko'rinadi */}
      {isMobile && (
        <button className={styles.hamburger} onClick={() => setMobileOpen(true)}>
          <MdMenu />
        </button>
      )}

      {/* 3. MOBILE OVERLAY */}
      {isMobile && mobileOpen && (
        <div className={styles.overlay} onClick={closeMobile} />
      )}

      {/* 4. MOBILE SIDEBAR (DRAWER) */}
      <aside className={`${styles.mobileSidebar} ${mobileOpen ? styles.mobileOpen : ''}`}>
        <SidebarContent mobile={true} />
      </aside>

      {/* 5. MAIN CONTENT */}
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