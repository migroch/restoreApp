import React from "react";

const Pagination = ({
  guidanceItemsPerPage,
  totalGuidanceItems,
  paginate,
  currentPage,
}) => {
  const pageNumbers = [];

  for (
    let guidance = 1;
    guidance <= Math.ceil(totalGuidanceItems / guidanceItemsPerPage);
    guidance++
  ) {
    pageNumbers.push(guidance);
  }
  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) =>
          currentPage == number ? (
            <li key={number} className="page-item active">
              <a onClick={() => paginate(number)} className="page-link">
                {number}
              </a>
            </li>
          ) : (
            <li key={number} className="page-item">
              <a onClick={() => paginate(number)} className="page-link">
                {number}
              </a>
            </li>
          )
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
