import { createTRPCContext } from './init';
import { appRouter } from './routers/_app';

export const createCaller = async () =>
  appRouter.createCaller(await createTRPCContext());
