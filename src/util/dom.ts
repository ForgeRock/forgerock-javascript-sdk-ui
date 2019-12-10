const injectCss = (stylesheet: string) => {
  const head = document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  style.innerHTML = stylesheet;
  head.insertBefore(style, head.firstChild);
};

const injectFont = (file: string) => {
  const linkRef = document.createElement('link');
  linkRef.setAttribute('rel', 'stylesheet');
  linkRef.setAttribute('type', 'text/css');
  linkRef.setAttribute('href', file);
  document.getElementsByTagName('head')[0].prepend(linkRef);
};

function el<T extends HTMLElement>(tagName: string, className?: string) {
  const d = document.createElement(tagName);
  if (className) {
    d.className = className;
  }
  return d as T;
}

export { el, injectCss, injectFont };
