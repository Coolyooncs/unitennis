/** 본문 텍스트의 URL만 링크로 변환 (HTML은 렌더링하지 않아 XSS 안전) */
export function Linkify({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s<]+)/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <a key={i} href={p} target="_blank" rel="noopener noreferrer nofollow ugc" className="break-all text-brand-500 underline">
            {p}
          </a>
        ) : (
          p
        ),
      )}
    </>
  );
}
