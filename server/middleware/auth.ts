import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthenticatedRequest extends Request {
  developer?: {
    id: string;
    username: string;
    email: string;
    isAdmin?: boolean;
  };
  user?: {
    id: string;
    username: string;
    isAdmin?: boolean;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, developer: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    req.developer = developer;
    next();
  });
};

export const generateToken = (user: { id: string; username: string; email?: string; isAdmin?: boolean }) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
};

// Admin-only middleware
export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    // Check if user is admin
    if (!decoded.isAdmin) {
      return res.status(403).json({ 
        message: 'Admin access required. This action is restricted to administrators only.',
        errorCode: 'ADMIN_REQUIRED'
      });
    }
    
    req.user = decoded;
    req.developer = decoded; // For backward compatibility
    next();
  });
};

// Enhanced authentication that sets both user and developer info
export const authenticateWithRole = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    req.user = decoded;
    req.developer = decoded;
    next();
  });
};
