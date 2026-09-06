import React, { useState } from "react";
import {
  Mail,
  Phone,
  Search,
  ChevronRight,
  X,
  History,
  AlertCircle,
} from "lucide-react";
import { useInquiries } from "./inquiries/hooks/useInquiries";
import {
  EnquiryStatus,
  EnquiryPriority,
} from "../contact/types/enquiry.types";

export const InquiriesView: React.FC = () => {
  const {
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
    closeDetail,
    updateStatus,
    updatePriority,
    saveNote,
  } = useInquiries();

  const [noteInput, setNoteInput] = useState("");

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case "NEW":
        return "bg-accent/15 text-accent border-accent/30";
      case "CONTACTED":
        return "bg-blue-500/15 text-blue-400 border-blue-500/30";
      case "IN_DISCUSSION":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "CONFIRMED":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "COMPLETED":
        return "bg-purple-500/15 text-purple-400 border-purple-500/30";
      case "DECLINED":
        return "bg-danger/15 text-danger border-danger/30";
      default:
        return "bg-surface-raised text-secondary border-surface-border";
    }
  };

  const getPriorityBadge = (priority: EnquiryPriority) => {
    switch (priority) {
      case "URGENT":
        return "text-red-400 bg-red-500/10 border-red-500/30";
      case "HIGH":
        return "text-amber-400 bg-amber-500/10 border-amber-500/30";
      case "NORMAL":
        return "text-secondary bg-surface-raised border-surface-border";
      case "LOW":
        return "text-secondary/60 bg-surface-raised border-surface-border";
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center space-x-2 text-accent text-xs uppercase tracking-widest font-mono">
            <span>VS-10 Module</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-primary mt-1">
            Client Inquiries & Leads
          </h2>
          <p className="text-xs text-secondary mt-1">
            Review incoming commission requests, update booking pipeline statuses, and record private consultation notes.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-center space-x-3 text-danger text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-surface border border-surface-border space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-secondary font-medium">Total Inquiries</p>
          <p className="text-2xl font-sans font-semibold text-primary">{stats.total}</p>
        </div>
        <div className="p-5 rounded-xl bg-surface border border-surface-border space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-accent font-medium">New Requests</p>
          <p className="text-2xl font-sans font-semibold text-accent">{stats.new}</p>
        </div>
        <div className="p-5 rounded-xl bg-surface border border-surface-border space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-amber-400 font-medium">In Discussion</p>
          <p className="text-2xl font-sans font-semibold text-amber-400">{stats.in_discussion}</p>
        </div>
        <div className="p-5 rounded-xl bg-surface border border-surface-border space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-medium">Confirmed Bookings</p>
          <p className="text-2xl font-sans font-semibold text-emerald-400">{stats.confirmed}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-surface p-4 rounded-xl border border-surface-border">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            placeholder="Search by client name, email, location, or reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-raised border border-surface-border rounded-lg pl-9 pr-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface-raised border border-surface-border rounded-lg px-3 py-2 text-xs text-primary focus:outline-none focus:border-accent"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="IN_DISCUSSION">In Discussion</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="DECLINED">Declined</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-surface-raised border border-surface-border rounded-lg px-3 py-2 text-xs text-primary focus:outline-none focus:border-accent"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="NORMAL">Normal</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Main Inquiries Table */}
      <div className="bg-surface border border-surface-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs uppercase tracking-widest text-secondary font-mono animate-pulse">
            Loading Client Inquiries...
          </div>
        ) : enquiries.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Mail className="w-8 h-8 text-secondary/40 mx-auto" />
            <p className="text-sm text-primary">No inquiries matching filter criteria</p>
            <p className="text-xs text-secondary">Incoming contact forms will populate automatically here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-raised/60 text-secondary uppercase font-mono tracking-wider text-[10px] border-b border-surface-border">
                <tr>
                  <th className="px-6 py-3.5">Reference</th>
                  <th className="px-6 py-3.5">Client</th>
                  <th className="px-6 py-3.5">Discipline</th>
                  <th className="px-6 py-3.5">Event Date / Location</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Priority</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {enquiries.map((enq) => (
                  <tr
                    key={enq.id}
                    onClick={() => selectEnquiry(enq)}
                    className="hover:bg-surface-raised/40 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-accent text-[11px]">
                      {enq.reference_number}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-primary text-sm font-serif">{enq.name}</p>
                      <p className="text-secondary text-[11px] font-mono">{enq.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize px-2.5 py-1 rounded bg-surface-raised border border-surface-border text-secondary text-[11px]">
                        {enq.enquiry_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-y-0.5">
                      <p className="text-primary">{enq.event_date || "Flexible / TBD"}</p>
                      <p className="text-secondary text-[11px]">{enq.location || "Location not specified"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border ${getStatusBadge(enq.status)}`}>
                        {enq.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${getPriorityBadge(enq.priority)}`}>
                        {enq.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-secondary hover:text-accent p-1">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inquiry Detail Drawer / Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-surface border-l border-surface-border h-full flex flex-col overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-surface-border flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-accent uppercase tracking-widest">
                  {selectedEnquiry.reference_number}
                </span>
                <h3 className="font-serif text-xl font-light text-primary mt-0.5">
                  {selectedEnquiry.name}
                </h3>
              </div>
              <button
                onClick={closeDetail}
                className="p-1.5 text-secondary hover:text-primary rounded-md bg-surface-raised hover:bg-surface-raised/80"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              {/* Quick Contact Links */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`mailto:${selectedEnquiry.email}?subject=Regarding Your Inquiry ${selectedEnquiry.reference_number} — Alex Mercer Studio`}
                  className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-surface-raised border border-surface-border hover:border-accent text-primary text-xs rounded-lg transition-colors font-medium"
                >
                  <Mail className="w-3.5 h-3.5 text-accent" />
                  <span>Email Client</span>
                </a>
                {selectedEnquiry.phone ? (
                  <a
                    href={`tel:${selectedEnquiry.phone}`}
                    className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-surface-raised border border-surface-border hover:border-accent text-primary text-xs rounded-lg transition-colors font-medium"
                  >
                    <Phone className="w-3.5 h-3.5 text-accent" />
                    <span>Call Phone</span>
                  </a>
                ) : (
                  <div className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-surface-raised/40 border border-surface-border text-secondary/40 text-xs rounded-lg cursor-not-allowed">
                    <Phone className="w-3.5 h-3.5" />
                    <span>No Phone Provided</span>
                  </div>
                )}
              </div>

              {/* Status & Priority Controls */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-surface-raised/30 border border-surface-border">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-secondary font-mono">
                    Pipeline Status
                  </label>
                  <select
                    disabled={isUpdating}
                    value={selectedEnquiry.status}
                    onChange={(e) => updateStatus(selectedEnquiry.id, e.target.value as EnquiryStatus)}
                    className="w-full bg-surface-raised border border-surface-border rounded px-3 py-1.5 text-xs text-primary"
                  >
                    <option value="NEW">New</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="IN_DISCUSSION">In Discussion</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="DECLINED">Declined</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-secondary font-mono">
                    Client Priority
                  </label>
                  <select
                    disabled={isUpdating}
                    value={selectedEnquiry.priority}
                    onChange={(e) => updatePriority(selectedEnquiry.id, e.target.value as EnquiryPriority)}
                    className="w-full bg-surface-raised border border-surface-border rounded px-3 py-1.5 text-xs text-primary"
                  >
                    <option value="LOW">Low</option>
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-3">
                <h4 className="text-[11px] uppercase tracking-wider text-secondary font-mono">
                  Commission Details
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs bg-surface-raised/20 p-4 rounded-xl border border-surface-border">
                  <div>
                    <span className="text-secondary text-[10px] block">Discipline:</span>
                    <span className="capitalize font-medium text-primary">{selectedEnquiry.enquiry_type}</span>
                  </div>
                  <div>
                    <span className="text-secondary text-[10px] block">Target Date:</span>
                    <span className="font-medium text-primary">{selectedEnquiry.event_date || "Not Specified"}</span>
                  </div>
                  <div>
                    <span className="text-secondary text-[10px] block">Destination / Venue:</span>
                    <span className="font-medium text-primary">{selectedEnquiry.location || "Not Specified"}</span>
                  </div>
                  <div>
                    <span className="text-secondary text-[10px] block">Budget Range:</span>
                    <span className="font-medium text-accent">{selectedEnquiry.budget_range || "Flexible / Not Stated"}</span>
                  </div>
                </div>
              </div>

              {/* Client Message */}
              <div className="space-y-2">
                <h4 className="text-[11px] uppercase tracking-wider text-secondary font-mono">
                  Client Message
                </h4>
                <div className="p-4 rounded-xl bg-surface-raised/40 border border-surface-border text-xs text-secondary/90 leading-relaxed font-light whitespace-pre-wrap">
                  "{selectedEnquiry.message}"
                </div>
              </div>

              {/* Private Notes */}
              <div className="space-y-2">
                <h4 className="text-[11px] uppercase tracking-wider text-secondary font-mono flex items-center justify-between">
                  <span>Private Studio Notes</span>
                  <span className="text-[9px] text-secondary/60">Visible only to studio admins</span>
                </h4>
                <textarea
                  rows={3}
                  defaultValue={selectedEnquiry.admin_notes || ""}
                  placeholder="Record consultation outcomes, negotiated deliverables, or follow-up dates..."
                  onChange={(e) => setNoteInput(e.target.value)}
                  className="w-full bg-surface-raised border border-surface-border rounded-lg p-3 text-xs text-primary focus:outline-none focus:border-accent"
                />
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => saveNote(selectedEnquiry.id, noteInput || selectedEnquiry.admin_notes || "")}
                  className="px-4 py-1.5 bg-accent text-[#08080a] text-xs font-semibold rounded hover:bg-accent-hover transition-colors"
                >
                  Save Notes
                </button>
              </div>

              {/* Activity Timeline */}
              {activity.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-[11px] uppercase tracking-wider text-secondary font-mono flex items-center space-x-1.5">
                    <History className="w-3.5 h-3.5 text-accent" />
                    <span>Activity History</span>
                  </h4>
                  <div className="space-y-2 border-l border-surface-border pl-4 ml-1">
                    {activity.map((act) => (
                      <div key={act.id} className="text-xs space-y-0.5">
                        <p className="text-primary text-[11px]">{act.description}</p>
                        <p className="text-secondary/60 text-[10px] font-mono">
                          {new Date(act.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiriesView;
