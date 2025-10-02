import jwt, { Secret, SignOptions, JwtPayload } from "jsonwebtoken";

const SECRET: Secret = process.env.JWT_SECRET || "supersecret";

export function signToken(
  payload: object,
  expiresIn: string | number = "7d"
): string {
  const options: SignOptions = { expiresIn: expiresIn as SignOptions["expiresIn"] };
  return jwt.sign(payload, SECRET, options);
}

export function verifyToken(token: string): JwtPayload | string {
  return jwt.verify(token, SECRET);
}
