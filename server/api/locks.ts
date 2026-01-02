import { Request, Response } from "express";
import { getActiveLocks, applyTvLock } from "../data/locks";
import { z } from "zod";

/**
 * GET /api/locks
 * List all active TV locks.
 */
export async function listLocks(req: Request, res: Response) {
  try {
    const locks = await getActiveLocks();
    res.json(locks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch locks" });
  }
}

/**
 * POST /api/locks
 * Create or update a lock on a TV.
 */
export async function createLock(req: Request, res: Response) {
  try {
    const schema = z.object({
      tvId: z.number(),
      durationMinutes: z.number().min(1)
    });

    const { tvId, durationMinutes } = schema.parse(req.body);
    const updatedTv = await applyTvLock(tvId, durationMinutes);
    
    res.json({
      tvId: updatedTv.id,
      lockedUntil: updatedTv.lockedUntil,
      status: "locked"
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to apply lock" });
  }
}
