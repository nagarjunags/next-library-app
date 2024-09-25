// global.d.ts or calendly.d.ts
declare global {
    interface Window {
      Calendly: {
        initInlineWidget: (options: {
          url: string;
          parentElement: Element;
          prefill?: Record<string, any>;
          utm?: Record<string, any>;
        }) => void;
      };
    }
  }
  
  export {}; // This line is necessary for the file to be treated as a module.
  