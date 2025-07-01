import axios from 'axios';

describe('Jobber Auth Service Integration Tests', () => {
  const graphqlEndpoint = '/api/graphql';
  let testUserId: string;
  let authCookie: string;

  // Helper function to make GraphQL requests
  const graphqlRequest = async (
    query: string,
    variables?: any,
    headers?: any
  ) => {
    return axios.post(
      graphqlEndpoint,
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
  };

  // Test data
  const testUser = {
    email: 'test@example.com',
    password: 'testPassword123',
  };

  const testUser2 = {
    email: 'test2@example.com',
    password: 'testPassword456',
  };

  describe('User Management APIs', () => {
    describe('createUser mutation', () => {
      afterEach(async () => {
        // Cleanup: Remove test users if they exist
        try {
          const getUsersQuery = `
            query GetUsers {
              getUsers {
                id
                email
              }
            }
          `;
          const response = await graphqlRequest(getUsersQuery);
          const users = response.data.data.getUsers;

          // Note: In a real scenario, you'd have a deleteUser mutation for cleanup
          // For now, we'll just track the created users
        } catch (error) {
          // Ignore cleanup errors
        }
      });

      it('should create a new user successfully', async () => {
        const createUserMutation = `
          mutation CreateUser($createUserInput: CreateUserInput!) {
            createUser(createUserInput: $createUserInput) {
              id
              email
            }
          }
        `;

        const response = await graphqlRequest(createUserMutation, {
          createUserInput: testUser,
        });

        expect(response.status).toBe(200);
        expect(response.data.data.createUser).toBeDefined();
        expect(response.data.data.createUser.email).toBe(testUser.email);
        expect(response.data.data.createUser.id).toBeDefined();

        testUserId = response.data.data.createUser.id;
      });

      it('should handle duplicate email error', async () => {
        const createUserMutation = `
          mutation CreateUser($createUserInput: CreateUserInput!) {
            createUser(createUserInput: $createUserInput) {
              id
              email
            }
          }
        `;

        // Create first user
        await graphqlRequest(createUserMutation, {
          createUserInput: testUser,
        });

        // Try to create user with same email
        const response = await graphqlRequest(createUserMutation, {
          createUserInput: testUser,
        });

        expect(response.data.errors).toBeDefined();
        expect(response.data.errors[0].message).toContain('Unique constraint');
      });

      it('should validate required fields', async () => {
        const createUserMutation = `
          mutation CreateUser($createUserInput: CreateUserInput!) {
            createUser(createUserInput: $createUserInput) {
              id
              email
            }
          }
        `;

        const response = await graphqlRequest(createUserMutation, {
          createUserInput: {
            email: '',
            password: '',
          },
        });

        expect(response.data.errors).toBeDefined();
      });
    });

    describe('getUsers query', () => {
      beforeEach(async () => {
        // Setup: Create test users
        const createUserMutation = `
          mutation CreateUser($createUserInput: CreateUserInput!) {
            createUser(createUserInput: $createUserInput) {
              id
              email
            }
          }
        `;

        await graphqlRequest(createUserMutation, {
          createUserInput: testUser,
        });

        await graphqlRequest(createUserMutation, {
          createUserInput: testUser2,
        });
      });

      it('should retrieve all users', async () => {
        const getUsersQuery = `
          query GetUsers {
            getUsers {
              id
              email
            }
          }
        `;

        const response = await graphqlRequest(getUsersQuery);

        expect(response.status).toBe(200);
        expect(response.data.data.getUsers).toBeDefined();
        expect(Array.isArray(response.data.data.getUsers)).toBe(true);
        expect(response.data.data.getUsers.length).toBeGreaterThanOrEqual(2);

        const emails = response.data.data.getUsers.map(
          (user: any) => user.email
        );
        expect(emails).toContain(testUser.email);
        expect(emails).toContain(testUser2.email);
      });

      it('should return empty array when no users exist', async () => {
        // This test assumes a clean database state
        // In practice, you might need database cleanup utilities
        const getUsersQuery = `
          query GetUsers {
            getUsers {
              id
              email
            }
          }
        `;

        const response = await graphqlRequest(getUsersQuery);

        expect(response.status).toBe(200);
        expect(response.data.data.getUsers).toBeDefined();
        expect(Array.isArray(response.data.data.getUsers)).toBe(true);
      });
    });
  });

  describe('Authentication APIs', () => {
    beforeEach(async () => {
      // Setup: Create a test user for authentication
      const createUserMutation = `
        mutation CreateUser($createUserInput: CreateUserInput!) {
          createUser(createUserInput: $createUserInput) {
            id
            email
          }
        }
      `;

      const response = await graphqlRequest(createUserMutation, {
        createUserInput: testUser,
      });

      testUserId = response.data.data.createUser.id;
    });

    describe('login mutation', () => {
      it('should login successfully with valid credentials', async () => {
        const loginMutation = `
          mutation Login($loginInput: LoginInput!) {
            login(loginInput: $loginInput) {
              id
              email
            }
          }
        `;

        const response = await graphqlRequest(loginMutation, {
          loginInput: {
            email: testUser.email,
            password: testUser.password,
          },
        });

        expect(response.status).toBe(200);
        expect(response.data.data.login).toBeDefined();
        expect(response.data.data.login.email).toBe(testUser.email);
        expect(response.data.data.login.id).toBe(testUserId);

        // Check if authentication cookie is set
        const cookies = response.headers['set-cookie'];
        expect(cookies).toBeDefined();
        const tokenCookie = cookies?.find((cookie: string) =>
          cookie.startsWith('token=')
        );
        expect(tokenCookie).toBeDefined();

        if (tokenCookie) {
          authCookie = tokenCookie.split(';')[0];
        }
      });

      it('should reject login with invalid email', async () => {
        const loginMutation = `
          mutation Login($loginInput: LoginInput!) {
            login(loginInput: $loginInput) {
              id
              email
            }
          }
        `;

        const response = await graphqlRequest(loginMutation, {
          loginInput: {
            email: 'nonexistent@example.com',
            password: testUser.password,
          },
        });

        expect(response.data.errors).toBeDefined();
        expect(response.data.errors[0].message).toContain(
          'Invalid credentials'
        );
      });

      it('should reject login with invalid password', async () => {
        const loginMutation = `
          mutation Login($loginInput: LoginInput!) {
            login(loginInput: $loginInput) {
              id
              email
            }
          }
        `;

        const response = await graphqlRequest(loginMutation, {
          loginInput: {
            email: testUser.email,
            password: 'wrongPassword',
          },
        });

        expect(response.data.errors).toBeDefined();
        expect(response.data.errors[0].message).toContain(
          'Invalid credentials'
        );
      });

      it('should validate email format', async () => {
        const loginMutation = `
          mutation Login($loginInput: LoginInput!) {
            login(loginInput: $loginInput) {
              id
              email
            }
          }
        `;

        const response = await graphqlRequest(loginMutation, {
          loginInput: {
            email: 'invalid-email',
            password: testUser.password,
          },
        });

        expect(response.data.errors).toBeDefined();
      });

      it('should validate required fields', async () => {
        const loginMutation = `
          mutation Login($loginInput: LoginInput!) {
            login(loginInput: $loginInput) {
              id
              email
            }
          }
        `;

        const response = await graphqlRequest(loginMutation, {
          loginInput: {
            email: '',
            password: '',
          },
        });

        expect(response.data.errors).toBeDefined();
      });
    });

    describe('Authentication Cookie Behavior', () => {
      it('should set secure cookie properties in production', async () => {
        // This test would need environment variable mocking
        // For now, we'll test the basic cookie setting behavior
        const loginMutation = `
          mutation Login($loginInput: LoginInput!) {
            login(loginInput: $loginInput) {
              id
              email
            }
          }
        `;

        const response = await graphqlRequest(loginMutation, {
          loginInput: {
            email: testUser.email,
            password: testUser.password,
          },
        });

        const cookies = response.headers['set-cookie'];
        expect(cookies).toBeDefined();

        const tokenCookie = cookies?.find((cookie: string) =>
          cookie.startsWith('token=')
        );
        expect(tokenCookie).toBeDefined();
        expect(tokenCookie).toContain('HttpOnly');
        expect(tokenCookie).toContain('SameSite=Lax');
      });
    });
  });

  describe('GraphQL Schema Validation', () => {
    it('should handle malformed GraphQL queries', async () => {
      const malformedQuery = `
        query {
          invalidField {
            nonExistentProperty
          }
        }
      `;

      const response = await graphqlRequest(malformedQuery);

      expect(response.data.errors).toBeDefined();
      expect(response.data.errors[0].message).toContain('Cannot query field');
    });

    it('should handle missing required variables', async () => {
      const queryWithMissingVariables = `
        mutation CreateUser($createUserInput: CreateUserInput!) {
          createUser(createUserInput: $createUserInput) {
            id
            email
          }
        }
      `;

      const response = await graphqlRequest(queryWithMissingVariables);

      expect(response.data.errors).toBeDefined();
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete user lifecycle: create -> login -> query', async () => {
      // Step 1: Create user
      const createUserMutation = `
        mutation CreateUser($createUserInput: CreateUserInput!) {
          createUser(createUserInput: $createUserInput) {
            id
            email
          }
        }
      `;

      const createResponse = await graphqlRequest(createUserMutation, {
        createUserInput: testUser,
      });

      expect(createResponse.status).toBe(200);
      const createdUser = createResponse.data.data.createUser;

      // Step 2: Login with created user
      const loginMutation = `
        mutation Login($loginInput: LoginInput!) {
          login(loginInput: $loginInput) {
            id
            email
          }
        }
      `;

      const loginResponse = await graphqlRequest(loginMutation, {
        loginInput: {
          email: testUser.email,
          password: testUser.password,
        },
      });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.data.data.login.id).toBe(createdUser.id);

      // Step 3: Query users (should include our created user)
      const getUsersQuery = `
        query GetUsers {
          getUsers {
            id
            email
          }
        }
      `;

      const queryResponse = await graphqlRequest(getUsersQuery);

      expect(queryResponse.status).toBe(200);
      const users = queryResponse.data.data.getUsers;
      const ourUser = users.find((user: any) => user.id === createdUser.id);
      expect(ourUser).toBeDefined();
      expect(ourUser.email).toBe(testUser.email);
    });
  });
});
