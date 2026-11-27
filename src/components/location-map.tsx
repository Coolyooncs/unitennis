import { site } from "@/lib/site";

export function LocationMap({ className = "" }: { className?: string }) {
  const q = encodeURIComponent("경기도 용인시 수지구 광교중앙로 302");
  return (
    <div className={`overflow-hidden rounded-3xl bg-ink/5 ${className}`}>
      <iframe
        title="유앤아이 테니스 아카데미 위치"
        src={`https://maps.google.com/maps?q=${q}&z=17&output=embed&hl=ko`}
        className="h-full min-h-80 w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="flex flex-wrap gap-2 bg-white p-3">
        <a className="btn-ghost text-xs" target="_blank" rel="noreferrer" href={`https://map.naver.com/p/search/${encodeURIComponent(site.address)}`}>
          네이버 지도
        </a>
        <a className="btn-ghost text-xs" target="_blank" rel="noreferrer" href={`https://map.kakao.com/?q=${encodeURIComponent("광교중앙로 302")}`}>
          카카오맵
        </a>
      </div>
    </div>
  );
}
