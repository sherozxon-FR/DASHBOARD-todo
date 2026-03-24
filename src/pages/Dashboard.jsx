import CategoryChart from "../Charts/CategoryChart"
import TaqsimotChart from "../Charts/TaqsimotChart"
import styles from './dasboard.module.css'
import { useTodo } from "../context/TodoContext"


function Dashboard() {
  const { todos, stats } = useTodo()

  const headCart = [
    { txt: "Jami Vazifalar", Protect: stats.total, color: "#378ADD" },
    { txt: "Bajarilgan", Protect: stats.completed, color: "#1D9E75" },
    { txt: "Qolgan", Protect: stats.active, color: "#7F77DD" },
    { txt: "Deadline Yaqin", Protect: stats.overdue, color: "#E24B4A" },
  ]

  return (
    <div className={styles.DashboardContainer}>
      <div className={styles.cartCntainer}>
        {headCart.map((txt) => (
          <div className={styles.cart} key={txt.txt}>
            <p className={styles.cartTXT}>{txt.txt}</p>
            <small className={styles.cartProtect}>{txt.Protect}</small>
            <div className={styles.statusBar} style={{ background: txt.color }} />
          </div>
        ))}
      </div>

      <div className={styles.ChartConatiner}>
        <CategoryChart todos={todos} stats={stats} />
        <TaqsimotChart todos={todos} stats={stats} />
      </div>
    </div>
  )
}

export default Dashboard