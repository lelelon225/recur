import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";
import { CheckIcon } from "lucide-react";

export const Default = () => (
  <Avatar>
    <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="Jordan Miller" />
    <AvatarFallback>JM</AvatarFallback>
  </Avatar>
);

export const Sizes = () => (
  <div className="flex items-center gap-3">
    <Avatar size="sm">
      <AvatarImage src="https://i.pravatar.cc/80?img=32" alt="Alex Kim" />
      <AvatarFallback>AK</AvatarFallback>
    </Avatar>
    <Avatar size="default">
      <AvatarImage src="https://i.pravatar.cc/80?img=32" alt="Alex Kim" />
      <AvatarFallback>AK</AvatarFallback>
    </Avatar>
    <Avatar size="lg">
      <AvatarImage src="https://i.pravatar.cc/80?img=32" alt="Alex Kim" />
      <AvatarFallback>AK</AvatarFallback>
    </Avatar>
  </div>
);

export const FallbackOnly = () => (
  <div className="flex items-center gap-3">
    <Avatar>
      <AvatarFallback>SR</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>TN</AvatarFallback>
    </Avatar>
  </div>
);

export const WithBadge = () => (
  <Avatar size="lg">
    <AvatarImage src="https://i.pravatar.cc/80?img=47" alt="Priya Shah" />
    <AvatarFallback>PS</AvatarFallback>
    <AvatarBadge>
      <CheckIcon />
    </AvatarBadge>
  </Avatar>
);

export const Group = () => (
  <AvatarGroup>
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="Jordan Miller" />
      <AvatarFallback>JM</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/80?img=32" alt="Alex Kim" />
      <AvatarFallback>AK</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>SR</AvatarFallback>
    </Avatar>
    <AvatarGroupCount>+4</AvatarGroupCount>
  </AvatarGroup>
);
