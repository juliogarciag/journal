import {
  faSun,
  faDumbbell,
  faTooth,
  faSmileBeam,
  faPastafarianism,
  faMoon,
  faQuestionCircle,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { EntryTypeIconType } from "types";

const allowedIcons: Record<EntryTypeIconType, IconDefinition> = {
  [EntryTypeIconType.Sun]: faSun,
  [EntryTypeIconType.Dumbbell]: faDumbbell,
  [EntryTypeIconType.Tooth]: faTooth,
  [EntryTypeIconType.SmileBeam]: faSmileBeam,
  [EntryTypeIconType.Moon]: faMoon,
  [EntryTypeIconType.Pastafarianism]: faPastafarianism,
  [EntryTypeIconType.Unknown]: faQuestionCircle,
};

type EntryTypeIconProps = {
  icon?: EntryTypeIconType;
  size?: FontAwesomeIconProps["size"];
  className?: string;
};
function EntryTypeIcon({
  icon,
  size = "1x",
  className = "",
}: EntryTypeIconProps) {
  let faIcon = faQuestionCircle;

  if (icon && allowedIcons[icon]) {
    faIcon = allowedIcons[icon];
  }

  return (
    <FontAwesomeIcon
      icon={faIcon}
      size={size}
      className={clsx("fill-current", className)}
    />
  );
}

export default EntryTypeIcon;
