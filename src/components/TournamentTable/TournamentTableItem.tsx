import React from "react";
import playImg from "../../assets/images/play.png";

interface Props {
  data: any;
  type: number
}
const TournamentTableItem = ({ data, type }: Props) => {

  const itemClick = (dataId: string) => {
    console.log(dataId);
  };

  return (
    <tr
      onClick={() => itemClick(data.id)}
      className={`tournamentTableItemWrapper cells`}
    >
      <td>
        <div>
          {type === 1 && <img src={playImg} />}
          <span>{data.name}</span>
        </div>
      </td>
      <td>{data.duration}</td>
      <td>{data.start_time}</td>
      <td>{data.time_control}</td>
      <td>{data.participants}</td>
      <td>{data.mode}</td>
    </tr>
  );
};

export default TournamentTableItem;
