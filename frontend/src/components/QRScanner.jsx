import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const qrcodeRegionId = "html5qr-code-full-region";

function QRScanner({ onScanSuccess, onScanFailure }) {
  const [hasError, setHasError] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    // Конфігурація сканера
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      rememberLastUsedCamera: true,
      supportedScanTypes: [0] // 0 = QR_CODE
    };

    try {
      const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, false);
      scannerRef.current = html5QrcodeScanner;

      html5QrcodeScanner.render(
        (decodedText, decodedResult) => {
          if (onScanSuccess) {
            onScanSuccess(decodedText, decodedResult);
          }
        },
        (errorMessage) => {
          if (onScanFailure) {
            onScanFailure(errorMessage);
          }
        }
      );
    } catch (err) {
      console.error("Помилка ініціалізації сканера:", err);
      setHasError(true);
    }

    // Очищення при анмаунті
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
      }
    };
  }, [onScanSuccess, onScanFailure]);

  if (hasError) {
    return (
      <div className="notice-error" style={{ textAlign: 'center', padding: '20px' }}>
        Не вдалося запустити сканер. Перевірте дозволи на використання камери.
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      {/* Container where the scanner will be rendered */}
      <div id={qrcodeRegionId} style={{ borderRadius: '16px', overflow: 'hidden' }} />
      <style>{`
        #${qrcodeRegionId} {
          border: 2px dashed var(--primary) !important;
          border-radius: 16px;
        }
        #${qrcodeRegionId} img[alt="Info icon"] {
          display: none;
        }
        #${qrcodeRegionId} button {
          background-color: var(--primary);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          margin-top: 10px;
          margin-bottom: 10px;
        }
        #${qrcodeRegionId} a {
          color: var(--primary);
        }
      `}</style>
    </div>
  );
}

export default QRScanner;
