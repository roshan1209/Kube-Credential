import { Router } from 'express';
import { verifyCredentialHandler } from '../controllers/verification.controller';

export const verificationRouter = Router();

verificationRouter.post('/', verifyCredentialHandler);
