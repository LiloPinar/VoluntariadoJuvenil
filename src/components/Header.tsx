import { Search, Globe, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HeaderProps {
  onMenuClick: () => void;
  currentPage: string;
}

export const Header = ({ onMenuClick, currentPage }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4 px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-secondary to-accent">
            <span className="text-xl font-bold text-white">V</span>
          </div>
          <div className="hidden flex-col md:flex">
            <h1 className="text-lg font-bold leading-none">VoluntariaJoven</h1>
            <span className="text-xs text-muted-foreground">{currentPage}</span>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-4 md:ml-8">
          <div className="relative hidden flex-1 md:block md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar proyectos..."
              className="w-full pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select defaultValue="es">
            <SelectTrigger className="w-[110px] gap-2">
              <Globe className="h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
};
