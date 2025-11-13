import { fetchPosts } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import { useSession } from "@/store/session";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

const PAGE_SIZE = 5;

export function useInfinitePostsData() {
  const queryClient = useQueryClient();
  const session = useSession();

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.post.list,
    queryFn: async ({ pageParam }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const posts = await fetchPosts({ from, to, userId: session!.user.id });
      posts.forEach((post) => {
        queryClient.setQueryData(QUERY_KEYS.post.byId(post.id), post);
      });
      return posts.map((post) => post.id);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length;
    },
    staleTime: Infinity,
  });
}

// 📌 useInfinitePostsData 흐름 정리
// 1. 컴포넌트가 처음 실행되면 pageParam(initialPageParam) = 0 으로 queryFn 호출됨
//    → fetchPosts({ from: 0, to: 4 }) 실행 (첫 5개 데이터 요청)
// 2. 요청이 끝나면 getNextPageParam 이 실행됨
//    - lastPage: 방금 받아온 페이지 데이터 (예: [post0..post4])
//    - allPages: 지금까지 받아온 모든 페이지들의 배열 (예: [[post0..post4],[post5...post9]])
// 3. lastPage.length 가 PAGE_SIZE(5)보다 작으면 → 다음 페이지 없음 (undefined 반환)
//    그렇지 않으면 → allPages.length 반환 (예: 1) → 다음 pageParam 으로 사용됨
// 4. 다음 fetchNextPage 호출 시 pageParam = 1 로 넘어가서
//    → fetchPosts({ from: 5, to: 9 }) 실행 (다음 5개 요청)
// 5. 이런 식으로 페이지가 쌓이며 무한 스크롤 구현됨
