import React from "react";

const UsersListTableHeader = ({
  option,
  type,
}: {
  option: string;
  type: string;
}) => {
  if (type[0] === "M") {
    return (
      <tr className="usersRankingTableHeaderWrapper usersRankingTableItemWrapper  cells">
        <th style={{ width: "10%" }}>Rank</th>
        <th style={{ width: "30%" }}>Username</th>
        <th style={{ width: "10%" }}>Game Count</th>
        <th style={{ width: "10%" }}>
          Player <br /> Rating
        </th>
        {option === "G" && <th style={{ width: "10%" }}>Win Percentage</th>}
        {option !== "G" && (
          <>
            <th style={{ width: "20%" }}>
              Eligible Rewards <br />
              (in $ SHAH)
            </th>
            <th style={{ width: "20%" }}>Wallet Address</th>
          </>
        )}
      </tr>
    );
  } else {
    return (
      <tr className="usersRankingTableHeaderWrapper usersRankingTableItemWrapper  cells">
        <th style={{ width: "10%" }}>Rank</th>
        <th style={{ width: "30%" }}>Username</th>
        <th style={{ width: "10%" }}>Game Count</th>
        <th style={{ width: "10%" }}>
          Player <br /> Rating
        </th>
        <th style={{ width: "10%" }}>Win Percentage</th>
      </tr>
    );
  }
};

export default UsersListTableHeader;
