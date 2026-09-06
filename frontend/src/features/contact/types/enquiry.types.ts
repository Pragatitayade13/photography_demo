export type EnquiryStatus =
  | "NEW"
  | "CONTACTED"
  | "IN_DISCUSSION"
  | "CONFIRMED"
  | "COMPLETED"
  | "DECLINED";

export type EnquiryPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export interface EnquiryItem {
  id: string;
  reference_number: string;
  name: string;
  email: string;
  phone?: string;
  enquiry_type: string;
  event_date?: string;
  location?: string;
  budget_range?: string;
  message: string;
  source?: string;
  source_project_id?: string;
  status: EnquiryStatus;
  priority: EnquiryPriority;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  responded_at?: string;
}

export interface EnquiryActivity {
  id: string;
  enquiry_id: string;
  action: string;
  description: string;
  old_value?: string;
  new_value?: string;
  created_at: string;
}

export interface CreateEnquiryDTO {
  name: string;
  email: string;
  phone?: string;
  enquiry_type: string;
  event_date?: string;
  location?: string;
  budget_range?: string;
  message: string;
  source?: string;
  source_project_id?: string;
  consent: boolean;
  honeypot?: string;
}

export interface EnquiryStats {
  total: number;
  new: number;
  in_discussion: number;
  confirmed: number;
}
