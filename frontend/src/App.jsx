import { useState } from 'react';

function App() {
  // Поточний екран
  const [screen, setScreen] = useState('main');

  // Дані транзакцій
  const transactions = [
    {
      id: 1,
      amount: '+100',
      name: 'Наталі',
      time: '5 хвилин тому',
      status: 'Отримано',
      color: '#2E7D32',
    },
    {
      id: 2,
      amount: '-50',
      name: 'Ліза',
      time: '1 година тому',
      status: 'Переказано',
      color: '#8B2E2E',
    },
    {
      id: 3,
      amount: '+200',
      name: 'Антон',
      time: '5 годин тому',
      status: 'Отримано',
      color: '#2E7D32',
    },
  ];

  // Відкриває потрібний екран
  const renderScreen = () => {
    switch (screen) {
      case 'main':
        return <MainScreen setScreen={setScreen} transactions={transactions} />;
      case 'qr':
        return <QRScreen setScreen={setScreen} />;
      case 'scan':
        return <ScanScreen setScreen={setScreen} />;
      case 'profile':
        return <ProfileScreen setScreen={setScreen} />;
      case 'intro':
        return <IntroScreen setScreen={setScreen} />;
      case 'success':
        return <SuccessScreen setScreen={setScreen} />;
      case 'error':
        return <ErrorScreen setScreen={setScreen} />;
      case 'menu':
        return <MenuScreen setScreen={setScreen} transactions={transactions} />;
      default:
        return <MainScreen setScreen={setScreen} transactions={transactions} />;
    }
  };

  return <main style={styles.page}>{renderScreen()}</main>;
}

// Головний екран
function MainScreen({ setScreen, transactions }) {
  return (
    <section style={styles.phone}>
      <Header
        title="PointDrop"
        leftAction={() => setScreen('menu')}
        leftSymbol="☰"
        showRightIcons
        setScreen={setScreen}
      />

      <div style={styles.balanceCard}>
        <div style={styles.balanceLeft}>
          <span style={styles.star}>✦</span>
          <p style={styles.greeting}>Привіт, Анна!</p>
        </div>

        <div style={styles.balanceRight}>
          <p style={styles.balanceText}>Баланс: 1000 балів</p>
          <span style={styles.cardMini}>▭</span>
        </div>
      </div>

      <div style={styles.transferCard}>
        <h2 style={styles.sectionTitle}>Переказати бали</h2>

        <div style={styles.transferRow}>
          <div style={styles.inputsColumn}>
            <input style={styles.input} placeholder="Номер або нік" />
            <input style={styles.input} placeholder="Кількість" />
            <button
              style={styles.greenButton}
              onClick={() => setScreen('intro')}
            >
              Переказати
            </button>
          </div>

          <div style={styles.qrColumn}>
            <div style={styles.qrBox} onClick={() => setScreen('qr')}>
              <FakeQR />
            </div>
            <p style={styles.qrLabel}>Показати QR для отримання балів</p>
          </div>
        </div>
      </div>

      <h3 style={styles.transactionsTitle}>Останні транзакції</h3>

      <div style={styles.transactionsList}>
        {transactions.map((item) => (
          <div key={item.id} style={styles.transactionCard}>
            <div style={styles.transactionTop}>
              <div style={styles.transactionLeft}>
                <span style={{ ...styles.amount, color: item.color }}>
                  {item.amount}
                </span>
                <span style={{ ...styles.cardMini, color: item.color }}>▭</span>
                <span style={styles.personName}>{item.name}</span>
              </div>

              <div style={styles.transactionRight}>
                <span style={styles.timeText}>{item.time}</span>
              </div>
            </div>

            <div style={styles.transactionBottom}>
              <span style={styles.statusText}>{item.status}</span>
              <span style={styles.arrow}>{'>'}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Екран QR
function QRScreen({ setScreen }) {
  return (
    <section style={styles.phone}>
      <Header
        title="QR-код"
        leftAction={() => setScreen('main')}
        leftSymbol="←"
        setScreen={setScreen}
      />

      <div style={styles.centerBlock}>
        <div style={styles.bigQrBox}>
          <FakeQR />
        </div>

        <div style={styles.infoCard}>
          <p style={styles.infoText}>Клієнт: Корніївська Анна Сергіївна</p>
          <p style={styles.infoText}>Баланс: 1000 балів</p>
        </div>

        <button
          style={styles.greenButtonWide}
          onClick={() => setScreen('main')}
        >
          Готово
        </button>
      </div>
    </section>
  );
}

// Екран сканера
function ScanScreen({ setScreen }) {
  return (
    <section style={styles.phone}>
      <Header
        title="Сканер"
        leftAction={() => setScreen('main')}
        leftSymbol="←"
        setScreen={setScreen}
      />

      <div style={styles.centerBlock}>
        <div style={styles.scanArea}>
          <div style={styles.scanQrWrap}>
            <FakeQR />
          </div>
        </div>

        <p style={styles.scanHint}>Наведіть камеру на QR-код</p>

        <div style={styles.rowButtons}>
          <button style={styles.lightButton}>Ліхтарик</button>
          <button style={styles.lightButton}>Камера</button>
        </div>

        <div style={styles.rowButtons}>
          <button
            style={styles.greenButtonWide}
            onClick={() => setScreen('success')}
          >
            Успішне сканування
          </button>
          <button
            style={styles.redButtonWide}
            onClick={() => setScreen('error')}
          >
            Помилка
          </button>
        </div>
      </div>
    </section>
  );
}

// Екран профілю
function ProfileScreen({ setScreen }) {
  return (
    <section style={styles.phone}>
      <Header
        title="Профіль"
        leftAction={() => setScreen('main')}
        leftSymbol="←"
        setScreen={setScreen}
      />

      <div style={styles.profileTop}>
        <div style={styles.avatar}>◯</div>
        <button style={styles.smallGhostButton}>Змінити фото</button>
      </div>

      <div style={styles.profileBalance}>Поточний баланс: 1000</div>

      <div style={styles.profileCard}>
        <p style={styles.profileText}>Ім'я: Корніївська Анна Сергіївна</p>
        <p style={styles.profileText}>Нік: @anna_0</p>
        <p style={styles.profileText}>Вік: 25 років</p>
        <p style={styles.profileText}>Дата народження: 02.07.2001</p>
        <p style={styles.profileText}>Телефон: +3809556289</p>
        <p style={styles.profileText}>E-mail: anna.kor123@gmail.com</p>
      </div>

      <div style={styles.bottomButtons}>
        <button style={styles.redButtonWide}>Вийти</button>
        <button
          style={styles.greenButtonWide}
          onClick={() => setScreen('main')}
        >
          Повернутися
        </button>
      </div>
    </section>
  );
}

// Екран швидкого переказу
function IntroScreen({ setScreen }) {
  return (
    <section style={styles.phone}>
      <Header
        title="Швидкий переказ"
        leftAction={() => setScreen('main')}
        leftSymbol="←"
        setScreen={setScreen}
      />

      <div style={styles.topStepRow}>
        <span style={styles.stepText}>Крок 1 з 3</span>
        <span style={styles.balanceSmall}>Баланс: 1000 балів</span>
      </div>

      <div style={styles.steps}>
        <span style={styles.activeStep}>1</span>
        <span style={styles.line}></span>
        <span style={styles.step}>2</span>
        <span style={styles.line}></span>
        <span style={styles.step}>3</span>
      </div>

      <div style={styles.whitePanel}>
        <p style={styles.panelTitle}>Отримувач</p>
        <input
          style={styles.darkInput}
          placeholder="Введіть номер телефону або нік"
        />

        <div style={styles.userList}>
          <div style={styles.userRow}>
            <span>Наталя</span>
          </div>
          <div style={styles.userRowActive}>
            <span>Ліза</span>
            <span>✓</span>
          </div>
          <div style={styles.userRow}>
            <span>Антон</span>
          </div>
        </div>

        <div style={styles.smallScanBox}>Скан</div>
      </div>

      <div style={styles.successPanel}>
        <p style={styles.successPanelTitle}>Користувач Ліза знайдено</p>
        <div style={styles.successPanelRow}>
          <div>
            <p style={styles.successName}>Ліза</p>
            <p style={styles.successNick}>@lizaa_123</p>
          </div>
          <span style={styles.successMark}>✓</span>
        </div>
      </div>

      <div style={styles.stepBlock}>
        <p style={styles.stepBlockTitle}>Крок 2 з 3</p>
        <input
          style={styles.darkInputTransparent}
          placeholder="Введіть кількість"
        />

        <div style={styles.plusButtons}>
          <button style={styles.outlineButton}>+50</button>
          <button style={styles.outlineButton}>+100</button>
          <button style={styles.outlineButton}>+200</button>
        </div>

        <div style={styles.bottomButtons}>
          <button
            style={styles.redButtonWide}
            onClick={() => setScreen('main')}
          >
            Відмінити
          </button>
          <button
            style={styles.greenButtonWide}
            onClick={() => setScreen('success')}
          >
            Далі
          </button>
        </div>
      </div>
    </section>
  );
}

// Екран успішного сканування
function SuccessScreen({ setScreen }) {
  return (
    <section style={styles.phone}>
      <Header
        title="Сканер"
        leftAction={() => setScreen('main')}
        leftSymbol="←"
        setScreen={setScreen}
      />

      <div style={styles.messageCenter}>
        <div style={styles.successIcon}>✓</div>
        <p style={styles.successTitle}>Успішно!</p>
        <p style={styles.successSubtext}>Нараховано 100 балів</p>

        <button
          style={styles.lightButtonWide}
          onClick={() => setScreen('main')}
        >
          Готово
        </button>
      </div>
    </section>
  );
}

// Екран помилки
function ErrorScreen({ setScreen }) {
  return (
    <section style={styles.phone}>
      <Header
        title="Сканер"
        leftAction={() => setScreen('main')}
        leftSymbol="←"
        setScreen={setScreen}
      />

      <div style={styles.messageCenter}>
        <div style={styles.errorIcon}>!</div>
        <p style={styles.errorTitle}>QR-код не знайдено</p>
        <p style={styles.errorSubtext}>Спробуйте ще раз</p>

        <button
          style={styles.lightButtonWide}
          onClick={() => setScreen('scan')}
        >
          Сканувати знову
        </button>
      </div>
    </section>
  );
}

// Екран меню
function MenuScreen({ setScreen, transactions }) {
  return (
    <section style={styles.phone}>
      <div style={styles.overlay}>
        <MainScreen setScreen={setScreen} transactions={transactions} />

        <div style={styles.menuPanel}>
          <div style={styles.menuTop}>
            <span style={styles.menuTitle}>Меню</span>
            <button
              style={styles.closeButton}
              onClick={() => setScreen('main')}
            >
              ×
            </button>
          </div>

          <div style={styles.menuLine}></div>

          <button style={styles.menuItem} onClick={() => setScreen('scan')}>
            Сканер
          </button>
          <button style={styles.menuItem} onClick={() => setScreen('main')}>
            Історія
          </button>
          <button style={styles.menuItem} onClick={() => setScreen('profile')}>
            Налаштування
          </button>
          <button style={styles.menuItem} onClick={() => setScreen('qr')}>
            QR-код
          </button>
        </div>
      </div>
    </section>
  );
}

// Шапка екрана
function Header({
  title,
  leftAction,
  leftSymbol,
  showRightIcons = false,
  setScreen,
}) {
  return (
    <header style={styles.header}>
      <div style={styles.headerLeft}>
        <button style={styles.iconButton} onClick={leftAction}>
          {leftSymbol}
        </button>
        <span style={styles.headerTitle}>{title}</span>
      </div>

      <div style={styles.headerRight}>
        {showRightIcons && (
          <>
            <button
              style={styles.headerMiniButton}
              onClick={() => setScreen('qr')}
            >
              ⌕
            </button>
            <button style={styles.headerMiniButton}>🔔</button>
            <button
              style={styles.headerMiniButton}
              onClick={() => setScreen('profile')}
            >
              👤
            </button>
          </>
        )}
        <span style={styles.lang}>UA|EN</span>
      </div>
    </header>
  );
}

// Фейковий QR для демо
function FakeQR() {
  return (
    <div style={styles.qrPattern}>
      <div style={styles.qrSquareTopLeft}></div>
      <div style={styles.qrSquareTopRight}></div>
      <div style={styles.qrSquareBottomLeft}></div>
      <div style={styles.qrDots}></div>
    </div>
  );
}

const styles = {
  // Фон сторінки
  page: {
    minHeight: '100vh',
    margin: 0,
    background: '#1E1E1E',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '20px 0',
    fontFamily: 'Arial, sans-serif',
  },

  // Контейнер мобільного екрана
  phone: {
    width: '390px',
    minHeight: '844px',
    background: '#3B3940',
    padding: '24px 18px 28px',
    boxSizing: 'border-box',
    position: 'relative',
    color: '#FFFFFF',
  },

  // Шапка
  header: {
    height: '56px',
    background: '#111111',
    borderRadius: '18px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 14px',
    marginBottom: '18px',
  },

  // Ліва частина шапки
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },

  // Права частина шапки
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  // Заголовок у шапці
  headerTitle: {
    fontSize: '14px',
    color: '#FFFFFF',
  },

  // Кнопка-іконка
  iconButton: {
    background: 'transparent',
    border: 'none',
    color: '#FFFFFF',
    fontSize: '18px',
    cursor: 'pointer',
  },

  // Маленькі кнопки справа
  headerMiniButton: {
    background: 'transparent',
    border: 'none',
    color: '#FFFFFF',
    fontSize: '14px',
    cursor: 'pointer',
  },

  // Перемикач мови
  lang: {
    fontSize: '11px',
    color: '#FFFFFF',
  },

  // Картка балансу
  balanceCard: {
    background: '#F2F2F2',
    borderRadius: '16px',
    padding: '14px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '18px',
  },

  // Ліва частина балансу
  balanceLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  // Права частина балансу
  balanceRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  // Іконка зірки
  star: {
    fontSize: '18px',
    color: '#8B2E2E',
  },

  // Привітання
  greeting: {
    margin: 0,
    color: '#8B2E2E',
    fontSize: '14px',
  },

  // Текст балансу
  balanceText: {
    margin: 0,
    color: '#2E7D32',
    fontSize: '14px',
  },

  // Маленька іконка картки
  cardMini: {
    fontSize: '15px',
    color: '#2E7D32',
  },

  // Картка переказу
  transferCard: {
    background: '#1A1A1D',
    border: '1px solid #EDEDED',
    borderRadius: '18px',
    padding: '14px',
    marginBottom: '20px',
  },

  // Заголовок секції
  sectionTitle: {
    margin: '0 0 14px 0',
    fontSize: '14px',
    color: '#FFFFFF',
  },

  // Рядок блоку переказу
  transferRow: {
    display: 'flex',
    gap: '14px',
  },

  // Колонка з input
  inputsColumn: {
    flex: 1,
  },

  // Колонка QR
  qrColumn: {
    width: '92px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  // Поле вводу
  input: {
    width: '100%',
    background: '#F2F2F2',
    border: 'none',
    borderRadius: '14px',
    padding: '10px 14px',
    boxSizing: 'border-box',
    fontSize: '12px',
    marginBottom: '12px',
    outline: 'none',
  },

  // Зелена кнопка
  greenButton: {
    width: '100%',
    background: '#2F7D1F',
    color: '#FFFFFF',
    border: '1px solid #EDEDED',
    borderRadius: '16px',
    padding: '8px 12px',
    fontSize: '12px',
    cursor: 'pointer',
  },

  // Широка зелена кнопка
  greenButtonWide: {
    minWidth: '120px',
    background: '#2F7D1F',
    color: '#FFFFFF',
    border: '1px solid #EDEDED',
    borderRadius: '16px',
    padding: '9px 16px',
    fontSize: '12px',
    cursor: 'pointer',
  },

  // Червона кнопка
  redButtonWide: {
    minWidth: '120px',
    background: '#8B2E2E',
    color: '#FFFFFF',
    border: '1px solid #EDEDED',
    borderRadius: '16px',
    padding: '9px 16px',
    fontSize: '12px',
    cursor: 'pointer',
  },

  // Світла кнопка
  lightButton: {
    minWidth: '110px',
    background: '#F2F2F2',
    color: '#2E2E2E',
    border: 'none',
    borderRadius: '14px',
    padding: '9px 12px',
    fontSize: '12px',
    cursor: 'pointer',
  },

  // Широка світла кнопка
  lightButtonWide: {
    minWidth: '140px',
    background: '#F2F2F2',
    color: '#2E2E2E',
    border: 'none',
    borderRadius: '14px',
    padding: '10px 14px',
    fontSize: '12px',
    cursor: 'pointer',
  },

  // Невелика прозора кнопка
  smallGhostButton: {
    background: 'transparent',
    color: '#FFFFFF',
    border: 'none',
    fontSize: '11px',
    cursor: 'pointer',
    marginTop: '8px',
  },

  // QR-блок
  qrBox: {
    width: '72px',
    height: '72px',
    background: '#FFFFFF',
    borderRadius: '6px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },

  // Великий QR-блок
  bigQrBox: {
    width: '122px',
    height: '122px',
    background: '#FFFFFF',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
  },

  // Підпис під QR
  qrLabel: {
    margin: '8px 0 0 0',
    fontSize: '10px',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: '14px',
  },

  // Внутрішній QR-візерунок
  qrPattern: {
    width: '52px',
    height: '52px',
    position: 'relative',
    background:
      'radial-gradient(circle, #000 17%, transparent 18%) 0 0 / 8px 8px',
  },

  // Квадрат QR верхній лівий
  qrSquareTopLeft: {
    position: 'absolute',
    top: '2px',
    left: '2px',
    width: '13px',
    height: '13px',
    border: '3px solid #000',
    background: '#FFFFFF',
  },

  // Квадрат QR верхній правий
  qrSquareTopRight: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    width: '13px',
    height: '13px',
    border: '3px solid #000',
    background: '#FFFFFF',
  },

  // Квадрат QR нижній лівий
  qrSquareBottomLeft: {
    position: 'absolute',
    bottom: '2px',
    left: '2px',
    width: '13px',
    height: '13px',
    border: '3px solid #000',
    background: '#FFFFFF',
  },

  // Дрібні точки QR
  qrDots: {
    position: 'absolute',
    right: '6px',
    bottom: '6px',
    width: '10px',
    height: '10px',
    border: '2px solid #000',
    background: '#FFFFFF',
  },

  // Заголовок транзакцій
  transactionsTitle: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    color: '#FFFFFF',
  },

  // Список транзакцій
  transactionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },

  // Картка транзакції
  transactionCard: {
    background: '#F2F2F2',
    borderRadius: '16px',
    padding: '14px 16px',
  },

  // Верх картки транзакції
  transactionTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },

  // Ліва частина транзакції
  transactionLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  // Права частина транзакції
  transactionRight: {
    display: 'flex',
    alignItems: 'center',
  },

  // Сума
  amount: {
    fontSize: '12px',
    fontWeight: '700',
  },

  // Ім'я
  personName: {
    fontSize: '12px',
    color: '#111111',
  },

  // Час
  timeText: {
    fontSize: '11px',
    color: '#111111',
  },

  // Низ транзакції
  transactionBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Статус
  statusText: {
    fontSize: '11px',
    color: '#111111',
    marginLeft: '28px',
  },

  // Стрілка
  arrow: {
    fontSize: '18px',
    color: '#111111',
  },

  // Центрований блок
  centerBlock: {
    minHeight: '680px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '40px',
  },

  // Інформаційна картка
  infoCard: {
    width: '100%',
    background: '#F2F2F2',
    borderRadius: '12px',
    padding: '12px 14px',
    boxSizing: 'border-box',
    marginBottom: '30px',
  },

  // Текст інформації
  infoText: {
    margin: '4px 0',
    color: '#111111',
    fontSize: '12px',
  },

  // Область сканування
  scanArea: {
    width: '170px',
    height: '115px',
    background: '#9B90A8',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '18px',
  },

  // Обгортка QR у сканері
  scanQrWrap: {
    width: '88px',
    height: '88px',
    background: '#FFFFFF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Підказка сканера
  scanHint: {
    fontSize: '12px',
    margin: '0 0 20px 0',
    color: '#FFFFFF',
  },

  // Ряд кнопок
  rowButtons: {
    display: 'flex',
    gap: '10px',
    marginBottom: '12px',
  },

  // Верх профілю
  profileTop: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '18px',
  },

  // Аватар
  avatar: {
    width: '62px',
    height: '62px',
    borderRadius: '50%',
    border: '2px solid #F2F2F2',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
    color: '#F2F2F2',
  },

  // Баланс у профілі
  profileBalance: {
    background: '#2F7D1F',
    color: '#FFFFFF',
    borderRadius: '14px',
    padding: '8px 12px',
    fontSize: '12px',
    width: 'fit-content',
    marginBottom: '16px',
  },

  // Картка профілю
  profileCard: {
    background: '#1A1A1D',
    border: '1px solid #EDEDED',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '18px',
  },

  // Текст профілю
  profileText: {
    margin: '0 0 8px 0',
    fontSize: '12px',
    color: '#FFFFFF',
  },

  // Нижні кнопки
  bottomButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
  },

  // Текст кроків
  stepText: {
    fontSize: '12px',
    color: '#FFFFFF',
  },

  // Малий баланс
  balanceSmall: {
    fontSize: '12px',
    color: '#B4E28E',
  },

  // Рядок зверху для кроків
  topStepRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },

  // Кроки
  steps: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },

  // Активний крок
  activeStep: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#8B2E2E',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '12px',
  },

  // Неактивний крок
  step: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#8A7A7A',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '12px',
  },

  // Лінія між кроками
  line: {
    flex: 1,
    height: '1px',
    background: '#FFFFFF',
    margin: '0 8px',
  },

  // Біла панель
  whitePanel: {
    background: '#F2F2F2',
    borderRadius: '12px',
    padding: '12px',
    marginBottom: '18px',
    position: 'relative',
  },

  // Заголовок панелі
  panelTitle: {
    margin: '0 0 10px 0',
    color: '#111111',
    fontSize: '12px',
  },

  // Темне поле вводу
  darkInput: {
    width: '100%',
    background: '#3A3A40',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    padding: '8px 10px',
    fontSize: '11px',
    boxSizing: 'border-box',
    marginBottom: '10px',
  },

  // Прозоре поле
  darkInputTransparent: {
    width: '100%',
    background: 'transparent',
    color: '#FFFFFF',
    border: '1px solid #FFFFFF',
    borderRadius: '10px',
    padding: '8px 10px',
    fontSize: '11px',
    boxSizing: 'border-box',
    marginBottom: '14px',
  },

  // Список користувачів
  userList: {
    width: '65%',
  },

  // Рядок користувача
  userRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0',
    borderBottom: '1px solid #AAAAAA',
    color: '#111111',
    fontSize: '11px',
  },

  // Активний рядок користувача
  userRowActive: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0',
    borderBottom: '1px solid #AAAAAA',
    color: '#111111',
    fontSize: '11px',
  },

  // Малий блок скану
  smallScanBox: {
    position: 'absolute',
    right: '12px',
    top: '56px',
    width: '72px',
    height: '72px',
    background: '#D7D2D8',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#111111',
    fontSize: '11px',
  },

  // Панель успіху
  successPanel: {
    background: '#1F6F14',
    borderRadius: '12px',
    padding: '12px',
    marginBottom: '18px',
  },

  // Заголовок успіху
  successPanelTitle: {
    margin: '0 0 10px 0',
    fontSize: '12px',
    color: '#FFFFFF',
  },

  // Рядок успіху
  successPanelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Ім'я в успіху
  successName: {
    margin: 0,
    fontSize: '12px',
    color: '#FFFFFF',
  },

  // Нік в успіху
  successNick: {
    margin: '4px 0 0 0',
    fontSize: '10px',
    color: '#D9D9D9',
  },

  // Іконка успіху
  successMark: {
    fontSize: '20px',
    color: '#FFFFFF',
  },

  // Блок кроку
  stepBlock: {
    paddingTop: '8px',
  },

  // Заголовок кроку
  stepBlockTitle: {
    margin: '0 0 10px 0',
    fontSize: '12px',
    color: '#FFFFFF',
  },

  // Кнопки +50 +100 +200
  plusButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    marginBottom: '18px',
  },

  // Контурна кнопка
  outlineButton: {
    flex: 1,
    background: 'transparent',
    border: '1px solid #FFFFFF',
    color: '#FFFFFF',
    borderRadius: '10px',
    padding: '8px 0',
    fontSize: '11px',
    cursor: 'pointer',
  },

  // Повідомлення по центру
  messageCenter: {
    minHeight: '680px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  },

  // Іконка успіху по центру
  successIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '2px solid #2F7D1F',
    color: '#2F7D1F',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '22px',
  },

  // Заголовок успіху
  successTitle: {
    margin: 0,
    color: '#2F7D1F',
    fontSize: '24px',
  },

  // Текст успіху
  successSubtext: {
    margin: 0,
    color: '#FFFFFF',
    fontSize: '14px',
  },

  // Іконка помилки
  errorIcon: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: '#8B2E2E',
    color: '#FFFFFF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '20px',
  },

  // Заголовок помилки
  errorTitle: {
    margin: 0,
    color: '#FFFFFF',
    fontSize: '24px',
  },

  // Текст помилки
  errorSubtext: {
    margin: 0,
    color: '#CCCCCC',
    fontSize: '14px',
  },

  // Оверлей меню
  overlay: {
    position: 'relative',
    width: '100%',
    minHeight: '100%',
  },

  // Панель меню
  menuPanel: {
    position: 'absolute',
    top: '10px',
    left: '0',
    width: '220px',
    background: '#F2F2F2',
    borderRadius: '12px',
    padding: '12px',
    boxSizing: 'border-box',
  },

  // Верх меню
  menuTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Заголовок меню
  menuTitle: {
    fontSize: '14px',
    color: '#111111',
  },

  // Кнопка закриття
  closeButton: {
    background: 'transparent',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#111111',
  },

  // Лінія в меню
  menuLine: {
    height: '1px',
    background: '#999999',
    margin: '10px 0',
  },

  // Кнопка пункту меню
  menuItem: {
    width: '100%',
    textAlign: 'left',
    padding: '8px 0',
    border: 'none',
    background: 'transparent',
    color: '#111111',
    cursor: 'pointer',
    fontSize: '12px',
  },
};

export default App;
