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
    const res = await apiClient.post<any>(
      "/contact/enquiries",
      data
    );
    return res.data?.data || res.data;
  },

  // Admin Inquiries
  async listEnquiries(params?: {
    status?: string;
    priority?: string;
    enquiry_type?: string;
    search?: string;
  }): Promise<{ enquiries: EnquiryItem[]; stats: EnquiryStats }> {
    const res = await apiClient.get<any>(
      "/contact/admin/enquiries",
      { params }
    );
    const payload = res.data?.data || res.data || {};
    return {
      enquiries: payload.enquiries || [],
      stats: payload.stats || { total: 0, new: 0, in_discussion: 0, confirmed: 0 },
    };
  },

  async getEnquiry(id: string): Promise<{ enquiry: EnquiryItem; activity: EnquiryActivity[] }> {
    const res = await apiClient.get<any>(
      `/contact/admin/enquiries/${id}`
    );
    const payload = res.data?.data || res.data || {};
    return {
      enquiry: payload.enquiry || payload,
      activity: payload.activity || [],
    };
  },

  async updateStatus(id: string, status: EnquiryStatus): Promise<EnquiryItem> {
    const res = await apiClient.patch<any>(
      `/contact/admin/enquiries/${id}/status`,
      { status }
    );
    const payload = res.data?.data || res.data;
    return payload?.enquiry || payload;
  },

  async updatePriority(id: string, priority: EnquiryPriority): Promise<EnquiryItem> {
    const res = await apiClient.patch<any>(
      `/contact/admin/enquiries/${id}/priority`,
      { priority }
    );
    const payload = res.data?.data || res.data;
    return payload?.enquiry || payload;
  },

  async addNote(id: string, notes: string): Promise<EnquiryItem> {
    const res = await apiClient.post<any>(
      `/contact/admin/enquiries/${id}/notes`,
      { notes }
    );
    const payload = res.data?.data || res.data;
    return payload?.enquiry || payload;
  },
};
