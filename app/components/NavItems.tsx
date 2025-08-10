import { useTheme } from "next-themes";
import Link from "next/link";
import React from "react";

export const navItemsData = [
  { name: "Home", url: "/" },
  { name: "Courses", url: "/courses" },
  { name: "About", url: "/about" },
  { name: "Policy", url: "/policy" },
  { name: "FAQ", url: "/faq" },
];

type Props = {
  activeItem: number;
  isMobile: boolean;
};

const NavItems: React.FC<Props> = ({ activeItem, isMobile }) => {
  const { theme } = useTheme();

  return (
    <>
      {isMobile ? (
        <div className="md:hidden mt-1 w-full">
          <div className="w-full text-center py-2">
            {navItemsData.map((item, index) => (
              <Link href={item.url} key={index} passHref>
                <span
                  className={`
                                    ${
                                      activeItem === index
                                        ? theme === "dark"
                                          ? "text-[#dccb14]"
                                          : "dark:text-[#7df6ec]"
                                        : theme === "dark"
                                          ? "text-white"
                                          : "dark:text-black"
                                    } 
                                    block py-2 text-[14px] px-3 font-Poppins font-[300]
                                `}
                >
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className=" hidden md:flex items-center gap-4">
          {navItemsData.map((item, index) => (
            <Link href={item.url} key={index} passHref>
              <span
                className={`
                                ${
                                  activeItem === index
                                    ? theme === "dark"
                                      ? "text-[crimson]"
                                      : "dark:text-[#59d6cc]"
                                    : theme === "dark"
                                      ? "text-white"
                                      : "dark:text-black"
                                } 
                                text-[16px] px-4 font-Poppins font-[400]
                                hover:text-[crimson] dark:hover:text-[rgb(73,219,207)] transition
                            `}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default NavItems;
