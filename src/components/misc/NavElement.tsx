interface NavElementProps {
  navigateTo: () => void;
  text: string;
  isActive: boolean;
}

const NavElement: React.FC<NavElementProps> = ({
  navigateTo,
  text,
  isActive,
}) => (
  <li
    className={`list-none cursor-pointer flex items-center px-4 py-2 lg:p-8 text-2xl hover:bg-slate-600 transition duration-200 ease-in-out ${
      isActive ? "bg-slate-600" : ""
    }`}
    onClick={navigateTo}
  >
    {text}
  </li>
);

export default NavElement;
