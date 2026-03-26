import React, { useState, useEffect, useRef } from "react";
import { useTodo } from "../../context/TodoContext";
import styles from "./Shaxsiy.module.css";

/* ═══════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════ */
const PRIORITIES = ["Yuqori", "O'rta", "Past"];

const P_META = {
  Yuqori: { stripe: styles.stripeHigh, tag: styles.tagHigh, dot: styles.dotHigh, opt: styles.poHigh },
  "O'rta": { stripe: styles.stripeMid, tag: styles.tagMid, dot: styles.dotMid, opt: styles.poMid },
  Past: { stripe: styles.stripeLow, tag: styles.tagLow, dot: styles.dotLow, opt: styles.poLow },
};

const MOODS = [
  { emoji: "😞", label: "Yomon", value: 1 },
  { emoji: "😐", label: "Oddiy", value: 2 },
  { emoji: "🙂", label: "Yaxshi", value: 3 },
  { emoji: "😊", label: "Zo'r", value: 4 },
  { emoji: "😄", label: "Ajoyib!", value: 5 },
];

const WEEK_DAYS = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

const INITIAL_HABITS = [
  { id: 1, label: "Erta turish", icon: "🕐", days: [true, true, true, true, false, true, true] },
  { id: 2, label: "Sport qilish", icon: "📍", days: [true, true, false, true, false, false, false] },
  { id: 3, label: "Meditatsiya", icon: "➕", days: [true, true, true, true, true, false, false] },
];

const INITIAL_GOALS = [
  { id: 1, title: "Vazn yo'qotish", detail: "6/10 kg — mart oxirigacha", progress: 60 },
  { id: 2, title: "Tejash maqsadi", detail: "2,000,000 / 5,000,000 so'm", progress: 40 },
];

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
  empty: <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><rect x="10" y="6" width="28" height="36" rx="5" /><path d="M17 16h14M17 23h10M17 30h6" /></svg>,
};

/* ═══════════════════════════════════════════════
   TASK MODAL
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
    if (!title.trim()) { setShake(true); setTimeout(() => setShake(false), 440); return; }
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
          <button className={styles.closeBtn} onClick={onClose}>{Icon.close}</button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Vazifa nomi <span className={styles.req}>*</span></label>
            <div className={styles.inputWrap}>
              <input
                ref={inputRef}
                type="text"
                placeholder="Masalan: Gym borish..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                className={`${styles.input} ${shake ? styles.shake : ""}`}
                maxLength={80}
              />
              {title && <button className={styles.clearBtn} onClick={() => setTitle("")} type="button">{Icon.close}</button>}
            </div>
            <span className={`${styles.charCount} ${title.length > 70 ? styles.charWarn : ""}`}>{title.length}/80</span>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Prioritet</label>
            <div className={styles.priorityPicker}>
              {PRIORITIES.map((p) => (
                <button key={p} type="button" onClick={() => setPriority(p)}
                  className={`${styles.pOpt} ${P_META[p].opt} ${priority === p ? styles.pOptActive : ""}`}>
                  <span className={`${styles.pOptDot} ${P_META[p].dot}`} />{p}
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
   DELETE MODAL
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
            <div className={`${styles.modalIconBox} ${styles.modalIconDanger}`}>{Icon.trash}</div>
            <h2 className={styles.modalTitle}>Vazifani o'chirish</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>{Icon.close}</button>
        </div>
        <div className={styles.deleteBody}>
          <p className={styles.deleteMsg}><strong>"{title}"</strong> — bu vazifani o'chirishni xohlaysizmi?</p>
          <p className={styles.deleteWarn}>Bu amalni qaytarib bo'lmaydi.</p>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Bekor qilish</button>
          <button className={styles.deleteConfirmBtn} onClick={onConfirm}>{Icon.trash} O'chirish</button>
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
      <button className={`${styles.checkbox} ${todo.done ? styles.checked : ""}`}
        onClick={() => onToggle(todo.id)} type="button">
        {todo.done && Icon.check}
      </button>
      <div className={styles.taskInfo}>
        <p className={styles.taskName}>{todo.text}</p>
        <p className={styles.taskSub}>{todo.done ? "Bajarildi" : todo.deadline ? "Bugun" : "Bu hafta"}</p>
      </div>
      <span className={`${styles.priorityTag} ${meta.tag}`}>{todo.priority}</span>
      <div className={styles.actions}>
        <button className={`${styles.actionBtn} ${todo.done ? styles.actionUndo : styles.actionDone}`}
          onClick={() => onToggle(todo.id)} type="button">
          {todo.done ? Icon.undo : Icon.done}
        </button>
        {!todo.done && (
          <button className={`${styles.actionBtn} ${styles.actionEdit}`}
            onClick={() => onEdit(todo)} type="button">{Icon.edit}</button>
        )}
        <button className={`${styles.actionBtn} ${styles.actionDelete}`}
          onClick={() => onDelete(todo)} type="button">{Icon.trash}</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN — Shaxsiy page
═══════════════════════════════════════════════ */
function Shaxsiy() {
  const { todos, addTodo, editTodo, removeTodo, toggleTodo } = useTodo();

  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [delTarget, setDelTarget] = useState(null);
  const [habits, setHabits] = useState(INITIAL_HABITS);
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [mood, setMood] = useState(null);
  const [now, setNow] = useState(new Date());

  /* live clock */
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const shaxsiyTodos = todos.filter((t) => t.category === "Shaxsiy");
  const total = shaxsiyTodos.length;
  const done = shaxsiyTodos.filter((t) => t.done).length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  const activeHabits = habits.filter((h) => h.days.filter(Boolean).length > 0).length;
  const activeGoals = goals.length;

  /* handlers */
  const handleAdd = (data) => addTodo({ ...data, category: "Shaxsiy" });
  const handleEdit = ({ text, priority }) => editTodo(editTarget.id, { text, priority });
  const handleDel = () => { removeTodo(delTarget.id); setDelTarget(null); };

  const toggleHabitDay = (habitId, dayIdx) => {
    setHabits((h) => h.map((hb) => hb.id === habitId
      ? { ...hb, days: hb.days.map((d, i) => i === dayIdx ? !d : d) }
      : hb
    ));
  };

  const getStreak = (days) => {
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i]) streak++; else break;
    }
    return streak;
  };

  const timeStr = now.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  /* status steps */
  const steps = [
    { key: "total", label: "Jami", count: total, color: "#7c6af7" },
    { key: "active", label: "Jarayonda", count: total - done, color: "#f5a623" },
    { key: "done", label: "Bajarildi", count: done, color: "#22c55e" },
  ];

  return (
    <div className={styles.container}>

      {/* ── HEADER ── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.dot} />
          <h1 className={styles.pageTitle}>Shaxsiy</h1>
          <span className={styles.badge}>{total} ta vazifa</span>
          <span className={styles.clock}>{timeStr}</span>
        </div>
        <button className={styles.addBtn} onClick={() => setAddOpen(true)}>
          {Icon.plus}<span>Vazifa qo'sh</span>
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
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Jami vazifa</p>
          <p className={styles.statValue}>{total}</p>
          <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${percent}%` }} /></div>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Bajarilgan</p>
          <p className={styles.statValue}>{done}</p>
          <p className={styles.statSub}>{percent}%</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Odatlar</p>
          <p className={styles.statValue}>{activeHabits}</p>
          <p className={styles.statSub}>faol</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Maqsadlar</p>
          <p className={styles.statValue}>{activeGoals}</p>
          <p className={styles.statSub}>davom etmoqda</p>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className={styles.grid}>

        {/* ── LEFT: Tasks ── */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Vazifalar</h2>
            <span className={styles.sectionBadge}>{total}</span>
          </div>

          <div className={styles.taskList}>
            {shaxsiyTodos.length === 0 ? (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>{Icon.empty}</div>
                <p className={styles.emptyTitle}>Vazifalar yo'q</p>
                <p className={styles.emptyDesc}>Yangi vazifa qo'shing</p>
                <button className={styles.emptyAddBtn} onClick={() => setAddOpen(true)}>
                  {Icon.plus} Vazifa qo'sh
                </button>
              </div>
            ) : (
              shaxsiyTodos.map((t) => (
                <TaskCard key={t.id} todo={t}
                  onToggle={toggleTodo}
                  onEdit={(todo) => setEditTarget(todo)}
                  onDelete={(todo) => setDelTarget(todo)}
                />
              ))
            )}
          </div>

          {/* inline add row */}
          <button className={styles.inlineAdd} onClick={() => setAddOpen(true)}>
            {Icon.plus} Yangi vazifa qo'shish...
          </button>
        </div>

        {/* ── RIGHT: Habits + Goals + Mood ── */}
        <div className={styles.aside}>

          {/* Kunlik odatlar */}
          <div className={styles.panel}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Kunlik odatlar</h2>
            </div>
            <div className={styles.habitList}>
              {habits.map((h) => {
                const streak = getStreak(h.days);
                return (
                  <div className={styles.habitItem} key={h.id}>
                    <div className={styles.habitIcon}>{h.icon}</div>
                    <div className={styles.habitInfo}>
                      <div className={styles.habitTop}>
                        <span className={styles.habitLabel}>{h.label}</span>
                        <span className={styles.habitStreak}>{streak} kun</span>
                      </div>
                      <div className={styles.habitDays}>
                        {h.days.map((active, i) => (
                          <button
                            key={i}
                            className={`${styles.habitDay} ${active ? styles.habitDayOn : ""}`}
                            onClick={() => toggleHabitDay(h.id, i)}
                            title={WEEK_DAYS[i]}
                            type="button"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shaxsiy maqsadlar */}
          <div className={styles.panel}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Shaxsiy maqsadlar</h2>
            </div>
            <div className={styles.goalList}>
              {goals.map((g) => (
                <div className={styles.goalItem} key={g.id}>
                  <div className={styles.goalTop}>
                    <span className={styles.goalTitle}>{g.title}</span>
                    <span className={styles.goalPct}>{g.progress}%</span>
                  </div>
                  <div className={styles.goalBar}>
                    <div className={styles.goalFill} style={{ width: `${g.progress}%` }} />
                  </div>
                  <p className={styles.goalDetail}>{g.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bugungi kayfiyat */}
          <div className={styles.panel}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Bugungi kayfiyat</h2>
            </div>
            <p className={styles.moodQuestion}>Qanday his qilyapsiz?</p>
            <div className={styles.moodRow}>
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  className={`${styles.moodBtn} ${mood === m.value ? styles.moodActive : ""}`}
                  onClick={() => setMood(m.value)}
                  title={m.label}
                  type="button"
                >
                  {m.emoji}
                </button>
              ))}
            </div>
            {mood && (
              <p className={styles.moodFeedback}>
                {MOODS.find((m) => m.value === mood)?.label} kayfiyat!
                {mood >= 4 ? " Zo'r, shunday davom eting! 💪" : mood <= 2 ? " Yaxshi bo'lib qolasiz! 🌟" : " Yaxshi kun bo'lsin! ☀️"}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* ── MODALS ── */}
      {addOpen && <TaskModal onClose={() => setAddOpen(false)} onSave={handleAdd} />}
      {editTarget && <TaskModal initial={editTarget} onClose={() => setEditTarget(null)} onSave={handleEdit} />}
      {delTarget && <DeleteModal title={delTarget.text} onClose={() => setDelTarget(null)} onConfirm={handleDel} />}

    </div>
  );
}

export default Shaxsiy;