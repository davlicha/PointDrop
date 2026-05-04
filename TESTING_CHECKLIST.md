# Testing Checklist for PointDrop

## Pre-Deployment Testing Checklist

### Backend Tests
- [ ] All auth service tests pass (`npm test auth.service.spec.ts`)
- [ ] Health check tests pass (`npm test health.controller.spec.ts`)
- [ ] E2E integration tests pass (`npm test app.e2e.spec.ts`)
- [ ] Test coverage >80% (`npm test:cov`)
- [ ] No console errors or warnings in test output
- [ ] All async operations complete properly
- [ ] Mock data generators work correctly
- [ ] Error handling covers all edge cases

### Frontend Tests
- [ ] QR code component tests pass (`npm test QRCodeDisplay.spec.jsx`)
- [ ] Auth service tests pass (`npm test authService.spec.js`)
- [ ] Auth hook tests pass (`npm test useAuth.spec.jsx`)
- [ ] Test coverage >75% (`npm test:coverage`)
- [ ] All async operations use waitFor/await
- [ ] Component mocking works correctly
- [ ] localStorage mock functions properly
- [ ] No memory leaks in tests

### Integration Testing
- [ ] Frontend can register new user
- [ ] Frontend can login with credentials
- [ ] Frontend QR page displays real user data
- [ ] Main page shows logged-in user information
- [ ] QR code generates and refreshes
- [ ] Backend validates all requests
- [ ] API errors are handled gracefully

### Manual Testing Checklist

#### Authentication Flow
- [ ] User can register with new email
- [ ] Duplicate email registration fails
- [ ] User can login with valid credentials
- [ ] Invalid credentials show error
- [ ] JWT token is stored on login
- [ ] Logout clears token
- [ ] Expired tokens are rejected

#### QR Code Feature
- [ ] QR page shows user's real name
- [ ] QR page shows user's phone
- [ ] QR page shows user's ID
- [ ] QR code displays correctly
- [ ] QR code refreshes every 4 minutes
- [ ] QR code updates on manual refresh
- [ ] Errors are handled gracefully

#### Main Page
- [ ] Greeting shows logged-in user's name
- [ ] User profile data is accurate
- [ ] Balance displays correctly
- [ ] Transfer form accepts input
- [ ] QR thumbnail is clickable
- [ ] Menu opens/closes properly
- [ ] Profile page shows all user info

#### Error Handling
- [ ] Network errors are caught
- [ ] Invalid data is rejected
- [ ] Auth errors show messages
- [ ] API errors are logged
- [ ] User sees error feedback
- [ ] App remains stable on errors
- [ ] Retry mechanisms work

### Performance Checklist
- [ ] Page loads in <2 seconds
- [ ] Tests run in <30 seconds (backend)
- [ ] Tests run in <20 seconds (frontend)
- [ ] No memory leaks in components
- [ ] Network requests are minimized
- [ ] Large data sets don't slow UI
- [ ] QR refresh doesn't lag UI

### Security Checklist
- [ ] Passwords are hashed (bcrypt)
- [ ] Tokens are validated on every request
- [ ] Sensitive data isn't logged
- [ ] CORS is properly configured
- [ ] Input is validated on backend
- [ ] SQL injection is prevented (Prisma)
- [ ] XSS is prevented (React escaping)
- [ ] CSRF tokens present if needed

### Docker/Container Checklist
- [ ] Backend builds without errors
- [ ] Frontend builds without errors
- [ ] Containers start successfully
- [ ] Services communicate properly
- [ ] Database migrations run
- [ ] Tests pass in containers
- [ ] No permission errors
- [ ] Volumes mount correctly

### Documentation Checklist
- [ ] README.md is up to date
- [ ] TEST_GUIDE.md is complete
- [ ] TESTING.md covers all tests
- [ ] Code comments explain complex logic
- [ ] Error messages are helpful
- [ ] API documentation is current
- [ ] Setup instructions work

### CI/CD Checklist (if applicable)
- [ ] GitHub Actions workflow configured
- [ ] Tests run on pull requests
- [ ] Coverage reports generate
- [ ] Build succeeds on main
- [ ] Linting passes
- [ ] Security scans run
- [ ] Deployment triggers on merge

### Before Going Live
- [ ] All tests passing locally
- [ ] All tests passing in CI/CD
- [ ] Coverage thresholds met
- [ ] Code reviewed
- [ ] Security audit complete
- [ ] Performance tested
- [ ] Database backed up
- [ ] Rollback plan documented

## Test Execution Commands

### Quick Full Test
```bash
# Backend
cd backend && npm test && npm test:cov

# Frontend
cd frontend && npm test && npm test:coverage
```

### Parallel Testing (if available)
```bash
# Backend parallel
cd backend && npm test -- --maxWorkers=4

# Frontend parallel
cd frontend && npm test -- --threads
```

### Specific Test Suites
```bash
# Backend auth tests only
cd backend && npm test auth.service.spec.ts

# Frontend component tests only
cd frontend && npm test -- QRCodeDisplay
```

### With Detailed Output
```bash
# Backend verbose
cd backend && npm test -- --verbose

# Frontend verbose
cd frontend && npm test -- --reporter=verbose
```

## Coverage Report Review

### What to Check
- [ ] Line coverage: >80% (backend), >75% (frontend)
- [ ] Branch coverage: >75% (backend), >70% (frontend)
- [ ] Function coverage: >80% (backend), >75% (frontend)
- [ ] Statement coverage: >80% (backend), >75% (frontend)

### Uncovered Areas to Investigate
- [ ] Note any missed error paths
- [ ] Check untested branches
- [ ] Identify edge cases
- [ ] Plan follow-up tests

## Regression Testing

### Before Each Release
1. [ ] Run full test suite
2. [ ] Check for new warnings
3. [ ] Verify coverage maintained
4. [ ] Test on latest browsers
5. [ ] Test on mobile devices
6. [ ] Performance comparison

### Automated Checks
1. [ ] Linting passes
2. [ ] Type checking passes
3. [ ] Security audit passes
4. [ ] Build succeeds
5. [ ] Tests pass

## Notes for QA Team

### Important Test Files
- Backend: `backend/src/auth/auth.service.spec.ts`
- Frontend: `frontend/src/services/authService.spec.js`
- Integration: `backend/src/app.e2e.spec.ts`

### Test Data
- Use provided mock generators in test-utils
- Don't hardcode test data
- Avoid using production data
- Clean up test data after runs

### Reporting Issues
When reporting test failures:
1. Include exact error message
2. Note environment (Node version, OS)
3. Include test output
4. List reproduction steps
5. Attach logs if available

## Maintenance Schedule

### Weekly
- [ ] Run full test suite
- [ ] Check coverage trends
- [ ] Review test execution time

### Monthly
- [ ] Update test dependencies
- [ ] Refactor slow tests
- [ ] Add tests for bug fixes
- [ ] Review coverage gaps

### Quarterly
- [ ] Audit test quality
- [ ] Update testing practices
- [ ] Plan coverage improvements
- [ ] Review CI/CD pipeline

## Sign-Off

- [ ] Backend Lead: ___________ Date: ___________
- [ ] Frontend Lead: __________ Date: ___________
- [ ] QA Lead: _______________ Date: ___________
- [ ] DevOps Lead: ____________ Date: ___________

---

**Last Updated:** 2026-05-04
**Version:** 1.0
**Status:** Ready for Testing
