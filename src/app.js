import env from "dotenv";
import cors from "cors";
const treblle = require('@treblle/express');
import morgan from "morgan";
import Prometheus from 'prom-client';
import swaggerUI from "swagger-ui-express";
import swagger from "./docConfig/swagger";
import allroutes from './routes/index.route';

const express = require("express");

env.config();
const app = express();
Prometheus.collectDefaultMetrics();
// const httpRequestDurationMicroseconds = new Prometheus.Histogram({
//   name: 'http_request_duration_ms',
//   help: 'Duration of HTTP requests in ms',
//   labelNames: ['method', 'route', 'code'],
//   buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]
// });
// app.use((req, res, next) => {
//   res.locals.startEpoch = Date.now();
//   next();
// });
const httpRequestDurationMicroseconds = new Prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['route'],
});

const httpRequestErrors = new Prometheus.Counter({
  name: 'http_request_errors_total',
  help: 'Total number of HTTP request errors',
  labelNames: ['route'],
});

// Middleware to measure request duration and count errors
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDurationMicroseconds.labels(req.path).observe(duration / 1000);
  });
  res.on('close', () => {
    if (res.statusCode >= 400) {
      httpRequestErrors.labels(req.path).inc();
    }
  });
  next();
});
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(
  treblle({
    apiKey: process.env.TREBLLE_API_KEY,
    projectId: process.env.TREBLLE_PROJECT_ID
  })
);
app.use(allroutes);
// app.use((req, res, next) => {
//   const responseTimeInMs = Date.now() - res.locals.startEpoch;
//   httpRequestDurationMicroseconds
//     .labels(req.method, req.path, res.statusCode)
//     .observe(responseTimeInMs);

//   next();
// });
app.get("/api/v1", (req, res) => {
  res.status(200).json({
    message: "Welcome to Task Tracker API"
  });
});
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', Prometheus.register.contentType);
    const metricsData = await Prometheus.register.metrics();
    res.send(metricsData);
  } catch (err) {
    console.error('Error getting metrics:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swagger));

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
