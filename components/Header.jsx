import Logo from "./Logo";

export default function Header({ logoSize = "h-7" }) {
  return (
    <div className="border-b border-black px-6 py-4 flex items-center justify-between">
      <Logo className={logoSize} />
      <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
        Live Voting
      </div>
    </div>
  );
}
