import React from "react";
import { Pagination } from "react-bootstrap";
import "./PaginationComponent.css";

const PaginationComponent = ({ currentPage, totalPages, onPageChange, 
  pageRangeStart, onPageRangeStartChange, pageRangeEnd, onPageRangeEndChange 
}) => {
  const pages = [];
  const offset = 4;

  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => onPageChange(i)}
        linkClassName={`${
          i === currentPage ? "bg-secondary text-warning" : "text-secondary"
        }`}
      >
        <div>{i}</div>
      </Pagination.Item>
    );
  }

  const handleFirst = () => {
    onPageChange(1);
    onPageRangeStartChange(1);
    onPageRangeEndChange(offset);
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      if (currentPage == pageRangeStart) {
        onPageRangeStartChange((pageRangeStart) =>
          pageRangeStart > 1 && Math.max(pageRangeStart - offset, 1)
        );
        onPageRangeEndChange((pageRangeEnd) =>
          pageRangeEnd > offset
            && Math.max(pageRangeEnd - offset, offset)
        );
      }
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      if (currentPage == pageRangeEnd) {
        onPageRangeStartChange((pageRangeStart) =>
             pageRangeStart + offset
        );
        onPageRangeEndChange((pageRangeEnd) =>
            pageRangeEnd + offset
        );
      }
    }
  };

  const handleLast = () => {
    onPageChange(totalPages);
    onPageRangeStartChange(totalPages - offset + 1);
    onPageRangeEndChange(totalPages);
  };

  return (
    <Pagination>
      <Pagination.First
        onClick={handleFirst}
        disabled={currentPage == 1}
        linkClassName="text-secondary"
      />
      <Pagination.Prev
        onClick={handlePrev}
        disabled={currentPage == 1}
        linkClassName="text-secondary"
      />
      {pages.slice(pageRangeStart - 1, pageRangeEnd)}
      <Pagination.Next
        onClick={handleNext}
        disabled={currentPage == totalPages}
        linkClassName="text-secondary"
      />
      <Pagination.Last
        onClick={handleLast}
        disabled={currentPage == totalPages}
        linkClassName="text-secondary"
      />
    </Pagination>
  );
};

export default PaginationComponent;
