import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { enquiryService } from "../../../contact/services/enquiryService";
import {
  EnquiryItem,
  EnquiryStats,
  EnquiryStatus,
  EnquiryPriority,
  EnquiryActivity,
} from "../../../contact/types/enquiry.types";

export const useInquiries = () => {
  const [searchParams] = useSearchParams();
  const refParam = searchParams.get("ref");

  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [stats, setStats] = useState<EnquiryStats>({
    total: 0,
    new: 0,
    in_discussion: 0,
    confirmed: 0,
  });
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);
  const [activity, setActivity] = useState<EnquiryActivity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const loadEnquiries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await enquiryService.listEnquiries({
        status: statusFilter,
        priority: priorityFilter,
        search: searchQuery,
      });
      setEnquiries(data.enquiries);
      setStats(data.stats);

      // Auto-open if ?ref= is present in URL
      if (refParam && data.enquiries.length > 0) {
        const found = data.enquiries.find(
          (e) => e.reference_number.toLowerCase() === refParam.toLowerCase() || e.id === refParam
        );
        if (found) {
          selectEnquiry(found);
        }
      }
    } catch (err: any) {
      setError(err.error?.message || err.message || "Failed to load inquiries");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, priorityFilter, searchQuery, refParam]);

  useEffect(() => {
    loadEnquiries();
  }, [loadEnquiries]);

  const selectEnquiry = async (item: EnquiryItem) => {
    setSelectedEnquiry(item);
    try {
      const data = await enquiryService.getEnquiry(item.id);
      setSelectedEnquiry(data.enquiry);
      setActivity(data.activity);
    } catch (err: any) {
      console.warn("Could not load enquiry activity", err);
    }
  };

  const updateStatus = async (id: string, newStatus: EnquiryStatus) => {
    setIsUpdating(true);
    try {
      const updated = await enquiryService.updateStatus(id, newStatus);
      setEnquiries((prev) => prev.map((e) => (e.id === id ? updated : e)));
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry(updated);
      }
      await loadEnquiries();
    } catch (err: any) {
      setError("Failed to update inquiry status");
    } finally {
      setIsUpdating(false);
    }
  };

  const updatePriority = async (id: string, newPriority: EnquiryPriority) => {
    setIsUpdating(true);
    try {
      const updated = await enquiryService.updatePriority(id, newPriority);
      setEnquiries((prev) => prev.map((e) => (e.id === id ? updated : e)));
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry(updated);
      }
    } catch (err: any) {
      setError("Failed to update inquiry priority");
    } finally {
      setIsUpdating(false);
    }
  };

  const saveNote = async (id: string, notes: string) => {
    setIsUpdating(true);
    try {
      const updated = await enquiryService.addNote(id, notes);
      setEnquiries((prev) => prev.map((e) => (e.id === id ? updated : e)));
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry(updated);
      }
    } catch (err: any) {
      setError("Failed to save private notes");
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    enquiries,
    stats,
    selectedEnquiry,
    activity,
    isLoading,
    isUpdating,
    error,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    searchQuery,
    setSearchQuery,
    selectEnquiry,
    closeDetail: () => setSelectedEnquiry(null),
    updateStatus,
    updatePriority,
    saveNote,
    refresh: loadEnquiries,
  };
};
