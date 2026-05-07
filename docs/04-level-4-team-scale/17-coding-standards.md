# AI-Friendly Coding Standards and Conventions

## Introduction to AI-Optimized Coding Standards

Traditional coding standards focus on human readability, maintainability, and consistency. AI-friendly coding standards build on these foundations while adding practices that maximize AI effectiveness in code generation, review, refactoring, and maintenance tasks.

The goal is not to compromise code quality for AI convenience, but rather to establish patterns that benefit both human engineers and AI assistants. Well-designed AI-friendly standards improve context clarity, reduce ambiguity, enable better code analysis, and facilitate more accurate AI-generated suggestions.

## Why AI-Friendly Standards Matter

AI models excel at pattern recognition and generation when working with consistent, well-structured code. However, they struggle with:

- Implicit conventions that aren't encoded in the code
- Context-dependent rules that vary across files or modules
- Undocumented architectural decisions
- Ambiguous naming patterns
- Inconsistent code organization

By establishing standards that make implicit knowledge explicit, teams can dramatically improve AI accuracy while also creating more maintainable codebases.

**Impact Metrics**: Organizations that adopt AI-friendly coding standards typically see:
- 40-60% reduction in AI-generated code requiring significant modification
- 30-50% improvement in AI code review accuracy
- 25-35% faster onboarding for new team members (human and AI)
- 20-30% reduction in refactoring rework

## Core Principles of AI-Friendly Standards

### 1. Explicit Over Implicit

Make architectural decisions, patterns, and conventions explicit in code rather than relying on tribal knowledge.

**Anti-Pattern**:
```python
# Implicit convention: services ending in 'Service' use async patterns
class UserService:
    def get_user(self, user_id):  # Should this be async?
        pass
```

**AI-Friendly Pattern**:
```python
# Base classes make patterns explicit
class AsyncService(ABC):
    """Base class for async services. All methods must be async."""
    pass

class UserService(AsyncService):
    async def get_user(self, user_id: str) -> User:
        """Fetch user by ID.
        
        Args:
            user_id: Unique user identifier
            
        Returns:
            User object if found
            
        Raises:
            UserNotFoundError: If user doesn't exist
        """
        pass
```

### 2. Consistent Structure

Maintain consistent file organization, naming patterns, and code structure across the codebase.

**Standard Template for Service Classes**:
```typescript
/**
 * [Service Name] - [Brief Description]
 * 
 * Responsibilities:
 * - [Responsibility 1]
 * - [Responsibility 2]
 * 
 * Dependencies:
 * - [Dependency 1]: [Purpose]
 * - [Dependency 2]: [Purpose]
 * 
 * Related Components:
 * - [Component 1]: [Relationship]
 */

export class UserAuthenticationService {
  // 1. Constants and static properties
  private static readonly MAX_LOGIN_ATTEMPTS = 3;
  
  // 2. Instance properties (grouped by visibility)
  private readonly userRepository: UserRepository;
  private readonly tokenService: TokenService;
  private loginAttempts: Map<string, number>;
  
  // 3. Constructor
  constructor(
    userRepository: UserRepository,
    tokenService: TokenService,
  ) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
    this.loginAttempts = new Map();
  }
  
  // 4. Public methods (grouped by functionality)
  async authenticate(email: string, password: string): Promise<AuthResult> {
    // Implementation
  }
  
  // 5. Private helper methods
  private async validateCredentials(
    email: string,
    password: string,
  ): Promise<boolean> {
    // Implementation
  }
}
```

### 3. Self-Documenting Code with Strategic Comments

Write code that is largely self-explanatory, but add comments that capture intent, business rules, and architectural decisions.

**Comment Categories**:

```java
public class OrderProcessor {
    
    // BUSINESS RULE: Orders over $1000 require manager approval
    // This threshold is defined in business policy BP-2024-003
    private static final BigDecimal APPROVAL_THRESHOLD = new BigDecimal("1000.00");
    
    /**
     * Process an order through the fulfillment pipeline.
     * 
     * WORKFLOW:
     * 1. Validate inventory availability
     * 2. Apply pricing and discounts
     * 3. Check if approval required (> $1000)
     * 4. Create fulfillment request
     * 5. Send confirmation email
     * 
     * SIDE EFFECTS:
     * - Reduces inventory quantities
     * - Creates audit log entries
     * - Sends external API calls to payment gateway
     * 
     * PERFORMANCE: Expected to complete in < 500ms for typical orders
     * 
     * @param order The order to process
     * @return Processing result with confirmation details
     * @throws InsufficientInventoryException if items unavailable
     * @throws PaymentProcessingException if payment fails
     */
    public OrderResult processOrder(Order order) {
        // WHY: Inventory check must happen before payment to avoid
        // charging customers for items we can't fulfill
        if (!checkInventory(order)) {
            throw new InsufficientInventoryException(order.getItems());
        }
        
        // ARCHITECTURE: Pricing service is called here rather than
        // in the controller to ensure consistent pricing even when
        // orders are created from batch imports
        BigDecimal total = pricingService.calculateTotal(order);
        
        // Implementation continues...
    }
}
```

### 4. Type Safety and Explicit Contracts

Use strong typing, interfaces, and explicit contracts to make expectations clear.

**TypeScript Example**:
```typescript
// Define explicit types for all data structures
interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  roles: UserRole[];
  preferences: UserPreferences;
  createdAt: Date;
  lastLoginAt: Date | null;
}

// Use discriminated unions for state management
type OrderStatus = 
  | { type: 'pending'; submittedAt: Date }
  | { type: 'processing'; assignedTo: string; startedAt: Date }
  | { type: 'completed'; completedAt: Date; confirmationId: string }
  | { type: 'cancelled'; reason: string; cancelledAt: Date };

// Explicit function signatures with full type information
async function createOrder(
  userId: string,
  items: OrderItem[],
  options?: OrderOptions,
): Promise<Result<Order, OrderError>> {
  // Implementation with type-safe error handling
}
```

### 5. Modular Organization with Clear Boundaries

Organize code into modules with clear responsibilities and dependencies.

**Standard Module Structure**:
```
src/
├── modules/
│   ├── user-management/
│   │   ├── README.md                    # Module overview and purpose
│   │   ├── api/                         # Public API (interfaces, DTOs)
│   │   │   ├── user.interface.ts
│   │   │   ├── user.dto.ts
│   │   │   └── user.service.interface.ts
│   │   ├── domain/                      # Business logic
│   │   │   ├── user.entity.ts
│   │   │   ├── user.repository.ts
│   │   │   └── user.validator.ts
│   │   ├── infrastructure/              # Implementation details
│   │   │   ├── user.service.impl.ts
│   │   │   └── user.repository.impl.ts
│   │   └── tests/                       # Module-specific tests
│   │       ├── user.service.test.ts
│   │       └── user.integration.test.ts
```

## Language-Specific AI-Friendly Patterns

### Python Standards

```python
"""
Module: user_authentication

Purpose: Handle user authentication and session management

Dependencies:
- bcrypt: Password hashing
- jwt: Token generation and validation
- redis: Session storage

Architecture Notes:
- Follows repository pattern for data access
- Uses dependency injection for testability
- All async operations use asyncio
"""

from typing import Optional, Protocol
from dataclasses import dataclass
from datetime import datetime, timedelta

# Use protocols for dependency injection
class UserRepository(Protocol):
    async def find_by_email(self, email: str) -> Optional[User]: ...
    async def save(self, user: User) -> None: ...

# Use dataclasses for DTOs
@dataclass(frozen=True)
class AuthenticationRequest:
    """Request for user authentication.
    
    Attributes:
        email: User's email address (validated format)
        password: Plain text password (will be hashed)
        remember_me: Whether to create long-lived session
    """
    email: str
    password: str
    remember_me: bool = False

# Explicit error types
class AuthenticationError(Exception):
    """Base class for authentication errors."""
    pass

class InvalidCredentialsError(AuthenticationError):
    """Raised when credentials are incorrect."""
    pass

class AccountLockedError(AuthenticationError):
    """Raised when account is locked due to failed attempts."""
    
    def __init__(self, unlock_at: datetime):
        self.unlock_at = unlock_at
        super().__init__(f"Account locked until {unlock_at}")

# Service with clear interface
class UserAuthenticationService:
    """Handle user authentication operations.
    
    This service manages:
    - Credential validation
    - Session creation and management
    - Account lockout after failed attempts
    
    Business Rules:
    - Lock account after 5 failed attempts
    - Session expires after 24 hours (or 30 days if remember_me)
    - Passwords must meet complexity requirements
    """
    
    # Class-level constants
    MAX_FAILED_ATTEMPTS = 5
    LOCKOUT_DURATION = timedelta(hours=1)
    SESSION_DURATION = timedelta(hours=24)
    EXTENDED_SESSION_DURATION = timedelta(days=30)
    
    def __init__(
        self,
        user_repository: UserRepository,
        session_store: SessionStore,
        password_hasher: PasswordHasher,
    ) -> None:
        """Initialize authentication service.
        
        Args:
            user_repository: Repository for user data access
            session_store: Store for session management (Redis)
            password_hasher: Service for password hashing/verification
        """
        self._user_repository = user_repository
        self._session_store = session_store
        self._password_hasher = password_hasher
    
    async def authenticate(
        self,
        request: AuthenticationRequest,
    ) -> AuthenticationResult:
        """Authenticate user and create session.
        
        Args:
            request: Authentication request with credentials
            
        Returns:
            AuthenticationResult with session token and user info
            
        Raises:
            InvalidCredentialsError: If email/password incorrect
            AccountLockedError: If account is locked
            
        Side Effects:
            - Updates last_login timestamp
            - Creates session in Redis
            - Resets failed login counter on success
        """
        # Implementation with clear steps
        user = await self._validate_credentials(request)
        await self._check_account_status(user)
        session = await self._create_session(user, request.remember_me)
        await self._update_login_timestamp(user)
        
        return AuthenticationResult(
            session_token=session.token,
            user_id=user.id,
            expires_at=session.expires_at,
        )
```

### Java Standards

```java
/**
 * User Authentication Service
 * 
 * Handles authentication operations including credential validation,
 * session management, and account security features.
 * 
 * Thread Safety: This service is thread-safe and can be used concurrently.
 * 
 * Performance Characteristics:
 * - authenticate(): O(1) average, 100-200ms typical
 * - validateSession(): O(1) average, 10-20ms typical
 * 
 * Dependencies:
 * - UserRepository: Data access for user entities
 * - SessionStore: Redis-backed session storage
 * - PasswordHasher: BCrypt password hashing
 * 
 * @author Authentication Team
 * @since 2.0.0
 */
@Service
public class UserAuthenticationService {
    
    // Configuration constants (externalized via Spring properties)
    @Value("${auth.max-failed-attempts:5}")
    private int maxFailedAttempts;
    
    @Value("${auth.lockout-duration-minutes:60}")
    private int lockoutDurationMinutes;
    
    private static final Logger logger = LoggerFactory.getLogger(
        UserAuthenticationService.class
    );
    
    // Dependencies injected via constructor
    private final UserRepository userRepository;
    private final SessionStore sessionStore;
    private final PasswordHasher passwordHasher;
    private final AuditLogger auditLogger;
    
    /**
     * Constructor for dependency injection.
     * 
     * @param userRepository Repository for user data access
     * @param sessionStore Store for session management
     * @param passwordHasher Service for password operations
     * @param auditLogger Logger for security audit events
     */
    @Autowired
    public UserAuthenticationService(
        UserRepository userRepository,
        SessionStore sessionStore,
        PasswordHasher passwordHasher,
        AuditLogger auditLogger
    ) {
        this.userRepository = userRepository;
        this.sessionStore = sessionStore;
        this.passwordHasher = passwordHasher;
        this.auditLogger = auditLogger;
    }
    
    /**
     * Authenticate user credentials and create session.
     * 
     * This method performs the following steps:
     * 1. Validate user exists and account is active
     * 2. Check account is not locked
     * 3. Verify password
     * 4. Create session
     * 5. Update login timestamp
     * 6. Log audit event
     * 
     * @param request Authentication request containing credentials
     * @return Authentication result with session details
     * @throws InvalidCredentialsException if credentials are incorrect
     * @throws AccountLockedException if account is locked
     * @throws AuthenticationException for other authentication failures
     */
    @Transactional
    public AuthenticationResult authenticate(AuthenticationRequest request) {
        Objects.requireNonNull(request, "Authentication request must not be null");
        
        logger.debug("Authenticating user: {}", request.getEmail());
        
        // Step 1: Fetch user
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new InvalidCredentialsException(
                "Invalid email or password"
            ));
        
        // Step 2: Check account status
        validateAccountStatus(user);
        
        try {
            // Step 3: Verify password
            boolean passwordValid = passwordHasher.verify(
                request.getPassword(),
                user.getPasswordHash()
            );
            
            if (!passwordValid) {
                handleFailedLogin(user);
                throw new InvalidCredentialsException("Invalid email or password");
            }
            
            // Step 4: Create session
            Session session = createSession(user, request.isRememberMe());
            
            // Step 5: Update user record
            handleSuccessfulLogin(user);
            
            // Step 6: Audit log
            auditLogger.logAuthentication(user.getId(), session.getId());
            
            logger.info("User authenticated successfully: {}", user.getId());
            
            return AuthenticationResult.builder()
                .sessionToken(session.getToken())
                .userId(user.getId())
                .expiresAt(session.getExpiresAt())
                .build();
                
        } catch (PasswordHashingException e) {
            logger.error("Password verification failed", e);
            throw new AuthenticationException("Authentication system error", e);
        }
    }
    
    /**
     * Validate account is active and not locked.
     * 
     * BUSINESS RULE: Accounts are locked after maxFailedAttempts failed
     * login attempts. Lock duration is configured via properties.
     * 
     * @param user User to validate
     * @throws AccountLockedException if account is locked
     * @throws AccountDisabledException if account is disabled
     */
    private void validateAccountStatus(User user) {
        if (!user.isActive()) {
            throw new AccountDisabledException("Account is disabled");
        }
        
        if (user.isLocked()) {
            Duration lockRemaining = Duration.between(
                Instant.now(),
                user.getLockedUntil()
            );
            
            if (lockRemaining.isPositive()) {
                throw new AccountLockedException(
                    "Account is locked until " + user.getLockedUntil(),
                    user.getLockedUntil()
                );
            } else {
                // Lock expired, unlock account
                user.unlock();
                userRepository.save(user);
            }
        }
    }
}
```

### TypeScript/JavaScript Standards

```typescript
/**
 * User Authentication Service
 * 
 * Handles user authentication, session management, and account security.
 * 
 * Architecture:
 * - Uses dependency injection for testability
 * - Implements Result pattern for error handling
 * - All operations are async/await
 * 
 * Performance:
 * - Authentication: ~150ms average
 * - Session validation: ~20ms average
 * 
 * Dependencies:
 * - UserRepository: Data access layer
 * - SessionStore: Redis-backed session storage
 * - PasswordHasher: BCrypt password hashing
 */

import { injectable, inject } from 'inversify';
import { Result, Success, Failure } from './result';
import { Logger } from './logger';

// Type definitions for clear contracts
export interface AuthenticationRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthenticationResult {
  sessionToken: string;
  userId: string;
  expiresAt: Date;
}

// Discriminated union for errors
export type AuthenticationError =
  | { type: 'invalid_credentials'; message: string }
  | { type: 'account_locked'; unlockAt: Date; message: string }
  | { type: 'account_disabled'; message: string }
  | { type: 'system_error'; error: Error; message: string };

// Configuration interface
export interface AuthConfig {
  maxFailedAttempts: number;
  lockoutDurationMinutes: number;
  sessionDurationHours: number;
  extendedSessionDurationDays: number;
}

/**
 * Service for user authentication operations.
 * 
 * This service is stateless and thread-safe. All state is managed
 * in the database and Redis session store.
 */
@injectable()
export class UserAuthenticationService {
  // Configuration (injected or defaulted)
  private readonly config: AuthConfig = {
    maxFailedAttempts: 5,
    lockoutDurationMinutes: 60,
    sessionDurationHours: 24,
    extendedSessionDurationDays: 30,
  };
  
  constructor(
    @inject('UserRepository') private readonly userRepository: UserRepository,
    @inject('SessionStore') private readonly sessionStore: SessionStore,
    @inject('PasswordHasher') private readonly passwordHasher: PasswordHasher,
    @inject('AuditLogger') private readonly auditLogger: AuditLogger,
    @inject('Logger') private readonly logger: Logger,
  ) {}
  
  /**
   * Authenticate user and create session.
   * 
   * Steps:
   * 1. Fetch user by email
   * 2. Validate account status
   * 3. Verify password
   * 4. Create session
   * 5. Update login timestamp
   * 6. Log audit event
   * 
   * @param request - Authentication credentials
   * @returns Result with session details or error
   * 
   * @example
   * ```typescript
   * const result = await authService.authenticate({
   *   email: 'user@example.com',
   *   password: 'secret123',
   *   rememberMe: true,
   * });
   * 
   * if (result.isSuccess) {
   *   console.log('Session token:', result.value.sessionToken);
   * } else {
   *   console.error('Authentication failed:', result.error);
   * }
   * ```
   */
  async authenticate(
    request: AuthenticationRequest,
  ): Promise<Result<AuthenticationResult, AuthenticationError>> {
    this.logger.debug('Authenticating user', { email: request.email });
    
    // Step 1: Fetch user
    const userResult = await this.userRepository.findByEmail(request.email);
    
    if (!userResult) {
      // SECURITY: Don't reveal whether email exists
      return Failure({
        type: 'invalid_credentials',
        message: 'Invalid email or password',
      });
    }
    
    const user = userResult;
    
    // Step 2: Validate account status
    const statusValidation = this.validateAccountStatus(user);
    if (statusValidation.isFailure) {
      return statusValidation;
    }
    
    // Step 3: Verify password
    const passwordValid = await this.passwordHasher.verify(
      request.password,
      user.passwordHash,
    );
    
    if (!passwordValid) {
      await this.handleFailedLogin(user);
      return Failure({
        type: 'invalid_credentials',
        message: 'Invalid email or password',
      });
    }
    
    // Step 4: Create session
    const session = await this.createSession(user, request.rememberMe ?? false);
    
    // Step 5: Update user record
    await this.handleSuccessfulLogin(user);
    
    // Step 6: Audit log
    await this.auditLogger.logAuthentication({
      userId: user.id,
      sessionId: session.id,
      timestamp: new Date(),
    });
    
    this.logger.info('User authenticated successfully', { userId: user.id });
    
    return Success({
      sessionToken: session.token,
      userId: user.id,
      expiresAt: session.expiresAt,
    });
  }
  
  /**
   * Validate account is active and not locked.
   * 
   * BUSINESS RULE: Accounts lock after configured failed attempts.
   * Lock automatically expires after configured duration.
   * 
   * @param user - User to validate
   * @returns Success or error result
   */
  private validateAccountStatus(
    user: User,
  ): Result<void, AuthenticationError> {
    // Check if account is disabled
    if (!user.isActive) {
      return Failure({
        type: 'account_disabled',
        message: 'This account has been disabled',
      });
    }
    
    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return Failure({
        type: 'account_locked',
        unlockAt: user.lockedUntil,
        message: `Account is locked until ${user.lockedUntil.toISOString()}`,
      });
    }
    
    // If lock has expired, clear it
    if (user.lockedUntil && user.lockedUntil <= new Date()) {
      user.lockedUntil = null;
      user.failedLoginAttempts = 0;
      // Update will happen in handleSuccessfulLogin
    }
    
    return Success(undefined);
  }
  
  /**
   * Handle failed login attempt.
   * 
   * Increments failed attempt counter and locks account if threshold reached.
   * 
   * @param user - User who failed login
   */
  private async handleFailedLogin(user: User): Promise<void> {
    user.failedLoginAttempts += 1;
    
    if (user.failedLoginAttempts >= this.config.maxFailedAttempts) {
      user.lockedUntil = new Date(
        Date.now() + this.config.lockoutDurationMinutes * 60 * 1000,
      );
      
      this.logger.warn('Account locked due to failed attempts', {
        userId: user.id,
        attempts: user.failedLoginAttempts,
        lockedUntil: user.lockedUntil,
      });
      
      await this.auditLogger.logAccountLock({
        userId: user.id,
        reason: 'Failed login attempts',
        lockedUntil: user.lockedUntil,
      });
    }
    
    await this.userRepository.save(user);
  }
}
```

## Testing Standards for AI Assistance

AI can generate comprehensive test suites when tests follow consistent patterns.

### Test Organization Standard

```typescript
/**
 * Tests for UserAuthenticationService
 * 
 * Test Categories:
 * - Happy path scenarios
 * - Error conditions
 * - Edge cases
 * - Security scenarios
 * - Performance requirements
 */

describe('UserAuthenticationService', () => {
  // Test setup pattern
  let service: UserAuthenticationService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockSessionStore: jest.Mocked<SessionStore>;
  let mockPasswordHasher: jest.Mocked<PasswordHasher>;
  let mockAuditLogger: jest.Mocked<AuditLogger>;
  
  beforeEach(() => {
    // Setup mocks
    mockUserRepository = createMockUserRepository();
    mockSessionStore = createMockSessionStore();
    mockPasswordHasher = createMockPasswordHasher();
    mockAuditLogger = createMockAuditLogger();
    
    // Create service instance
    service = new UserAuthenticationService(
      mockUserRepository,
      mockSessionStore,
      mockPasswordHasher,
      mockAuditLogger,
      createMockLogger(),
    );
  });
  
  describe('authenticate()', () => {
    describe('Happy Path', () => {
      it('should authenticate valid credentials and return session token', async () => {
        // GIVEN: Valid user with correct password
        const user = createTestUser({ email: 'test@example.com' });
        mockUserRepository.findByEmail.mockResolvedValue(user);
        mockPasswordHasher.verify.mockResolvedValue(true);
        
        const session = createTestSession({ userId: user.id });
        mockSessionStore.create.mockResolvedValue(session);
        
        // WHEN: Authenticating with valid credentials
        const result = await service.authenticate({
          email: 'test@example.com',
          password: 'ValidPassword123!',
          rememberMe: false,
        });
        
        // THEN: Should return success with session token
        expect(result.isSuccess).toBe(true);
        expect(result.value.sessionToken).toBe(session.token);
        expect(result.value.userId).toBe(user.id);
        
        // AND: Should update last login timestamp
        expect(mockUserRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            lastLoginAt: expect.any(Date),
          }),
        );
        
        // AND: Should log audit event
        expect(mockAuditLogger.logAuthentication).toHaveBeenCalledWith(
          expect.objectContaining({
            userId: user.id,
            sessionId: session.id,
          }),
        );
      });
      
      it('should create extended session when rememberMe is true', async () => {
        // Test implementation
      });
    });
    
    describe('Error Conditions', () => {
      it('should reject non-existent email', async () => {
        // Test implementation
      });
      
      it('should reject incorrect password', async () => {
        // Test implementation
      });
      
      it('should reject locked account', async () => {
        // Test implementation
      });
    });
    
    describe('Security Scenarios', () => {
      it('should lock account after max failed attempts', async () => {
        // Test implementation
      });
      
      it('should not reveal whether email exists', async () => {
        // Test implementation
      });
    });
  });
});
```

## Documentation Standards

### Code-Level Documentation

```python
def calculate_shipping_cost(
    order: Order,
    shipping_address: Address,
    shipping_method: ShippingMethod,
) -> Money:
    """Calculate shipping cost for an order.
    
    This function implements the shipping cost calculation algorithm
    based on order weight, destination, and selected shipping method.
    
    Args:
        order: Order containing items to ship. Must have at least one item.
        shipping_address: Destination address. Used for zone calculation.
        shipping_method: Selected shipping method (standard, express, overnight)
        
    Returns:
        Calculated shipping cost in order currency
        
    Raises:
        EmptyOrderError: If order contains no items
        InvalidAddressError: If shipping address is incomplete
        UnsupportedShippingMethodError: If method not available for destination
        
    Business Rules:
        - Base cost determined by shipping zone (domestic, international)
        - Weight surcharge applied for orders > 10kg
        - Express and overnight methods have minimum charges
        - Free shipping available for orders > $100 (domestic only)
        
    Performance:
        - Expected runtime: O(n) where n = number of items
        - Typical execution: < 50ms
        
    Examples:
        >>> order = Order(items=[...], total=Money(150, 'USD'))
        >>> address = Address(country='US', zip='12345')
        >>> cost = calculate_shipping_cost(order, address, ShippingMethod.STANDARD)
        >>> print(cost)
        Money(0, 'USD')  # Free shipping for $150 order
        
    Related:
        - get_shipping_zone(): Determines shipping zone from address
        - apply_shipping_promotions(): Applies promotional discounts
        
    Version History:
        - 2.0.0: Added international shipping support
        - 1.5.0: Implemented free shipping threshold
        - 1.0.0: Initial implementation
    """
    # Implementation
```

### Module-Level Documentation

Create README.md files for each major module:

```markdown
# User Authentication Module

## Purpose

Handles all user authentication operations including credential validation,
session management, and account security features.

## Architecture

This module follows a layered architecture:

```
API Layer (Controllers)
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (Data Access)
    ↓
Database Layer (PostgreSQL)
```

## Components

### AuthenticationService
Primary service for authentication operations.
- authenticate(): Validate credentials and create session
- validateSession(): Check if session is valid
- logout(): Terminate session

### SessionStore
Manages session storage using Redis.
- create(): Create new session
- get(): Retrieve session by token
- delete(): Remove session

### PasswordHasher
Handles password hashing and verification.
- hash(): Hash plaintext password
- verify(): Verify password against hash

## Business Rules

1. Account Lockout: Accounts lock after 5 failed login attempts
2. Session Duration: 24 hours (standard), 30 days (remember me)
3. Password Requirements: 8+ characters, uppercase, lowercase, number, symbol
4. Concurrent Sessions: Maximum 3 sessions per user

## Security Considerations

- Passwords never logged or stored in plaintext
- Failed login attempts logged for security monitoring
- Account lockout prevents brute force attacks
- Sessions stored in Redis with automatic expiration

## Usage Examples

### Basic Authentication
```typescript
const result = await authService.authenticate({
  email: 'user@example.com',
  password: 'SecurePassword123!',
});

if (result.isSuccess) {
  // Store session token
  const token = result.value.sessionToken;
}
```

## Configuration

Environment variables:
- AUTH_MAX_FAILED_ATTEMPTS: Maximum failed login attempts (default: 5)
- AUTH_LOCKOUT_DURATION: Account lockout duration in minutes (default: 60)
- AUTH_SESSION_DURATION: Session duration in hours (default: 24)

## Testing

Run tests:
```bash
npm test src/modules/auth
```

Coverage requirements: 90% minimum

## Dependencies

- bcrypt: Password hashing
- jsonwebtoken: Token generation
- redis: Session storage
- pg: PostgreSQL database access

## Performance Metrics

- authenticate(): 100-200ms average
- validateSession(): 10-20ms average
- logout(): 5-10ms average

## Monitoring

Key metrics to monitor:
- Failed login rate
- Average authentication time
- Active session count
- Account lockout rate

## Troubleshooting

Common issues:
1. "Account locked" errors: Check failed_login_attempts in database
2. "Invalid session" errors: Session may have expired in Redis
3. Slow authentication: Check database and Redis connectivity

## Version History

- 2.0.0: Added OAuth2 support
- 1.5.0: Implemented account lockout
- 1.0.0: Initial release
```

## AI Context Files

Create .claude.md or similar files to provide AI-specific context:

```markdown
# Authentication Module - AI Context

## Module Purpose
This module handles user authentication. When working on this module,
always consider security implications and follow OWASP guidelines.

## Common Tasks

### Adding a new authentication method
1. Create interface in api/auth-method.interface.ts
2. Implement in domain/auth-providers/
3. Register in auth.service.ts
4. Add tests in tests/auth-methods/
5. Update module README.md

### Modifying password requirements
1. Update PASSWORD_REQUIREMENTS constant
2. Update password.validator.ts
3. Update user-facing error messages
4. Update documentation
5. Notify frontend team of changes

## Architecture Decisions

### Why Redis for sessions?
We use Redis instead of JWT for session storage because:
- Allows instant session revocation
- Supports concurrent session limits
- Provides automatic expiration
- Better suited for our high-security requirements

### Why separate UserRepository and AuthRepository?
Auth operations have different performance characteristics and
security requirements than general user operations.

## Patterns to Follow

### Error Handling
Always use the Result pattern for authentication operations.
Never throw exceptions for expected failures (wrong password, etc).

```typescript
// Good
return Failure({
  type: 'invalid_credentials',
  message: 'Invalid email or password',
});

// Bad
throw new InvalidCredentialsError('Invalid email or password');
```

### Logging
- Log authentication events at INFO level
- Log failures at WARN level
- Never log passwords or tokens
- Include user ID but not PII in logs

## Testing Guidelines

### Security Tests Required
Every authentication method must have tests for:
- Brute force protection
- Session fixation prevention
- Timing attack resistance
- Input validation

### Test Data
Use test fixtures from tests/fixtures/users.ts
Never use production data in tests

## Common Pitfalls

1. Don't bypass account lockout in any code path
2. Don't log sensitive data (passwords, tokens, PII)
3. Don't use timing-unsafe password comparison
4. Don't store sessions in database (use Redis)
5. Don't expose different error messages for invalid email vs password

## Related Modules

- user-management: Manages user data
- rbac: Role-based access control
- audit: Security audit logging
```

## Standards Enforcement

### Automated Enforcement

**Pre-commit Hooks**:
```bash
#!/bin/bash
# .git/hooks/pre-commit

# Format code
npm run format

# Lint code
npm run lint

# Type check
npm run type-check

# Run fast tests
npm run test:fast

# Check for AI-unfriendly patterns
npm run check-standards
```

**Custom Linting Rules**:
```javascript
// .eslintrc.js
module.exports = {
  rules: {
    // Require JSDoc for exported functions
    'jsdoc/require-jsdoc': ['error', {
      require: {
        FunctionDeclaration: true,
        MethodDefinition: true,
        ClassDeclaration: true,
      },
    }],
    
    // Require explicit return types
    '@typescript-eslint/explicit-function-return-type': 'error',
    
    // Require parameter types
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    
    // Disallow any type
    '@typescript-eslint/no-explicit-any': 'error',
    
    // Custom rules for AI-friendly code
    'custom/require-business-rule-comments': 'warn',
    'custom/require-module-readme': 'error',
  },
};
```

### Code Review Checklist

**AI-Friendly Standards Review**:
- [ ] All public APIs have complete documentation
- [ ] Business rules are explicitly commented
- [ ] Error types are well-defined and specific
- [ ] Type safety is enforced (no any, unknown properly handled)
- [ ] Module structure follows standard organization
- [ ] Tests follow Given-When-Then pattern
- [ ] Performance expectations are documented
- [ ] Security considerations are noted
- [ ] Related components are linked in documentation

## Migration Strategy

### Introducing Standards to Existing Codebases

**Phase 1: Assessment (Week 1-2)**
- Audit current code quality and consistency
- Identify most problematic areas
- Create migration plan with priorities

**Phase 2: Documentation (Week 3-4)**
- Document current patterns and anti-patterns
- Create standards guide
- Build example implementations
- Set up automated tooling

**Phase 3: Pilot (Week 5-8)**
- Apply standards to one module completely
- Gather team feedback
- Refine standards based on learnings
- Create migration templates

**Phase 4: Gradual Migration (Month 3-6)**
- Apply standards to new code immediately
- Gradually refactor existing code
- Focus on high-traffic modules first
- Update standards based on experience

**Phase 5: Enforcement (Month 6+)**
- Enable strict linting rules
- Require standards compliance for all PRs
- Conduct regular audits
- Continuously improve standards

## Measuring Standards Adoption

Track these metrics to measure AI-friendly standards adoption:

1. **AI Code Quality Score**: Percentage of AI-generated code requiring modification
2. **Documentation Coverage**: Percentage of public APIs with complete documentation
3. **Type Safety**: Percentage of code with explicit typing
4. **Test Consistency**: Percentage of tests following standard patterns
5. **Review Efficiency**: Average time spent on code reviews
6. **Onboarding Speed**: Time for new developers to become productive

## Conclusion

AI-friendly coding standards represent an investment that pays dividends through improved code quality, faster development, better collaboration, and more effective AI assistance. By making implicit knowledge explicit, maintaining consistency, and emphasizing clarity, teams create codebases that are easier for both humans and AI to understand and modify.

The key is finding the right balance: standards should enable rather than constrain, guide rather than dictate, and evolve based on team experience and AI capabilities.
