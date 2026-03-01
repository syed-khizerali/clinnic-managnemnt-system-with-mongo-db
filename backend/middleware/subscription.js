/**
 * Subscription-based feature access
 * Pro plan required for AI features
 */

export const requireProPlan = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated.' });
  }

  if (req.user.role === 'admin') {
    return next(); // Admins bypass subscription check
  }

  const hasAiAccess = ['pro', 'enterprise'].includes(req.user.subscriptionPlan);
  if (!hasAiAccess) {
    return res.status(403).json({
      message: 'Pro subscription required for this feature.',
      upgradeRequired: true,
    });
  }

  next();
};
