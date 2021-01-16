import { faCog, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "components/atoms/Button";
import Spacer from "components/atoms/Spacer";
import EntryTypeIcon from "components/EntryTypeIcon";
import { Link } from "react-router-dom";
import { EntryTypeIconType } from "types";

function YearMetrics({ year }: { year: number }) {
  return (
    <div
      className="p-8 flex flex-wrap justify-around m-auto"
      style={{ marginTop: "-2rem" }}
    >
      <div className="flex flex-col items-center pr-8 mt-8">
        <div className="flex items-center">
          <EntryTypeIcon
            icon={EntryTypeIconType.Dumbbell}
            size="2x"
            className="text-green-800"
          />
          <span className="pl-2 text-3xl flex items-center">
            <span>80</span>
            <span className="text-xl pl-2">%</span>
          </span>
        </div>
        <div className="text-center text-sm pt-1">12 days out of 15</div>
      </div>
      <div className="flex flex-col items-center pr-8 mt-8">
        <div className="flex items-center">
          <EntryTypeIcon
            icon={EntryTypeIconType.Tooth}
            size="2x"
            className="text-green-800"
          />
          <span className="pl-2 text-3xl flex items-center">
            <span>100</span>
            <span className="text-xl pl-2">%</span>
          </span>
        </div>
        <div className="text-center text-sm pt-1">15 days out of 15</div>
      </div>
      <div className="flex flex-col items-center pr-8 mt-8">
        <div className="flex items-center">
          <EntryTypeIcon
            icon={EntryTypeIconType.SmileBeam}
            size="2x"
            className="text-green-800"
          />
          <span className="pl-2 text-3xl flex items-center">
            <span>100</span>
            <span className="text-xl pl-2">%</span>
          </span>
        </div>
        <div className="text-center text-sm pt-1">15 days out of 15</div>
      </div>
      <div className="flex flex-col items-center pr-8 mt-8">
        <div className="flex items-center">
          <EntryTypeIcon
            icon={EntryTypeIconType.Pastafarianism}
            size="2x"
            className="text-green-800"
          />
          <span className="pl-2 text-3xl flex items-center">
            <span>1.9</span>
            <span className="text-lg pl-2">times</span>
          </span>
        </div>
        <div className="text-center text-sm pt-1">is the daily average</div>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <div className="bg-gray-200 w-full h-screen sticky top-0 left-0 px-6 py-4">
      <Spacer className="h-2" />
      <header className="p-2">
        <h1 className="text-2xl">
          <Link to="/">Journal</Link>
        </h1>
      </header>
      <Spacer className="h-4" />
      <div className="bg-gray-300 p-2 rounded-xl">
        <YearMetrics year={2021} />
      </div>
      <Spacer className="h-6" />
      <ul className="p-4 text-lg border-gray-400 border-solid border-t">
        <li className="pb-4 pt-2">
          <FontAwesomeIcon icon={faCog} />
          <Link to="/settings" className="pl-2">
            Settings
          </Link>
        </li>
        <li>
          <FontAwesomeIcon icon={faSignOutAlt} />
          <Button className="pl-2">Sign out</Button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
