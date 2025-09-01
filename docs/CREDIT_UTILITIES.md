# Credit System Utilities & Advanced Configuration

This document covers advanced utilities, configurations, and customization options for the credit system.

## Table of Contents

1. [Credit Utilities](#credit-utilities)
2. [Advanced Configuration](#advanced-configuration)
3. [Custom Credit Rules](#custom-credit-rules)
4. [Analytics & Reporting](#analytics--reporting)
5. [Testing Utilities](#testing-utilities)
6. [Deployment Considerations](#deployment-considerations)
7. [Scaling Strategies](#scaling-strategies)

## Credit Utilities

### Credit Validation Utilities

```typescript
// lib/credit-utils.ts
export class CreditValidator {
  /**
   * Validate credit amount for operations
   */
  static validateAmount(amount: number): boolean {
    return Number.isInteger(amount) && amount > 0 && amount <= 1000000
  }

  /**
   * Validate user eligibility for credit operations
   */
  static async validateUserEligibility(userId: string): Promise<boolean> {
    // Check if user account is active
    const { data: user } = await supabase.auth.admin.getUserById(userId)
    return user?.user?.email_confirmed_at !== null
  }

  /**
   * Check for suspicious credit activity
   */
  static async detectSuspiciousActivity(
    userId: string,
    amount: number,
    timeWindow: number = 3600000 // 1 hour
  ): Promise<boolean> {
    const since = new Date(Date.now() - timeWindow)
    
    const { data: transactions } = await supabase
      .from('credit_transactions')
      .select('amount')
      .eq('user_id', userId)
      .gte('created_at', since.toISOString())
    
    const totalSpent = transactions
      ?.filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0
    
    // Flag if user spent more than 1000 credits in an hour
    return totalSpent > 1000
  }
}

/**
 * Credit formatting utilities
 */
export class CreditFormatter {
  /**
   * Format credit amount for display
   */
  static formatAmount(amount: number): string {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`
    }
    return amount.toLocaleString()
  }

  /**
   * Format credit cost with currency
   */
  static formatCost(credits: number, pricePerCredit: number = 0.01): string {
    const cost = credits * pricePerCredit
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cost)
  }

  /**
   * Calculate savings for bulk purchases
   */
  static calculateSavings(credits: number, bulkDiscounts: Record<number, number>): {
    originalPrice: number
    discountedPrice: number
    savings: number
    discountPercent: number
  } {
    const basePrice = credits * 0.01
    let discountPercent = 0
    
    // Find applicable bulk discount
    for (const [threshold, discount] of Object.entries(bulkDiscounts)) {
      if (credits >= parseInt(threshold)) {
        discountPercent = Math.max(discountPercent, discount)
      }
    }
    
    const discountedPrice = basePrice * (1 - discountPercent / 100)
    const savings = basePrice - discountedPrice
    
    return {
      originalPrice: basePrice,
      discountedPrice,
      savings,
      discountPercent
    }
  }
}

/**
 * Credit calculation utilities
 */
export class CreditCalculator {
  /**
   * Calculate dynamic pricing based on usage patterns
   */
  static async calculateDynamicCost(
    userId: string,
    toolType: string,
    baseCredits: number
  ): Promise<number> {
    // Get user's usage history
    const { data: usage } = await supabase
      .from('credit_transactions')
      .select('amount, created_at')
      .eq('user_id', userId)
      .eq('type', 'deduction')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    
    const totalUsage = usage?.reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0
    
    // Apply volume discount for heavy users
    if (totalUsage > 1000) {
      return Math.ceil(baseCredits * 0.8) // 20% discount
    }
    if (totalUsage > 500) {
      return Math.ceil(baseCredits * 0.9) // 10% discount
    }
    
    return baseCredits
  }

  /**
   * Calculate estimated monthly cost
   */
  static estimateMonthlyCost(
    dailyUsage: number,
    creditsPerUse: number,
    pricePerCredit: number = 0.01
  ): number {
    const monthlyCredits = dailyUsage * creditsPerUse * 30
    return monthlyCredits * pricePerCredit
  }

  /**
   * Calculate break-even point for subscription vs pay-per-use
   */
  static calculateBreakEven(
    subscriptionPrice: number,
    creditsIncluded: number,
    pricePerCredit: number
  ): number {
    return Math.ceil(subscriptionPrice / pricePerCredit)
  }
}
```

### Credit Backup & Recovery

```typescript
// lib/credit-backup.ts
export class CreditBackup {
  /**
   * Create backup of user's credit data
   */
  static async backupUserCredits(userId: string): Promise<{
    balance: number
    transactions: any[]
    timestamp: string
  }> {
    const [balance, transactions] = await Promise.all([
      creditService.getUserCredits(userId),
      supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    ])
    
    return {
      balance,
      transactions: transactions.data || [],
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Restore credits from backup (admin only)
   */
  static async restoreCredits(
    userId: string,
    backup: any,
    adminId: string
  ): Promise<void> {
    // Verify admin permissions
    const isAdmin = await verifyAdminRole(adminId)
    if (!isAdmin) throw new Error('Unauthorized')
    
    // Restore balance
    await creditService.addCredits(
      userId,
      backup.balance - await creditService.getUserCredits(userId)
    )
    
    // Log restoration
    await supabase.from('credit_transactions').insert({
      user_id: userId,
      amount: backup.balance,
      type: 'restoration',
      description: `Credits restored from backup: ${backup.timestamp}`,
      reference_id: adminId
    })
  }
}
```

## Advanced Configuration

### Environment Variables

```bash
# .env.local

# Credit System Configuration
CREDIT_INITIAL_AMOUNT=100
CREDIT_MAX_BALANCE=1000000
CREDIT_MIN_PURCHASE=10
CREDIT_MAX_PURCHASE=10000

# Pricing Configuration
CREDIT_BASE_PRICE=0.01
CREDIT_BULK_DISCOUNT_500=10
CREDIT_BULK_DISCOUNT_1000=15
CREDIT_BULK_DISCOUNT_5000=25

# Rate Limiting
CREDIT_RATE_LIMIT_WINDOW=3600000
CREDIT_RATE_LIMIT_MAX_DEDUCTIONS=100

# Security
CREDIT_ENABLE_FRAUD_DETECTION=true
CREDIT_SUSPICIOUS_THRESHOLD=1000
CREDIT_AUTO_FREEZE_SUSPICIOUS=false

# Analytics
CREDIT_ENABLE_ANALYTICS=true
CREDIT_ANALYTICS_RETENTION_DAYS=90
```

### Configuration Service

```typescript
// lib/credit-config.ts
export class CreditConfig {
  static get initialAmount(): number {
    return parseInt(process.env.CREDIT_INITIAL_AMOUNT || '100')
  }

  static get maxBalance(): number {
    return parseInt(process.env.CREDIT_MAX_BALANCE || '1000000')
  }

  static get basePrice(): number {
    return parseFloat(process.env.CREDIT_BASE_PRICE || '0.01')
  }

  static get bulkDiscounts(): Record<number, number> {
    return {
      500: parseInt(process.env.CREDIT_BULK_DISCOUNT_500 || '10'),
      1000: parseInt(process.env.CREDIT_BULK_DISCOUNT_1000 || '15'),
      5000: parseInt(process.env.CREDIT_BULK_DISCOUNT_5000 || '25')
    }
  }

  static get rateLimits(): {
    window: number
    maxDeductions: number
  } {
    return {
      window: parseInt(process.env.CREDIT_RATE_LIMIT_WINDOW || '3600000'),
      maxDeductions: parseInt(process.env.CREDIT_RATE_LIMIT_MAX_DEDUCTIONS || '100')
    }
  }

  static get fraudDetection(): {
    enabled: boolean
    threshold: number
    autoFreeze: boolean
  } {
    return {
      enabled: process.env.CREDIT_ENABLE_FRAUD_DETECTION === 'true',
      threshold: parseInt(process.env.CREDIT_SUSPICIOUS_THRESHOLD || '1000'),
      autoFreeze: process.env.CREDIT_AUTO_FREEZE_SUSPICIOUS === 'true'
    }
  }
}
```

## Custom Credit Rules

### Rule Engine

```typescript
// lib/credit-rules.ts
export interface CreditRule {
  id: string
  name: string
  condition: (context: CreditRuleContext) => boolean
  action: (context: CreditRuleContext) => Promise<CreditRuleResult>
  priority: number
}

export interface CreditRuleContext {
  userId: string
  amount: number
  operation: 'add' | 'deduct'
  toolType?: string
  userTier?: string
  currentBalance: number
  metadata?: Record<string, any>
}

export interface CreditRuleResult {
  allowed: boolean
  modifiedAmount?: number
  reason?: string
  metadata?: Record<string, any>
}

export class CreditRuleEngine {
  private rules: CreditRule[] = []

  addRule(rule: CreditRule): void {
    this.rules.push(rule)
    this.rules.sort((a, b) => b.priority - a.priority)
  }

  async evaluateRules(context: CreditRuleContext): Promise<CreditRuleResult> {
    for (const rule of this.rules) {
      if (rule.condition(context)) {
        const result = await rule.action(context)
        if (!result.allowed) {
          return result
        }
        if (result.modifiedAmount !== undefined) {
          context.amount = result.modifiedAmount
        }
      }
    }

    return { allowed: true, modifiedAmount: context.amount }
  }
}

// Example rules
export const defaultCreditRules: CreditRule[] = [
  {
    id: 'max-balance-limit',
    name: 'Maximum Balance Limit',
    priority: 100,
    condition: (ctx) => ctx.operation === 'add',
    action: async (ctx) => {
      const maxBalance = CreditConfig.maxBalance
      if (ctx.currentBalance + ctx.amount > maxBalance) {
        return {
          allowed: false,
          reason: `Adding ${ctx.amount} credits would exceed maximum balance of ${maxBalance}`
        }
      }
      return { allowed: true }
    }
  },
  {
    id: 'premium-user-bonus',
    name: 'Premium User Bonus',
    priority: 90,
    condition: (ctx) => ctx.operation === 'add' && ctx.userTier === 'premium',
    action: async (ctx) => {
      const bonusAmount = Math.ceil(ctx.amount * 0.1) // 10% bonus
      return {
        allowed: true,
        modifiedAmount: ctx.amount + bonusAmount,
        metadata: { bonus: bonusAmount }
      }
    }
  },
  {
    id: 'first-time-user-discount',
    name: 'First Time User Discount',
    priority: 80,
    condition: (ctx) => ctx.operation === 'deduct' && ctx.metadata?.isFirstUse,
    action: async (ctx) => {
      const discountedAmount = Math.ceil(ctx.amount * 0.5) // 50% discount
      return {
        allowed: true,
        modifiedAmount: discountedAmount,
        metadata: { discount: ctx.amount - discountedAmount }
      }
    }
  }
]
```

## Analytics & Reporting

### Credit Analytics Service

```typescript
// lib/credit-analytics.ts
export class CreditAnalytics {
  /**
   * Get user credit usage statistics
   */
  static async getUserStats(userId: string, days: number = 30): Promise<{
    totalSpent: number
    totalAdded: number
    averageDaily: number
    mostUsedTool: string
    usageByDay: Array<{ date: string; amount: number }>
  }> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    
    const { data: transactions } = await supabase
      .from('credit_transactions')
      .select('amount, type, description, created_at')
      .eq('user_id', userId)
      .gte('created_at', since.toISOString())
    
    if (!transactions) return this.getEmptyStats()
    
    const spent = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    
    const added = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0)
    
    // Group by day
    const usageByDay = this.groupTransactionsByDay(transactions, days)
    
    // Find most used tool
    const toolUsage = transactions
      .filter(t => t.amount < 0 && t.description)
      .reduce((acc, t) => {
        const tool = this.extractToolFromDescription(t.description)
        acc[tool] = (acc[tool] || 0) + Math.abs(t.amount)
        return acc
      }, {} as Record<string, number>)
    
    const mostUsedTool = Object.entries(toolUsage)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none'
    
    return {
      totalSpent: spent,
      totalAdded: added,
      averageDaily: spent / days,
      mostUsedTool,
      usageByDay
    }
  }

  /**
   * Get platform-wide credit statistics
   */
  static async getPlatformStats(days: number = 30): Promise<{
    totalUsers: number
    activeUsers: number
    totalCreditsIssued: number
    totalCreditsSpent: number
    averageBalance: number
    topSpenders: Array<{ userId: string; amount: number }>
  }> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    
    const [users, transactions, balances] = await Promise.all([
      supabase.from('auth.users').select('id', { count: 'exact' }),
      supabase
        .from('credit_transactions')
        .select('user_id, amount, type')
        .gte('created_at', since.toISOString()),
      supabase.from('credits').select('user_id, balance')
    ])
    
    const activeUsers = new Set(
      transactions.data?.map(t => t.user_id) || []
    ).size
    
    const totalIssued = transactions.data
      ?.filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0) || 0
    
    const totalSpent = transactions.data
      ?.filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0
    
    const averageBalance = balances.data
      ?.reduce((sum, b) => sum + b.balance, 0) / (balances.data?.length || 1) || 0
    
    // Top spenders
    const spenderMap = transactions.data
      ?.filter(t => t.amount < 0)
      .reduce((acc, t) => {
        acc[t.user_id] = (acc[t.user_id] || 0) + Math.abs(t.amount)
        return acc
      }, {} as Record<string, number>) || {}
    
    const topSpenders = Object.entries(spenderMap)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([userId, amount]) => ({ userId, amount }))
    
    return {
      totalUsers: users.count || 0,
      activeUsers,
      totalCreditsIssued: totalIssued,
      totalCreditsSpent: totalSpent,
      averageBalance,
      topSpenders
    }
  }

  private static getEmptyStats() {
    return {
      totalSpent: 0,
      totalAdded: 0,
      averageDaily: 0,
      mostUsedTool: 'none',
      usageByDay: []
    }
  }

  private static groupTransactionsByDay(transactions: any[], days: number) {
    const dayMap = new Map()
    
    for (let i = 0; i < days; i++) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        .toISOString().split('T')[0]
      dayMap.set(date, 0)
    }
    
    transactions.forEach(t => {
      const date = new Date(t.created_at).toISOString().split('T')[0]
      if (dayMap.has(date) && t.amount < 0) {
        dayMap.set(date, dayMap.get(date) + Math.abs(t.amount))
      }
    })
    
    return Array.from(dayMap.entries())
      .map(([date, amount]) => ({ date, amount }))
      .reverse()
  }

  private static extractToolFromDescription(description: string): string {
    // Extract tool name from transaction description
    const match = description.match(/tool: ([\w-]+)/i)
    return match ? match[1] : 'unknown'
  }
}
```

## Testing Utilities

### Credit Test Helpers

```typescript
// lib/credit-test-utils.ts
export class CreditTestUtils {
  /**
   * Create test user with credits
   */
  static async createTestUser(credits: number = 100): Promise<{
    userId: string
    email: string
    cleanup: () => Promise<void>
  }> {
    const email = `test-${Date.now()}@example.com`
    const password = 'test-password-123'
    
    // Create user
    const { data: authData } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })
    
    if (!authData.user) throw new Error('Failed to create test user')
    
    // Initialize credits
    await creditService.initializeUserCredits(authData.user.id, credits)
    
    return {
      userId: authData.user.id,
      email,
      cleanup: async () => {
        await supabase.auth.admin.deleteUser(authData.user.id)
      }
    }
  }

  /**
   * Mock credit operations for testing
   */
  static mockCreditService(): {
    getUserCredits: jest.Mock
    addCredits: jest.Mock
    deductCredits: jest.Mock
    hasCredits: jest.Mock
    restore: () => void
  } {
    const original = { ...creditService }
    
    const mocks = {
      getUserCredits: jest.fn(),
      addCredits: jest.fn(),
      deductCredits: jest.fn(),
      hasCredits: jest.fn()
    }
    
    Object.assign(creditService, mocks)
    
    return {
      ...mocks,
      restore: () => Object.assign(creditService, original)
    }
  }

  /**
   * Simulate credit transactions
   */
  static async simulateUsage(
    userId: string,
    operations: Array<{ type: 'add' | 'deduct'; amount: number }>
  ): Promise<number[]> {
    const balances: number[] = []
    
    for (const op of operations) {
      if (op.type === 'add') {
        await creditService.addCredits(userId, op.amount)
      } else {
        await creditService.deductCredits(userId, op.amount)
      }
      
      const balance = await creditService.getUserCredits(userId)
      balances.push(balance)
    }
    
    return balances
  }

  /**
   * Verify credit transaction history
   */
  static async verifyTransactionHistory(
    userId: string,
    expectedTransactions: Array<{
      amount: number
      type: string
    }>
  ): Promise<boolean> {
    const { data: transactions } = await supabase
      .from('credit_transactions')
      .select('amount, type')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
    
    if (!transactions || transactions.length !== expectedTransactions.length) {
      return false
    }
    
    return transactions.every((t, i) => {
      const expected = expectedTransactions[i]
      return t.amount === expected.amount && t.type === expected.type
    })
  }
}

// Jest test examples
describe('Credit System', () => {
  let testUser: Awaited<ReturnType<typeof CreditTestUtils.createTestUser>>
  
  beforeEach(async () => {
    testUser = await CreditTestUtils.createTestUser(100)
  })
  
  afterEach(async () => {
    await testUser.cleanup()
  })
  
  test('should deduct credits correctly', async () => {
    const newBalance = await creditService.deductCredits(testUser.userId, 50)
    expect(newBalance).toBe(50)
    
    const verified = await CreditTestUtils.verifyTransactionHistory(
      testUser.userId,
      [
        { amount: 100, type: 'initialization' },
        { amount: -50, type: 'deduction' }
      ]
    )
    expect(verified).toBe(true)
  })
  
  test('should handle insufficient credits', async () => {
    await expect(
      creditService.deductCredits(testUser.userId, 150)
    ).rejects.toThrow('Insufficient credits')
  })
})
```

## Deployment Considerations

### Production Checklist

```markdown
## Pre-deployment Checklist

### Database
- [ ] Credits table created with proper indexes
- [ ] Credit transactions table created (if using)
- [ ] Row Level Security (RLS) policies configured
- [ ] Database backup strategy in place

### Environment Variables
- [ ] All credit configuration variables set
- [ ] Supabase credentials configured
- [ ] DodoPayments API keys set
- [ ] Rate limiting configuration set

### Security
- [ ] API routes protected with authentication
- [ ] Credit operations use server-side validation
- [ ] Fraud detection rules configured
- [ ] Rate limiting implemented

### Monitoring
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Performance monitoring set up
- [ ] Credit operation logging enabled
- [ ] Webhook monitoring configured

### Testing
- [ ] Unit tests for credit operations
- [ ] Integration tests for payment flow
- [ ] Load testing for high-traffic scenarios
- [ ] Webhook testing with payment provider
```

### Performance Optimization

```typescript
// lib/credit-performance.ts
export class CreditPerformanceOptimizer {
  /**
   * Batch credit operations for better performance
   */
  static async batchCreditOperations(
    operations: Array<{
      userId: string
      amount: number
      type: 'add' | 'deduct'
    }>
  ): Promise<void> {
    const { data, error } = await supabase.rpc('batch_credit_operations', {
      operations: operations
    })
    
    if (error) throw error
  }

  /**
   * Optimize credit balance queries with caching
   */
  static async getCachedBalance(userId: string): Promise<number> {
    const cacheKey = `credit_balance:${userId}`
    
    // Try cache first (Redis, memory, etc.)
    const cached = await this.getFromCache(cacheKey)
    if (cached !== null) return cached
    
    // Fallback to database
    const balance = await creditService.getUserCredits(userId)
    
    // Cache for 5 minutes
    await this.setCache(cacheKey, balance, 300)
    
    return balance
  }

  private static async getFromCache(key: string): Promise<number | null> {
    // Implement your caching strategy
    return null
  }

  private static async setCache(
    key: string,
    value: number,
    ttl: number
  ): Promise<void> {
    // Implement your caching strategy
  }
}
```

## Scaling Strategies

### Horizontal Scaling

```typescript
// For high-traffic applications
export class CreditScalingStrategy {
  /**
   * Implement read replicas for credit balance queries
   */
  static async getBalanceFromReadReplica(userId: string): Promise<number> {
    // Use read replica for balance queries
    const { data } = await supabaseReadReplica
      .from('credits')
      .select('balance')
      .eq('user_id', userId)
      .single()
    
    return data?.balance || 0
  }

  /**
   * Implement credit operation queuing for high load
   */
  static async queueCreditOperation(
    userId: string,
    amount: number,
    type: 'add' | 'deduct'
  ): Promise<void> {
    // Add to queue (Redis, SQS, etc.)
    await this.addToQueue('credit_operations', {
      userId,
      amount,
      type,
      timestamp: Date.now()
    })
  }

  private static async addToQueue(queueName: string, data: any): Promise<void> {
    // Implement your queuing strategy
  }
}
```

### Database Optimization

```sql
-- Optimize credit queries with proper indexing
CREATE INDEX CONCURRENTLY idx_credits_balance ON credits(balance) WHERE balance > 0;
CREATE INDEX CONCURRENTLY idx_credit_transactions_user_created ON credit_transactions(user_id, created_at DESC);

-- Partition large transaction tables
CREATE TABLE credit_transactions_2024 PARTITION OF credit_transactions
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- Create materialized view for analytics
CREATE MATERIALIZED VIEW credit_usage_summary AS
SELECT 
  user_id,
  DATE_TRUNC('day', created_at) as date,
  SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as credits_added,
  SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as credits_spent
FROM credit_transactions
GROUP BY user_id, DATE_TRUNC('day', created_at);

-- Refresh materialized view daily
CREATE OR REPLACE FUNCTION refresh_credit_usage_summary()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY credit_usage_summary;
END;
$$ LANGUAGE plpgsql;
```

This comprehensive utility documentation provides advanced tools and strategies for managing, optimizing, and scaling the credit system in production environments.