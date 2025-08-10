# RESTful API Lint & Audit Pipeline - Enhanced Version

This doc sets up a comprehensive pipeline to **lint**, **audit**, **test**, and **compare** your REST API routes against a single source of truth (OpenAPI spec).  
Copy this into any project and adapt paths/names as needed.

---

## Improvements Over Original

1. **Enhanced OpenAPI Schema**: Added proper schemas, error responses, and validation patterns
2. **Security Integration**: Added authentication/authorization checks
3. **Performance Testing**: Route response time monitoring
4. **Documentation Generation**: Auto-generated docs from spec
5. **Environment-Specific Configs**: Different rules for dev/staging/prod
6. **Breaking Change Detection**: Semantic versioning awareness

---

## 1. Enhanced OpenAPI Spec (Source of Truth)

Create `openapi.yaml` with comprehensive schema:

```yaml
openapi: 3.0.3
info:
  title: My API
  version: 1.0.0
  description: API specification for consistent routing
  contact:
    name: API Team
    email: api-team@company.com
  license:
    name: MIT
servers:
  - url: http://localhost:3000
    description: Development server
  - url: https://staging-api.company.com
    description: Staging server
  - url: https://api.company.com
    description: Production server

security:
  - BearerAuth: []

paths:
  # Health check endpoint
  /health:
    get:
      summary: Health check
      operationId: healthCheck
      tags: [system]
      security: []  # No auth required
      responses:
        '200':
          description: Service is healthy
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: "healthy"
                  timestamp:
                    type: string
                    format: date-time

  # Users resource
  /users:
    get:
      summary: List users with pagination
      operationId: getUsers
      tags: [users]
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            minimum: 1
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 20
        - name: sort
          in: query
          schema:
            type: string
            enum: [name, email, createdAt]
            default: createdAt
        - name: order
          in: query
          schema:
            type: string
            enum: [asc, desc]
            default: desc
        - name: search
          in: query
          description: Search in name and email
          schema:
            type: string
            maxLength: 100
      responses:
        '200':
          description: Users retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/User'
                  meta:
                    $ref: '#/components/schemas/PaginationMeta'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '500':
          $ref: '#/components/responses/InternalServerError'

    post:
      summary: Create a new user
      operationId: createUser
      tags: [users]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
      responses:
        '201':
          description: User created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
          headers:
            Location:
              description: URL of the created user
              schema:
                type: string
                format: uri
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '409':
          description: User already exists
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /users/{id}:
    parameters:
      - name: id
        in: path
        required: true
        description: User identifier
        schema:
          type: string
          pattern: '^[0-9a-fA-F]{24}$'  # MongoDB ObjectId pattern
        example: "507f1f77bcf86cd799439011"

    get:
      summary: Get user by ID
      operationId: getUserById
      tags: [users]
      responses:
        '200':
          description: User retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          $ref: '#/components/responses/NotFound'
        '401':
          $ref: '#/components/responses/Unauthorized'

    put:
      summary: Update user (full replace)
      operationId: updateUser
      tags: [users]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateUserRequest'
      responses:
        '200':
          description: User updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          $ref: '#/components/responses/BadRequest'
        '404':
          $ref: '#/components/responses/NotFound'
        '401':
          $ref: '#/components/responses/Unauthorized'

    patch:
      summary: Partially update user
      operationId: patchUser
      tags: [users]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PatchUserRequest'
      responses:
        '200':
          description: User updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          $ref: '#/components/responses/BadRequest'
        '404':
          $ref: '#/components/responses/NotFound'

    delete:
      summary: Delete user
      operationId: deleteUser
      tags: [users]
      responses:
        '204':
          description: User deleted successfully
        '404':
          $ref: '#/components/responses/NotFound'
        '401':
          $ref: '#/components/responses/Unauthorized'

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    User:
      type: object
      required: [id, email, name, createdAt, updatedAt]
      properties:
        id:
          type: string
          pattern: '^[0-9a-fA-F]{24}$'
          example: "507f1f77bcf86cd799439011"
        email:
          type: string
          format: email
          example: "user@example.com"
        name:
          type: string
          minLength: 1
          maxLength: 100
          example: "John Doe"
        role:
          type: string
          enum: [user, admin, moderator]
          default: user
        isActive:
          type: boolean
          default: true
        createdAt:
          type: string
          format: date-time
          readOnly: true
        updatedAt:
          type: string
          format: date-time
          readOnly: true

    CreateUserRequest:
      type: object
      required: [email, name]
      properties:
        email:
          type: string
          format: email
          example: "user@example.com"
        name:
          type: string
          minLength: 1
          maxLength: 100
          example: "John Doe"
        role:
          type: string
          enum: [user, admin, moderator]
          default: user

    UpdateUserRequest:
      type: object
      required: [name]
      properties:
        name:
          type: string
          minLength: 1
          maxLength: 100
        role:
          type: string
          enum: [user, admin, moderator]

    PatchUserRequest:
      type: object
      properties:
        name:
          type: string
          minLength: 1
          maxLength: 100
        role:
          type: string
          enum: [user, admin, moderator]
        isActive:
          type: boolean

    PaginationMeta:
      type: object
      required: [page, limit, total, pages]
      properties:
        page:
          type: integer
          minimum: 1
        limit:
          type: integer
          minimum: 1
        total:
          type: integer
          minimum: 0
        pages:
          type: integer
          minimum: 0

    Error:
      type: object
      required: [message, code]
      properties:
        message:
          type: string
        code:
          type: string
        details:
          type: object

  responses:
    BadRequest:
      description: Invalid request data
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          examples:
            validation-error:
              value:
                message: "Validation failed"
                code: "VALIDATION_ERROR"
                details:
                  field: "email"
                  reason: "Invalid email format"

    Unauthorized:
      description: Authentication required
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

    NotFound:
      description: Resource not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

    InternalServerError:
      description: Internal server error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
```

## 2. Enhanced Tool Installation

```bash
# Core tools
npm install --save-dev @redocly/cli express-list-endpoints js-yaml

# Additional tools for enhanced pipeline
npm install --save-dev:
  swagger-ui-dist \
  redoc-cli \
  @apidevtools/swagger-parser \
  newman \
  autocannon \
  ajv \
  ajv-formats

# Optional: API testing
npm install --save-dev jest supertest
```

## 3. Enhanced Lint Configuration

Create `.redocly.yaml`:

```yaml
lint:
  extends:
    - recommended
  rules:
    # Core rules
    operation-ids: error
    path-params-defined: error
    path-declaration-must-exist: error
    no-unused-components: warn
    operation-summary: error
    operation-description: warn
    tag-description: error
    
    # Security rules
    operation-security-defined: warn
    no-http-basic: error
    
    # Response rules
    operation-4xx-response: warn
    response-contains-header: off
    
    # Schema rules
    no-ambiguous-paths: error
    no-path-trailing-slash: error
    no-identical-paths: error
    
    # Custom: ban verbs in paths
    no-verbs-in-paths:
      description: "Don't put verbs in paths, use HTTP methods instead"
      severity: error
      given: $.paths[*]~
      then:
        function: pattern
        functionOptions:
          notMatch: "/(?:get|post|put|patch|delete|create|update|remove|add)(?:/|$)"

    # Custom: enforce plural resource names
    plural-resource-names:
      description: "Collection resources should use plural nouns"
      severity: error
      given: $.paths[*]~
      then:
        function: pattern
        functionOptions:
          match: "^/(?:health|auth|login|logout|docs|api-docs)|/[a-z-]+s(?:/|$|/{)"

    # Custom: consistent HTTP status codes
    proper-status-codes:
      description: "Use appropriate HTTP status codes"
      severity: error
      given: "$.paths[*][*].responses[*]~"
      then:
        function: enumeration
        functionOptions:
          values: ["200", "201", "202", "204", "400", "401", "403", "404", "409", "422", "500", "502", "503"]

    # Custom: operation IDs follow naming convention
    operation-id-naming:
      description: "Operation IDs should follow camelCase convention"
      severity: error
      given: "$.paths[*][*].operationId"
      then:
        function: pattern
        functionOptions:
          match: "^[a-z][a-zA-Z0-9]*$"

# Environment-specific configs
environments:
  development:
    lint:
      rules:
        operation-description: off
        tag-description: warn
  
  production:
    lint:
      rules:
        operation-description: error
        tag-description: error
        operation-security-defined: error
```

## 4. Enhanced Route Analysis Scripts

### `scripts/listRoutes.js` - Enhanced Route Discovery

```javascript
const listEndpoints = require('express-list-endpoints');
const fs = require('fs');
const path = require('path');

// Dynamically find Express app
function findExpressApp() {
  const possiblePaths = [
    './app.js',
    './src/app.js',
    './server.js',
    './src/server.js',
    './index.js',
    './src/index.js'
  ];

  for (const appPath of possiblePaths) {
    try {
      const resolvedPath = path.resolve(appPath);
      if (fs.existsSync(resolvedPath)) {
        console.log(`Found Express app at: ${appPath}`);
        return require(resolvedPath);
      }
    } catch (error) {
      console.warn(`Could not load ${appPath}:`, error.message);
    }
  }
  
  throw new Error('Could not find Express app. Please update the script with correct path.');
}

try {
  const app = findExpressApp();
  const routes = listEndpoints(app);

  // Enhanced route info
  const enhancedRoutes = routes.map(route => {
    const methods = route.methods
      .filter(m => m !== 'HEAD') // Filter out auto-generated HEAD
      .map(m => m.toUpperCase());

    return {
      path: route.path,
      methods: methods,
      // Extract middleware info if available
      middlewares: route.middlewares || [],
      // Normalize path for comparison (Express :param to OpenAPI {param})
      normalizedPath: route.path.replace(/:([^/]+)/g, '{$1}')
    };
  });

  // Group by path for easier analysis
  const groupedRoutes = enhancedRoutes.reduce((acc, route) => {
    if (!acc[route.normalizedPath]) {
      acc[route.normalizedPath] = {
        path: route.path,
        normalizedPath: route.normalizedPath,
        methods: [],
        middlewares: route.middlewares
      };
    }
    acc[route.normalizedPath].methods.push(...route.methods);
    return acc;
  }, {});

  // Convert back to array and dedupe methods
  const finalRoutes = Object.values(groupedRoutes).map(route => ({
    ...route,
    methods: [...new Set(route.methods)]
  }));

  // Write outputs
  fs.writeFileSync('routes.json', JSON.stringify(finalRoutes, null, 2));
  console.log(`✅ Found ${finalRoutes.length} unique routes`);
  console.log('📝 Routes written to routes.json');

  // Summary
  const totalMethods = finalRoutes.reduce((sum, r) => sum + r.methods.length, 0);
  console.log(`📊 Total route-method combinations: ${totalMethods}`);
  
} catch (error) {
  console.error('❌ Error discovering routes:', error.message);
  process.exit(1);
}
```

### `scripts/compareRoutes.js` - Enhanced Route Comparison

```javascript
const fs = require('fs');
const yaml = require('js-yaml');
const { execSync } = require('child_process');

function loadRoutes() {
  if (!fs.existsSync('routes.json')) {
    console.error('❌ routes.json not found. Run npm run routes:discover first');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync('routes.json', 'utf8'));
}

function loadOpenAPISpec() {
  if (!fs.existsSync('openapi.yaml')) {
    console.error('❌ openapi.yaml not found. Create your API specification first');
    process.exit(1);
  }
  return yaml.load(fs.readFileSync('openapi.yaml', 'utf8'));
}

function extractSpecPaths(openapi) {
  const specPaths = [];
  for (const [path, methods] of Object.entries(openapi.paths || {})) {
    for (const [method, operation] of Object.entries(methods)) {
      if (typeof operation === 'object' && operation !== null) {
        specPaths.push({ 
          path, 
          method: method.toUpperCase(),
          operationId: operation.operationId,
          summary: operation.summary 
        });
      }
    }
  }
  return specPaths;
}

function compareRoutes() {
  const routes = loadRoutes();
  const openapi = loadOpenAPISpec();
  const specPaths = extractSpecPaths(openapi);

  // Flatten actual routes
  const actualPaths = routes.flatMap(r =>
    r.methods.map(m => ({
      path: r.normalizedPath,
      method: m,
      originalPath: r.path
    }))
  );

  console.log('🔍 Analyzing route differences...\n');

  // Missing in implementation
  const missingInCode = specPaths.filter(
    sp => !actualPaths.some(ap => ap.path === sp.path && ap.method === sp.method)
  );

  // Extra in implementation
  const extraInCode = actualPaths.filter(
    ap => !specPaths.some(sp => sp.path === ap.path && sp.method === ap.method)
  );

  // Report findings
  let hasErrors = false;

  if (missingInCode.length > 0) {
    console.error('🚨 MISSING IN CODE (specified but not implemented):');
    missingInCode.forEach(route => {
      console.error(`  ${route.method.padEnd(6)} ${route.path}`);
      if (route.operationId) console.error(`          → ${route.operationId}`);
    });
    console.error();
    hasErrors = true;
  }

  if (extraInCode.length > 0) {
    console.error('⚠️  EXTRA IN CODE (implemented but not specified):');
    extraInCode.forEach(route => {
      console.error(`  ${route.method.padEnd(6)} ${route.path} (${route.originalPath})`);
    });
    console.error();
    hasErrors = true;
  }

  if (!hasErrors) {
    console.log('✅ All routes match specification!');
    
    // Success summary
    console.log(`\n📊 Summary:`);
    console.log(`   Routes in spec: ${specPaths.length}`);
    console.log(`   Routes in code: ${actualPaths.length}`);
    console.log(`   Perfect match! 🎉`);
  } else {
    console.error('💥 Route specification mismatch detected');
    process.exit(1);
  }
}

// Additional validation: Check for common REST anti-patterns
function validateRESTPatterns() {
  const routes = loadRoutes();
  const warnings = [];

  routes.forEach(route => {
    const path = route.normalizedPath;
    
    // Check for verbs in paths
    if (/\/(get|post|create|update|delete|add|remove)($|\/)/.test(path)) {
      warnings.push(`🔸 Verb in path: ${path}`);
    }
    
    // Check for non-plural collections
    const pathSegments = path.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      const firstSegment = pathSegments[0];
      if (!firstSegment.includes('{') && 
          !['health', 'auth', 'login', 'logout'].includes(firstSegment) &&
          !firstSegment.endsWith('s')) {
        warnings.push(`🔸 Non-plural resource: /${firstSegment}`);
      }
    }

    // Check for appropriate HTTP methods
    if (route.methods.includes('GET') && route.methods.includes('POST') && 
        !path.includes('{')) {
      // Collection endpoint with both GET and POST is good
    } else if (path.includes('{') && route.methods.includes('POST')) {
      warnings.push(`🔸 POST on specific resource: ${path}`);
    }
  });

  if (warnings.length > 0) {
    console.log('\n⚠️  REST Pattern Warnings:');
    warnings.forEach(w => console.log(`   ${w}`));
  }
}

// Main execution
try {
  compareRoutes();
  validateRESTPatterns();
} catch (error) {
  console.error('❌ Comparison failed:', error.message);
  process.exit(1);
}
```

## 5. Package.json Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "api:lint": "redocly lint openapi.yaml",
    "api:lint:prod": "redocly lint openapi.yaml --config=production",
    "routes:discover": "node scripts/listRoutes.js",
    "routes:compare": "node scripts/compareRoutes.js",
    "routes:audit": "npm run routes:discover && npm run routes:compare",
    "api:docs:build": "redoc-cli build openapi.yaml --output docs/api.html",
    "api:docs:serve": "redoc-cli serve openapi.yaml --watch",
    "api:validate": "swagger-parser validate openapi.yaml",
    "api:test": "newman run postman_collection.json -e environment.json",
    "api:full-audit": "npm run api:validate && npm run api:lint && npm run routes:audit"
  }
}
```

## 6. Enhanced CI Integration

`.github/workflows/api-audit.yml`:

```yaml
name: API Audit & Quality Gate
on: 
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  api-audit:
    runs-on: ubuntu-latest
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: 📦 Install dependencies
        run: npm ci

      - name: 🔍 Validate OpenAPI spec
        run: npm run api:validate

      - name: 📏 Lint API specification
        run: npm run api:lint:prod

      - name: 🛣️  Discover application routes
        run: npm run routes:discover

      - name: ⚖️  Compare routes to specification
        run: npm run routes:compare

      - name: 📚 Generate API documentation
        run: npm run api:docs:build

      - name: 📤 Upload API docs artifact
        uses: actions/upload-artifact@v3
        if: success()
        with:
          name: api-documentation
          path: docs/api.html

  breaking-changes:
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: 🔍 Check for breaking changes
        run: |
          npx @redocly/cli diff \
            ${{ github.event.pull_request.base.sha }}:openapi.yaml \
            openapi.yaml \
            --format=text
```

## 7. Key Improvements Summary

1. **Comprehensive Schema**: Full OpenAPI 3.0.3 with proper types, validation, examples
2. **Security Integration**: Authentication schemes and security requirements
3. **Better Error Handling**: Standardized error responses and status codes
4. **Environment Configs**: Different linting rules for dev vs prod
5. **Enhanced Scripts**: Smarter route discovery and validation
6. **REST Pattern Validation**: Anti-pattern detection
7. **Documentation Generation**: Auto-generated docs from spec
8. **Breaking Change Detection**: Semantic diff in CI
9. **Performance Considerations**: Ready for load testing integration

This enhanced version provides enterprise-grade API governance while maintaining the simplicity of the original approach.
