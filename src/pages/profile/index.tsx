import React, { useEffect, useState } from "react";

import { Actions, Actions as userActions } from "../../store/user/user.action";
import Matches from "../../components/Matches";
import ProfileSidebar from "../../components/ProfileSidebar";
import { IAppState } from "../../store/reducers";
import { IUser } from "../../store/user/user.interfaces";
import { connect, useDispatch } from "react-redux";
import CloseIcon from "../../assets/images/close-icon.png";
import { navigate } from "gatsby";
import UserEditInfo from "../../components/UserEditInfo";
import ProfileSummary from "../../components/ProfileSummary";
import AnotherThing from "../../components/AnotherThing";
import ProfileDateRange from "../../components/ProfileDateRange";
interface Props {
  currentUser: IUser;
}

interface IActionProps {
  fetchCurrentUser: typeof userActions.fetchCurrentUser;
}

const Profile = ({ currentUser, fetchCurrentUser }: Props & IActionProps) => {
  useEffect(() => {
    if (currentUser?.Id && fetchCurrentUser) fetchCurrentUser();
  }, [fetchCurrentUser]);
  const months: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  let currentDate: number = new Date().getDate();
  let currentMonth: number = new Date().getMonth();
  let currentYear: number = new Date().getFullYear();
  let daysInMonth: number = new Date(
    currentYear,
    currentMonth + 1,
    0
  ).getDate();
  let dateRange: string = currentDate < 15 ? "1-15" : `16-${daysInMonth}`;
  let dateString: string = `${dateRange} ${months[currentMonth]} ${currentYear}`;
  const [startDate, setStartDate] = useState(dateString);

  // console.log(fetchCurrentUser);
  // return <UserEditInfo />;
  const dispatch = useDispatch();
  useEffect(() => {
    console.log(
      "Dates ",
      new Date(
        +startDate.split(" ")[2],
        months.indexOf(startDate.split(" ")[1]),
        +startDate.split(" ")[0].split("-")[0]
      ),
      new Date(
        +startDate.split(" ")[2],
        months.indexOf(startDate.split(" ")[1]),
        +startDate.split(" ")[0].split("-")[1]
      )
    );
    dispatch(
      Actions.fetchUserStatsDateRange({
        beginDate: new Date(
          +startDate.split(" ")[2],
          months.indexOf(startDate.split(" ")[1]),
          +startDate.split(" ")[0].split("-")[0]
        ).getTime(),
        endDate: new Date(
          +startDate.split(" ")[2],
          months.indexOf(startDate.split(" ")[1]),
          +startDate.split(" ")[0].split("-")[1]
        ).getTime(),
      })
    );
  }, [startDate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2vmin",
        alignItems: "center",
        flex: "1",
        marginBottom: "4vmin",
        maxWidth: "100%",
      }}
    >
      <div className={"profileWrapper"}>
        <ProfileSidebar currentUser={currentUser} />
        <div className="profileOverall">
          {!currentUser ? (
            <div></div>
          ) : currentUser.GuestId ? (
            <div className="logged-in-feature">
              This area is not available for guests.
            </div>
          ) : (
            <>
              <ProfileDateRange
                title={startDate}
                onClickNext={() => {
                  if (startDate === dateString) return;
                  if (+startDate.split(" ")[0].split("-")[1] === 15) {
                    let newDaysInMonth: number = new Date(
                      +startDate.split(" ")[2],
                      months.indexOf(startDate.split(" ")[1]) + 1,
                      0
                    ).getDate();
                    return setStartDate(
                      `16-${newDaysInMonth} ${startDate
                        .split(" ")
                        .slice(1)
                        .join(" ")}`
                    );
                  }
                  let newMonth: number;
                  let newYear: number;
                  if (months.indexOf(startDate.split(" ")[1]) === 11) {
                    newMonth = 0;
                    newYear = parseInt(startDate.split(" ")[2]) + 1;
                  } else {
                    newMonth = months.indexOf(startDate.split(" ")[1]) + 1;
                    newYear = +startDate.split(" ")[2];
                  }
                  let newDaysInMonth: number = new Date(
                    newYear,
                    newMonth,
                    0
                  ).getDate();
                  let newDateRange: string =
                    +startDate.split(" ")[0].split("-")[1] > 15
                      ? "1-15"
                      : `16-${newDaysInMonth}`;
                  let newDateString: string = `${newDateRange} ${months[newMonth]} ${newYear}`;
                  setStartDate(newDateString);
                }}
                onClickPrev={() => {
                  if (+startDate.split(" ")[0].split("-")[1] > 15) {
                    return setStartDate(
                      `1-15 ${startDate.split(" ").slice(1).join(" ")}`
                    );
                  }
                  let newMonth: number;
                  let newYear: number;
                  if (months.indexOf(startDate.split(" ")[1]) === 0) {
                    newMonth = 11;
                    newYear = parseInt(startDate.split(" ")[2]) - 1;
                  } else {
                    newMonth = months.indexOf(startDate.split(" ")[1]) - 1;
                    newYear = +startDate.split(" ")[2];
                  }
                  let newDaysInMonth: number = new Date(
                    newYear,
                    newMonth + 1,
                    0
                  ).getDate();
                  let newDateRange: string = `16-${newDaysInMonth}`;
                  let newDateString: string = `${newDateRange} ${months[newMonth]} ${newYear}`;
                  setStartDate(newDateString);
                }}
              />
              <div className="summaryContainer">
                <ProfileSummary />
                <AnotherThing />
              </div>
              <Matches
                endDate={new Date(
                  +startDate.split(" ")[2],
                  months.indexOf(startDate.split(" ")[1]),
                  +startDate.split(" ")[0].split("-")[1]
                ).getTime()}
                startDate={new Date(
                  +startDate.split(" ")[2],
                  months.indexOf(startDate.split(" ")[1]),
                  +startDate.split(" ")[0].split("-")[0]
                ).getTime()}
              />
            </>
          )}
          {/* <ProfileDateRange
        title={"01-15 Aug 2020"}
        onClickNext={() => {}}
        onClickPrev={() => {}}
      />
      <div className={"profileSummaryWrapper"}>
        <ProfileSummary />
      </div> */}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ user: { currentUser } }: IAppState): Props => ({
  currentUser,
});

export default connect(mapStateToProps, {
  fetchCurrentUser: userActions.fetchCurrentUser,
})(Profile);
