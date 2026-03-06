import { NavigationMenu, NavigationMenuList, NavigationMenuItem} from "../ui/navigation-menu";

import { Link } from "react-router-dom";

function Navbar() {
  return (
    <NavigationMenu className="bg-gray-800 text-white p-4 w-full max-w-full">
      <NavigationMenuList className="flex w-full space-x-4">
        <NavigationMenuItem className="mr-auto">
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="ml-auto">
          <Link to="" className="hover:text-gray-300">
           Favorite
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="ml-8">
          <Link to="" className="hover:text-gray-300">
           Sign In
          </Link>
        </NavigationMenuItem>
         {/* Add more navigation items as needed */}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default Navbar;