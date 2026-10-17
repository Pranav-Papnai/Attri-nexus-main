import { RateLimitHit } from '../db/models/RateLimitHit.js';

// express-rate-limit store backed by MongoDB, using fixed windows. Counters
// are shared across every instance of the API (serverless functions,
// containers, restarts), unlike the default per-process memory store.
export class MongoRateLimitStore {
  constructor(prefix) {
    this.prefix = `${prefix}:`;
    this.localKeys = false;
  }

  init(options) {
    this.windowMs = options.windowMs;
  }

  #window(now = Date.now()) {
    const start = Math.floor(now / this.windowMs) * this.windowMs;
    return { start, resetTime: new Date(start + this.windowMs) };
  }

  #id(key, start) {
    return `${this.prefix}${key}:${start}`;
  }

  async get(key) {
    const { start, resetTime } = this.#window();
    const doc = await RateLimitHit.findById(this.#id(key, start)).lean();
    return doc ? { totalHits: doc.hits, resetTime } : undefined;
  }

  async increment(key) {
    const { start, resetTime } = this.#window();
    const update = { $inc: { hits: 1 }, $setOnInsert: { expiresAt: resetTime } };
    const options = { upsert: true, returnDocument: 'after', lean: true };
    let doc;
    try {
      doc = await RateLimitHit.findOneAndUpdate({ _id: this.#id(key, start) }, update, options);
    } catch (err) {
      // Two first hits racing on the same new window; the loser retries as
      // a plain increment of the document the winner created.
      if (err?.code !== 11000) throw err;
      doc = await RateLimitHit.findOneAndUpdate({ _id: this.#id(key, start) }, update, options);
    }
    return { totalHits: doc.hits, resetTime };
  }

  async decrement(key) {
    const { start } = this.#window();
    await RateLimitHit.updateOne({ _id: this.#id(key, start), hits: { $gt: 0 } }, { $inc: { hits: -1 } });
  }

  async resetKey(key) {
    await RateLimitHit.deleteMany({ _id: { $regex: `^${escapeRegex(this.prefix + key)}:` } });
  }
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
