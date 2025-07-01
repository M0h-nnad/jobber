# GraphQL Playground Modernization Guide

Your GraphQL setup has been updated to use modern alternatives to the deprecated GraphQL Playground. Here are the available options:

## 🚀 Current Setup: Apollo Studio Explorer (Recommended)

The default configuration now uses Apollo Server 4's built-in modern landing page, which provides:

- **Modern UI**: Clean, intuitive interface with Apollo Studio Explorer
- **Advanced Features**: Query builder, variable management, documentation explorer
- **Authentication Support**: Built-in auth handling
- **Team Collaboration**: Share queries and collections
- **Performance Insights**: Query analysis and optimization suggestions

### Current Configuration

```typescript
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: true,
  context: ({ req, res }) => ({ req, res }),
  introspection: true,
  playground: false, // Disable deprecated playground
  // Apollo Server 4 automatically provides modern landing page
});
```

### Accessing the Explorer

1. **Local Development**: Visit `http://localhost:3000/api/graphql`
2. **Apollo Studio**: Connect your schema to [Apollo Studio](https://studio.apollographql.com)

### Features Available

- ✅ Query building with autocomplete
- ✅ Real-time schema introspection
- ✅ Variable and header management
- ✅ Cookie support for authentication
- ✅ Query history and collections
- ✅ Documentation explorer

## 🔧 Alternative Options

### Option 1: Custom Landing Page with Plugins

If you want more control over the landing page, you can add custom plugins:

```typescript
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: true,
  context: ({ req, res }) => ({ req, res }),
  introspection: true,
  playground: false,
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({
      embed: true,
      includeCookies: true,
    }),
  ],
});
```

### Option 2: GraphQL Yoga (Most Modern)

For the most modern experience, install GraphQL Yoga:

```bash
npm install @graphql-yoga/nestjs graphql-yoga
```

Then update your configuration:

```typescript
// Replace Apollo with Yoga in app.module.ts
import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs';

GraphQLModule.forRoot<YogaDriverConfig>({
  driver: YogaDriver,
  autoSchemaFile: true,
  context: ({ req, res }) => ({ req, res }),
  graphiql: {
    title: 'Jobber Auth GraphQL API',
    settings: {
      'editor.theme': 'dark',
      'request.credentials': 'include',
    },
  },
});
```

### Option 3: External Tools

Use external GraphQL clients:

1. **Insomnia**: Download from [insomnia.rest](https://insomnia.rest)
2. **Postman**: Built-in GraphQL support
3. **GraphQL Playground Desktop**: Standalone application
4. **Apollo Studio**: Cloud-based solution

## 🛠️ Configuration Details

### Simplified Setup

The current setup uses Apollo Server 4's default behavior:

- Introspection enabled for development
- Modern landing page automatically provided
- No plugin conflicts
- Cookie support built-in

### Adding CORS (Optional)

If you need CORS for external tools, add this to `main.ts`:

```typescript
app.enableCors({
  origin: ['https://studio.apollographql.com', 'http://localhost:3000', 'http://localhost:4200', /^http:\/\/localhost:\d+$/],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Apollo-Require-Preflight'],
});
```

## 🎯 Getting Started

1. **Start your server**:

   ```bash
   nx serve jobber-auth
   ```

2. **Open the GraphQL endpoint**:

   ```
   http://localhost:3000/api/graphql
   ```

3. **Try a query**:

   ```graphql
   query GetUsers {
     getUsers {
       id
       email
     }
   }
   ```

4. **Test authentication**:
   ```graphql
   mutation Login($loginInput: LoginInput!) {
     login(loginInput: $loginInput) {
       id
       email
     }
   }
   ```

## 🔐 Security Considerations

- Introspection is enabled for development
- Consider disabling introspection in production
- Modern landing page is secure by default
- Cookie support is built-in

## 📚 Additional Resources

- [Apollo Studio Documentation](https://www.apollographql.com/docs/studio/)
- [Apollo Server 4 Documentation](https://www.apollographql.com/docs/apollo-server/)
- [GraphQL Yoga Documentation](https://the-guild.dev/graphql/yoga-server)

## 🚨 Migration Notes

- The old GraphQL Playground is deprecated as of December 31, 2022
- Apollo Server 4 provides modern alternatives by default
- All existing queries and mutations work without changes
- Authentication flows remain the same
- No additional packages required for basic modern functionality
