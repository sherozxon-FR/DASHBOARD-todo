import { useState } from "react"
import styles from "./Charts.module.css"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"

const data = [
    { name: "Ish", count: 3, tasks: ["Loyiha tayyorlash", "Meeting", "Hisobot"] },
    { name: "O'qish", count: 4, tasks: ["React", "CSS", "JavaScript", "Node.js"] },
    { name: "Shaxsiy", count: 1, tasks: ["Sport"] },
    { name: "Loyiha", count: 4, tasks: ["Dashboard", "API", "Design", "Test"] },
]

const colors = ["#378ADD", "#1D9E75", "#7F77DD", "#D85A30"]

const CategoryChart = () => {
    const [selected, setSelected] = useState(null)

    const handleClick = (data, index) => {
        setSelected({ ...data, color: colors[index] })
    }

    return (
        <>
            <div className={styles.chartCart}>
                <h3 className={styles.chartTitle}>Kategoriya holati</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis
                            type="category"
                            dataKey="name"
                            width={65}
                            tick={{ fontSize: 13, fill: "#999" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={14} cursor="pointer" onClick={handleClick}>
                            {data.map((_, i) => (
                                <Cell key={i} fill={colors[i]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {selected && (
                <div className={styles.modalOverlay} onClick={() => setSelected(null)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <div className={styles.modalTitleRow}>
                                <span className={styles.modalDot} style={{ background: selected.color }} />
                                <h3 className={styles.modalTitle}>{selected.name}</h3>
                                <span className={styles.modalCount} style={{ color: selected.color }}>
                                    {selected.count} ta
                                </span>
                            </div>
                            <button className={styles.modalClose} onClick={() => setSelected(null)}>✕</button>
                        </div>
                        <ul className={styles.modalList}>
                            {selected.tasks.map((task, i) => (
                                <li key={i} className={styles.modalItem}>
                                    <span className={styles.modalItemDot} style={{ background: selected.color }} />
                                    {task}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </>
    )
}

export default CategoryChart