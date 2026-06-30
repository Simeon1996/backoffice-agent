export function Wordmark({ onInk = false }: { onInk?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden>
        <path d="M5 10.5C5 9.67 5.67 9 6.5 9H12l1.9 2.2H25.5c.83 0 1.5.67 1.5 1.5V23c0 .83-.67 1.5-1.5 1.5h-19C5.67 24.5 5 23.83 5 23V10.5Z" fill="#d8c393" />
        <path d="M5 13.2h22V23c0 .83-.67 1.5-1.5 1.5h-19C5.67 24.5 5 23.83 5 23v-9.8Z" fill="#f4efe4" />
        <circle cx="22" cy="18.6" r="3.3" fill="none" stroke="#b23a2e" strokeWidth="1.5" />
        <path d="M20.4 18.7l1.1 1.1 2.2-2.4" stroke="#b23a2e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span
        className="font-serif text-[19px] font-semibold tracking-tight"
        style={{ color: onInk ? "var(--color-ink-on)" : "var(--color-text)" }}
      >
        Manila
      </span>
    </span>
  );
}
