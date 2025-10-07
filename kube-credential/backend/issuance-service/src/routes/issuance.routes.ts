import { Router } from 'express';
import { issueCredentialHandler, getCredentialHandler } from '../controllers/issuance.controller';

export const issuanceRouter = Router();

issuanceRouter.post('/', issueCredentialHandler);
issuanceRouter.get('/:id', getCredentialHandler);
