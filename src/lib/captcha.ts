import "server-only";
import { randomInt } from "node:crypto";
import { sign, unsign } from "./crypto";

type Challenge = { a: number; b: number; t: number };

/** 간단한 산수 캡차. 원본 KBoard의 보안코드 입력을 대체한다. */
export function createCaptcha() {
  const a = randomInt(1, 10);
  const b = randomInt(1, 10);
  return { question: `${a} + ${b} = ?`, token: sign({ a, b, t: Date.now() } satisfies Challenge) };
}

/** 정답, 만료(30분), 최소 작성 시간(3초), 허니팟 필드를 함께 검사한다. */
export function checkHuman(form: FormData): string | null {
  if (String(form.get("website") ?? "") !== "") return "스팸으로 의심되어 등록할 수 없습니다.";
  const c = unsign<Challenge>(String(form.get("captcha_token") ?? ""));
  if (!c) return "보안코드가 올바르지 않습니다. 새로고침 후 다시 시도해주세요.";
  const age = Date.now() - c.t;
  if (age > 30 * 60 * 1000) return "보안코드가 만료되었습니다. 새로고침 후 다시 시도해주세요.";
  if (age < 3000) return "너무 빠르게 제출되었습니다. 잠시 후 다시 시도해주세요.";
  if (Number(form.get("captcha")) !== c.a + c.b) return "보안코드 계산 결과가 틀렸습니다.";
  return null;
}
