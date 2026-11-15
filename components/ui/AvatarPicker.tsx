import { Avatar } from "./Avatar";
import { avatarNames } from "@/lib/avatars";
export function AvatarOptions({ selected = 0 }: { selected?: number }) {
  return (
    <div className="avatar-grid">
      {avatarNames.map((name, index) => (
        <label className="avatar-choice" key={name}>
          <Avatar handle={name} index={index} size={90} />
          <input
            type="radio"
            name="avatar"
            value={index}
            defaultChecked={index === selected}
          />
          <span>{name}</span>
        </label>
      ))}
    </div>
  );
}
