import React, { useEffect, useRef, useState } from "react";
import Button from "../Button";

interface Props {
  onCancel: () => void;
  roomCode: string;
}

const CreatedARoom = ({ onCancel, roomCode }: Props) => {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<NodeJS.Timeout>(null);

  const onCopy = () => {
    const str = `${location.origin}/join-game?roomId=${roomCode}`
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    setCopied(true);
    timeout.current = setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  return (
    <div className="toastContainer topLeft">
      <p className="title">
        {"Waiting for a player to join your match..."}
      </p>
      <br />
      <p className="gameCodeTitle">{"MATCH CODE:"}</p>
      <p className="gameCode">{roomCode}</p>
      <br />
      <div>
        <Button small onClick={onCopy}>
          {copied ? "Copied" : "Copy"}
        </Button>
        <Button dark small onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default CreatedARoom;
