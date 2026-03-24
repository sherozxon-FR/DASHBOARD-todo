import styles from "./Charts.module.css"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const data = [
    { name: "Yuqori", value: 4, color: "#E24B4A" },
    { name: "O'rta", value: 5, color: "#BA7517" },
    { name: "Past", value: 3, color: "#1D9E75" },
]

const TaqsimotChart = () => {
    return (
        <div className={styles.chartCart}>
            <h3 className={styles.chartTitle}>Prioritet taqsimoti</h3>
            <div className={styles.donutWrapper}>
                <ResponsiveContainer width="55%" height={180}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            dataKey="value"
                            strokeWidth={0}
                        >
                            {data.map((item, i) => (
                                <Cell key={i} fill={item.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                <div className={styles.donutLegend}>
                    {data.map((item, i) => (
                        <div key={i} className={styles.legendItem}>
                            <span className={styles.legendDot} style={{ background: item.color }} />
                            <span className={styles.legendTxt}>{item.name} — {item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TaqsimotChart