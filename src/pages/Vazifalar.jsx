import { useState, useMemo } from "react"
import { useTodo } from "../context/TodoContext"
import AddTodoModal from "./addModal/Addtodomodal"
import styles from "./Vazifalar.module.css"

const priorityColors = {
  yuqori: "#E24B4A",
  orta: "#BA7517",
  past: "#1D9E75",
}

const categoryColors = {
  "Ish": "#378ADD",
  "O'qish": "#1D9E75",
  "Shaxsiy": "#7F77DD",
  "Loyiha": "#D85A30",
}

function Vazifalar() {
  const {
    todos,
    addTodo,
    toggleTodo,
    removeTodo,
    editTodo
  } = useTodo()

  const [filter, setFilter] = useState("barchasi")
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState(null)

  const filtered = useMemo(() => {
    return todos.filter((t) => {
      const todoText = (t.text || t.title || "").toLowerCase()
      const matchSearch = todoText.includes(search.toLowerCase())
      const matchStatus = filter === "barchasi" ? true : filter === "active" ? !t.done : t.done
      const matchCategory = category === "" ? true : t.category === category
      const matchPriority = priority === "" ? true : t.priority === priority
      return matchSearch && matchStatus && matchCategory && matchPriority
    })
  }, [todos, filter, search, category, priority])

  const incomplete = filtered.filter(t => !t.done)
  const complete = filtered.filter(t => t.done)

  const handleAdd = (newTodo) => {
    addTodo(newTodo)
  }

  const handleEdit = (updatedTodo) => {
    editTodo(updatedTodo.id, updatedTodo)
    setEditingTodo(null)
  }

  const handleEditOpen = (todo) => {
    setEditingTodo(todo)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingTodo(null)
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Vazifalar</h2>
        <button className={styles.addBtn} onClick={() => setModalOpen(true)}>
          + Yangi vazifa
        </button>
      </div>

      {/* Qidiruv va Filtrlar */}
      <div className={styles.topActions}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Qidirish..."
            className={styles.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.statusFilters}>
          {["barchasi", "active", "bajarilgan"].map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.activeFilter : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "barchasi" ? "Barchasi" : f === "active" ? "Bajarilmagan" : "Bajarilgan"}
            </button>
          ))}
        </div>
      </div>

      {/* Selectlar */}
      <div className={styles.selectGroup}>
        <select className={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Kategoriya</option>
          {Object.keys(categoryColors).map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select className={styles.select} value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">Prioritet</option>
          {Object.keys(priorityColors).map(prio => <option key={prio} value={prio}>{prio}</option>)}
        </select>
      </div>

      {/* Bajarilmagan */}
      {(filter === "barchasi" || filter === "active") && (
        <div className={styles.listSection}>
          <div className={styles.listHeader}>
            <h3>Bajarilmagan</h3>
            <span className={styles.badgeCount}>{incomplete.length}</span>
          </div>
          <ul className={styles.list}>
            {incomplete.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                priorityColors={priorityColors}
                categoryColors={categoryColors}
                onToggle={toggleTodo}
                onRemove={removeTodo}
                onEdit={handleEditOpen}
              />
            ))}
            <div className={styles.addInline} onClick={() => setModalOpen(true)}>
              <span className={styles.plusIcon}>+</span>
              <span className={styles.inlineInput}>Vazifa qo'shish...</span>
            </div>
          </ul>
        </div>
      )}

      {/* Bajarilgan */}
      {(filter === "barchasi" || filter === "bajarilgan") && complete.length > 0 && (
        <div className={`${styles.listSection} ${styles.completedSection}`}>
          <div className={styles.listHeader}>
            <h3>Bajarilgan</h3>
            <span className={styles.badgeCount}>{complete.length}</span>
          </div>
          <ul className={styles.list}>
            {complete.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                priorityColors={priorityColors}
                categoryColors={categoryColors}
                onToggle={toggleTodo}
                onRemove={removeTodo}
                onEdit={handleEditOpen}
                completed
              />
            ))}
          </ul>
        </div>
      )}

      {/* Modal */}
      <AddTodoModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onAdd={handleAdd}
        onEdit={handleEdit}
        editingTodo={editingTodo}
      />
    </div>
  )
}

function TodoItem({ todo, priorityColors, categoryColors, onToggle, onRemove, onEdit, completed = false }) {
  const [showActions, setShowActions] = useState(false)

  return (
    <li
      className={`${styles.todoItem} ${todo.done ? styles.completedItem : ""}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div
        className={styles.priorityIndicator}
        style={{ backgroundColor: priorityColors[todo.priority] }}
      />

      <div className={styles.itemContent}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={todo.done}
          onChange={() => onToggle(todo.id)}
        />
        <div className={styles.details}>
          <span className={styles.todoText}>{todo.text || todo.title}</span>
          <div className={styles.metaInfo}>
            {todo.category && (
              <span
                className={styles.categoryBadge}
                style={{
                  backgroundColor: (categoryColors[todo.category] || "#888") + "20",
                  color: categoryColors[todo.category] || "#888",
                }}
              >
                {todo.category}
              </span>
            )}
            <span className={styles.deadlineInfo}>
              <span style={{ color: priorityColors[todo.priority] }}>●</span>{" "}
              {todo.deadline || "Keyinroq"}
            </span>
          </div>
        </div>
      </div>

      {/* Hover action tugmalari */}
      <div className={`${styles.actions} ${showActions ? styles.actionsVisible : ""}`}>
        <button
          className={styles.actionBtn}
          title="Tahrirlash"
          onClick={(e) => { e.stopPropagation(); onEdit(todo) }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          className={`${styles.actionBtn} ${styles.deleteBtn}`}
          title="O'chirish"
          onClick={(e) => { e.stopPropagation(); onRemove(todo.id) }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
          </svg>
        </button>
      </div>

      <span
        className={styles.priorityLabel}
        style={{
          backgroundColor: (priorityColors[todo.priority] || "#888") + "15",
          color: priorityColors[todo.priority] || "#888",
        }}
      >
        {todo.priority === "yuqori" ? "Yuqori"
          : todo.priority === "orta" ? "O'rta"
            : todo.priority === "past" ? "Past"
              : todo.priority}
      </span>
    </li>
  )
}

export default Vazifalar