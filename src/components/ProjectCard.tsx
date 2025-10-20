import { Clock, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  title: string;
  description: string;
  category: "social" | "environmental" | "educational";
  hours: number;
  participants: number;
  location: string;
  image: string;
}

const categoryColors = {
  social: "bg-accent text-accent-foreground",
  environmental: "bg-secondary text-secondary-foreground",
  educational: "bg-primary text-primary-foreground",
};

const categoryLabels = {
  social: "Social",
  environmental: "Ambiental",
  educational: "Educativo",
};

export const ProjectCard = ({
  title,
  description,
  category,
  hours,
  participants,
  location,
  image,
}: ProjectCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge
          className={`absolute right-4 top-4 ${categoryColors[category]}`}
        >
          {categoryLabels[category]}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{hours}h</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{participants} voluntarios</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-primary hover:bg-primary-hover">
          Inscribirse
        </Button>
      </CardFooter>
    </Card>
  );
};
