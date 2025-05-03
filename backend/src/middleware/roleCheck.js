/**
 * Role-based access control middleware
 * Verifies user has required role and profile
 * @param {string[]} allowedRoles - Array of roles allowed to access the route
 */
const roleCheck = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      console.log('Role Check - Request URL:', req.originalUrl);
      console.log('Role Check - Allowed Roles:', allowedRoles);
      console.log('Role Check - User:', {
        id: req.user?.id,
        role: req.user?.role,
        hasProfile: !!req[`${req.user?.role}Profile`]
      });

      // Check if user exists and has a role
      if (!req.user || !req.user.role) {
        throw new Error('User role not found');
      }

      // Check if user's role is allowed
      if (!allowedRoles.includes(req.user.role)) {
        throw new Error('Access denied: insufficient role permissions');
      }

      // Check if user has required profile
      const profileKey = `${req.user.role}Profile`;
      if (!req[profileKey]) {
        throw new Error(`${req.user.role} profile not found`);
      }

      // Log success
      console.log('Role Check - Success:', {
        role: req.user.role,
        hasProfile: true,
        profileId: req[profileKey]._id
      });

      next();
    } catch (error) {
      console.error('Role Check - Error:', error.message);
      res.status(403).json({
        status: 'error',
        message: 'Access denied',
        error: error.message
      });
    }
  };
};

module.exports = roleCheck;
