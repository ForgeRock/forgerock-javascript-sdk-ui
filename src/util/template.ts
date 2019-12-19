const replaceTokens = (s: string, tokens: { [key: string]: string }): string => {
  for (const k in tokens) {
    if (tokens.hasOwnProperty(k)) {
      s = s.replace(new RegExp(`{${k}}`, 'g'), tokens[k]);
    }
  }
  return s;
};

export { replaceTokens };
