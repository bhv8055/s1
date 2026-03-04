import { config } from 'dotenv';
config({ path: '.env.local' });

import '@/ai/flows/health-analyzer-flow.ts';
