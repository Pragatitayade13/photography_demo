import { HomepageRepository } from "./homepage.repository.js";
import { HomepageSectionEntity, PublicHomepagePayload } from "./homepage.types.js";
import { ProjectRepository } from "../projects/project.repository.js";
import { CategoryRepository } from "../categories/category.repository.js";
import { PhotoRepository } from "../photos/photo.repository.js";
import { DashboardService } from "../dashboard/dashboard.service.js";

export class HomepageService {
  private homepageRepository: HomepageRepository;
  private projectRepository: ProjectRepository;
  private categoryRepository: CategoryRepository;
  private photoRepository: PhotoRepository;
  private dashboardService: DashboardService;

  constructor() {
    this.homepageRepository = new HomepageRepository();
    this.projectRepository = new ProjectRepository();
    this.categoryRepository = new CategoryRepository();
    this.photoRepository = new PhotoRepository();
    this.dashboardService = new DashboardService();
  }

  async getPublicHomepage(): Promise<PublicHomepagePayload> {
    const allSections = await this.homepageRepository.findAll();
    const visibleSections = allSections.filter((s) => s.is_visible);

    const populatedSections = await Promise.all(
      visibleSections.map(async (sec) => {
        const item: any = {
          section_key: sec.section_key,
          title: sec.title,
          sort_order: sec.sort_order,
          configuration: sec.configuration,
          data: {},
        };

        if (sec.section_key === "featured_projects") {
          const config = sec.configuration;
          const allProjects = await this.projectRepository.findAll({ publicOnly: true });

          let projects = [];
          if (config.project_ids && config.project_ids.length > 0) {
            projects = config.project_ids
              .map((id: string) => allProjects.find((p) => p.id === id))
              .filter(Boolean);
          }
          if (projects.length === 0) {
            projects = allProjects.filter((p) => p.is_featured).slice(0, config.max_display || 3);
          }
          if (projects.length === 0) {
            projects = allProjects.slice(0, config.max_display || 3);
          }
          item.data.projects = projects;
        } else if (sec.section_key === "categories") {
          const categories = await this.categoryRepository.findAll({ publicOnly: true });
          item.data.categories = categories;
        } else if (sec.section_key === "selected_work") {
          const config = sec.configuration;
          const { photos: allPhotos } = await this.photoRepository.findAll({ publicOnly: true });

          let photos = [];
          if (config.photo_ids && config.photo_ids.length > 0) {
            photos = config.photo_ids
              .map((id: string) => allPhotos.find((p) => p.id === id))
              .filter(Boolean);
          }
          if (photos.length === 0) {
            photos = allPhotos.filter((p) => p.is_featured).slice(0, config.max_display || 4);
          }
          if (photos.length === 0) {
            photos = allPhotos.slice(0, config.max_display || 4);
          }
          item.data.photos = photos;
        }

        return item;
      })
    );

    return {
      sections: populatedSections,
    };
  }

  async getAllSections(): Promise<HomepageSectionEntity[]> {
    return this.homepageRepository.findAll();
  }

  async getSectionByKey(sectionKey: string): Promise<HomepageSectionEntity> {
    const section = await this.homepageRepository.findByKey(sectionKey);
    if (!section) {
      const error: any = new Error(`Homepage section '${sectionKey}' not found`);
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }
    return section;
  }

  async updateSection(
    sectionKey: string,
    updates: Partial<HomepageSectionEntity>,
    adminId?: string
  ): Promise<HomepageSectionEntity> {
    const updated = await this.homepageRepository.update(sectionKey, updates);
    if (!updated) {
      const error: any = new Error("Failed to update homepage section");
      error.statusCode = 500;
      throw error;
    }

    await this.dashboardService.recordActivity(
      "UPDATE",
      "HOMEPAGE",
      `Updated homepage section: "${updated.title}"`,
      adminId
    );

    return updated;
  }

  async toggleVisibility(
    sectionKey: string,
    isVisible: boolean,
    adminId?: string
  ): Promise<HomepageSectionEntity> {
    const updated = await this.homepageRepository.update(sectionKey, { is_visible: isVisible });
    if (!updated) {
      const error: any = new Error("Failed to toggle section visibility");
      error.statusCode = 500;
      throw error;
    }

    await this.dashboardService.recordActivity(
      "UPDATE",
      "HOMEPAGE",
      `Set section "${updated.title}" to ${isVisible ? "visible" : "hidden"}`,
      adminId
    );

    return updated;
  }

  async reorderSections(
    items: { section_key: string; sort_order: number }[],
    adminId?: string
  ): Promise<void> {
    await this.homepageRepository.reorder(items);
    await this.dashboardService.recordActivity(
      "UPDATE",
      "HOMEPAGE",
      `Reordered homepage sections`,
      adminId
    );
  }

  async resetSections(adminId?: string): Promise<HomepageSectionEntity[]> {
    const reset = await this.homepageRepository.resetToDefault();
    await this.dashboardService.recordActivity(
      "UPDATE",
      "HOMEPAGE",
      `Reset homepage layout to default`,
      adminId
    );
    return reset;
  }
}
