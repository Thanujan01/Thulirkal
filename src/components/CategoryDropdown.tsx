import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/config/constants";

interface CategoryDropdownProps {
  mobile?: boolean;
  onLinkClick?: () => void;
}

const categories = [
  { name: CATEGORIES.JEWELRIES.title, path: `/category/${CATEGORIES.JEWELRIES.slug}` },
  { name: CATEGORIES.RESIN_ARTS.title, path: `/category/${CATEGORIES.RESIN_ARTS.slug}` },
  { name: CATEGORIES.FLOWER_VASES.title, path: `/category/${CATEGORIES.FLOWER_VASES.slug}` },
  { name: CATEGORIES.HAND_CRAFTS.title, path: `/category/${CATEGORIES.HAND_CRAFTS.slug}` },
  { name: CATEGORIES.PHOTO_FRAMES.title, path: `/category/${CATEGORIES.PHOTO_FRAMES.slug}` },
];

export const CategoryDropdown = ({ mobile, onLinkClick }: CategoryDropdownProps) => {
  if (mobile) {
    return (
      <div className="flex flex-col space-y-2 px-4 py-3">
        
        <div className="flex flex-col space-y-2">
          {categories.map((category) => (
            <Link
              key={category.path}
              to={category.path}
              className="font-semibold text-foreground hover:text-primary transition-colors"
              onClick={onLinkClick}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-1">
          Categories
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-30 bg-popover z-50">
        {categories.map((category) => (
          <DropdownMenuItem key={category.path} asChild>
            <Link
              to={category.path}
              className="cursor-pointer w-full hover:bg-accent transition-colors"
            >
              {category.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
