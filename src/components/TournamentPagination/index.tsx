import React from "react";

interface Props {
  curpage: number;
  onTransition: () => void;
}

const TournamentPagination = ({ curpage, onTransition }: Props) => {
  return (
    <div className="paginationContainer">
      <div className="pagination-buttons">
        <button onClick={() => onTransition(curpage - 1)}>
          <svg width="13" height="21" viewBox="0 0 13 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1L2 10.5531L12 20" stroke="#CCA66A" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <button onClick={() => onTransition(curpage + 1)}>
          <svg width="13" height="21" viewBox="0 0 13 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L11 10.5531L1 20" stroke="#CCA66A" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TournamentPagination;
