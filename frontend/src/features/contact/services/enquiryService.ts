import { apiClient } from "../../../services/apiClient";
import {
  CreateEnquiryDTO,
  EnquiryItem,
  EnquiryActivity,
  EnquiryStats,
  EnquiryStatus,
  EnquiryPriority,
} from "../types/enquiry.types";

export const enquiryService = {
  // Public Submission
  async submitEnquiry(data: CreateEnquiryDTO): Promise<{ reference_number: string; message: string }> {
    const res = await apiClient.post<{ reference_number: string; message: string }>(
      "/contact/enquiries",
      data
    );
    return res.data;
  },

  // Admin Inquiries
  async listEnquiries(params?: {
    status?: string;
    priority?: string;
    enquiry_type?: string;
    search?: string;
  }): Promise<{ enquiries: EnquiryItem[]; stats: EnquiryStats }> {
    const res = await apiClient.get<{ enquiries: EnquiryItem[]; stats: EnquiryStats }>(
      "/contact/admin/enquiries",
      { params }
    );
    return res.data;
  },

  async getEnquiry(id: string): Promise<{ enquiry: EnquiryItem; activity: EnquiryActivity[] }> {
    const res = await apiClient.get<{ enquiry: EnquiryItem; activity: EnquiryActivity[] }>(
      `/contact/admin/enquiries/${id}`
    );
    return res.data;
  },

  async updateStatus(id: string, status: EnquiryStatus): Promise<EnquiryItem> {
    const res = await apiClient.patch<EnquiryItem>(
      `/contact/admin/enquiries/${id}/status`,
      { status }
    );
    return res.data;
  },

  async updatePriority(id: string, priority: EnquiryPriority): Promise<EnquiryItem> {
    const res = await apiClient.patch<EnquiryItem>(
      `/contact/admin/enquiries/${id}/priority`,
      { priority }
    );
    return res.data;
  },

  async addNote(id: string, notes: string): Promise<EnquiryItem> {
    const res = await apiClient.post<EnquiryItem>(
      `/contact/admin/enquiries/${id}/notes`,
      { notes }
    );
    return res.data;
  },
};
