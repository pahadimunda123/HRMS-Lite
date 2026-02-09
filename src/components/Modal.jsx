import { useEffect } from 'react'
import styles from './Modal.module.css'

export default function Modal({ title, children, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{title}</h2>
          {onClose && (
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
              ×
            </button>
          )}
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}
