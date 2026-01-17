import { literal, nonEmpty, object, parse, pipe, string, union, url } from 'valibot';

const EnvSchema = object({
  DATABASE_URL: pipe(string(), nonEmpty()),
  BETTER_AUTH_SECRET: pipe(string(), nonEmpty()),
  BETTER_AUTH_URL: pipe(string(), nonEmpty(), url()),
  NEXT_PUBLIC_HOST: pipe(string(), nonEmpty(), url()),

  NODE_ENV: union([literal('production'), literal('development')]),
});

export const env = parse(EnvSchema, Bun.env);
