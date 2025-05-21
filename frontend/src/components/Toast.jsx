import { useRef, useImperativeHandle, forwardRef } from "react";

const Toast = forwardRef(({ message, type }, ref) => {
  const toastRef = useRef();

  useImperativeHandle(ref, () => ({
    show: (message, type = "primary") => {
      const toastElement = toastRef.current;
      const toastBody = toastElement.querySelector(".toast-body");

      toastBody.textContent = message;
      toastElement.className = `toast align-items-center text-bg-${type} border-0`;

      try {
        // ✅ Defensive check for Bootstrap Toast
        if (window.bootstrap?.Toast) {
          const toast = new window.bootstrap.Toast(toastElement);
          toast.show();
        } else {
          console.warn(
            "⚠️ Bootstrap Toast is not available. Using fallback alert."
          );
          alert(message); // fallback
        }
      } catch (err) {
        console.error("🚨 Toast error:", err);
        alert(message); // fallback in case of unexpected error
      }
    },
  }));

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
      <div
        ref={toastRef}
        className="toast align-items-center text-bg-primary border-0"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <div className="toast-body">{message}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  );
});

export default Toast;
