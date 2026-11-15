import type { Post, User } from "./types";
import type { SocialState } from "@/components/social/Actions";
export function postState(post: Post, user?: User): SocialState {
  return {
    likes: post.likedBy?.length || 0,
    reposts: post.repostedBy?.length || 0,
    replies: post.replies?.length || 0,
    liked: Boolean(user && post.likedBy?.includes(user.id)),
    reposted: Boolean(user && post.repostedBy?.includes(user.id)),
    bookmarked: Boolean(user?.bookmarks?.includes(post.id)),
  };
}
