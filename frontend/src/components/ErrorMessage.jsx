import styles from './ErrorMessage.module.css'

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.icon}>⚠</span>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button className={styles.retryBtn} onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
