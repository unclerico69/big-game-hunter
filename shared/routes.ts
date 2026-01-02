import { z } from 'zod';
import { insertTvSchema, insertGameSchema, insertPreferencesSchema, tvs, games, preferences } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
};

export const api = {
  tvs: {
    list: {
      method: 'GET' as const,
      path: '/api/tvs',
      responses: {
        200: z.array(z.custom<typeof tvs.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/tvs/:id',
      responses: {
        200: z.custom<typeof tvs.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/tvs/:id',
      input: insertTvSchema.partial().extend({
        lockDuration: z.number().optional(), // Minutes
      }),
      responses: {
        200: z.custom<typeof tvs.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  games: {
    list: {
      method: 'GET' as const,
      path: '/api/games',
      input: z.object({
        status: z.enum(['Live', 'Scheduled', 'Ended', 'All']).optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof games.$inferSelect>()),
      },
    },
  },
  preferences: {
    get: {
      method: 'GET' as const,
      path: '/api/preferences',
      responses: {
        200: z.custom<typeof preferences.$inferSelect>(),
      },
    },
    update: {
      method: 'POST' as const,
      path: '/api/preferences',
      input: insertPreferencesSchema,
      responses: {
        200: z.custom<typeof preferences.$inferSelect>(),
      },
    },
  },
  recommendations: {
    list: {
      method: 'GET' as const,
      path: '/api/recommendations',
      responses: {
        200: z.array(z.object({
          tvId: z.number(),
          gameId: z.number(),
          reason: z.string(),
          score: z.number(),
        })),
      },
    },
    apply: {
      method: 'POST' as const,
      path: '/api/recommendations/apply',
      input: z.object({
        tvId: z.number(),
        gameId: z.number(),
      }),
      responses: {
        200: z.object({ success: z.boolean() }),
      },
    }
  },
  requests: {
    create: {
      method: 'POST' as const,
      path: '/api/requests',
      input: z.object({
        tvId: z.number(),
        gameId: z.number(),
      }),
      responses: {
        201: z.object({ id: z.number() }),
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/requests',
      responses: {
        200: z.array(z.any()),
      },
    }
  },
  beers: {
    order: {
      method: 'POST' as const,
      path: '/api/beers/order',
      input: z.object({
        type: z.string(),
      }),
      responses: {
        201: z.object({ id: z.number() }),
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
