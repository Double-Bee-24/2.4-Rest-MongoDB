import { Request, Response, NextFunction } from "express";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { action } = req.query;

  // Check if user authorized adn skip this if we deal with login or register methods
  if (req.session.user || action === "login" || action === "register") {
    next();
  } else {
    console.error("Unauthorized access attempt. User is not authenticated.");
    res.status(401).json({ error: "Unauthorized" });
  }
}
