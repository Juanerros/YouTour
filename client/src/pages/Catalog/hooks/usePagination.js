import { useState, useMemo } from 'react';

const usePagination = (items, itemsPerPage = 6) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginationData = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(items.length / itemsPerPage);

    return {
      currentItems,
      totalPages,
      indexOfFirstItem,
      indexOfLastItem
    };
  }, [items, currentPage, itemsPerPage]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToNextPage = () => {
    if (currentPage < paginationData.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    ...paginationData,
    paginate,
    goToNextPage,
    goToPrevPage,
    resetPagination
  };
};

export default usePagination; 