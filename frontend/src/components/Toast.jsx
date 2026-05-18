// Toast повідомлення
function Toast({ message, type = 'error' }) {
  return (
    // Контейнер toast
    <div
      style={{
        ...styles.toast,
        ...(type === 'success' ? styles.successToast : styles.errorToast),
      }}
    >
      {/* Текст повідомлення */}
      <p style={styles.text}>{message}</p>
    </div>
  );
}

// Стилі toast
const styles = {
  // Основний toast
  toast: {
    width: '100%',
    borderRadius: '14px',
    padding: '12px 14px',
    boxSizing: 'border-box',
    marginBottom: '14px',
    border: '1px solid',
  },

  // Toast помилки
  errorToast: {
    background: 'rgba(120, 25, 25, 0.18)',
    borderColor: '#FF5C5C',
  },

  // Toast успіху
  successToast: {
    background: 'rgba(47, 125, 31, 0.18)',
    borderColor: '#7ED957',
  },

  // Текст повідомлення
  text: {
    margin: 0,
    color: '#FFFFFF',
    fontSize: '12px',
    lineHeight: '18px',
    fontWeight: '500',
  },
};

export default Toast;
