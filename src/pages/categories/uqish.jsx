import React, { useState, useEffect, useRef } from "react";
import { useTodo } from "../../context/TodoContext";
import styles from "./Uqish.module.css";

/* ═══════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════ */
const PRIORITIES = ["Yuqori", "O'rta", "Past"];

const P_META = {
  Yuqori: { stripe: styles.stripeHigh, tag: styles.tagHigh, dot: styles.dotHigh, opt: styles.poHigh },
  "O'rta": { stripe: styles.stripeMid, tag: styles.tagMid, dot: styles.dotMid, opt: styles.poMid },
  Past: { stripe: styles.stripeLow, tag: styles.tagLow, dot: styles.dotLow, opt: styles.poLow },
};

const INITIAL_BOOKS = [
  { id: 1, title: "Clean Code", author: "Robert C. Martin", progress: 75 },
  { id: 2, title: "The Pragmatic Programmer", author: "Hunt & Thomas", progress: 30 },
  { id: 3, title: "You Don't Know JS", author: "Kyle Simpson", progress: 100 },
];

const DAYS = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];
const INITIAL_WEEKLY = [15, 45, 40, 55, 10, 50, 60];

/* ═══════════════════════════════════════════════
   SVG ICONS
═══════════════════════════════════════════════ */
const Icon = {
  plus: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M8 3v10M3 8h10" /></svg>,
  check: <svg viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,6 5,9 10,3" /></svg>,
  close: <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M3 3l8 8M11 3l-8 8" /></svg>,
  edit: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 2.5l2.5 2.5-8 8H3V10.5l8-8z" /></svg>,
  trash: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h10M6 4V3h4v1M5 4l.5 9h5l.5-9" /><path d="M7 7v4M9 7v4" /></svg>,
  done: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6" /><polyline points="5.5,8 7,9.5 10.5,6.5" /></svg>,
  undo: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6H10a3 3 0 010 6H6" /><path d="M4 6L6 4M4 6l2 2" /></svg>,
  book: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h4.5a2 2 0 012 2v8a2 2 0 00-2-2H3z" /><path d="M13 3H8.5a2 2 0 00-2 2v8a2 2 0 012-2H13z" /></svg>,
  empty: <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><rect x="10" y="6" width="28" height="36" rx="5" /><path d="M17 16h14M17 23h10M17 30h6" /></svg>,
};

/* ═══════════════════════════════════════════════
   TASK MODAL  (add + edit)
═══════════════════════════════════════════════ */
function TaskModal({ initial = null, onClose, onSave }) {
  const isEdit = !!initial;
  const [title, setTitle] = useState(initial?.text ?? "");
  const [priority, setPriority] = useState(initial?.priority ?? "O'rta");
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = () => {
    if (!title.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 440);
      return;
    }
    onSave({ text: title.trim(), priority });
    onClose();
  };

  return (
    <div className={styles.overlay} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>

        <div className={styles.modalHeader}>
          <div className={styles.modalTitleRow}>
            <div className={`${styles.modalIconBox} ${isEdit ? styles.modalIconEdit : ""}`}>
              {isEdit ? Icon.edit : Icon.plus}
            </div>
            <h2 className={styles.modalTitle}>{isEdit ? "Vazifani tahrirlash" : "Yangi vazifa"}</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Yopish">
            {Icon.close}
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>
              Vazifa nomi <span className={styles.req}>*</span>
            </label>
            <div className={styles.inputWrap}>
              <input
                ref={inputRef}
                type="text"
                placeholder="Masalan: Kitob o'qish..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                className={`${styles.input} ${shake ? styles.shake : ""}`}
                maxLength={80}
              />
              {title && (
                <button className={styles.clearBtn} onClick={() => setTitle("")} type="button">
                  {Icon.close}
                </button>
              )}
            </div>
            <span className={`${styles.charCount} ${title.length > 70 ? styles.charWarn : ""}`}>
              {title.length}/80
            </span>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Prioritet</label>
            <div className={styles.priorityPicker}>
              {PRIORITIES.map((p) => (
                <button
                  key={p} type="button"
                  onClick={() => setPriority(p)}
                  className={`${styles.pOpt} ${P_META[p].opt} ${priority === p ? styles.pOptActive : ""}`}
                >
                  <span className={`${styles.pOptDot} ${P_META[p].dot}`} />
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose} type="button">Bekor qilish</button>
          <button className={styles.submitBtn} onClick={submit} type="button">
            {isEdit ? Icon.edit : Icon.plus}
            {isEdit ? "Saqlash" : "Qo'shish"}
          </button>
        </div>

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DELETE CONFIRM MODAL
═══════════════════════════════════════════════ */
function DeleteModal({ title, onClose, onConfirm }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className={styles.overlay} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`${styles.modal} ${styles.deleteModal}`}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleRow}>
            <div className={`${styles.modalIconBox} ${styles.modalIconDanger}`}>
              {Icon.trash}
            </div>
            <h2 className={styles.modalTitle}>Vazifani o'chirish</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>{Icon.close}</button>
        </div>
        <div className={styles.deleteBody}>
          <p className={styles.deleteMsg}>
            <strong>"{title}"</strong> — bu vazifani o'chirishni xohlaysizmi?
          </p>
          <p className={styles.deleteWarn}>Bu amalni qaytarib bo'lmaydi.</p>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Bekor qilish</button>
          <button className={styles.deleteConfirmBtn} onClick={onConfirm}>
            {Icon.trash} O'chirish
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TASK CARD
═══════════════════════════════════════════════ */
function TaskCard({ todo, onToggle, onEdit, onDelete }) {
  const meta = P_META[todo.priority] ?? P_META["O'rta"];

  return (
    <div className={`${styles.taskCard} ${todo.done ? styles.taskDone : ""}`}>
      <div className={`${styles.stripe} ${meta.stripe}`} />

      <button
        className={`${styles.checkbox} ${todo.done ? styles.checked : ""}`}
        onClick={() => onToggle(todo.id)}
        type="button"
        aria-label="Bajarildi"
      >
        {todo.done && Icon.check}
      </button>

      <div className={styles.taskInfo}>
        <p className={styles.taskName}>{todo.text}</p>
        <div className={styles.taskMeta}>
          <span className={`${styles.taskDate} ${todo.done ? styles.dateDone : styles.dateWeek}`}>
            {todo.done ? "✓ Bajarildi" : "Bu hafta"}
          </span>
          <span className={`${styles.priorityTag} ${meta.tag}`}>{todo.priority}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.actionBtn} ${todo.done ? styles.actionUndo : styles.actionDone}`}
          onClick={() => onToggle(todo.id)}
          title={todo.done ? "Qaytarish" : "Bajarildi"}
          type="button"
        >
          {todo.done ? Icon.undo : Icon.done}
        </button>

        {!todo.done && (
          <button
            className={`${styles.actionBtn} ${styles.actionEdit}`}
            onClick={() => onEdit(todo)}
            title="Tahrirlash"
            type="button"
          >
            {Icon.edit}
          </button>
        )}

        <button
          className={`${styles.actionBtn} ${styles.actionDelete}`}
          onClick={() => onDelete(todo)}
          title="O'chirish"
          type="button"
        >
          {Icon.trash}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════ */
function StatCard({ label, value, sub, progress }) {
  return (
    <div className={styles.statCard}>
      <p className={styles.statLabel}>{label}</p>
      <p className={styles.statValue}>{value}</p>
      {progress !== undefined ? (
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      ) : (
        <p className={styles.statSub}>{sub}</p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN — Uqish page
═══════════════════════════════════════════════ */
function Uqish() {
  const { todos, addTodo, editTodo, removeTodo, toggleTodo } = useTodo();

  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [delTarget, setDelTarget] = useState(null);
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [weekly] = useState(INITIAL_WEEKLY);
  const [now, setNow] = useState(new Date());

  /* live clock */
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const uqishTodos = todos.filter((t) => t.category === "O'qish");
  const total = uqishTodos.length;
  const done = uqishTodos.filter((t) => t.done).length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  const maxMin = Math.max(...weekly, 1);

  const timeStr = now.toLocaleTimeString("uz-UZ", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });

  /* handlers */
  const handleAdd = (data) => addTodo({ ...data, category: "O'qish" });
  const handleEdit = ({ text, priority }) => editTodo(editTarget.id, { text, priority });
  const handleDel = () => { removeTodo(delTarget.id); setDelTarget(null); };
  const handleBookProgress = (id, val) =>
    setBooks((b) => b.map((bk) => bk.id === id ? { ...bk, progress: +val } : bk));

  const steps = [
    { key: "total", label: "Jami", count: total, color: "#22c55e" },
    { key: "active", label: "Jarayonda", count: total - done, color: "#f5a623" },
    { key: "done", label: "Bajarildi", count: done, color: "#4f8ef7" },
  ];

  const recentDone = uqishTodos.filter((t) => t.done).slice(-4).reverse();

  return (
    <div className={styles.container}>

      {/* ── HEADER ── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.dot} />
          <h1 className={styles.pageTitle}>O'qish</h1>
          <span className={styles.badge}>{total} ta vazifa</span>
          <span className={styles.clock}>{timeStr}</span>
        </div>
        <button className={styles.addBtn} onClick={() => setAddOpen(true)}>
          {Icon.plus}
          <span>Vazifa qo'sh</span>
        </button>
      </header>

      {/* ── STATUS BAR ── */}
      <div className={styles.statusBar}>
        <div className={styles.statusSteps}>
          {steps.map((s) => (
            <div className={styles.statusStep} key={s.key}>
              <span className={styles.statusDot} style={{ background: s.color, boxShadow: `0 0 8px ${s.color}88` }} />
              <span className={styles.statusLabel}>{s.label}</span>
              <span className={styles.statusCount} style={{ color: s.color }}>{s.count}</span>
            </div>
          ))}
        </div>
        <div className={styles.statusTrack}>
          <div className={styles.statusActive} style={{ width: `${total ? ((total - done) / total) * 100 : 0}%` }} />
          <div className={styles.statusDone} style={{ width: `${percent}%` }} />
        </div>
        <span className={styles.statusPercent}>{percent}%</span>
      </div>

      {/* ── STAT CARDS ── */}
      <div className={styles.statsRow}>
        <StatCard label="Jami vazifa" value={total} progress={percent} />
        <StatCard label="Bajarilgan" value={done} sub={`${percent}%`} />
        <StatCard label="Qolgan" value={total - done} sub={`${100 - percent}%`} />
        <StatCard label="Streak" value="5" sub="kun ketma-ket 🔥" />
      </div>

      {/* ── MAIN GRID ── */}
      <div className={styles.grid}>

        {/* Tasks section */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Barcha vazifalar</h2>
            <span className={styles.sectionBadge}>{total}</span>
          </div>

          <div className={styles.taskList}>
            {uqishTodos.length === 0 ? (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>{Icon.empty}</div>
                <p className={styles.emptyTitle}>Vazifalar yo'q</p>
                <p className={styles.emptyDesc}>Yangi vazifa qo'shing</p>
                <button className={styles.emptyAddBtn} onClick={() => setAddOpen(true)}>
                  {Icon.plus} Vazifa qo'sh
                </button>
              </div>
            ) : (
              uqishTodos.map((t) => (
                <TaskCard
                  key={t.id}
                  todo={t}
                  onToggle={toggleTodo}
                  onEdit={(todo) => setEditTarget(todo)}
                  onDelete={(todo) => setDelTarget(todo)}
                />
              ))
            )}
          </div>
        </div>

        {/* Aside */}
        <div className={styles.aside}>

          {/* Books panel */}
          <div className={styles.panel}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Kitoblar jarayoni</h2>
            </div>
            <div className={styles.panelBody}>
              {books.map((bk) => {
                const isDone = bk.progress >= 100;
                const barColor = isDone ? "#22c55e" : bk.progress > 50 ? "#22c55e" : "#f5a623";
                return (
                  <div className={styles.bookItem} key={bk.id}>
                    <div className={styles.bookIcon}>{Icon.book}</div>
                    <div className={styles.bookInfo}>
                      <span className={styles.bookTitle}>{bk.title}</span>
                      <span className={styles.bookAuthor}>{bk.author}</span>
                      <div className={styles.bookBarWrap}>
                        <div className={styles.bookBarTrack}>
                          <div className={styles.bookBarFill} style={{ width: `${bk.progress}%`, background: barColor }} />
                        </div>
                      </div>
                      {isDone
                        ? <span className={styles.bookDone}>Tugallandi ✓</span>
                        : <span className={styles.bookPct} style={{ color: barColor }}>{bk.progress}% o'qildi</span>
                      }
                      <input
                        type="range" min="0" max="100"
                        value={bk.progress}
                        className={styles.bookSlider}
                        onChange={(e) => handleBookProgress(bk.id, e.target.value)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly chart */}
          <div className={styles.panel}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Haftalik o'qish</h2>
            </div>
            <div className={styles.chartWrap}>
              {weekly.map((min, i) => (
                <div className={styles.barCol} key={i}>
                  <div className={styles.barWrap}>
                    <div
                      className={styles.bar}
                      style={{ height: `${(min / maxMin) * 100}%`, background: min > 20 ? "#22c55e" : "#d1d5db" }}
                      title={`${min} daqiqa`}
                    />
                  </div>
                  <span className={styles.dayLabel}>{DAYS[i]}</span>
                </div>
              ))}
            </div>
            <p className={styles.chartSub}>o'qilgan daqiqa / kun</p>
          </div>

          {/* Recent activity */}
          <div className={styles.panel}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Oxirgi faoliyat</h2>
            </div>
            <div className={styles.panelBody}>
              {recentDone.length === 0 ? (
                <p className={styles.noActivity}>Hali faoliyat yo'q</p>
              ) : (
                recentDone.map((t) => (
                  <div className={styles.actItem} key={t.id}>
                    <span className={styles.actDot} />
                    <div>
                      <p className={styles.actText}>{t.text} bajarildi</p>
                      <p className={styles.actTime}>Yaqinda</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ── MODALS ── */}
      {addOpen && (
        <TaskModal onClose={() => setAddOpen(false)} onSave={handleAdd} />
      )}
      {editTarget && (
        <TaskModal initial={editTarget} onClose={() => setEditTarget(null)} onSave={handleEdit} />
      )}
      {delTarget && (
        <DeleteModal title={delTarget.text} onClose={() => setDelTarget(null)} onConfirm={handleDel} />
      )}

    </div>
  );
}

export default Uqish;