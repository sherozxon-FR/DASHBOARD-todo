import { NavLink } from 'react-router-dom'
import styles from './Sidebar.module.css'

function Sidebar() {
    return (
        <div className={styles.sidebarContainer}>
            <div className={styles.logoTxt}>
                <h1>Dashboard 🎉</h1>
            </div>

            <nav className={styles.pagesContainer}>
                <ul>
                    <NavLink to='/'>Dashboard</NavLink>
                    <NavLink to='/vazifalar'>Vazifalar</NavLink>
                    <NavLink to='/kalendar'>Kalendar</NavLink>
                </ul>

                <div className={styles.categoryContainer}>
                    <h2>Category</h2>
                    <ul>
                        <NavLink to='/categories/ish'>Ish</NavLink>
                        <NavLink to='/categories/uqish'>O'qish</NavLink>
                        <NavLink to='/categories/shaxsiy'>Shaxsiy</NavLink>
                        <NavLink to='/categories/loyha'>Loyha</NavLink>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Sidebar