import { NavLink } from "react-router-dom";
import Spacer from "components/atoms/Spacer";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { faHome, faCog } from "@fortawesome/free-solid-svg-icons";
import NavbarStyles from "./Navbar.module.css";

type NavbarLinkProps = {
  to: string;
  text: string;
  icon: FontAwesomeIconProps["icon"];
};
function NavbarLink({ to, text, icon }: NavbarLinkProps) {
  return (
    <NavLink
      to={to}
      title={text}
      className={NavbarStyles.link}
      activeClassName={NavbarStyles.activeLink}
      end={to === "/"}
    >
      <figure>
        <figcaption className="sr-only">{text}</figcaption>
        <FontAwesomeIcon icon={icon} size="2x" />
      </figure>
    </NavLink>
  );
}

function Navbar() {
  return (
    <>
      <div className="sticky top-0 bg-white z-50">
        <div className="p-8 flex justify-around w-96 m-auto border-b">
          <NavbarLink to="/" text="Home" icon={faHome} />
          <NavbarLink to="/settings" text="Home" icon={faCog} />
        </div>
      </div>
      <Spacer className="h-8" />
    </>
  );
}

export default Navbar;
