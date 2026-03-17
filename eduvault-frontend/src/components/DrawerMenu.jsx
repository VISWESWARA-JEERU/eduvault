import { useEffect } from "react";
import "./DrawerMenu.css";

export default function DrawerMenu({ open, onClose, title, items }) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  return (
    <>
      <div
        className={`drawer-backdrop ${open ? "open" : ""}`}
        onClick={onClose}
      />
      <aside className={`drawer ${open ? "open" : ""}`}>
        <div className="drawer-header">
          <div className="drawer-title">{title || "Menu"}</div>
          <button className="drawer-close" type="button" onClick={onClose}>
            ✕
          </button>
        </div>
        <nav className="drawer-list">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              className="drawer-item"
              onClick={() => {
                item.onClick();
                onClose();
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
