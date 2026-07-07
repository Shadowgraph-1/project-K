import { useMemo } from "react";

import { env } from "@/shared/config/env";

const MCP_PACKAGE = "@kono/mcp-server";

export function buildJwtLoginExamples(apiUrl: string) {
  const loginUrl = `${apiUrl}/auth/login`;

  return {
    loginUrl,
    curl: `curl -X POST ${loginUrl} \\
  -H "Content-Type: application/json" \\
  -d '{"email":"you@example.com","password":"your-password"}'`,
    curlExtract: `curl -s -X POST ${loginUrl} \\
  -H "Content-Type: application/json" \\
  -d '{"email":"you@example.com","password":"your-password"}' | jq -r .token`,
    powershell: `$response = Invoke-RestMethod -Method Post -Uri "${loginUrl}" \`
  -ContentType "application/json" \`
  -Body '{"email":"you@example.com","password":"your-password"}'

$response.token`,
  };
}

export function useMcpInstallTabs() {
  const apiUrl = env.apiUrl || "http://localhost:3000/api";
  const jwtExamples = useMemo(() => buildJwtLoginExamples(apiUrl), [apiUrl]);

  const installTabs = useMemo(
    () => [
      {
        id: "jwt",
        label: "JWT",
        code: jwtExamples.curl,
      },
      {
        id: "env",
        label: "env",
        code: [`KONO_API_URL=${apiUrl}`, "KONO_API_KEY=<token из ответа login>"].join(
          "\n",
        ),
      },
      {
        id: "run",
        label: "Запуск",
        code: `npx -y ${MCP_PACKAGE}@latest`,
      },
      {
        id: "config",
        label: "Конфиг",
        code: JSON.stringify(
          {
            mcpServers: {
              kono: {
                command: "npx",
                args: ["-y", `${MCP_PACKAGE}@latest`],
                env: {
                  KONO_API_URL: apiUrl,
                  KONO_API_KEY: "<token из POST /auth/login>",
                },
              },
            },
          },
          null,
          2,
        ),
      },
    ],
    [apiUrl, jwtExamples.curl],
  );

  const mcpClientConfig = installTabs.find((tab) => tab.id === "config")?.code ?? "";
  const envExample = installTabs.find((tab) => tab.id === "env")?.code ?? "";

  return { apiUrl, installTabs, mcpClientConfig, envExample, jwtExamples };
}