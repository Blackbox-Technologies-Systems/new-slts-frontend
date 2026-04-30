"use client";

import { useUI } from "@/hooks";
import { MODAL_KEYS } from "@/constants";
import { CreateViolationModal } from "@/components/dashboard/violations/CreateViolationModal";
import { GlobalFilterModal } from "@/components/dashboard/GlobalFilterModal";

/**
 * SharedModals — mount this ONCE in DashboardLayout.
 * To add a new modal:
 *   1. Add its key to MODAL_KEYS in constants/index.ts
 *   2. Build the modal component using the Dialog primitives
 *   3. Import it here and add one line inside the fragment below
 */
export function SharedModals() {
  const { activeModal } = useUI();

  // Nothing mounted at all if no modal is active — zero DOM overhead
  if (!activeModal) return null;

  return (
    <>
      {activeModal === MODAL_KEYS.CREATE_VIOLATION && <CreateViolationModal />}
      {activeModal === MODAL_KEYS.GLOBAL_FILTER && <GlobalFilterModal />}
    </>
  );
}