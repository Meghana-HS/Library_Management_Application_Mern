// Backend/middleware/adminMiddleware.js
export default function adminMiddleware(req, res, next) {
  // authMiddleware must already have set req.user from the JWT
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Admins only" });
  }

  next();
}
