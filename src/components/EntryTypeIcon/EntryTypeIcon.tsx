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
  icon: EntryTypeIconType;
  size?: FontAwesomeIconProps["size"];
};
function EntryTypeIcon({ icon, size = "1x" }: EntryTypeIconProps) {
  return (
    <FontAwesomeIcon
      icon={allowedIcons[icon] || faQuestionCircle}
      size={size}
    />
  );
}

export default EntryTypeIcon;
