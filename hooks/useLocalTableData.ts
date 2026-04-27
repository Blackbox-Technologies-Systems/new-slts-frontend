import { useState, useMemo } from "react";
import type { DateRange } from "react-day-picker";

interface UseLocalTableDataProps<T> {
  data: T[];
  itemsPerPage?: number;
  filterFn?: (item: T, searchQuery: string, dateRange: DateRange | undefined) => boolean;
}

export function useLocalTableData<T>({
  data,
  itemsPerPage = 10,
  filterFn,
}: UseLocalTableDataProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Automatically reset to page 1 when search query changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
    setCurrentPage(1);
  };

  const filteredData = useMemo(() => {
    if (!filterFn) return data;
    return data.filter((item) => filterFn(item, searchQuery, dateRange));
  }, [data, filterFn, searchQuery, dateRange]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    return filteredData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredData, currentPage, itemsPerPage]);

  const toggleRowSelection = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const toggleAllRows = (itemIdsOnPage: string[]) => {
    if (selectedRows.size === itemIdsOnPage.length && itemIdsOnPage.length > 0) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(itemIdsOnPage));
    }
  };

  const clearSelection = () => {
    setSelectedRows(new Set());
  };

  return {
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery: handleSearchChange,
    dateRange,
    setDateRange: handleDateChange,
    selectedRows,
    toggleRowSelection,
    toggleAllRows,
    clearSelection,
    totalPages,
    totalItems: filteredData.length,
    paginatedData,
  };
}
