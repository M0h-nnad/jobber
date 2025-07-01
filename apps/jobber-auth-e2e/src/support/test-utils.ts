import axios from 'axios';

export interface TestUser {
  email: string;
  password: string;
  id?: string;
}

export interface GraphQLResponse<T = any> {
  data: {
    data?: T;
    errors?: Array<{
      message: string;
      locations?: Array<{ line: number; column: number }>;
      path?: string[];
    }>;
  };
  status: number;
  headers: any;
}

export class TestUtils {
  private static readonly graphqlEndpoint = '/api/graphql';

  /**
   * Make a GraphQL request with proper error handling
   */
  static async graphqlRequest<T = any>(
    query: string,
    variables?: any,
    headers?: any
  ): Promise<GraphQLResponse<T>> {
    try {
      const response = await axios.post(
        this.graphqlEndpoint,
        {
          query,
          variables,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          withCredentials: true,
        }
      );
      return response;
    } catch (error: any) {
      // Return the error response for testing error scenarios
      return (
        error.response || {
          data: { errors: [{ message: error.message }] },
          status: 500,
          headers: {},
        }
      );
    }
  }

  /**
   * Create a test user with generated data
   */
  static generateTestUser(prefix = 'test'): TestUser {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return {
      email: `${prefix}-${timestamp}-${random}@example.com`,
      password: `TestPassword${timestamp}!`,
    };
  }

  /**
   * Create multiple test users
   */
  static generateTestUsers(count: number, prefix = 'test'): TestUser[] {
    return Array.from({ length: count }, (_, i) =>
      this.generateTestUser(`${prefix}-${i}`)
    );
  }

  /**
   * Create a user via GraphQL mutation
   */
  static async createTestUser(userData?: Partial<TestUser>): Promise<TestUser> {
    const user = userData
      ? { ...this.generateTestUser(), ...userData }
      : this.generateTestUser();

    const createUserMutation = `
      mutation CreateUser($createUserInput: CreateUserInput!) {
        createUser(createUserInput: $createUserInput) {
          id
          email
        }
      }
    `;

    const response = await this.graphqlRequest(createUserMutation, {
      createUserInput: {
        email: user.email,
        password: user.password,
      },
    });

    if (response.data.errors) {
      throw new Error(
        `Failed to create test user: ${response.data.errors[0].message}`
      );
    }

    return {
      ...user,
      id: response.data.data.createUser.id,
    };
  }

  /**
   * Login with a user and return the response
   */
  static async loginUser(userData: { email: string; password: string }) {
    const loginMutation = `
      mutation Login($loginInput: LoginInput!) {
        login(loginInput: $loginInput) {
          id
          email
        }
      }
    `;

    return this.graphqlRequest(loginMutation, {
      loginInput: userData,
    });
  }

  /**
   * Get all users
   */
  static async getAllUsers() {
    const getUsersQuery = `
      query GetUsers {
        getUsers {
          id
          email
        }
      }
    `;

    return this.graphqlRequest(getUsersQuery);
  }

  /**
   * Extract authentication cookie from response headers
   */
  static extractAuthCookie(response: GraphQLResponse): string | null {
    const cookies = response.headers['set-cookie'];
    if (!cookies) return null;

    const tokenCookie = cookies.find((cookie: string) =>
      cookie.startsWith('token=')
    );

    return tokenCookie ? tokenCookie.split(';')[0] : null;
  }

  /**
   * Wait for a specified amount of time (useful for testing timing-related features)
   */
  static async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Generate invalid email addresses for testing validation
   */
  static getInvalidEmails(): string[] {
    return [
      'invalid-email',
      '@example.com',
      'test@',
      'test..test@example.com',
      'test@.com',
      '',
      '   ',
      'test@domain',
      'test@domain.',
      'test@.domain.com',
      'test@domain..com',
    ];
  }

  /**
   * Generate weak passwords for testing validation
   */
  static getWeakPasswords(): string[] {
    return [
      '', // empty
      '123', // too short
      'password', // common password
      '   ', // whitespace only
      'a', // single character
      '12345678', // numeric only
      'abcdefgh', // alphabetic only
    ];
  }

  /**
   * Generate SQL injection attack strings
   */
  static getSQLInjectionAttempts(): string[] {
    return [
      "'; DROP TABLE users; --",
      "' OR '1'='1",
      "admin@example.com'; DELETE FROM users WHERE '1'='1",
      "test@example.com' UNION SELECT * FROM users --",
      "' OR 1=1 --",
      "'; INSERT INTO users (email, password) VALUES ('hacker@evil.com', 'hacked'); --",
    ];
  }

  /**
   * Generate XSS attack strings
   */
  static getXSSAttempts(): string[] {
    return [
      '<script>alert("xss")</script>',
      '<img src="x" onerror="alert(1)">',
      'javascript:alert("xss")',
      '<svg onload="alert(1)">',
      '"><script>alert("xss")</script>',
      '<iframe src="javascript:alert(1)"></iframe>',
    ];
  }

  /**
   * Cleanup test data (Note: This would require a delete user mutation in the actual API)
   */
  static async cleanupTestUsers(userIds: string[]): Promise<void> {
    // This is a placeholder for cleanup functionality
    // In a real scenario, you would implement a deleteUser mutation
    // or have a test database that can be reset
    console.log(`Cleanup would delete users with IDs: ${userIds.join(', ')}`);
  }

  /**
   * Assert that a GraphQL response contains errors
   */
  static assertHasErrors(
    response: GraphQLResponse,
    expectedErrorMessage?: string
  ): void {
    expect(response.data.errors).toBeDefined();
    expect(response.data.errors!.length).toBeGreaterThan(0);

    if (expectedErrorMessage) {
      const hasExpectedError = response.data.errors!.some((error) =>
        error.message.includes(expectedErrorMessage)
      );
      expect(hasExpectedError).toBe(true);
    }
  }

  /**
   * Assert that a GraphQL response is successful
   */
  static assertSuccessful(response: GraphQLResponse): void {
    expect(response.status).toBe(200);
    expect(response.data.errors).toBeUndefined();
    expect(response.data.data).toBeDefined();
  }

  /**
   * Assert that a user object has the expected structure
   */
  static assertValidUser(user: any, expectedEmail?: string): void {
    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.email).toBeDefined();
    expect(typeof user.email).toBe('string');
    expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/); // Basic email regex

    if (expectedEmail) {
      expect(user.email).toBe(expectedEmail);
    }
  }

  /**
   * Generate test data for performance testing
   */
  static generateLargeDataSet(size: number): TestUser[] {
    return Array.from({ length: size }, (_, i) => ({
      email: `perf-test-${i}@example.com`,
      password: `TestPassword${i}!`,
    }));
  }

  /**
   * Measure execution time of an async function
   */
  static async measureExecutionTime<T>(
    fn: () => Promise<T>
  ): Promise<{ result: T; executionTime: number }> {
    const startTime = Date.now();
    const result = await fn();
    const executionTime = Date.now() - startTime;

    return { result, executionTime };
  }

  /**
   * Create a batch of users concurrently
   */
  static async createUsersBatch(users: TestUser[]): Promise<TestUser[]> {
    const createUserMutation = `
      mutation CreateUser($createUserInput: CreateUserInput!) {
        createUser(createUserInput: $createUserInput) {
          id
          email
        }
      }
    `;

    const promises = users.map((user) =>
      this.graphqlRequest(createUserMutation, {
        createUserInput: {
          email: user.email,
          password: user.password,
        },
      })
    );

    const responses = await Promise.all(promises);

    return responses.map((response, index) => ({
      ...users[index],
      id: response.data.data?.createUser?.id,
    }));
  }

  /**
   * Retry a function with exponential backoff
   */
  static async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 1000
  ): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;

        const delay = baseDelay * Math.pow(2, i);
        await this.wait(delay);
      }
    }

    throw new Error('Max retries exceeded');
  }
}

// Export commonly used GraphQL queries and mutations as constants
export const GRAPHQL_QUERIES = {
  CREATE_USER: `
    mutation CreateUser($createUserInput: CreateUserInput!) {
      createUser(createUserInput: $createUserInput) {
        id
        email
      }
    }
  `,

  LOGIN: `
    mutation Login($loginInput: LoginInput!) {
      login(loginInput: $loginInput) {
        id
        email
      }
    }
  `,

  GET_USERS: `
    query GetUsers {
      getUsers {
        id
        email
      }
    }
  `,
} as const;

// Export test data generators
export const TEST_DATA = {
  validUser: (): TestUser => ({
    email: 'valid@example.com',
    password: 'ValidPassword123!',
  }),

  adminUser: (): TestUser => ({
    email: 'admin@example.com',
    password: 'AdminPassword123!',
  }),

  invalidEmails: TestUtils.getInvalidEmails(),
  weakPasswords: TestUtils.getWeakPasswords(),
  sqlInjectionAttempts: TestUtils.getSQLInjectionAttempts(),
  xssAttempts: TestUtils.getXSSAttempts(),
} as const;
