"use client";

import { useState, useRef } from "react";
import {
  X, ChevronDown, Calendar, Upload,
  Loader2, ChevronUp, Trash2, FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useUI } from "@/hooks";
import { ViolationFormData, SectionHeaderProps, SelectFieldProps, UploadFile } from "@/types/index";

// ─── Upload File Type ─────────────────────────────────────────────────────────


function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

// ─── File Row ─────────────────────────────────────────────────────────────────

function FileRow({
  uploadFile,
  onRemove,
}: {
  uploadFile: UploadFile;
  onRemove: () => void;
}) {
  const { file, progress } = uploadFile;
  const isDone = progress >= 100;

  return (
    <div className="mt-4">
      {/* File info row */}
      <div className="flex items-center gap-3">
        {/* PDF icon badge */}
        <div className="h-9 w-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
          <FileText className="h-5 w-5 text-red-500" />
        </div>

        {/* Name + size */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {file.name.replace(/\.[^/.]+$/, "")}
          </p>
          <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
        </div>

        {/* Remove — red circle X while uploading, trash when done */}
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0"
          aria-label="Remove file"
        >
          {isDone ? (
            <Trash2 className="h-5 w-5 text-red-500 hover:text-red-600 transition-colors" />
          ) : (
            <div className="h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors">
              <X className="h-3.5 w-3.5 text-white" />
            </div>
          )}
        </button>
      </div>

      {/* Progress bar — thin hairline, full width, only while uploading */}
      {!isDone && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-muted-foreground text-sm leading-none select-none">|</span>
          <div className="flex-1 h-[2px] bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0B1629] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-7 text-right shrink-0">
            {progress}%
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Reusable Select ──────────────────────────────────────────────────────────

function SelectField({
  label,
  placeholder,
  required,
  options = [],
  value,
  onChange,
  className,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-xs text-muted-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          className={cn(
            "w-full flex items-center justify-between rounded-lg border border-input bg-background px-4 py-3 text-sm",
            "hover:border-[#1B3A6B]/40 hover:bg-[#1B3A6B]/5 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/20 transition-colors",
            value ? "text-foreground" : "text-muted-foreground"
          )}
        >
          <span>{value || placeholder}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform shrink-0",
              open && "rotate-180"
            )}
          />
        </button>

        {open && options.length > 0 && (
          <div className="absolute z-[60] mt-1 w-full rounded-lg border border-border bg-card shadow-lg overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-[#0B1629] hover:text-white transition-colors"
                onClick={() => { onChange(opt); setOpen(false); }}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ title, isOpen, onToggle, noBorder }: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-3 cursor-pointer select-none",
        !noBorder && "border-b border-border"
      )}
      onClick={onToggle}
    >
      <h3 className="font-semibold text-base text-foreground">{title}</h3>
      {isOpen
        ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
        : <ChevronDown className="h-4 w-4 text-muted-foreground" />
      }
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export function CreateViolationModal() {
  const { activeModal, closeModal } = useUI();
  const isOpen = activeModal === "create-violation";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vehicleOpen, setVehicleOpen] = useState(true);
  const [offenceOpen, setOffenceOpen] = useState(true);
  const [filesOpen, setFilesOpen] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Separate state for upload files (with progress) from form data
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);

  const [form, setForm] = useState<ViolationFormData>({
    plateNumber: "",
    plateType: "",
    plateColor: "",
    vehicleBrand: "",
    vehicleType: "",
    vehicleColor: "",
    offence: "",
    eventType: "",
    violationDate: "",
    zone: "",
    command: "",
    offenderFirstName: "",
    offenderSurname: "",
    phoneNumber: "",
    emailAddress: "",
    files: [],
  });

  const set = (key: keyof ViolationFormData) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Simulate upload progress per file
  const simulateProgress = (index: number) => {
    const interval = setInterval(() => {
      setUploadFiles((prev) => {
        const updated = [...prev];
        if (!updated[index]) { clearInterval(interval); return prev; }
        const next = Math.min(
          updated[index].progress + Math.floor(Math.random() * 15 + 5),
          100
        );
        updated[index] = { ...updated[index], progress: next };
        if (next >= 100) clearInterval(interval);
        return updated;
      });
    }, 200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setUploadFiles((prev) => {
      const startIndex = prev.length;
      const newEntries: UploadFile[] = selected.map((f) => ({ file: f, progress: 0 }));
      newEntries.forEach((_, i) => simulateProgress(startIndex + i));
      return [...prev, ...newEntries];
    });
    setForm((prev) => ({ ...prev, files: [...prev.files, ...selected] }));
    // reset so same file can be re-added
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setUploadFiles((prev) => prev.filter((_, i) => i !== index));
    setForm((prev) => ({ ...prev, files: prev.files.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // NOTE: Replace with real API call once endpoint is live:
      // const formData = new FormData();
      // Object.entries(form).forEach(([k, v]) => {
      //   if (k === "files") (v as File[]).forEach((f) => formData.append("files", f));
      //   else formData.append(k, v as string);
      // });
      // await apiClient.post("/violations", formData);
      await new Promise((res) => setTimeout(res, 1200));
      closeModal();
    } catch (err) {
      console.error("Failed to create violation:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-violation-title"
        className={cn(
          "fixed z-50 top-0 right-0 h-[90vh]",
          "w-full max-w-[480px] md:w-[33%]",
          "bg-white dark:bg-card shadow-2xl",
          "flex flex-col mt-16 mr-8",
          "animate-in slide-in-from-right duration-300"
        )}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={closeModal}
          className="absolute top-4 right-4 z-10 h-6 w-6 rounded-full bg-[#94A3B8] hover:bg-[#1B3A6B] flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="h-3 w-3 text-white" />
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <h2 id="create-violation-title" className="text-xl font-bold text-foreground">
            Create Violation
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Fill in the details to record a new traffic violation
          </p>
        </div>

        {/* Scrollable form body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="overflow-y-auto flex-1 px-6 py-4 space-y-5">

            {/* ── Vehicle Info Section ─────────────────────── */}
            <div>
              <SectionHeader
                title="Vehicle Info Section"
                isOpen={vehicleOpen}
                onToggle={() => setVehicleOpen((p) => !p)}
                noBorder
              />
              {vehicleOpen && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-4 mt-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-muted-foreground">
                      Enter Plate Number <span className="text-destructive">*</span>
                    </label>
                    <Input
                      placeholder="e.g 1213-fxb"
                      value={form.plateNumber}
                      onChange={(e) => set("plateNumber")(e.target.value)}
                      className="rounded-lg hover:border-[#1B3A6B]/40 hover:bg-[#1B3A6B]/5 focus-visible:ring-[#1B3A6B]/20"
                      required
                    />
                  </div>
                  <SelectField label="Select Plate Type" placeholder="e.g Army" required
                    options={["Army", "Police", "Civil", "Commercial", "Private"]}
                    value={form.plateType} onChange={set("plateType")} />
                  <SelectField label="Select Plate Color" placeholder="e.g Red" required
                    options={["Red", "White", "Black", "Blue", "Yellow", "Green"]}
                    value={form.plateColor} onChange={set("plateColor")} />
                  <SelectField label="Select Vehicle Brand" placeholder="e.g Acura" required
                    options={["Acura", "Toyota", "Honda", "Ford", "BMW", "Mercedes", "Kia", "Hyundai"]}
                    value={form.vehicleBrand} onChange={set("vehicleBrand")} />
                  <SelectField label="Select Vehicle Type" placeholder="Select plate" required
                    options={["Sedan", "SUV", "Pickup", "Bus", "Truck", "Motorcycle"]}
                    value={form.vehicleType} onChange={set("vehicleType")} />
                  <SelectField label="Select Vehicle Color" placeholder="e.g Red" required
                    options={["Red", "White", "Black", "Blue", "Silver", "Grey", "Green"]}
                    value={form.vehicleColor} onChange={set("vehicleColor")} />
                </div>
              )}
            </div>

            <div className="border-t border-border" />

            {/* ── Offence Section ──────────────────────────── */}
            <div>
              <SectionHeader
                title="Offence Section"
                isOpen={offenceOpen}
                onToggle={() => setOffenceOpen((p) => !p)}
              />
              {offenceOpen && (
                <div className="mt-3 space-y-4">
                  <SelectField label="Select Offence" placeholder="e.g Ambulance/Towing service" required
                    options={["Ambulance/Towing service", "Obstruction on Highway", "Traffic Light Violation",
                      "Illegal Parking", "Speeding", "Wrong Way Driving", "Overloading", "Driving Without License"]}
                    value={form.offence} onChange={set("offence")} />
                  <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                    <SelectField label="Select Event Type" placeholder="e.g Cross line at red light" required
                      options={["Cross line at red light", "Speeding in school zone", "No seat belt",
                        "Using phone while driving", "Drunk driving"]}
                      value={form.eventType} onChange={set("eventType")} />
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-muted-foreground">
                        Select Violation Date <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <Input type="date" value={form.violationDate}
                          onChange={(e) => set("violationDate")(e.target.value)}
                          className="rounded-lg pr-10 hover:border-[#1B3A6B]/40 hover:bg-[#1B3A6B]/5" required />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                    <SelectField label="Select Zone" placeholder="e.g Kaduna Center" required
                      options={["Kaduna Center", "Kaduna North", "Kaduna South", "Zaria", "Lagos Island", "Lagos Mainland", "Abuja Central"]}
                      value={form.zone} onChange={set("zone")} />
                    <SelectField label="Select Command" placeholder="e.g Acura" required
                      options={["Zone A", "Zone B", "Zone C", "North Command", "South Command"]}
                      value={form.command} onChange={set("command")} />
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-muted-foreground">Offender First Name</label>
                      <Input placeholder="e.g Tunde" value={form.offenderFirstName}
                        onChange={(e) => set("offenderFirstName")(e.target.value)}
                        className="rounded-lg hover:border-[#1B3A6B]/40 hover:bg-[#1B3A6B]/5" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-muted-foreground">Offender Surname</label>
                      <Input placeholder="e.g Samuel" value={form.offenderSurname}
                        onChange={(e) => set("offenderSurname")(e.target.value)}
                        className="rounded-lg hover:border-[#1B3A6B]/40 hover:bg-[#1B3A6B]/5" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-muted-foreground">Enter Phone Number</label>
                      <Input placeholder="e.g 8102XXXXXX12" value={form.phoneNumber}
                        onChange={(e) => set("phoneNumber")(e.target.value)}
                        className="rounded-lg hover:border-[#1B3A6B]/40 hover:bg-[#1B3A6B]/5" type="tel" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-muted-foreground">Enter Email Address</label>
                      <Input placeholder="e.g Samuel@gmail.com" value={form.emailAddress}
                        onChange={(e) => set("emailAddress")(e.target.value)}
                        className="rounded-lg hover:border-[#1B3A6B]/40 hover:bg-[#1B3A6B]/5" type="email" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-border" />

            {/* ── Offence Files Section ─────────────────────── */}
            <div>
              <SectionHeader
                title="Offence Files Section"
                isOpen={filesOpen}
                onToggle={() => setFilesOpen((p) => !p)}
              />
              {filesOpen && (
                <div className="mt-3">
                  <label className="text-xs text-muted-foreground block mb-1.5">
                    Upload Files
                  </label>

                  {/* Choose Files box */}
                  <div className="rounded-lg border border-input bg-background p-3 min-h-[52px] flex items-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs gap-1.5 hover:bg-[#1B3A6B]/5 hover:border-[#1B3A6B]/40"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Choose Files
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*,video/*,.pdf,.doc,.docx"
                    />
                  </div>

                  {/* File rows rendered below the input box */}
                  {uploadFiles.map((uf, i) => (
                    <FileRow
                      key={`${uf.file.name}-${i}`}
                      uploadFile={uf}
                      onRemove={() => removeFile(i)}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border shrink-0">
            <Button type="button" variant="outline" onClick={closeModal} disabled={isSubmitting}
              className="min-w-[88px] hover:bg-[#1B3A6B]/5 hover:border-[#1B3A6B]/40">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}
              className="min-w-[88px] bg-[#0B1629] text-white hover:bg-[#1B3A6B]">
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" />Submitting...</>
              ) : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
