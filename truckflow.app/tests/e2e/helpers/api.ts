import { type APIRequestContext, request } from "@playwright/test";
import { TEST_ENV } from "./env";

export async function newApi(token?: string): Promise<APIRequestContext> {
  return await request.newContext({
    baseURL: TEST_ENV.apiBaseUrl,
    extraHTTPHeaders: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function loginAdmin(): Promise<string> {
  const api = await newApi();
  const url = `${TEST_ENV.apiBaseUrl}/AuthAdmin/login`;
  const resp = await api.post(url, {
    data: { login: TEST_ENV.admin.login, password: TEST_ENV.admin.password },
  });
  if (!resp.ok()) {
    throw new Error(`Login admin falhou em ${url}: ${resp.status()} ${await resp.text()}`);
  }
  const body = await resp.json();
  await api.dispose();
  return body.token as string;
}

export async function loginMotorista(): Promise<string> {
  const api = await newApi();
  const url = `${TEST_ENV.apiBaseUrl}/AuthMotorista/login`;
  const resp = await api.post(url, {
    data: { login: TEST_ENV.motorista.login, password: TEST_ENV.motorista.password },
  });
  if (!resp.ok()) {
    throw new Error(`Login motorista falhou em ${url}: ${resp.status()} ${await resp.text()}`);
  }
  const body = await resp.json();
  await api.dispose();
  return body.token as string;
}
