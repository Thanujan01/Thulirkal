import { ChevronDown, ChevronRight, Menu, Gem, Palette, Flower, Scissors, Image as ImageIcon, Shirt } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/config/constants";

// Configuration - Manually adjustable settings for category items
// Use specific units (px) for smooth fine-tuning
const CONFIG = {
  // Individual Category Item Settings
  ITEM_WIDTH: "240px",            // Width of each category item ("auto" or specific like "200px")
  ITEM_HEIGHT: "45px",           // Height of each category item ("auto" or specific like "50px")
  ITEM_PADDING_TOP: "12px",      // Padding top for each category item
  ITEM_PADDING_BOTTOM: "12px",   // Padding bottom for each category item
  ITEM_PADDING_LEFT: "8px",      // Padding left for each category item
  ITEM_PADDING_RIGHT: "16px",    // Padding right for each category item
  ITEM_GAP: "2.5px",               // Gap between category items (vertical spacing)
  BORDER_WIDTH: "1px",           // Border width for each item
  BORDER_RADIUS: "6px",          // Border radius for rounded corners

  // Text and Icon Sizes
  TEXT_SIZE: "13px",             // Font size for category names
  ICON_SIZE: "16px",             // Size of category icons (width and height)

  // Overall Dropdown Panel Settings (container for all categories)
  PANEL_WIDTH: "250px",          // Width of the entire dropdown panel (or "auto")
  PANEL_HEIGHT: "auto",          // Height of the entire dropdown panel (or "auto")
  PANEL_PADDING_TOP: "8px",      // Padding top of dropdown panel
  PANEL_PADDING_BOTTOM: "8px",   // Padding bottom of dropdown panel
  PANEL_PADDING_LEFT: "5px",     // Padding left of dropdown panel
  PANEL_PADDING_RIGHT: "5px",    // Padding right of dropdown panel
};

interface CategoryDropdownProps {
  mobile?: boolean;
  onLinkClick?: () => void;
}

const categories = [
  {
    name: CATEGORIES.JEWELRIES.title,
    path: `/category/${CATEGORIES.JEWELRIES.slug}`,
    icon: Gem,
    iconColor: "text-pink-500",
    bgColor: "bg-pink-50"
  },
  {
    name: CATEGORIES.RESIN_ARTS.title,
    path: `/category/${CATEGORIES.RESIN_ARTS.slug}`,
    icon: Palette,
    iconColor: "text-purple-500",
    bgColor: "bg-purple-50"
  },
  {
    name: CATEGORIES.FLOWER_VASES.title,
    path: `/category/${CATEGORIES.FLOWER_VASES.slug}`,
    icon: Flower,
    iconColor: "text-green-500",
    bgColor: "bg-green-50"
  },
  {
    name: CATEGORIES.HAND_CRAFTS.title,
    path: `/category/${CATEGORIES.HAND_CRAFTS.slug}`,
    icon: Scissors,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-50"
  },
  {
    name: CATEGORIES.PHOTO_FRAMES.title,
    path: `/category/${CATEGORIES.PHOTO_FRAMES.slug}`,
    icon: ImageIcon,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50"
  },
  {
    name: CATEGORIES.CLOTHS.title,
    path: `/category/${CATEGORIES.CLOTHS.slug}`,
    icon: Shirt,
    iconColor: "text-red-500",
    bgColor: "bg-red-50"
  },
];

export const CategoryDropdown = ({ mobile, onLinkClick }: CategoryDropdownProps) => {
  if (mobile) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: CONFIG.ITEM_GAP,
          width: CONFIG.PANEL_WIDTH,
          height: CONFIG.PANEL_HEIGHT,
          paddingTop: CONFIG.PANEL_PADDING_TOP,
          paddingBottom: CONFIG.PANEL_PADDING_BOTTOM,
          paddingLeft: CONFIG.PANEL_PADDING_LEFT,
          paddingRight: CONFIG.PANEL_PADDING_RIGHT,
        }}
      >
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Link
              key={category.path}
              to={category.path}
              className="flex items-center gap-3 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
              style={{
                width: CONFIG.ITEM_WIDTH,
                height: CONFIG.ITEM_HEIGHT,
                paddingTop: CONFIG.ITEM_PADDING_TOP,
                paddingBottom: CONFIG.ITEM_PADDING_BOTTOM,
                paddingLeft: CONFIG.ITEM_PADDING_LEFT,
                paddingRight: CONFIG.ITEM_PADDING_RIGHT,
                borderWidth: CONFIG.BORDER_WIDTH,
                borderRadius: CONFIG.BORDER_RADIUS,
              }}
              onClick={onLinkClick}
            >
              <div className={`p-2 rounded-lg ${category.bgColor}`}>
                <IconComponent
                  className={`${category.iconColor}`}
                  strokeWidth={1.5}
                  style={{ width: CONFIG.ICON_SIZE, height: CONFIG.ICON_SIZE }}
                />
              </div>
              <span
                className="font-medium text-foreground flex-1 whitespace-nowrap"
                style={{ fontSize: CONFIG.TEXT_SIZE }}
              >
                {category.name}
              </span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="gap-2 bg-orange-600 hover:bg-orange-700 text-white rounded-full px-4 py-2 font-medium"
        >
          <Menu className="h-4 w-4" />
          All Categories
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="bg-white shadow-lg rounded-lg z-50"
        style={{
          width: CONFIG.PANEL_WIDTH,
          height: CONFIG.PANEL_HEIGHT,
          paddingTop: CONFIG.PANEL_PADDING_TOP,
          paddingBottom: CONFIG.PANEL_PADDING_BOTTOM,
          paddingLeft: CONFIG.PANEL_PADDING_LEFT,
          paddingRight: CONFIG.PANEL_PADDING_RIGHT,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: CONFIG.ITEM_GAP }}>
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <DropdownMenuItem key={category.path} asChild className="p-0">
                <Link
                  to={category.path}
                  className="flex items-center gap-3 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer w-full hover:scale-[1.02]"
                  style={{
                    width: CONFIG.ITEM_WIDTH,
                    height: CONFIG.ITEM_HEIGHT,
                    paddingTop: CONFIG.ITEM_PADDING_TOP,
                    paddingBottom: CONFIG.ITEM_PADDING_BOTTOM,
                    paddingLeft: CONFIG.ITEM_PADDING_LEFT,
                    paddingRight: CONFIG.ITEM_PADDING_RIGHT,
                    borderWidth: CONFIG.BORDER_WIDTH,
                    borderRadius: CONFIG.BORDER_RADIUS,
                  }}
                >
                  <div className={`p-2 rounded-lg ${category.bgColor}`}>
                    <IconComponent
                      className={`${category.iconColor}`}
                      strokeWidth={1.5}
                      style={{ width: CONFIG.ICON_SIZE, height: CONFIG.ICON_SIZE }}
                    />
                  </div>
                  <span
                    className="font-medium text-gray-800 flex-1 whitespace-nowrap"
                    style={{ fontSize: CONFIG.TEXT_SIZE }}
                  >
                    {category.name}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
