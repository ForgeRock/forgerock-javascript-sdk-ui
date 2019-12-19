function el<T extends HTMLElement>(tagName: string, className?: string): T {
  const d = document.createElement(tagName);
  if (className) {
    d.className = className;
  }
  return d as T;
}

export { el };
