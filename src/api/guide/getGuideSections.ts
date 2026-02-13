import { mockFetch } from "../client";
import { guideSections as mockGuideSections } from "@/api/mocks";
import type { GuideSection } from "@/types/guide";

/**
 * 가이드 섹션 목록 조회 API
 *
 * @returns 가이드 섹션 목록
 */
export async function getGuideSections(): Promise<GuideSection[]> {
  return mockFetch(mockGuideSections);
}
