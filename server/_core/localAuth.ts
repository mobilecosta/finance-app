import type { Express, Request, Response } from "express";
import { COOKIE_NAME, ONE_YEAR_MS } from "../../shared/const.js";
import { createLocalUser, getUserByUsername } from "../db";
import { getSessionCookieOptions } from "./cookies";
import { hashPassword, verifyPassword } from "./password";
import { sdk } from "./sdk";

function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

function toIsoString(value: string | Date | null | undefined) {
  if (!value) {
    return new Date().toISOString();
  }

  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function getBodyString(body: unknown, key: "username" | "password" | "name") {
  if (!body || typeof body !== "object") return undefined;
  const value = (body as Record<string, unknown>)[key];
  return typeof value === "string" ? value.trim() : undefined;
}

function buildUserResponse(user: NonNullable<Awaited<ReturnType<typeof getUserByUsername>>>) {
  return {
    id: user.id,
    openId: user.openId,
    name: user.name,
    email: user.email,
    loginMethod: user.loginMethod,
    lastSignedIn: toIsoString(user.lastSignedIn),
  };
}

async function issueSession(req: Request, res: Response, user: NonNullable<Awaited<ReturnType<typeof getUserByUsername>>>) {
  const sessionToken = await sdk.createSessionToken(user.openId, {
    name: user.name || user.username || "",
    expiresInMs: ONE_YEAR_MS,
  });

  const cookieOptions = getSessionCookieOptions(req);
  res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

  return {
    sessionToken,
    user: buildUserResponse(user),
  };
}

export function registerLocalAuthRoutes(app: Express) {
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const username = getBodyString(req.body, "username");
    const password = getBodyString(req.body, "password");

    if (!username || !password) {
      res.status(400).json({ error: "username and password are required" });
      return;
    }

    const normalizedUsername = normalizeUsername(username);
    const user = await getUserByUsername(normalizedUsername);

    if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    const signedInUser = {
      ...user,
      lastSignedIn: new Date(),
    };

    const session = await issueSession(req, res, signedInUser);
    res.json(session);
  });

  app.post("/api/auth/register", async (req: Request, res: Response) => {
    const username = getBodyString(req.body, "username");
    const password = getBodyString(req.body, "password");
    const name = getBodyString(req.body, "name");

    if (!username || !password) {
      res.status(400).json({ error: "username and password are required" });
      return;
    }

    const normalizedUsername = normalizeUsername(username);
    const existingUser = await getUserByUsername(normalizedUsername);
    if (existingUser) {
      res.status(409).json({ error: "Username already exists" });
      return;
    }

    const passwordHash = hashPassword(password);
    const createdUser = await createLocalUser({
      username: normalizedUsername,
      passwordHash,
      name: name || normalizedUsername,
    });

    if (!createdUser) {
      res.status(500).json({ error: "Failed to create user" });
      return;
    }

    const session = await issueSession(req, res, createdUser);
    res.status(201).json(session);
  });
}
