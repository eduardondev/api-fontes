import { PrismaClient } from "@prisma/client";
import { Logger } from "../utils/Logger";
export const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  const before = Date.now();

  const result = await next(params);

  const after = Date.now();

  Logger.info(
    `--> QUERY ${params.model}.${params.action} took ${after - before}ms`
  );

  return result;
});
