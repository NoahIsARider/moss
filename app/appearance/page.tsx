import { CommunityShell } from "@/components/shell/CommunityShell";
import { BackgroundPicker } from "@/components/ui/Backgrounds";
import { config } from "@/lib/config";
export const metadata = { title: "Appearance" };
export default function Appearance() {
  return (
    <CommunityShell site={{ title: config.title }}>
      <div className="view-heading">
        <h1>A change of scenery</h1>
        <p>Same neighborhood feeling. A different little view.</p>
      </div>
      <div className="mint-page">
        <BackgroundPicker />
      </div>
    </CommunityShell>
  );
}
