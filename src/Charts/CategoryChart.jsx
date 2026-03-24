import styles from "./Charts.module.css"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"

const data = [
    { name: "Ish", count: 3 },
    { name: "O'qish", count: 4 },
    { name: "Shaxsiy", count: 1 },
    { name: "Loyiha", count: 4 },
]

const colors = ["#378ADD", "#1D9E75", "#7F77DD", "#D85A30"]

const CategoryChart = () => {
    return (
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
                    <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={14}>
                        {data.map((_, i) => (
                            <Cell key={i} fill={colors[i]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default CategoryChart