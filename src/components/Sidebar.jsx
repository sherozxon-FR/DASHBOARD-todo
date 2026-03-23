import { NavLink } from 'react-router-dom'
import styles from './Sidebar.module.css'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa"


function Sidebar({ open, setOpen }) {

    return (
        <div className={`${styles.sidebarContainer} ${!open ? styles.closed : ''}`}>

            <div className={styles.logoTxt}>
                {open && <h1>Dashboard</h1>}
                <button onClick={() => setOpen(!open)} className={styles.toggleBtn}>
                    {open ? <FaAngleLeft /> : <FaAngleRight />}
                </button>
            </div>

            <nav className={styles.pagesContainer}>
                <ul>
                    <NavLink to='/'><span>Dashboard</span></NavLink>
                    <NavLink to='/vazifalar'><span>Vazifalar</span></NavLink>
                    <NavLink to='/kalendar'><span>Kalendar</span></NavLink>
                </ul>

                <div className={styles.categoryContainer}>
                    {open && <h2>Category</h2>}
                    <ul>
                        <NavLink to='/categories/ish'><span>Ish</span></NavLink>
                        <NavLink to='/categories/uqish'><span>O'qish</span></NavLink>
                        <NavLink to='/categories/shaxsiy'><span>Shaxsiy</span></NavLink>
                        <NavLink to='/categories/loyha'><span>Loyha</span></NavLink>
                    </ul>
                </div>
            </nav>




        </div>
    )
}

export default Sidebar