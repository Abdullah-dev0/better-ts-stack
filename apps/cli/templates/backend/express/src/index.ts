import 'dotenv/config';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
{{#if (eq database 'mongoose')}}
import { connectDB } from './lib/db';
{{/if}}
import healthRouter from './routes/health';
{{#if useAuth}}
import authRouter from './routes/auth';
{{/if}}



const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/health', healthRouter);
{{#if useAuth}}
app.use('/auth', authRouter);
{{/if}}

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use(
  (
    err: Error & { status?: number; statusCode?: number; expose?: boolean },
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    // Middleware such as express.json() sets 4xx statuses (bad JSON, body too large)
    const status = err.status ?? err.statusCode ?? 500;

    if (status >= 400 && status < 500) {
      res.status(status).json({ error: err.expose ? err.message : 'Bad Request' });
      return;
    }

    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  },
);

{{#if (eq database 'mongoose')}}
void awaitDatabase().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
async function awaitDatabase(): Promise<void> {
  await connectDB();
  app.listen(port);
}
{{else}}
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port} 
    Health: http://localhost:${port}/health
    `);
});

{{/if}}

export default app;
