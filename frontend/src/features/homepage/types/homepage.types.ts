import { Photo } from "../../photos/types/photo.types";
import { Project } from "../../projects/types/project.types";
import { Category } from "../../categories/types/category.types";

export interface HomepageSection {
  id: string;
  section_key: string;
  title: string;
  is_visible: boolean;
  sort_order: number;
  configuration: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PublicHomepageSection {
  section_key: string;
  title: string;
  sort_order: number;
  configuration: Record<string, any>;
  data?: {
    projects?: Project[];
    categories?: Category[];
    photos?: Photo[];
  };
}

export interface PublicHomepageData {
  sections: PublicHomepageSection[];
}
