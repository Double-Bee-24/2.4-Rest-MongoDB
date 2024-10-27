import session from "express-session";

declare module "express-session" {
  export interface SessionData {
    user: {
      id: ObjectId;
      email: string;
    };
  }
}
