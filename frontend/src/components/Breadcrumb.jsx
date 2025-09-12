import { Link } from "react-router-dom";

export default function Breadcrumb({ items }) {
  return (
    <nav className="text-sm text-gray-500 mb-4">
      {items.map((item, idx) => (
        <span key={idx}>
          {item.to ? (
            <Link
              to={item.to}
              className="text-blue-600 hover:underline"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-600">{item.label}</span>
          )}
          {idx < items.length - 1 && " > "}
        </span>
      ))}
    </nav>
  );
}
