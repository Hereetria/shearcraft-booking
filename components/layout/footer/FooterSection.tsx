interface FooterSectionProps {
  title: string;
  links: string[];
}

export default function FooterSection({ title, links }: FooterSectionProps) {
  const linkCls =
    "block text-xs text-slate-600 hover:text-slate-900/90 cursor-pointer hover:underline underline-offset-2 decoration-slate-400 transition-colors";

  return (
    <div className="md:col-span-3">
      <h3 className="text-sm font-semibold text-slate-900 mb-3">{title}</h3>
      <ul className="mt-3 space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <span role="link" tabIndex={0} className={linkCls}>
              {link}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
