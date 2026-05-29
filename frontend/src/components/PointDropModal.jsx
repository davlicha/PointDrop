import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { transferPoints } from '../services/transactionService';

const transferSchema = z.object({
  amount: z
    .number({
      required_error: "Сума є обов'язковою",
      invalid_type_error: "Сума повинна бути числом",
    })
    .int("Тільки цілі числа")
    .positive("Сума повинна бути більшою за нуль"),
});

export default function PointDropModal({ selectedUser, merchantId, senderId, onClose, onSuccess }) {
  const [serverError, setServerError] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(transferSchema),
    defaultValues: { amount: '' },
  });

  const onSubmit = async (data) => {
    setServerError('');
    setIsTransferring(true);
    try {
      await transferPoints({
        senderId,
        merchantId,
        receiverId: selectedUser.id,
        amount: data.amount,
      });
      onSuccess(data.amount);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Не вдалося виконати переказ';
      setServerError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="overlay">
      <div className="modal-content" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <h3 className="section-title">Переказ балів</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>
          Ви впевнені, що хочете надіслати бали користувачу <b style={{ color: 'var(--text-primary)' }}>{selectedUser.name}</b>?
        </p>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Кількість балів</label>
            <input
              type="number"
              className="input-base"
              placeholder="Введіть суму"
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && <span className="notice-error">{errors.amount.message}</span>}
          </div>

          {serverError && <div className="notice-error" style={{ background: 'var(--danger-light)', padding: '12px', borderRadius: '12px' }}>{serverError}</div>}

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={onClose}
              disabled={isSubmitting || isTransferring}
            >
              Відмінити
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={isSubmitting || isTransferring}
            >
              {(isSubmitting || isTransferring) ? 'Обробка...' : 'Підтвердити'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
