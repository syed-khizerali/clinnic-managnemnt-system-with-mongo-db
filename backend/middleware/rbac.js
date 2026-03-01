export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(' or ')}`,
      });
    }
    next();
  };
};

export const adminOnly = authorize('admin');
export const doctorOnly = authorize('doctor');
export const receptionistOnly = authorize('receptionist');
export const patientOnly = authorize('patient');
export const adminOrDoctor = authorize('admin', 'doctor');
export const adminOrReceptionist = authorize('admin', 'receptionist');
export const staffOnly = authorize('admin', 'doctor', 'receptionist');
