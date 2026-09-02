export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/80">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-xs text-slate-600 md:flex-row">
        <span>© {new Date().getFullYear()} Pearl Visual. Built in Uganda.</span>
        <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#2B7A4B]">Kampala · Uganda</span>
      </div>
    </footer>
  )
}
