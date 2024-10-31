import { Link } from "react-router-dom";
import {useLocation, Location} from 'react-router-dom'
const NavBarItem = (props: { link: string; text: string }) => {
  let { link, text } = props;
  const location: Location = useLocation();
  console.log(location.pathname.includes(text))
  console.log(text)
  return (
    <>
      <li>
        <Link to={link} className = {`hover:text-slate-500 ${location.pathname.includes(text) ? "text-[#ff5353]":""}`}>
          {text}
        </Link>
      </li>
    </>
  );
};

export default NavBarItem;
