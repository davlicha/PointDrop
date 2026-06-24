import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const qrcodeRegionId = "html5qr-code-full-region";

function QRScanner({ onScanSuccess, onScanFailure }) {
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Створюємо унікальний ID для кожного маунта, щоб уникнути конфліктів StrictMode
    const uniqueId = `qr-${Math.random().toString(36).substring(2, 9)}`;
    
    // Створюємо div динамічно, щоб React не намагався ним керувати
    const scannerDiv = document.createElement('div');
    scannerDiv.id = uniqueId;
    scannerDiv.style.borderRadius = '16px';
    scannerDiv.style.overflow = 'hidden';
    
    containerRef.current.appendChild(scannerDiv);

    const config = {
      fps: 10,
      rememberLastUsedCamera: true,
      useBarCodeDetectorIfSupported: true,
      videoConstraints: {
        facingMode: "environment",
        width: { ideal: 1920, min: 1280 },
        height: { ideal: 1080, min: 720 }
      }
    };

    try {
      const html5QrcodeScanner = new Html5QrcodeScanner(uniqueId, config, false);
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

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().then(() => {
          // Після очищення сканера, видаляємо наш динамічний div
          if (containerRef.current && scannerDiv.parentNode === containerRef.current) {
            containerRef.current.removeChild(scannerDiv);
          }
        }).catch(error => {
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
      {/* Container where the dynamic scanner div will be appended */}
      <div ref={containerRef} className="qr-scanner-wrapper" />
      <style>{`
        .qr-scanner-wrapper > div {
          border: 2px dashed var(--primary) !important;
          border-radius: 16px;
        }
        .qr-scanner-wrapper img[alt="Info icon"] {
          display: none;
        }
        .qr-scanner-wrapper button {
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
        .qr-scanner-wrapper a {
          color: var(--primary);
        }
      `}</style>
    </div>
  );
}

export default QRScanner;
