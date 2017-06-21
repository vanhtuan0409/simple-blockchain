// @flow
import crypto from "crypto";

const HASH_KEY = "abcxyz123456";

export function hash(s: string): string {
  return crypto.createHmac("sha1", HASH_KEY).update(s).digest("hex");
}
