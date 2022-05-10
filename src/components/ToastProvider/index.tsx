import React, { useState } from "react";
export interface ToastOptions {
  duration?: number;
  disablePage?: boolean;
}
const DEFAULT_TOAST_OPTIONS: ToastOptions = {
  disablePage: true,
};

export const ToastContext = React.createContext({
  showToast: (
    component: JSX.Element | null,
    options: ToastOptions = {}
  ): void => {
    options;
    component;
  },
  hideToast: () => null,
});

const ToastProvider = ({ children }: { children: JSX.Element }) => {
  const [toast, showToast] = useState<{
    component: JSX.Element;
    options?: ToastOptions;
  } | null>(null);
  const hideToast = () => showToast(null);

  return (
    <ToastContext.Provider
      value={{
        showToast: (
          component: JSX.Element,
          options: ToastOptions = DEFAULT_TOAST_OPTIONS
        ) => {
          showToast({ component, options });
        },
        hideToast,
      }}
    >
      <div className="toastPageContainer">{children}</div>
      {console.log('toasing success',toast)}
      {toast?.options?.disablePage ? <div className="pageDisabler" /> : null}
      {toast ? toast.component : null}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
