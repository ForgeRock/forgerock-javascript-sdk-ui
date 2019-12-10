declare module '*.html' {
  const content: string;
  export = content;
}

interface Window {
  grecaptcha: {
    render: (
      container: string | HTMLElement,
      params: {
        callback: (result: string) => void;
        'expired-callback': () => void;
        sitekey: string;
      },
    ) => void;
  };
}
