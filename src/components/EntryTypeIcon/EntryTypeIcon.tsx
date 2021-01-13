import {
  faSun,
  faDumbbell,
  faTooth,
  faSmileBeam,
  faPastafarianism,
  faMoon,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";

const allowedIcons: { [key: string]: FontAwesomeIconProps["icon"] } = {
  sun: faSun,
  dumbbell: faDumbbell,
  tooth: faTooth,
  "smile-beam": faSmileBeam,
  pastafarianism: faPastafarianism,
  moon: faMoon,
  unknown: faQuestionCircle,
};

type EntryTypeIconProps = {
  icon: string;
  color: string;
  size?: FontAwesomeIconProps["size"];
};
function EntryTypeIcon({ icon, color, size = "1x" }: EntryTypeIconProps) {
  return (
    <FontAwesomeIcon
      icon={allowedIcons[icon] || faQuestionCircle}
      size={size}
      className={`fill-current text-${color}`}
    />
  );
}

export default EntryTypeIcon;
