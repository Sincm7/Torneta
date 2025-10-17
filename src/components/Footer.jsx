import { Link } from 'react-router-dom';

const footerLinks = [
  { name: 'About', path: '/about' },
  { name: 'Terms', path: '/terms' },
  { name: 'Contact', path: '/contact' },
];

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm text-neutral-500">© {new Date().getFullYear()} Torneta. All rights reserved.</p>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-neutral-600">
          {footerLinks.map((link) => (
            <Link key={link.name} to={link.path} className="transition hover:text-neutral-900">
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
