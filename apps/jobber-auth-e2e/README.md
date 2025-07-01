# Jobber Auth Service - Integration Tests

This directory contains comprehensive integration tests for the Jobber Auth Service GraphQL APIs.

## Overview

The test suite covers all APIs in the jobber-auth service with comprehensive scenarios including:

- **Core Functionality Tests** - Basic API operations and happy path scenarios
- **Error Handling Tests** - Input validation, authentication failures, and edge cases
- **Security Tests** - SQL injection prevention, XSS protection, and security vulnerabilities
- **Performance Tests** - Load testing, concurrent operations, and performance regression detection

## Test Structure

### Main Test Files

#### 1. `jobber-auth.spec.ts` - Core Integration Tests

- **User Management APIs**
  - `createUser` mutation - User creation with validation
  - `getUsers` query - Retrieve all users
- **Authentication APIs**
  - `login` mutation - User authentication with JWT cookies
- **Integration Scenarios** - Complete user lifecycle testing
- **GraphQL Schema Validation** - Malformed query handling

#### 2. `jobber-auth-error-scenarios.spec.ts` - Error & Security Tests

- **Input Validation Errors**
  - Invalid email formats
  - Weak password validation
  - Null/undefined input handling
- **Security Tests**
  - SQL injection prevention
  - XSS attack mitigation
  - Rate limiting and DoS protection
- **GraphQL Error Handling**
  - Query complexity limits
  - Invalid syntax handling
  - Variable type validation
- **Concurrent Operations**
  - Race condition testing
  - Database constraint handling

#### 3. `jobber-auth-performance.spec.ts` - Performance Tests

- **Single Request Performance** - Individual operation timing
- **Batch Operations** - Multiple operation efficiency
- **Concurrent Operations** - Parallel request handling
- **Load Testing** - High volume request handling
- **Memory Management** - Resource usage optimization
- **Performance Regression Detection** - Baseline performance tracking

### Support Files

#### `test-utils.ts` - Test Utilities

- GraphQL request helpers
- Test data generation
- Performance measurement tools
- Common assertion helpers
- Security test data generators

## APIs Tested

### User Management

```graphql
# Create a new user
mutation CreateUser($createUserInput: CreateUserInput!) {
  createUser(createUserInput: $createUserInput) {
    id
    email
  }
}

# Get all users
query GetUsers {
  getUsers {
    id
    email
  }
}
```

### Authentication

```graphql
# Login user and set JWT cookie
mutation Login($loginInput: LoginInput!) {
  login(loginInput: $loginInput) {
    id
    email
  }
}
```

## Running the Tests

### Prerequisites

1. Ensure the jobber-auth service is running on the configured port (default: 3000)
2. Database should be accessible and properly configured
3. Required environment variables should be set

### Run All Tests

```bash
# Run all integration tests
npm run test:e2e jobber-auth-e2e

# Run with coverage
npm run test:e2e jobber-auth-e2e -- --coverage
```

### Run Specific Test Suites

```bash
# Core functionality tests only
npm run test:e2e jobber-auth-e2e -- --testNamePattern="Jobber Auth Service Integration Tests"

# Error scenarios and security tests only
npm run test:e2e jobber-auth-e2e -- --testNamePattern="Error Scenarios & Edge Cases"

# Performance tests only
npm run test:e2e jobber-auth-e2e -- --testNamePattern="Performance Tests"
```

### Run Individual Test Files

```bash
# Core integration tests
npm run test:e2e jobber-auth-e2e -- src/jobber-auth/jobber-auth.spec.ts

# Error scenario tests
npm run test:e2e jobber-auth-e2e -- src/jobber-auth/jobber-auth-error-scenarios.spec.ts

# Performance tests
npm run test:e2e jobber-auth-e2e -- src/jobber-auth/jobber-auth-performance.spec.ts
```

## Test Configuration

### Environment Variables

```bash
# Service configuration
HOST=localhost
PORT=3000

# Database configuration (if needed for cleanup)
DATABASE_URL=postgresql://user:password@localhost:5432/jobber_auth_test

# JWT configuration (for testing token expiration)
JWT_EXPIRATION_MS=3600000
NODE_ENV=test
```

### Jest Configuration

The tests use the following Jest configuration:

- Global setup/teardown for service lifecycle
- Test environment: Node.js
- Coverage reporting enabled
- TypeScript support via ts-jest

## Test Data Management

### Automatic Test Data Generation

The test suite automatically generates unique test data for each test run:

- Unique email addresses with timestamps
- Secure random passwords
- Isolated test users to prevent conflicts

### Test Data Cleanup

Currently, test data cleanup is limited due to the absence of a delete user API. In a production environment, you should:

1. Implement a `deleteUser` mutation for cleanup
2. Use a separate test database that can be reset
3. Implement automated cleanup procedures

## Performance Benchmarks

### Expected Performance Thresholds

- **Single Request**: < 1 second
- **Batch Operations**: < 5 seconds
- **Concurrent Requests**: < 3 seconds
- **High Volume Queries**: < 10 seconds

### Performance Metrics Tracked

- Response time for individual operations
- Throughput for concurrent operations
- Memory usage patterns
- Error handling efficiency

## Security Test Coverage

### SQL Injection Prevention

Tests various SQL injection attack vectors:

- Basic injection attempts
- Union-based attacks
- Comment-based bypasses
- Boolean-based attacks

### XSS Protection

Tests cross-site scripting prevention:

- Script tag injection
- Event handler injection
- JavaScript protocol usage
- HTML entity encoding

### Authentication Security

- Invalid credential handling
- Session management
- Cookie security attributes
- Rate limiting protection

## Troubleshooting

### Common Issues

#### Service Not Running

```
Error: connect ECONNREFUSED 127.0.0.1:3000
```

**Solution**: Ensure the jobber-auth service is running on the configured port.

#### Database Connection Issues

```
Error: Can't reach database server
```

**Solution**: Verify database connection string and ensure database is accessible.

#### Test Timeouts

```
Error: Timeout - Async callback was not invoked within the timeout
```

**Solution**:

- Check if service is responding slowly
- Increase Jest timeout configuration
- Verify database performance

#### Memory Issues During Load Tests

```
Error: JavaScript heap out of memory
```

**Solution**:

- Reduce batch sizes in performance tests
- Increase Node.js memory limit: `--max-old-space-size=4096`
- Run performance tests separately

### Debug Mode

Enable verbose logging for debugging:

```bash
# Run with debug output
DEBUG=* npm run test:e2e jobber-auth-e2e

# Run specific test with detailed output
npm run test:e2e jobber-auth-e2e -- --verbose --testNamePattern="specific test name"
```

## Contributing

### Adding New Tests

1. Follow the existing test structure and naming conventions
2. Use the `TestUtils` class for common operations
3. Include both positive and negative test cases
4. Add performance considerations for new APIs
5. Update this README with new test coverage

### Test Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Cleanup**: Clean up test data when possible
3. **Assertions**: Use descriptive assertions with clear error messages
4. **Performance**: Include performance expectations for new APIs
5. **Security**: Test for common security vulnerabilities

## Future Enhancements

### Planned Improvements

1. **Database Cleanup**: Implement proper test data cleanup mechanisms
2. **Test Parallelization**: Optimize tests for parallel execution
3. **Visual Reports**: Add test result visualization and reporting
4. **CI/CD Integration**: Automated test execution in deployment pipelines
5. **Mock Services**: Add ability to test with mocked dependencies

### Additional Test Coverage

1. **Authorization Tests**: Role-based access control testing
2. **Rate Limiting**: Comprehensive rate limiting validation
3. **API Versioning**: Version compatibility testing
4. **Monitoring**: Integration with application monitoring tools

## Support

For questions or issues with the test suite:

1. Check the troubleshooting section above
2. Review test logs for specific error details
3. Ensure all prerequisites are properly configured
4. Contact the development team for additional support
