import jwt from 'jsonwebtoken';

export function authenticate(req, res, next) {
  const token = req.cookies.token; 
  console.log(req.cookies)
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid or expired token' });
  }
}