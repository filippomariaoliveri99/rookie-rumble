export default function Logo({ className = "h-7" }) {
  return (
    <img
      src="/logo.webp"
      alt="Jet HR"
      className={`${className} w-auto`}
    />
  );
}
