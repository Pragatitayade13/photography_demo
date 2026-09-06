import {
  EnquiryItem,
  EnquiryActivity,
  CreateEnquiryDTO,
  EnquiryStats,
  EnquiryStatus,
  EnquiryPriority,
} from "./contact.types.js";

let ENQUIRY_COUNTER = 103;

const INITIAL_ENQUIRIES: EnquiryItem[] = [
  {
    id: "enq-001",
    reference_number: "ENQ-2026-000101",
    name: "Eleanor & Christian Vance",
    email: "eleanor.vance@atelier-vance.com",
    phone: "+44 20 7946 0912",
    enquiry_type: "wedding",
    event_date: "2026-09-18",
    location: "Villa Balbiano, Lake Como, Italy",
    budget_range: "₹2,50,000 - ₹5,00,000",
    message: "We adore your medium-format chiaroscuro coverage of Lake Como. We are planning a three-day celebration with 120 guests and would love to reserve your studio for our weekend.",
    source: "portfolio",
    source_project_id: "lake-como-celebrations",
    status: "IN_DISCUSSION",
    priority: "HIGH",
    admin_notes: "Initial video consultation completed. Shared bespoke Italian monograph proposal.",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    responded_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "enq-002",
    reference_number: "ENQ-2026-000102",
    name: "Maison Saint-Honoré",
    email: "press@sainthonore-paris.fr",
    phone: "+33 1 42 68 55 12",
    enquiry_type: "editorial",
    event_date: "2026-10-05",
    location: "Place Vendôme Atelier, Paris",
    budget_range: "₹5,00,000+",
    message: "Requesting Alex Mercer for our Fall/Winter Haute Couture lookbook and cinematic short film documentation. 4 shoot days in Paris and Normandy.",
    source: "about",
    status: "NEW",
    priority: "URGENT",
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "enq-003",
    reference_number: "ENQ-2026-000103",
    name: "Julian & Hiroshi Sterling",
    email: "j.sterling@designsanctuary.jp",
    phone: "+81 3 5555 0143",
    enquiry_type: "architecture",
    event_date: "2026-11-12",
    location: "Arashiyama Villa, Kyoto",
    budget_range: "₹2,50,000 - ₹5,00,000",
    message: "Commissioning an architectural light monograph for our newly completed cantilevered cedar residence overlooking the Oi River.",
    source: "homepage",
    status: "CONFIRMED",
    priority: "NORMAL",
    admin_notes: "Contract signed, 50% deposit received. Travel logistics booked for Kyoto.",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    responded_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const INITIAL_ACTIVITIES: EnquiryActivity[] = [
  {
    id: "act-01",
    enquiry_id: "enq-001",
    action: "CREATED",
    description: "Enquiry submitted via website portfolio CTA",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act-02",
    enquiry_id: "enq-001",
    action: "STATUS_CHANGE",
    description: "Status updated from NEW to IN_DISCUSSION",
    old_value: "NEW",
    new_value: "IN_DISCUSSION",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act-03",
    enquiry_id: "enq-002",
    action: "CREATED",
    description: "High-priority enquiry received from Maison Saint-Honoré",
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act-04",
    enquiry_id: "enq-003",
    action: "STATUS_CHANGE",
    description: "Status updated to CONFIRMED after deposit clearance",
    old_value: "IN_DISCUSSION",
    new_value: "CONFIRMED",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

let IN_MEMORY_ENQUIRIES: EnquiryItem[] = JSON.parse(JSON.stringify(INITIAL_ENQUIRIES));
let IN_MEMORY_ACTIVITIES: EnquiryActivity[] = JSON.parse(JSON.stringify(INITIAL_ACTIVITIES));

export class ContactRepository {
  async createEnquiry(dto: CreateEnquiryDTO): Promise<EnquiryItem> {
    ENQUIRY_COUNTER += 1;
    const refNumber = `ENQ-2026-000${ENQUIRY_COUNTER}`;
    const newId = `enq-${Date.now()}`;

    const newEnquiry: EnquiryItem = {
      id: newId,
      reference_number: refNumber,
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      enquiry_type: dto.enquiry_type,
      event_date: dto.event_date,
      location: dto.location,
      budget_range: dto.budget_range,
      message: dto.message,
      source: dto.source || "direct",
      source_project_id: dto.source_project_id,
      status: "NEW",
      priority: "NORMAL",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    IN_MEMORY_ENQUIRIES.unshift(newEnquiry);

    IN_MEMORY_ACTIVITIES.unshift({
      id: `act-${Date.now()}`,
      enquiry_id: newId,
      action: "CREATED",
      description: `Enquiry received from ${dto.name} (${dto.enquiry_type})`,
      created_at: new Date().toISOString(),
    });

    return newEnquiry;
  }

  async listEnquiries(filter?: {
    status?: string;
    priority?: string;
    enquiry_type?: string;
    search?: string;
  }): Promise<EnquiryItem[]> {
    let result = [...IN_MEMORY_ENQUIRIES];

    if (filter) {
      if (filter.status && filter.status !== "ALL") {
        result = result.filter((e) => e.status === filter.status);
      }
      if (filter.priority && filter.priority !== "ALL") {
        result = result.filter((e) => e.priority === filter.priority);
      }
      if (filter.enquiry_type && filter.enquiry_type !== "ALL") {
        result = result.filter((e) => e.enquiry_type.toLowerCase() === filter.enquiry_type?.toLowerCase());
      }
      if (filter.search) {
        const q = filter.search.toLowerCase();
        result = result.filter(
          (e) =>
            e.name.toLowerCase().includes(q) ||
            e.email.toLowerCase().includes(q) ||
            e.reference_number.toLowerCase().includes(q) ||
            (e.location && e.location.toLowerCase().includes(q))
        );
      }
    }

    return result.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  async getEnquiryById(id: string): Promise<EnquiryItem | null> {
    const item = IN_MEMORY_ENQUIRIES.find((e) => e.id === id || e.reference_number === id);
    return item || null;
  }

  async updateStatus(id: string, status: EnquiryStatus): Promise<EnquiryItem> {
    const item = await this.getEnquiryById(id);
    if (!item) throw new Error("Enquiry not found");

    const oldStatus = item.status;
    item.status = status;
    item.updated_at = new Date().toISOString();
    if (!item.responded_at && status !== "NEW") {
      item.responded_at = new Date().toISOString();
    }

    IN_MEMORY_ACTIVITIES.unshift({
      id: `act-${Date.now()}`,
      enquiry_id: item.id,
      action: "STATUS_CHANGE",
      description: `Status changed from ${oldStatus} to ${status}`,
      old_value: oldStatus,
      new_value: status,
      created_at: new Date().toISOString(),
    });

    return item;
  }

  async updatePriority(id: string, priority: EnquiryPriority): Promise<EnquiryItem> {
    const item = await this.getEnquiryById(id);
    if (!item) throw new Error("Enquiry not found");

    const oldPriority = item.priority;
    item.priority = priority;
    item.updated_at = new Date().toISOString();

    IN_MEMORY_ACTIVITIES.unshift({
      id: `act-${Date.now()}`,
      enquiry_id: item.id,
      action: "PRIORITY_CHANGE",
      description: `Priority updated from ${oldPriority} to ${priority}`,
      old_value: oldPriority,
      new_value: priority,
      created_at: new Date().toISOString(),
    });

    return item;
  }

  async addNote(id: string, notes: string): Promise<EnquiryItem> {
    const item = await this.getEnquiryById(id);
    if (!item) throw new Error("Enquiry not found");

    item.admin_notes = notes;
    item.updated_at = new Date().toISOString();

    IN_MEMORY_ACTIVITIES.unshift({
      id: `act-${Date.now()}`,
      enquiry_id: item.id,
      action: "NOTE_ADDED",
      description: "Private note updated by photographer",
      created_at: new Date().toISOString(),
    });

    return item;
  }

  async getActivity(enquiryId: string): Promise<EnquiryActivity[]> {
    return IN_MEMORY_ACTIVITIES.filter((a) => a.enquiry_id === enquiryId).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  async getStats(): Promise<EnquiryStats> {
    return {
      total: IN_MEMORY_ENQUIRIES.length,
      new: IN_MEMORY_ENQUIRIES.filter((e) => e.status === "NEW").length,
      in_discussion: IN_MEMORY_ENQUIRIES.filter((e) => e.status === "IN_DISCUSSION").length,
      confirmed: IN_MEMORY_ENQUIRIES.filter((e) => e.status === "CONFIRMED").length,
    };
  }
}
