import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { ContactCta } from "@/components/contact-cta";
import { LocationMap } from "@/components/location-map";
import { highlights, site } from "@/lib/site";

export const metadata: Metadata = { title: "아카데미 소개" };

export default function AboutPage() {
  return (
    <>
      <PageHero title="아카데미 소개" en="About Us" />

      <section className="container-x grid gap-14 py-20 lg:grid-cols-[1fr_1.1fr] lg:py-28">
        <div className="reveal">
          <p className="eyebrow">Welcome to</p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            U&amp;I TENNIS
            <br />
            ACADEMY
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-3">
            <Image src="/images/about-1.jpg" alt="테니스 레슨" width={500} height={334} className="aspect-[4/5] rounded-3xl object-cover" />
            <Image src="/images/about-2.jpg" alt="테니스 코트" width={500} height={334} className="mt-10 aspect-[4/5] rounded-3xl object-cover" />
          </div>
        </div>
        <div className="reveal space-y-6 text-[17px] leading-[1.9] text-ink/75">
          <p className="text-2xl font-bold leading-snug text-ink">
            안녕하세요.
            <br />
            유앤아이 테니스 아카데미 홈페이지를 방문해주셔서 감사합니다.
          </p>
          <p>
            유앤아이 테니스 아카데미는 &ldquo;U &amp; I&rdquo; 라는 모토 아래 남녀노소 누구든 관계없이 테니스를 쉽게 배우고 즐길 수 있는
            공간입니다. 테니스는 야외 스포츠라 대한민국 여건상 공간 협소 및 날씨의 영향을 많이 받아, 실제로 세계 5대 인기 스포츠이지만
            국내에서는 배울 수 있는 곳도 즐길 수 있는 곳도 찾기 힘든 실정입니다.
          </p>
          <p>
            유앤아이는 그런 단점을 보완하고 이 매력적인 스포츠를 누구나 즐길 수 있도록 공간과 강습을 제공하여, 언제든 고객님이 원하시는
            시간에 운동하실 수 있도록 최고의 시설과 최고 엘리트 강사진을 갖추었습니다.
          </p>
          <p>
            유앤아이 테니스 본원은 광교신도시 신분당선 상현역 2번 출구 도보 10초의 초역세권에 위치하고 있으며, 지상 7층에 테니스 정식
            규격 코트 한 면과 입문자와 어린이들을 위한 미니코트 1면을 갖추고 있습니다.
          </p>
          <p>
            추위, 더위, 비, 눈, 바람, 미세먼지, 황사 같은 날씨로 야외에서는 테니스를 할 수 없는 날이 점점 많아지고 있습니다. 유앤아이
            아카데미는 이런 불안 요소와 관계없이 언제든 약속된 시간에 쾌적한 환경에서 테니스를 즐기실 수 있다는 가장 큰 장점이 있습니다.
          </p>
          <p className="font-semibold text-ink">최고의 시설, 최고의 레슨, 최고의 재미를 드릴 것을 약속드립니다. 감사합니다.</p>
          <p className="text-right font-bold text-brand-500">유앤아이 프로 일동</p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-x grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h, i) => (
            <div key={h.title} className="reveal rounded-3xl border border-ink/10 p-7">
              <span className="font-display text-5xl font-black text-brand-100">0{i + 1}</span>
              <h3 className="mt-4 text-xl font-extrabold">{h.title}</h3>
              <p className="mt-2 text-ink/60">{h.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x grid gap-10 py-20 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <div>
          <p className="eyebrow">Contact Us</p>
          <h2 className="mt-3 text-3xl font-extrabold">오시는 길</h2>
          <dl className="mt-8 space-y-5">
            <div>
              <dt className="text-sm font-semibold text-ink/50">주소</dt>
              <dd className="mt-1 text-lg font-semibold">
                {site.address}
                <br />
                {site.addressDetail}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-ink/50">지하철</dt>
              <dd className="mt-1 font-semibold">{site.subway}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-ink/50">문의</dt>
              <dd className="mt-1 space-y-0.5">
                <p>
                  대표전화 : <a href={`tel:${site.phone}`} className="font-semibold text-brand-500">{site.phone}</a>
                </p>
                <p>email : {site.email}</p>
                <p>카톡 아이디 : {site.kakaoId}</p>
              </dd>
            </div>
          </dl>
        </div>
        <LocationMap />
      </section>

      <ContactCta />
    </>
  );
}
