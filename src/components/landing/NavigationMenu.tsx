
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const AppNavigationMenu: React.FC = () => {
  return (
    <NavigationMenu className="max-w-none w-full justify-center">
      <NavigationMenuList className="gap-1">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-white/10 text-white hover:bg-white/20 focus:bg-white/20">
            Features
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem href="/app/voice" title="Voice AI">
                Talk to our AI sleep coach to get personalized sleep advice
              </ListItem>
              <ListItem href="/app/sleep-cast" title="Sleep Cast">
                Drift off with relaxing stories and soundscapes
              </ListItem>
              <ListItem href="/app/stats" title="Sleep Stats">
                Track your sleep patterns and progress over time
              </ListItem>
              <ListItem href="/app/dashboard" title="Dashboard">
                Your sleep wellness overview
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-white/10 text-white hover:bg-white/20 focus:bg-white/20">
            How It Works
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
              <ListItem href="#" title="Our Approach">
                Learn about the science behind our sleep improvement techniques
              </ListItem>
              <ListItem href="#" title="Success Stories">
                Read about how others improved their sleep with Azleep
              </ListItem>
              <ListItem href="#" title="Research">
                The sleep science that powers our application
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/app/onboarding">
            <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-white/10 text-white hover:bg-white/20 focus:bg-white/20")}>
              Get Started
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

// ListItem component for navigation menu entries
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    title: string;
  }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-purple-400/20 hover:text-white focus:bg-purple-400/20 focus:text-white",
            className
          )}
          {...props}
        >
          <div className="flex items-center text-white font-medium">
            <span>{title}</span>
            <ChevronRight className="ml-auto h-4 w-4 opacity-60" />
          </div>
          <p className="text-sm leading-snug text-white/70 line-clamp-2">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default AppNavigationMenu;
