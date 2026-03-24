import { createContext, useContext, useState, useEffect, useMemo } from "react";

// ─── Initial data ────────────────────────────────────────────────────────────
const INITIAL_TODOS = [
    { id: 1, text: "Meeting tayyorlash", category: "Ish", priority: "Yuqori", done: false, deadline: "2026-03-23" },
    { id: 2, text: "Hisobot yozish", category: "Ish", priority: "O'rta", done: false, deadline: "2026-03-27" },
    { id: 3, text: "Taqdimot tayyorlash", category: "Ish", priority: "Past", done: true, deadline: null },
    { id: 4, text: "Kitob o'qish", category: "O'qish", priority: "O'rta", done: false, deadline: "2026-03-28" },
    { id: 5, text: "React darsligi o'qish", category: "O'qish", priority: "O'rta", done: true, deadline: null },
    { id: 6, text: "CSS Grid o'rganish", category: "O'qish", priority: "Yuqori", done: true, deadline: null },
    { id: 7, text: "Gym borish",
         category: "Shaxsiy", priority: "Past", done: false, deadline: "2026-03-23" },
    { id: 8, text: "Shifokorga borish", category: "Shaxsiy", priority: "O'rta", done: false, deadline: "2026-03-26" },
    { id: 9, text: "Uy tozalash", category: "Shaxsiy", priority: "Past", done: true, deadline: null },
    { id: 10, text: "UI dizayn ishlash", category: "Loyiha", priority: "Yuqori", done: false, deadline: "2026-03-23" },
    { id: 11, text: "API integratsiya", category: "Loyiha", priority: "O'rta", done: false, deadline: "2026-03-24" },
    { id: 12, text: "Loyiha rejasi", category: "Loyiha", priority: "Past", done: true, deadline: null },
];

const INITIAL_HABITS = [
    { id: 1, name: "Erta turish", icon: "clock", streak: 6, log: [true, true, true, false, true, true, true] },
    { id: 2, name: "Sport qilish", icon: "activity", streak: 4, log: [true, false, true, true, false, true, false] },
    { id: 3, name: "Meditatsiya", icon: "plus-circle", streak: 5, log: [true, true, true, true, true, false, false] },
];

const INITIAL_GOALS = [
    { id: 1, name: "Vazn yo'qotish", current: 6, target: 10, unit: "kg", deadline: "2026-03-31" },
    { id: 2, name: "Tejash maqsadi", current: 2000000, target: 5000000, unit: "so'm", deadline: "2026-04-30" },
];

const INITIAL_BOOKS = [
    { id: 1, title: "Clean Code", author: "Robert C. Martin", progress: 75, done: false },
    { id: 2, title: "The Pragmatic Programmer", author: "Hunt & Thomas", progress: 30, done: false },
    { id: 3, title: "You Don't Know JS", author: "Kyle Simpson", progress: 100, done: true },
];

// ─── Helper: localStorage ────────────────────────────────────────────────────
function loadFromStorage(key, fallback) {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch {
        return fallback;
    }
}

function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        console.warn("localStorage ga yozib bo'lmadi");
    }
}

// ─── Context ─────────────────────────────────────────────────────────────────
const TodoContext = createContext(null);

// ─── Provider ────────────────────────────────────────────────────────────────
let nextId = 100;

export function TodoProvider({ children }) {
    // ── State ──────────────────────────────────────────────────────────────────
    const [todos, setTodos] = useState(() => loadFromStorage("todos", INITIAL_TODOS));
    const [habits, setHabits] = useState(() => loadFromStorage("habits", INITIAL_HABITS));
    const [goals, setGoals] = useState(() => loadFromStorage("goals", INITIAL_GOALS));
    const [books, setBooks] = useState(() => loadFromStorage("books", INITIAL_BOOKS));
    const [mood, setMood] = useState(() => loadFromStorage("mood", null));

    // ── localStorage sync ──────────────────────────────────────────────────────
    useEffect(() => saveToStorage("todos", todos), [todos]);
    useEffect(() => saveToStorage("habits", habits), [habits]);
    useEffect(() => saveToStorage("goals", goals), [goals]);
    useEffect(() => saveToStorage("books", books), [books]);
    useEffect(() => saveToStorage("mood", mood), [mood]);

    // ── TODO funksiyalari ──────────────────────────────────────────────────────

    // Qo'shish
    function addTodo({ text, category, priority, deadline = null }) {
        if (!text?.trim()) return;
        setTodos(prev => [
            ...prev,
            { id: nextId++, text: text.trim(), category, priority, done: false, deadline },
        ]);
    }

    // Bajarildi toggle
    function toggleTodo(id) {
        setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    }

    // O'chirish
    function removeTodo(id) {
        setTodos(prev => prev.filter(t => t.id !== id));
    }

    // Tahrirlash
    function editTodo(id, changes) {
        setTodos(prev => prev.map(t => t.id === id ? { ...t, ...changes } : t));
    }

    // ── HABIT funksiyalari ─────────────────────────────────────────────────────

    function addHabit(name, icon = "circle") {
        setHabits(prev => [
            ...prev,
            { id: nextId++, name, icon, streak: 0, log: [false, false, false, false, false, false, false] },
        ]);
    }

    function toggleHabitDay(id, dayIndex) {
        setHabits(prev => prev.map(h => {
            if (h.id !== id) return h;
            const log = [...h.log];
            log[dayIndex] = !log[dayIndex];
            const streak = log.filter(Boolean).length;
            return { ...h, log, streak };
        }));
    }

    function removeHabit(id) {
        setHabits(prev => prev.filter(h => h.id !== id));
    }

    // ── GOAL funksiyalari ──────────────────────────────────────────────────────

    function addGoal({ name, current = 0, target, unit, deadline }) {
        setGoals(prev => [
            ...prev,
            { id: nextId++, name, current, target, unit, deadline },
        ]);
    }

    function updateGoalProgress(id, current) {
        setGoals(prev => prev.map(g => g.id === id ? { ...g, current } : g));
    }

    function removeGoal(id) {
        setGoals(prev => prev.filter(g => g.id !== id));
    }

    // ── BOOK funksiyalari ──────────────────────────────────────────────────────

    function addBook({ title, author }) {
        setBooks(prev => [
            ...prev,
            { id: nextId++, title, author, progress: 0, done: false },
        ]);
    }

    function updateBookProgress(id, progress) {
        setBooks(prev => prev.map(b =>
            b.id === id ? { ...b, progress, done: progress >= 100 } : b
        ));
    }

    function removeBook(id) {
        setBooks(prev => prev.filter(b => b.id !== id));
    }

    // ── Derived / computed qiymatlar ───────────────────────────────────────────
    const stats = useMemo(() => {
        const total = todos.length;
        const done = todos.filter(t => t.done).length;
        const percent = total ? Math.round((done / total) * 100) : 0;
        const today = new Date().toISOString().split("T")[0];
        const urgent = todos.filter(t => !t.done && t.deadline === today).length;

        // Kategoriya bo'yicha
        const byCategory = ["Ish", "O'qish", "Shaxsiy", "Loyiha"].map(cat => ({
            category: cat,
            total: todos.filter(t => t.category === cat).length,
            done: todos.filter(t => t.category === cat && t.done).length,
        }));

        // Prioritet bo'yicha
        const byPriority = ["Yuqori", "O'rta", "Past"].map(pri => ({
            priority: pri,
            total: todos.filter(t => t.priority === pri).length,
            done: todos.filter(t => t.priority === pri && t.done).length,
        }));

        return { total, done, percent, urgent, byCategory, byPriority };
    }, [todos]);

    // ── Context value ──────────────────────────────────────────────────────────
    const value = {
        // Data
        todos,
        habits,
        goals,
        books,
        mood,
        stats,

        // Todo actions
        addTodo,
        toggleTodo,
        removeTodo,
        editTodo,

        // Habit actions
        addHabit,
        toggleHabitDay,
        removeHabit,

        // Goal actions
        addGoal,
        updateGoalProgress,
        removeGoal,

        // Book actions
        addBook,
        updateBookProgress,
        removeBook,

        // Mood
        setMood,
    };

    return (
        <TodoContext.Provider value={value}>
            {children}
        </TodoContext.Provider>
    );
}

// ─── Custom hook ─────────────────────────────────────────────────────────────
export function useTodo() {
    const ctx = useContext(TodoContext);
    if (!ctx) throw new Error("useTodo faqat <TodoProvider> ichida ishlatilishi kerak");
    return ctx;
}

export default TodoContext;