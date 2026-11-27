import Form from "next/form";
import type { SearchField } from "@/lib/board";

export function SearchBar({ field, q }: { field: SearchField; q: string }) {
  return (
    <Form action="/community" className="flex w-full gap-2 sm:w-auto" role="search">
      <label className="sr-only" htmlFor="search-field">검색 범위</label>
      <select id="search-field" name="field" defaultValue={field} className="field w-auto py-2.5 pr-8 text-sm">
        <option value="all">전체</option>
        <option value="title">제목</option>
        <option value="content">내용</option>
        <option value="author">작성자</option>
      </select>
      <label className="sr-only" htmlFor="search-q">검색어</label>
      <input id="search-q" name="q" defaultValue={q} placeholder="검색어 입력" className="field min-w-0 flex-1 py-2.5 text-sm sm:w-56" />
      <button className="btn-primary shrink-0">검색</button>
    </Form>
  );
}
