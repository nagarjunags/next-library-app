// @/components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Menu, X, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Navbar = () => {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [providers, setProviders] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    setAuthProviders();
  }, []);

  const navItems = [
    { href: "/", label: "Home", authRequired: true },
    { href: "/requests", label: "Requests", authRequired: true },
    { href: "/transactions", label: "Transactions", authRequired: true },
    { href: "/members", label: "Members", adminOnly: true },
    { href:"/professors",label:"Professors",authRequired:true},
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-purple-900 border-b border-blue-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="ml-2 text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                CodeCraft Library
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {navItems.map(
                (item) =>
                  ((item.adminOnly && session?.user?.role === "admin") ||
                    (!item.adminOnly && (!item.authRequired || session))) && (
                    <TooltipProvider key={item.href}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.href}
                            className={`${
                              pathname === item.href
                                ? "bg-blue-800 text-white"
                                : "text-blue-100 hover:bg-blue-700 hover:text-white"
                            } px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out`}
                          >
                            {item.label}
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Go to {item.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )
              )}
            </div>
          </div>

          <div className="flex items-center">
            {session ? (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="relative text-blue-100 hover:text-white mr-4"
                      >
                        <Bell className="h-5 w-5" />
                        <Badge
                          variant="destructive"
                          className="absolute -top-1 -right-1"
                        >
                          2
                        </Badge>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Notifications</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative rounded-full focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-blue-800"
                    >
                      <Avatar>
                        <AvatarImage
                          src={session.user.image || "/profile-default.png"}
                          alt="User profile"
                        />
                        <AvatarFallback>
                          {session.user.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              providers &&
              Object.values(providers).map((provider) => (
                <Button
                  key={provider.id}
                  onClick={() => signIn(provider.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login with {provider.name}
                </Button>
              ))
            )}
          </div>

          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-blue-100 hover:text-white"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map(
                (item) =>
                  ((item.adminOnly && session?.user?.role === "admin") ||
                    (!item.adminOnly && (!item.authRequired || session))) && (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`${
                        pathname === item.href
                          ? "bg-blue-800 text-white"
                          : "text-blue-100 hover:bg-blue-700 hover:text-white"
                      } block px-3 py-2 rounded-md text-base font-medium`}
                    >
                      {item.label}
                    </Link>
                  )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
