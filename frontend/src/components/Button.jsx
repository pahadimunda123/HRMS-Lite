import styles from './Button.module.css'

export default function Button({ children, variant = 'primary', disabled, loading, className = '', ...props }) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${loading ? styles.loading : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className={styles.spinner} />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
