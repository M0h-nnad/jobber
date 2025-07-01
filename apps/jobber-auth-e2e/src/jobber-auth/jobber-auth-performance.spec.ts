import { TestUtils, TestUser } from '../support/test-utils';

describe('Jobber Auth Service - Performance Tests', () => {
  // Performance thresholds (in milliseconds)
  const PERFORMANCE_THRESHOLDS = {
    SINGLE_REQUEST: 1000, // 1 second
    BATCH_REQUESTS: 5000, // 5 seconds
    CONCURRENT_REQUESTS: 3000, // 3 seconds
  };

  //   describe('Single Request Performance', () => {
  //     it('should create user within acceptable time', async () => {
  //       const testUser = TestUtils.generateTestUser('perf');

  //       const { result, executionTime } = await TestUtils.measureExecutionTime(async () => {
  //         return TestUtils.createTestUser(testUser);
  //       });

  //       expect(executionTime).toBeLessThan(PERFORMANCE_THRESHOLDS.SINGLE_REQUEST);
  //       expect(result.id).toBeDefined();
  //       expect(result.email).toBe(testUser.email);
  //     });

  //     it('should login within acceptable time', async () => {
  //       // Setup: Create a user first
  //       const testUser = await TestUtils.createTestUser();

  //       const { result, executionTime } = await TestUtils.measureExecutionTime(async () => {
  //         return TestUtils.loginUser({
  //           email: testUser.email,
  //           password: testUser.password,
  //         });
  //       });

  //       expect(executionTime).toBeLessThan(PERFORMANCE_THRESHOLDS.SINGLE_REQUEST);
  //       TestUtils.assertSuccessful(result);
  //       expect(result.data.data.login.email).toBe(testUser.email);
  //     });

  //     it('should retrieve users within acceptable time', async () => {
  //       // Setup: Create some users first
  //       const users = TestUtils.generateTestUsers(5, 'perf-query');
  //       await TestUtils.createUsersBatch(users);

  //       const { result, executionTime } = await TestUtils.measureExecutionTime(async () => {
  //         return TestUtils.getAllUsers();
  //       });

  //       expect(executionTime).toBeLessThan(PERFORMANCE_THRESHOLDS.SINGLE_REQUEST);
  //       TestUtils.assertSuccessful(result);
  //       expect(result.data.data.getUsers.length).toBeGreaterThanOrEqual(5);
  //     });
  //   });

  //   describe('Batch Operations Performance', () => {
  //     it('should handle batch user creation efficiently', async () => {
  //       const batchSize = 10;
  //       const users = TestUtils.generateTestUsers(batchSize, 'batch-create');

  //       const { result, executionTime } = await TestUtils.measureExecutionTime(async () => {
  //         return TestUtils.createUsersBatch(users);
  //       });

  //       expect(executionTime).toBeLessThan(PERFORMANCE_THRESHOLDS.BATCH_REQUESTS);
  //       expect(result.length).toBe(batchSize);

  //       // Verify all users were created successfully
  //       result.forEach((user, index) => {
  //         expect(user.id).toBeDefined();
  //         expect(user.email).toBe(users[index].email);
  //       });
  //     });

  //     it('should handle multiple sequential operations efficiently', async () => {
  //       const operationCount = 5;

  //       const { executionTime } = await TestUtils.measureExecutionTime(async () => {
  //         for (let i = 0; i < operationCount; i++) {
  //           const user = await TestUtils.createTestUser();
  //           await TestUtils.loginUser({
  //             email: user.email,
  //             password: user.password,
  //           });
  //         }
  //       });

  //       expect(executionTime).toBeLessThan(PERFORMANCE_THRESHOLDS.BATCH_REQUESTS);
  //     });
  //   });

  //   describe('Concurrent Operations Performance', () => {
  //     it('should handle concurrent user creation efficiently', async () => {
  //       const concurrentCount = 10;
  //       const users = TestUtils.generateTestUsers(concurrentCount, 'concurrent-create');

  //       const { result, executionTime } = await TestUtils.measureExecutionTime(async () => {
  //         const promises = users.map(user => TestUtils.createTestUser(user));
  //         return Promise.all(promises);
  //       });

  //       expect(executionTime).toBeLessThan(PERFORMANCE_THRESHOLDS.CONCURRENT_REQUESTS);
  //       expect(result.length).toBe(concurrentCount);

  //       // Verify all users were created successfully
  //       result.forEach((user, index) => {
  //         expect(user.id).toBeDefined();
  //         expect(user.email).toBe(users[index].email);
  //       });
  //     });

  //     it('should handle concurrent login attempts efficiently', async () => {
  //       // Setup: Create users first
  //       const users = await TestUtils.createUsersBatch(
  //         TestUtils.generateTestUsers(10, 'concurrent-login')
  //       );

  //       const { result, executionTime } = await TestUtils.measureExecutionTime(async () => {
  //         const promises = users.map(user =>
  //           TestUtils.loginUser({
  //             email: user.email,
  //             password: user.password,
  //           })
  //         );
  //         return Promise.all(promises);
  //       });

  //       expect(executionTime).toBeLessThan(PERFORMANCE_THRESHOLDS.CONCURRENT_REQUESTS);
  //       expect(result.length).toBe(users.length);

  //       // Verify all logins were successful
  //       result.forEach((response, index) => {
  //         TestUtils.assertSuccessful(response);
  //         expect(response.data.data.login.email).toBe(users[index].email);
  //       });
  //     });

  //     it('should handle concurrent mixed operations efficiently', async () => {
  //       const operationCount = 15;

  //       const { result, executionTime } = await TestUtils.measureExecutionTime(async () => {
  //         const promises: Promise<any>[] = [];

  //         // Mix of create, login, and query operations
  //         for (let i = 0; i < operationCount; i++) {
  //           if (i % 3 === 0) {
  //             // Create user
  //             promises.push(TestUtils.createTestUser());
  //           } else if (i % 3 === 1) {
  //             // Query users
  //             promises.push(TestUtils.getAllUsers());
  //           } else {
  //             // Create user and login
  //             promises.push(
  //               TestUtils.createTestUser().then(user =>
  //                 TestUtils.loginUser({
  //                   email: user.email,
  //                   password: user.password,
  //                 })
  //               )
  //             );
  //           }
  //         }

  //         return Promise.all(promises);
  //       });

  //       expect(executionTime).toBeLessThan(PERFORMANCE_THRESHOLDS.CONCURRENT_REQUESTS);
  //       expect(result.length).toBe(operationCount);
  //     });
  //   });

  //   describe('Load Testing', () => {
  //     it('should handle high volume of user queries', async () => {
  //       const queryCount = 50;

  //       const { result, executionTime } = await TestUtils.measureExecutionTime(async () => {
  //         const promises = Array(queryCount).fill(null).map(() =>
  //           TestUtils.getAllUsers()
  //         );
  //         return Promise.all(promises);
  //       });

  //       expect(executionTime).toBeLessThan(10000); // 10 seconds for high volume
  //       expect(result.length).toBe(queryCount);

  //       // Verify all queries were successful
  //       result.forEach(response => {
  //         TestUtils.assertSuccessful(response);
  //         expect(Array.isArray(response.data.data.getUsers)).toBe(true);
  //       });
  //     });

  //     it('should maintain performance under sustained load', async () => {
  //       const rounds = 3;
  //       const operationsPerRound = 10;
  //       const results: number[] = [];

  //       for (let round = 0; round < rounds; round++) {
  //         const { executionTime } = await TestUtils.measureExecutionTime(async () => {
  //           const promises = Array(operationsPerRound).fill(null).map(() =>
  //             TestUtils.createTestUser()
  //           );
  //           return Promise.all(promises);
  //         });

  //         results.push(executionTime);

  //         // Small delay between rounds
  //         await TestUtils.wait(100);
  //       }

  //       // Performance should not degrade significantly across rounds
  //       const avgTime = results.reduce((sum, time) => sum + time, 0) / results.length;
  //       const maxTime = Math.max(...results);

  //       expect(avgTime).toBeLessThan(PERFORMANCE_THRESHOLDS.CONCURRENT_REQUESTS);
  //       expect(maxTime).toBeLessThan(PERFORMANCE_THRESHOLDS.CONCURRENT_REQUESTS * 1.5); // Allow 50% variance
  //     });
  //   });

  //   describe('Error Handling Performance', () => {
  //     it('should handle validation errors efficiently', async () => {
  //       const invalidRequests = 20;

  //       const { result, executionTime } = await TestUtils.measureExecutionTime(async () => {
  //         const promises = Array(invalidRequests).fill(null).map(() =>
  //           TestUtils.graphqlRequest(`
  //             mutation CreateUser($createUserInput: CreateUserInput!) {
  //               createUser(createUserInput: $createUserInput) {
  //                 id
  //                 email
  //               }
  //             }
  //           `, {
  //             createUserInput: {
  //               email: 'invalid-email',
  //               password: '',
  //             },
  //           })
  //         );
  //         return Promise.all(promises);
  //       });

  //       expect(executionTime).toBeLessThan(PERFORMANCE_THRESHOLDS.CONCURRENT_REQUESTS);
  //       expect(result.length).toBe(invalidRequests);

  //       // All should have validation errors
  //       result.forEach(response => {
  //         TestUtils.assertHasErrors(response);
  //       });
  //     });

  //     it('should handle authentication failures efficiently', async () => {
  //       const failedLoginAttempts = 20;

  //       const { result, executionTime } = await TestUtils.measureExecutionTime(async () => {
  //         const promises = Array(failedLoginAttempts).fill(null).map(() =>
  //           TestUtils.loginUser({
  //             email: 'nonexistent@example.com',
  //             password: 'wrongpassword',
  //           })
  //         );
  //         return Promise.all(promises);
  //       });

  //       expect(executionTime).toBeLessThan(PERFORMANCE_THRESHOLDS.CONCURRENT_REQUESTS);
  //       expect(result.length).toBe(failedLoginAttempts);

  //       // All should have authentication errors
  //       result.forEach(response => {
  //         TestUtils.assertHasErrors(response, 'Invalid credentials');
  //       });
  //     });
  //   });

  //   describe('Memory Usage and Resource Management', () => {
  //     it('should handle large query results efficiently', async () => {
  //       // Create a significant number of users first
  //       const largeUserSet = TestUtils.generateTestUsers(50, 'large-set');
  //       await TestUtils.createUsersBatch(largeUserSet);

  //       const { result, executionTime } = await TestUtils.measureExecutionTime(async () => {
  //         return TestUtils.getAllUsers();
  //       });

  //       expect(executionTime).toBeLessThan(PERFORMANCE_THRESHOLDS.SINGLE_REQUEST * 2); // Allow extra time for large dataset
  //       TestUtils.assertSuccessful(result);
  //       expect(result.data.data.getUsers.length).toBeGreaterThanOrEqual(50);
  //     });

  //     it('should handle rapid successive requests without memory leaks', async () => {
  //       const rapidRequests = 100;
  //       const batchSize = 10;
  //       const results: number[] = [];

  //       // Process requests in batches to avoid overwhelming the system
  //       for (let i = 0; i < rapidRequests; i += batchSize) {
  //         const batch = Math.min(batchSize, rapidRequests - i);

  //         const { executionTime } = await TestUtils.measureExecutionTime(async () => {
  //           const promises = Array(batch).fill(null).map(() =>
  //             TestUtils.getAllUsers()
  //           );
  //           return Promise.all(promises);
  //         });

  //         results.push(executionTime);
  //       }

  //       // Performance should remain consistent across batches
  //       const avgTime = results.reduce((sum, time) => sum + time, 0) / results.length;
  //       const maxTime = Math.max(...results);

  //       expect(avgTime).toBeLessThan(PERFORMANCE_THRESHOLDS.SINGLE_REQUEST);
  //       expect(maxTime).toBeLessThan(PERFORMANCE_THRESHOLDS.SINGLE_REQUEST * 2);
  //     });
  //   });

  //   describe('Network and Timeout Handling', () => {
  //     it('should handle slow network conditions gracefully', async () => {
  //       // Simulate slow network by making many concurrent requests
  //       const slowNetworkSimulation = 30;

  //       const { result, executionTime } = await TestUtils.measureExecutionTime(async () => {
  //         const promises = Array(slowNetworkSimulation).fill(null).map(() =>
  //           TestUtils.getAllUsers()
  //         );
  //         return Promise.all(promises);
  //       });

  //       // Should complete within reasonable time even under load
  //       expect(executionTime).toBeLessThan(15000); // 15 seconds
  //       expect(result.length).toBe(slowNetworkSimulation);

  //       // Most requests should succeed
  //       const successfulRequests = result.filter(response =>
  //         response.status === 200 && !response.data.errors
  //       );
  //       expect(successfulRequests.length).toBeGreaterThan(slowNetworkSimulation * 0.8); // 80% success rate
  //     });
  //   });

  //   describe('Performance Regression Detection', () => {
  //     it('should detect performance regressions in user creation', async () => {
  //       const samples = 5;
  //       const results: number[] = [];

  //       for (let i = 0; i < samples; i++) {
  //         const { executionTime } = await TestUtils.measureExecutionTime(async () => {
  //           return TestUtils.createTestUser();
  //         });
  //         results.push(executionTime);
  //       }

  //       const avgTime = results.reduce((sum, time) => sum + time, 0) / results.length;
  //       const maxTime = Math.max(...results);
  //       const minTime = Math.min(...results);

  //       // Performance metrics for regression detection
  //       expect(avgTime).toBeLessThan(PERFORMANCE_THRESHOLDS.SINGLE_REQUEST);
  //       expect(maxTime - minTime).toBeLessThan(PERFORMANCE_THRESHOLDS.SINGLE_REQUEST); // Consistency check

  //       console.log(`User creation performance - Avg: ${avgTime}ms, Min: ${minTime}ms, Max: ${maxTime}ms`);
  //     });

  //     it('should detect performance regressions in authentication', async () => {
  //       // Setup: Create a user first
  //       const testUser = await TestUtils.createTestUser();

  //       const samples = 5;
  //       const results: number[] = [];

  //       for (let i = 0; i < samples; i++) {
  //         const { executionTime } = await TestUtils.measureExecutionTime(async () => {
  //           return TestUtils.loginUser({
  //             email: testUser.email,
  //             password: testUser.password,
  //           });
  //         });
  //         results.push(executionTime);
  //       }

  //       const avgTime = results.reduce((sum, time) => sum + time, 0) / results.length;
  //       const maxTime = Math.max(...results);
  //       const minTime = Math.min(...results);

  //       // Performance metrics for regression detection
  //       expect(avgTime).toBeLessThan(PERFORMANCE_THRESHOLDS.SINGLE_REQUEST);
  //       expect(maxTime - minTime).toBeLessThan(PERFORMANCE_THRESHOLDS.SINGLE_REQUEST); // Consistency check

  //       console.log(`Authentication performance - Avg: ${avgTime}ms, Min: ${minTime}ms, Max: ${maxTime}ms`);
  //     });
  //   });
});
