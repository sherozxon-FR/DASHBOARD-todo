import React, { useState, useEffect, useRef } from "react";
import { useTodo } from "../../context/TodoContext";
import styles from "./Ish.module.css";

/* ═══════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════ */
const PRIORITIES = ["Yuqori", "O'rta", "Past"];

const P_META = {
  Yuqori: { stripe: styles.stripeHigh, tag: styles.tagHigh, dot: styles.dotHigh, opt: styles.poHigh },
  "O'rta": { stripe: styles.stripeMid, tag: styles.tagMid, dot: styles.dotMid, opt: styles.poMid },
  Past: { stripe: styles.stripeLow, tag: styles.tagLow, dot: styles.dotLow, opt: styles.poLow },
};

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
function getDateInfo(deadline) {
  if (!deadline) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d = new Date(deadline); d.setHours(0, 0, 0, 0);
  const diff = (d - today) / 86400000;
  if (diff === 0) return { label: "Bugun", cls: styles.dateToday };
  if (diff > 0 && diff <= 6) return { label: "Bu hafta", cls: styles.dateWeek };
  if (diff < 0) return { label: "Muddati o'tgan", cls: styles.dateOver };
  return { label: new Date(deadline).toLocaleDateString("uz-UZ"), cls: "" };
}

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
   TASK MODAL  (add + edit)
═══════════════════════════════════════════════ */
function TaskModal({ initial = null, onClose, onSave }) {
  const isEdit = !!initial;
  const [title, setTitle] = useState(initial?.text ?? "");
  const [priority, setPriority] = useState(initial?.priority ?? "O'rta");
  const [deadline, setDeadline] = useState(initial?.deadline ?? "");
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
    onSave({ text: title.trim(), priority, deadline: deadline || null });
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
            <label className={styles.fieldLabel}>Vazifa nomi <span className={styles.req}>*</span></label>
            <div className={styles.inputWrap}>
              <input
                ref={inputRef}
                type="text"
                placeholder="Masalan: Hisobot tayyorlash..."
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

          <div className={styles.field}>
            <label className={styles.fieldLabel}>
              Muddati <span className={styles.optional}>(ixtiyoriy)</span>
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className={`${styles.input} ${styles.dateInput}`}
              min={new Date().toISOString().split("T")[0]}
            />
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
  const meta = P_META[todo.priority] ?? P_META["Past"];
  const dateInfo = getDateInfo(todo.deadline);
  const menuRef = useRef(null);

  return (
    <div className={`${styles.taskCard} ${todo.done ? styles.taskDone : ""}`}>

      <div className={`${styles.stripe} ${meta.stripe}`} />

      <button
        className={`${styles.checkbox} ${todo.done ? styles.checked : ""}`}
        onClick={() => onToggle(todo.id)}
        aria-label="Bajarildi"
        type="button"
      >
        {todo.done && Icon.check}
      </button>

      <div className={styles.taskInfo}>
        <p className={styles.taskName}>{todo.text}</p>
        <div className={styles.taskMeta}>
          {dateInfo && (
            <span className={`${styles.taskDate} ${todo.done ? styles.dateDone : dateInfo.cls}`}>
              {todo.done ? "✓ Bajarildi" : dateInfo.label}
            </span>
          )}
          {todo.priority && (
            <span className={`${styles.priorityTag} ${meta.tag}`}>{todo.priority}</span>
          )}
        </div>
      </div>

      <div className={styles.actions} ref={menuRef}>
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
function StatCard({ label, value, sub, subRed, progress }) {
  return (
    <div className={styles.statCard}>
      <p className={styles.statLabel}>{label}</p>
      <p className={`${styles.statValue} ${subRed ? styles.valRed : sub ? styles.valGreen : ""}`}>
        {value}
      </p>
      {progress !== undefined ? (
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      ) : sub ? (
        <p className={styles.statSub}>{sub}</p>
      ) : subRed ? (
        <p className={styles.statSubRed}>{subRed}</p>
      ) : null}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN  —  Ish page
═══════════════════════════════════════════════ */
function Ish() {
  const { todos, addTodo, editTodo, removeTodo, toggleTodo } = useTodo();

  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [delTarget, setDelTarget] = useState(null);

  const ishTodos = todos.filter((t) => t.category === "Ish");
  const total = ishTodos.length;
  const done = ishTodos.filter((t) => t.done).length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  const deadlines = ishTodos.filter((t) => {
    if (!t.deadline || t.done) return false;
    const diff = (new Date(t.deadline).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 86400000;
    return diff >= 0 && diff < 1;
  }).length;

  const countBy = (p) => ishTodos.filter((t) => t.priority === p).length;
  const maxP = Math.max(countBy("Yuqori"), countBy("O'rta"), countBy("Past"), 1);
  const recentDone = ishTodos.filter((t) => t.done).slice(-4).reverse();

  /* ── handlers ── */
  const handleAdd = (data) =>
    addTodo({ ...data, category: "Ish" });

  // editTodo(id, changes) — context API
  const handleEdit = ({ text, priority, deadline }) =>
    editTodo(editTarget.id, { text, priority, deadline });

  // removeTodo(id) — context API
  const handleDel = () => {
    removeTodo(delTarget.id);
    setDelTarget(null);
  };

  const steps = [
    { key: "total", label: "Jami", count: total, color: "#4f8ef7" },
    { key: "active", label: "Jarayonda", count: total - done, color: "#f5a623" },
    { key: "done", label: "Bajarildi", count: done, color: "#3ecf78" },
  ];

  return (
    <div className={styles.container}>

      {/* ── HEADER ── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.dot} />
          <h1 className={styles.pageTitle}>Ish</h1>
          <span className={styles.badge}>{total} ta vazifa</span>
        </div>
        <button className={styles.addBtn} onClick={() => setAddOpen(true)}>
          {Icon.plus}
          <span className={styles.addBtnText}>Vazifa qo'sh</span>
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
        <StatCard label="Deadline bugun" value={deadlines} subRed={deadlines > 0 ? "bugun" : undefined} />
      </div>

      {/* ── MAIN GRID ── */}
      <div className={styles.grid}>

        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Barcha vazifalar</h2>
            <span className={styles.sectionBadge}>{total}</span>
          </div>

          <div className={styles.taskList}>
            {ishTodos.length === 0 ? (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>{Icon.empty}</div>
                <p className={styles.emptyTitle}>Vazifalar yo'q</p>
                <p className={styles.emptyDesc}>Yangi vazifa qo'shing</p>
                <button className={styles.emptyAddBtn} onClick={() => setAddOpen(true)}>
                  {Icon.plus} Vazifa qo'sh
                </button>
              </div>
            ) : (
              ishTodos.map((t) => (
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

        <div className={styles.aside}>

          <div className={styles.panel}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Prioritet bo'yicha</h2>
            </div>
            <div className={styles.panelBody}>
              {[
                { label: "Yuqori", cls: styles.fillRed },
                { label: "O'rta", cls: styles.fillYellow },
                { label: "Past", cls: styles.fillGray },
              ].map(({ label, cls }) => (
                <div className={styles.pRow} key={label}>
                  <span className={styles.pLabel}>{label}</span>
                  <div className={styles.pBarWrap}>
                    <div className={`${styles.pBar} ${cls}`}
                      style={{ width: `${(countBy(label) / maxP) * 100}%` }} />
                  </div>
                  <span className={styles.pCount}>{countBy(label)}</span>
                </div>
              ))}
              <div className={styles.divider} />
              {[
                { label: "Bajarilgan", count: done, cls: styles.fillGreen },
                { label: "Qolgan", count: total - done, cls: styles.fillBlue },
              ].map(({ label, count, cls }) => (
                <div className={styles.pRow} key={label}>
                  <span className={styles.pLabel}>{label}</span>
                  <div className={styles.pBarWrap}>
                    <div className={`${styles.pBar} ${cls}`}
                      style={{ width: total ? `${(count / total) * 100}%` : "0%" }} />
                  </div>
                  <span className={styles.pCount}>{count}</span>
                </div>
              ))}
            </div>
          </div>

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

export default Ish;