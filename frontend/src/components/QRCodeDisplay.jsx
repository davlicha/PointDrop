import { QRCodeCanvas } from 'qrcode.react';

function QRCodeDisplay({ value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          background: '#fff',
          padding: '16px',
          borderRadius: '12px',
        }}
      >
        <QRCodeCanvas value={value} size={140} />
      </div>
    </div>
  );
}

export default QRCodeDisplay;
