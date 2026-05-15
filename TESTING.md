# Unit Tests for PointDrop

This document describes the unit test suite for the PointDrop project.

## Backend Tests

### Running Backend Tests

```bash
cd backend
npm test                  # Run all tests
npm test:watch          # Run tests in watch mode
npm test:cov            # Run tests with coverage report
```

### Backend Test Files

#### `src/auth/auth.service.spec.ts`
Tests for authentication service covering:
- User registration with validation
- User login with password verification
- JWT token generation
- QR payload generation and verification
- User profile retrieval

**Test Cases:**
- `register` - Tests user registration, duplicate email/phone handling
- `login` - Tests login flow, authentication, token generation
- `getUserProfile` - Tests profile retrieval
- `validateUserById` - Tests user validation
- `generateQrPayload` - Tests QR code payload generation
- `verifyQrPayload` - Tests QR code verification

#### `src/health/health.controller.spec.ts`
Tests for health check endpoint:
- Database connectivity status
- Health status responses

**Test Cases:**
- `getHealth` - Tests health check with database connection status

### Backend Test Configuration

Jest configuration is defined in `jest.config.js`:
- Test environment: Node.js
- Test pattern: `**/*.spec.ts`
- Coverage directory: `coverage/`
- Transform: TypeScript to JavaScript using `ts-jest`

## Frontend Tests

### Running Frontend Tests

```bash
cd frontend
npm test                 # Run all tests
npm test -- --watch     # Run tests in watch mode
npm test:coverage       # Run tests with coverage report
npm test:ui             # Run tests with UI dashboard
```

### Frontend Test Files

#### `src/components/QRCodeDisplay.spec.jsx`
Tests for QR code display component:
- Loading state rendering
- QR code rendering with provided value
- Backend QR payload fetching
- Error handling
- Automatic QR refresh every 4 minutes

**Test Cases:**
- Renders loading state initially
- Renders QR code when value provided
- Fetches and renders QR payload from backend
- Displays error message on fetch failure
- Refreshes QR payload every 4 minutes

#### `src/services/authService.spec.js`
Tests for authentication service:
- User registration
- User login with token storage
- QR payload fetching
- Logout functionality
- Authentication state checking

**Test Cases:**
- `register` - Tests user registration via API
- `login` - Tests login and token storage
- `getQrPayload` - Tests QR payload API call
- `logout` - Tests token cleanup
- `isAuthenticated` - Tests authentication status

#### `src/hooks/useAuth.spec.jsx`
Tests for authentication context hook:
- Auth context provision
- Login workflow
- Logout workflow
- User state management

**Test Cases:**
- Provides auth context to components
- Handles user login
- Handles user logout
- Manages user state

### Frontend Test Configuration

Vitest configuration in `vitest.config.js`:
- Test environment: jsdom (browser-like environment)
- Global test utilities (describe, it, expect)
- React Testing Library for component testing
- Coverage reporting with v8

## Coverage Goals

- **Backend:** >80% coverage for core services
- **Frontend:** >75% coverage for components and utilities
- Focus areas: Authentication, QR code generation, data validation

## Running All Tests

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

## Continuous Integration

Tests should be run:
1. Before commits (pre-commit hooks recommended)
2. On pull requests
3. Before production deployments

## Troubleshooting

### Backend Tests
- Ensure `src/` directory exists with test files
- Mock `PrismaService` and `JwtService` in tests
- Use `jest.mock()` for external dependencies

### Frontend Tests
- Ensure test files are named `*.spec.jsx` or `*.spec.js`
- Mock API calls with `vi.mock()`
- Use `waitFor()` for async operations
- Use `screen` queries instead of React Testing Library's `render().getByText()`

## Best Practices

1. **Unit Tests:** Test single functions/methods in isolation
2. **Mocking:** Mock external dependencies (API calls, database)
3. **Naming:** Use descriptive test names explaining behavior
4. **Assertions:** Use specific assertions (not just `toBeTruthy()`)
5. **Setup/Teardown:** Use `beforeEach()` and `afterEach()` for cleanup
6. **Coverage:** Aim for >80% line coverage on critical paths
