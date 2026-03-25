import { useState, useMemo, useEffect } from "react";
import styles from "./Calendar.module.css";
import { useTodo } from "../context/TodoContext";

const DAYS = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];
const MONTHS = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
];

const CATEGORIES = {
  Ish: { color: "#3b82f6", bg: "#eff6ff", label: "Ish" },
  "O'qish": { color: "#10b981", bg: "#ecfdf5", label: "O'qish" },
  Shaxsiy: { color: "#8b5cf6", bg: "#f5f3ff", label: "Shaxsiy" },
  Loyiha: { color: "#f97316", bg: "#fff7ed", label: "Loyiha" },
};

const PRIORITIES = {
  Yuqori: { color: "#ef4444", label: "Yuqori" },
  "O'rta": { color: "#f59e0b", label: "O'rta" },
  Past: { color: "#6b7280", label: "Past" },
};

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}
function toKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export default function CalendarApp() {
  const { todos } = useTodo();

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
    day: today.getDate(),
  });
  const [showEvents, setShowEvents] = useState(true); // 📱 Mobile uchun toggle

  // 🔔 NOTIFICATION LOGIC (o'zgarmadi)
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const checkReminders = () => {
      const nowKey = toKey(today.getFullYear(), today.getMonth(), today.getDate());
      todos.forEach(t => {
        if (t.deadline === nowKey && !t.done && Notification.permission === "granted") {
          new Notification("Eslatma!", {
            body: `Bugun: ${t.text}`,
            icon: "/favicon.ico"
          });
        }
      });
    };

    const interval = setInterval(checkReminders, 1000 * 60 * 60);
    checkReminders();
    return () => clearInterval(interval);
  }, [todos]);

  const events = useMemo(() => {
    return todos.reduce((acc, t) => {
      if (!t.deadline) return acc;
      if (!acc[t.deadline]) acc[t.deadline] = [];
      acc[t.deadline].push({
        id: t.id,
        title: t.text,
        category: t.category,
        priority: t.priority,
        done: t.done,
      });
      return acc;
    }, {});
  }, [todos]);

  const selectedKey = toKey(selected.year, selected.month, selected.day);
  const selectedEvents = events[selectedKey] || [];

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const prevDays = getDaysInMonth(year, month - 1);

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear(y => y - 1);
    } else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear(y => y + 1);
    } else setMonth(m => m + 1);
  }

  function goToday() {
    const t = new Date();
    setYear(t.getFullYear());
    setMonth(t.getMonth());
    setSelected({
      year: t.getFullYear(),
      month: t.getMonth(),
      day: t.getDate(),
    });
  }

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    cells.push({ day: prevDays - i, cur: false, key: toKey(y, m, prevDays - i) });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, cur: true, key: toKey(year, month, d) });
  }

  const rem = 42 - cells.length;
  for (let d = 1; d <= rem; d++) {
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    cells.push({ day: d, cur: false, key: toKey(y, m, d) });
  }

  const isToday = (cell) =>
    cell.cur && cell.day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const isSelected = (cell) =>
    cell.cur && cell.day === selected.day && month === selected.month && year === selected.year;

  function dayCellClass(cell) {
    return [
      styles.dayCell,
      !cell.cur ? styles.otherMonth : "",
      isSelected(cell) ? styles.isSelected : "",
      isToday(cell) ? styles.isToday : "",
    ].join(" ");
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.left}>
          <div className={styles.header}>
            <button onClick={prevMonth} aria-label="O'tgan oy">‹</button>
            <span>{MONTHS[month]} {year}</span>
            <div className={styles.headerRight}>
              <button onClick={nextMonth} aria-label="Keyingi oy">›</button>
              <button onClick={goToday} className={styles.todayBtn}>Bugun</button>
            </div>
          </div>

          <div className={styles.grid}>
            {DAYS.map(d => (
              <div key={d} className={styles.dayHead}>{d}</div>
            ))}

            {cells.map((cell, i) => {
              const evts = events[cell.key] || [];
              return (
                <div
                  key={i}
                  className={dayCellClass(cell)}
                  onClick={() => cell.cur && setSelected({ year, month, day: cell.day })}
                  role="button"
                  tabIndex={cell.cur ? 0 : -1}
                >
                  <div className={styles.dayNum}>{cell.day}</div>

                  {/* 📱 Mobile: faqat nuqtalar, Desktop: matn */}
                  {evts.slice(0, 2).map(e => (
                    <div
                      key={e.id}
                      className={styles.evtDot}
                      style={{
                        background: CATEGORIES[e.category]?.bg,
                        color: CATEGORIES[e.category]?.color,
                        borderLeft: `3px solid ${PRIORITIES[e.priority]?.color}`,
                      }}
                      title={e.title} // Hover uchun tooltip
                    >
                      {e.done ? "✅" : "●"}
                      <span className={styles.evtText}>{e.title}</span>
                    </div>
                  ))}

                  {evts.length > 2 && (
                    <div className={styles.moreBadge}>+{evts.length - 2}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 📱 Mobile toggle button */}
        <button
          className={styles.toggleBtn}
          onClick={() => setShowEvents(!showEvents)}
          aria-expanded={showEvents}
        >
          {showEvents ? "📋 Yopish" : "📋 Rejalar"}
        </button>

        {showEvents && (
          <div className={styles.right}>
            <div className={styles.rightHeader}>
              <h3>Tanlangan kun</h3>
              <div className={styles.selectedDate}>
                {selected.day} {MONTHS[selected.month]} {selected.year}
              </div>
            </div>

            {selectedEvents.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📝</div>
                <p>Kun uchun reja yo‘q</p>
              </div>
            ) : (
              selectedEvents.map(e => (
                <div key={e.id} className={styles.evtCard}>
                  <div className={styles.evtTitle}>
                    {e.done ? "✅" : "○"} {e.title}
                  </div>
                  <div className={styles.evtTags}>
                    <span className={styles.tag}
                      style={{ background: CATEGORIES[e.category]?.bg, color: CATEGORIES[e.category]?.color }}>
                      {e.category}
                    </span>
                    <span className={styles.priorityTag}
                      style={{ color: PRIORITIES[e.priority]?.color }}>
                      {e.priority}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}