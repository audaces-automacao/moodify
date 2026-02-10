# Server Testing Guidelines

The Express backend uses Jest + Supertest for API endpoint and middleware testing.

## Commands

```bash
cd server && npm test    # Run tests (Jest with --experimental-vm-modules)
```

## Test Structure

- `server/index.spec.js` - API endpoint and middleware tests
- Config: `server/jest.config.js` (ESM transform via `--experimental-vm-modules`)

## Writing Tests

### Test Organization
Use `describe` blocks per endpoint or middleware. Use `it` blocks with clear behavior descriptions.

### Endpoint Testing
Use Supertest to make HTTP requests against the Express app (see `index.spec.js`):
- Test status codes, response bodies, and headers
- Test both success and error paths for each endpoint

### Mocking
- External APIs: Mock OpenAI API calls to avoid real API hits
- JWT: Test with valid and invalid tokens
- Use `jest.fn()` and `jest.mock()` for isolating dependencies

### Auth Testing
- Test `authMiddleware` with missing, invalid, and valid tokens
- Test rate limiting on auth endpoints
- Test login with valid and invalid credentials
