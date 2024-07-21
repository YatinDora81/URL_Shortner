import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LinkIcon, LogOut } from "lucide-react";
import { UrlState } from "../context";
import { getInitials } from "../utils/getInitials";
import { useFetch } from "../hooks/use_fetch";
import { logout } from "../db/apiAuth";
import { BarLoader } from "react-spinners";

const Header = () => {
  const navigate = useNavigate();

  const { user, fetchuser } = UrlState();

  const { loading, fn: fnLogout } = useFetch(logout);

  return (
    <>
      <nav
        className=" flex py4 
     justify-between items-center my-6"
      >
        <Link>
          <img src="/logo.png" className=" h-16" alt="Logo"></img>
        </Link>

        <div>
          {!user ? (
            <Button
              onClick={() => {
                navigate("/auth");
              }}
            >
              Login
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="w-10 rounded-full overflow-hidden">
                <Avatar>
                  <AvatarImage
                    className=" object-contain"
                    src={user?.user_metadata?.profile_pic}
                  />
                  <AvatarFallback>
                    {getInitials(user?.user_metadata?.name)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  {user?.user_metadata?.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to={"/dashboard"} className=" flex">
                  <LinkIcon className="mr-2 h-4 w-4"></LinkIcon>My Links</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className=" text-red-400">
                  <LogOut className="mr-2 h-4 w-4"></LogOut>
                  <span
                    onClick={() => {
                      fnLogout().then(() => {
                        fetchuser();
                        navigate("/auth");
                      });
                    }}
                  >
                    Logout
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
      {loading && (
        <BarLoader className=" mb-4" width={"100%"} color="#36d7b7" />
      )}
    </>
  );
};

export default Header;
