import winston from "winston";

export const getLogger = (service: string) =>
  winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: { service },
    transports: [new winston.transports.Console()],
  });

export default getLogger;


