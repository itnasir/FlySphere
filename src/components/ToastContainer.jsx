import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function ToastContainer() {
  const { toasts, removeToast } = useApp()

  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-[360px] w-[calc(100%-2rem)]"
    >
      {toasts.map((toast) => {
        const isErr = toast.type === 'error'
        const isInfo = toast.type === 'info'
        return (
          <div
            key={toast.id}
            className={`rounded-[14px] border px-4 py-3 shadow-book flex items-start gap-3 bg-white ${
              isErr
                ? 'border-bad/40 text-bad'
                : isInfo
                ? 'border-royal/40 text-navy'
                : 'border-ok/40 text-ok'
            }`}
          >
            {isErr ? (
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            ) : isInfo ? (
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            )}
            <p className="text-[13.5px] font-semibold text-ink flex-1 leading-snug">
              {toast.message}
            </p>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
              className="text-muted hover:text-ink cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
