import { FilePicker } from "@/components/ui/FilePicker";
import Link from "next/link";
import { CommunityShell } from "@/components/shell/CommunityShell";
import { AvatarOptions } from "@/components/ui/AvatarPicker";
import { uploadAvatar, chooseAvatar } from "@/app/actions/posts";
import { currentUser } from "@/lib/auth";
import { readStore } from "@/lib/store";
import { avatarIndex } from "@/lib/assets";
import { config } from "@/lib/config";
export const dynamic = "force-dynamic";
export const metadata = { title: "Default avatars" };
export default async function Avatars({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const [user, store, { saved, error }] = await Promise.all([
    currentUser(),
    readStore(),
    searchParams,
  ]);
  const record = store.users.find((u) => u.id === user?.id);
  return (
    <CommunityShell site={{ title: config.title }}>
      <div className="view-heading">
        <h1>A face for your corner</h1>
        <p>
          Thirty-two hand-drawn neighbors. Choose the one that feels like you.
        </p>
      </div>
      <div className="mint-page">
        {error && (
          <p className="notice error" role="alert">
            Use a PNG, JPEG or WebP up to 5 MB.
          </p>
        )}
        {saved && (
          <p className="notice" role="status">
            Your avatar is saved.
          </p>
        )}
        {user ? (
          <>
            <form action={chooseAvatar}>
              <AvatarOptions
                selected={record?.avatar ?? avatarIndex(user.handle)}
              />
              <button type="submit">Save avatar</button>
            </form>
            <form action={uploadAvatar} className="mint-form upload-avatar">
              <h2 className="doc-h">Or bring your own</h2>
              <label htmlFor="avatar-image">
                PNG, JPEG or WebP · up to 5 MB
              </label>
              <FilePicker id="avatar-image" required />
              <button type="submit">Upload avatar</button>
            </form>
          </>
        ) : (
          <>
            <AvatarOptions />
            <p className="notice">
              <Link href="/login">Sign in</Link> or{" "}
              <Link href="/join">create a handle</Link> to choose your avatar.
            </p>
          </>
        )}
      </div>
    </CommunityShell>
  );
}
