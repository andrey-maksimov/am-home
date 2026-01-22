import crypto from 'crypto';

// In-memory rate limiting (for production, use Redis or similar)
const rateLimitStore = new Map<string, number>();

export function shouldRateLimit(ip: string, userAgent: string, windowMinutes: number = 10): boolean {
  // Create a hash of IP + User Agent
  const hash = crypto
    .createHash('sha256')
    .update(`${ip}:${userAgent}`)
    .digest('hex');

  const now = Date.now();
  const lastTime = rateLimitStore.get(hash);

  if (!lastTime) {
    rateLimitStore.set(hash, now);
    return false; // Not rate limited
  }

  const elapsed = now - lastTime;
  const windowMs = windowMinutes * 60 * 1000;

  if (elapsed < windowMs) {
    return true; // Rate limited
  }

  rateLimitStore.set(hash, now);
  
  // Clean up old entries (older than 1 hour)
  const oneHourAgo = now - (60 * 60 * 1000);
  for (const [key, time] of rateLimitStore.entries()) {
    if (time < oneHourAgo) {
      rateLimitStore.delete(key);
    }
  }

  return false; // Not rate limited
}

export function getClientInfo(request: Request): { ip: string; userAgent: string } {
  const ip = 
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';
  
  const userAgent = request.headers.get('user-agent') || 'unknown';

  return { ip, userAgent };
}

// Rate limit with configurable limits
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export async function rateLimit(
  identifier: string,
  maxRequests: number,
  windowSeconds: number
): Promise<{ success: boolean; remaining: number }> {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  
  const record = requestCounts.get(identifier);
  
  if (!record || now > record.resetTime) {
    // New window
    requestCounts.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { success: true, remaining: maxRequests - 1 };
  }
  
  if (record.count >= maxRequests) {
    return { success: false, remaining: 0 };
  }
  
  record.count++;
  return { success: true, remaining: maxRequests - record.count };
}
