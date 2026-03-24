import { useState } from "react"
import styles from "./Charts.module.css"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const data = [
    { name: "Yuqori", value: 4, color: "#E24B4A", tasks: ["Loyiha tayyorlash", "API", "Deploy", "Test"] },
    { name: "O'rta", value: 5, color: "#BA7517", tasks: ["Dashboard", "Design", "CSS", "Meeting", "Hisobot"] },
    { name: "Past", value: 3, color: "#1D9E75", tasks: ["Sport", "O'qish", "React"] },
]

const TaqsimotChart = () => {
    const [selected, setSelected] = useState(null)

    const handleClick = (item) => {
        setSelected(item)
    }

    return (
        <>
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
                                activeIndex={-1}
                                activeShape={null}
                                onClick={(item) => handleClick(item)}
                                style={{ cursor: "pointer", outline: "none" }}
                            >
                                {data.map((item, i) => (
                                    <Cell
                                        key={i}
                                        fill={item.color}
                                        stroke="none"
                                        style={{ outline: "none" }}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    <div className={styles.donutLegend}>
                        {data.map((item, i) => (
                            <div
                                key={i}
                                className={styles.legendItem}
                                style={{ cursor: "pointer" }}
                                onClick={() => handleClick(item)}
                            >
                                <span className={styles.legendDot} style={{ background: item.color }} />
                                <span className={styles.legendTxt}>{item.name} — {item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {selected && (
                <div className={styles.modalOverlay} onClick={() => setSelected(null)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <div className={styles.modalTitleRow}>
                                <span className={styles.modalDot} style={{ background: selected.color }} />
                                <h3 className={styles.modalTitle}>{selected.name}</h3>
                                <span className={styles.modalCount} style={{ color: selected.color }}>
                                    {selected.value} ta
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

export default TaqsimotChart