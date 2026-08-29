export default function Footer() {
  return (
    <footer className="border-t border-panelLine bg-[#071A1D]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 font-body text-xs text-#2DD4BF md:flex-row">
        <span>© {new Date().getFullYear()}Pearl Visual. Built in Uganda.</span>
        <span className="font-mono">Kampala · Uganda</span>
      </div>
    </footer>
  )
}
