# Testing Guide - PointDrop

## Overview

This project includes comprehensive unit tests for both backend (NestJS) and frontend (React) components.

## Test Structure

```
PointDrop/
├── backend/
│   ├── jest.config.js                 # Jest configuration
│   └── src/
│       ├── auth/
│       │   └── auth.service.spec.ts  # Auth service tests
│       ├── health/
│       │   └── health.controller.spec.ts  # Health check tests
│       └── app.e2e.spec.ts           # End-to-end integration tests
└── frontend/
    ├── vitest.config.js               # Vitest configuration
    └── src/
        ├── components/
        │   └── QRCodeDisplay.spec.jsx  # QR code component tests
        ├── services/
        │   └── authService.spec.js     # Auth service tests
        └── hooks/
            └── useAuth.spec.jsx        # Auth hook tests
```

## Backend Testing

### Technologies
- **Framework:** Jest
- **Test Runner:** ts-jest (TypeScript support)
- **HTTP Testing:** Supertest (for e2e tests)
- **Mocking:** Jest built-in mocks

### Setup

```bash
cd backend
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (re-run on file changes)
npm test:watch

# Run tests with coverage report
npm test:cov

# Run specific test file
npm test -- auth.service.spec.ts

# Run tests matching pattern
npm test -- --testNamePattern="register"
```

### Example Test: Auth Service

```typescript
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    // Setup test module with mocked dependencies
    const module = await Test.createTestingModule({
      providers: [AuthService, { provide: PrismaService, useValue: {...} }]
    }).compile();
    
    service = module.get(AuthService);
  });

  it('should register a new user', async () => {
    // Arrange
    const registerDto = { email: 'test@example.com', ... };
    
    // Act
    const result = await service.register(registerDto);
    
    // Assert
    expect(result.email).toBe('test@example.com');
  });
});
```

### Key Test Files

**`auth.service.spec.ts`**
- Tests user registration and validation
- Tests authentication and JWT token generation
- Tests user profile retrieval
- Covers error cases (duplicate email, invalid password)

**`health.controller.spec.ts`**
- Tests health check endpoint
- Verifies database connectivity status

**`app.e2e.spec.ts`**
- End-to-end integration tests
- Tests complete HTTP request/response cycles
- Validates API contracts

## Frontend Testing

### Technologies
- **Test Runner:** Vitest
- **Component Testing:** React Testing Library
- **DOM Environment:** jsdom
- **Mocking:** Vitest's `vi` module

### Setup

```bash
cd frontend
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test:coverage

# Run tests with UI dashboard
npm test:ui

# Run specific test file
npm test -- QRCodeDisplay.spec.jsx
```

### Example Test: QR Code Component

```jsx
describe('QRCodeDisplay', () => {
  it('should render loading state initially', () => {
    render(<QRCodeDisplay />);
    expect(screen.getByText('Завантаження...')).toBeInTheDocument();
  });

  it('should render QR code when value is provided', () => {
    render(<QRCodeDisplay value="test-payload" />);
    expect(screen.getByTestId('qr-code')).toBeInTheDocument();
  });
});
```

### Key Test Files

**`QRCodeDisplay.spec.jsx`**
- Tests QR code component rendering
- Tests loading and error states
- Tests data fetching from backend
- Tests automatic refresh interval

**`authService.spec.js`**
- Tests API calls for login/register
- Tests token storage in localStorage
- Tests logout functionality
- Tests authentication state

**`useAuth.spec.jsx`**
- Tests auth context provider
- Tests login/logout workflows
- Tests user state management
- Tests auth hook integration

## Test Coverage

### Backend Coverage Goals
- **auth.service.ts:** >90%
- **health.controller.ts:** 100%
- Overall: >80%

### Frontend Coverage Goals
- **Components:** >75%
- **Services:** >85%
- **Hooks:** >80%
- Overall: >75%

## Best Practices

### Writing Tests

1. **Follow AAA Pattern**
   ```
   Arrange → Setup test data
   Act → Call the function
   Assert → Verify results
   ```

2. **Use Descriptive Names**
   ```typescript
   ✓ it('should return access token on successful login')
   ✗ it('works')
   ```

3. **Test Behavior, Not Implementation**
   ```typescript
   ✓ expect(result.email).toBe('test@example.com')
   ✗ expect(prismaService.user.create).toHaveBeenCalled()
   ```

4. **Mock External Dependencies**
   ```typescript
   jest.spyOn(prismaService, 'user.findUnique')
     .mockResolvedValue(mockUser)
   ```

5. **Use Setup/Teardown Properly**
   ```typescript
   beforeEach(() => { /* Setup */ })
   afterEach(() => { /* Cleanup */ })
   ```

### Test Organization

- One describe block per unit/component
- Group related tests with describe blocks
- Use setup/teardown for common logic
- Keep tests independent and isolated
- Mock network calls and external services

## Running Tests in Docker

### Backend Tests
```bash
docker compose exec backend npm test
docker compose exec backend npm test:watch
docker compose exec backend npm test:cov
```

### Frontend Tests
```bash
docker compose exec frontend npm test
docker compose exec frontend npm test -- --watch
docker compose exec frontend npm test:coverage
```

## Continuous Integration

Tests should automatically run:
1. **Pre-commit:** Use git hooks to run tests before committing
2. **Pull Requests:** Run tests on all PRs
3. **Pre-deployment:** Run full test suite before production deployment

### Setting Up Pre-commit Hooks

```bash
# Install husky
npm install husky --save-dev
npx husky install

# Add test hook
echo "npm test" > .husky/pre-commit
chmod +x .husky/pre-commit
```

## Debugging Tests

### Backend
```bash
# Debug specific test
node --inspect-brk node_modules/.bin/jest --runInBand auth.service.spec.ts

# Then open chrome://inspect in Chrome DevTools
```

### Frontend
```bash
# Run with Chrome DevTools
npm test -- --inspect-brk

# Run in UI mode for debugging
npm test:ui
```

## Common Issues

### Backend Tests

**Issue:** Tests hang or timeout
- Check if database is mocked properly
- Ensure async operations complete
- Increase timeout: `jest.setTimeout(10000)`

**Issue:** Module not found errors
- Verify imports use correct paths
- Check tsconfig.json paths configuration
- Ensure jest.config.js rootDir is correct

### Frontend Tests

**Issue:** "can't find module" errors
- Verify vitest.config.js environment is jsdom
- Check mock paths and setup files
- Ensure file extensions in imports (.jsx, .js)

**Issue:** Tests fail with "not defined" errors
- Import describe, it, expect from vitest
- Use vi for mocking (not jest)
- Check globals are enabled in vitest.config.js

## Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
