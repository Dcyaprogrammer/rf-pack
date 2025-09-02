import { Hono } from "hono";
import { describeRoute } from "hono-openapi";

const app = new Hono()
  .use(
    describeRoute({
      tags: ["Setup"],
    })
  )
  .post(
    "/",
    describeRoute({
      description: "系统初始化占位接口（后续将串联创建数据集/上传/解析/助手）",
      request: {
        body: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  files: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "占位成功",
        },
      },
    }),
    async (c) => {
      return c.json({ ok: true });
    }
  );

export default app;


