import { useState, useEffect, useRef } from "react"
import styles from "./Addtodomodal.module.css"

const CATEGORIES = ["Ish", "O'qish", "Shaxsiy", "Loyiha"]
const PRIORITIES = [
    { value: "yuqori", label: "Yuqori", color: "#E24B4A" },
    { value: "orta", label: "O'rta", color: "#BA7517" },
    { value: "past", label: "Past", color: "#1D9E75" },
]

const EMPTY = { text: "", category: "", priority: "", deadline: "", note: "" }

function AddTodoModal({ isOpen, onClose, onAdd, onEdit, editingTodo }) {
    const isEditMode = Boolean(editingTodo)
    const [form, setForm] = useState(EMPTY)
    const [errors, setErrors] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const inputRef = useRef(null)

    // Ochilganda formni to'ldirish
    useEffect(() => {
        if (isOpen) {
            if (editingTodo) {
                setForm({
                    text: editingTodo.text || editingTodo.title || "",
                    category: editingTodo.category || "",
                    priority: editingTodo.priority || "",
                    deadline: editingTodo.deadline === "Keyinroq" ? "" : (editingTodo.deadline || ""),
                    note: editingTodo.note || "",
                })
            } else {
                setForm(EMPTY)
            }
            setErrors({})
            setSubmitted(false)
            setTimeout(() => inputRef.current?.focus(), 80)
        }
    }, [isOpen, editingTodo])

    // Escape bilan yopish
    useEffect(() => {
        const handler = (e) => { if (e.key === "Escape") onClose() }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [onClose])

    const validate = () => {
        const errs = {}
        if (!form.text.trim()) errs.text = "Vazifa nomini kiriting"
        if (!form.category) errs.category = "Kategoriya tanlang"
        if (!form.priority) errs.priority = "Prioritet tanlang"
        return errs
    }

    const handleSubmit = () => {
        const errs = validate()
        if (Object.keys(errs).length) { setErrors(errs); return }

        const payload = {
            ...(editingTodo || {}),
            id: editingTodo?.id || Date.now(),
            text: form.text.trim(),
            title: form.text.trim(),
            category: form.category,
            priority: form.priority,
            deadline: form.deadline || "Keyinroq",
            note: form.note,
            done: editingTodo?.done || false,
        }

        if (isEditMode) {
            onEdit(payload)
        } else {
            onAdd({ ...payload, createdAt: new Date().toISOString() })
        }

        setSubmitted(true)
        setTimeout(() => onClose(), 520)
    }

    const set = (key) => (e) => {
        setForm((f) => ({ ...f, [key]: e.target.value }))
        if (errors[key]) setErrors((er) => ({ ...er, [key]: "" }))
    }

    if (!isOpen) return null

    return (
        <div
            className={`${styles.overlay} ${submitted ? styles.overlayOut : ""}`}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className={`${styles.modal} ${submitted ? styles.modalOut : ""}`}>

                {/* Header */}
                <div className={styles.modalHeader}>
                    <div className={styles.headerLeft}>
                        <span className={styles.headerIcon}>{isEditMode ? "✎" : "✦"}</span>
                        <h2 className={styles.modalTitle}>
                            {isEditMode ? "Vazifani tahrirlash" : "Yangi vazifa"}
                        </h2>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className={styles.modalBody}>

                    {/* Vazifa nomi */}
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>
                            Vazifa nomi <span className={styles.req}>*</span>
                        </label>
                        <input
                            ref={inputRef}
                            type="text"
                            className={`${styles.input} ${errors.text ? styles.inputError : ""}`}
                            placeholder="Nima qilish kerak?"
                            value={form.text}
                            onChange={set("text")}
                            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        />
                        {errors.text && <span className={styles.errorMsg}>{errors.text}</span>}
                    </div>

                    {/* Kategoriya */}
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>
                            Kategoriya <span className={styles.req}>*</span>
                        </label>
                        <div className={styles.chipGroup}>
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    className={`${styles.chip} ${form.category === cat ? styles.chipActive : ""}`}
                                    onClick={() => { setForm(f => ({ ...f, category: cat })); setErrors(er => ({ ...er, category: "" })) }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        {errors.category && <span className={styles.errorMsg}>{errors.category}</span>}
                    </div>

                    {/* Prioritet */}
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>
                            Prioritet <span className={styles.req}>*</span>
                        </label>
                        <div className={styles.priorityGroup}>
                            {PRIORITIES.map(p => (
                                <button
                                    key={p.value}
                                    type="button"
                                    className={`${styles.priorityChip} ${form.priority === p.value ? styles.priorityChipActive : ""}`}
                                    style={form.priority === p.value
                                        ? { backgroundColor: p.color + "18", borderColor: p.color, color: p.color }
                                        : {}}
                                    onClick={() => { setForm(f => ({ ...f, priority: p.value })); setErrors(er => ({ ...er, priority: "" })) }}
                                >
                                    <span className={styles.dot} style={{ background: p.color }} />
                                    {p.label}
                                </button>
                            ))}
                        </div>
                        {errors.priority && <span className={styles.errorMsg}>{errors.priority}</span>}
                    </div>

                    {/* Muddat */}
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Muddat</label>
                        <div className={styles.dateWrapper}>
                            <svg className={styles.dateIcon} width="15" height="15" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <input
                                type="date"
                                className={styles.dateInput}
                                value={form.deadline}
                                onChange={set("deadline")}
                            />
                        </div>
                    </div>

                    {/* Izoh */}
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>
                            Izoh <span className={styles.optional}>(ixtiyoriy)</span>
                        </label>
                        <textarea
                            className={styles.textarea}
                            placeholder="Qo'shimcha ma'lumot..."
                            value={form.note}
                            onChange={set("note")}
                            rows={3}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.modalFooter}>
                    <button className={styles.cancelBtn} onClick={onClose}>
                        Bekor qilish
                    </button>
                    <button
                        className={`${styles.submitBtn} ${submitted ? styles.submitSuccess : ""}`}
                        onClick={handleSubmit}
                    >
                        {submitted ? (
                            <><span className={styles.checkAnim}>✓</span> {isEditMode ? "Saqlandi" : "Qo'shildi"}</>
                        ) : (
                            isEditMode ? <>✎ Saqlash</> : <><span>+</span> Qo'shish</>
                        )}
                    </button>
                </div>

            </div>
        </div>
    )
}

export default AddTodoModal