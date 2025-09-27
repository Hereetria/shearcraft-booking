export default function FooterBottom() {
  const linkCls =
    "block text-xs text-slate-600 hover:text-slate-900/90 cursor-pointer hover:underline underline-offset-2 decoration-slate-400 transition-colors";

  return (
    <div className="mt-8 pt-6 border-t border-slate-200/60">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500">© 2025 ShearCraft</span>
          <div className="flex items-center gap-3">
            <span role="link" tabIndex={0} className={linkCls}>
              Privacy
            </span>
            <span className="text-xs text-slate-300">·</span>
            <span role="link" tabIndex={0} className={linkCls}>
              Terms
            </span>
            <span className="text-xs text-slate-300">·</span>
            <span role="link" tabIndex={0} className={linkCls}>
              Contact
            </span>
          </div>
        </div>
        <span className="text-xs text-slate-500">
          Made by Hereetria. All rights reserved.
        </span>
      </div>
    </div>
  );
}
