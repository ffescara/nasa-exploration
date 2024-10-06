// app/components/Dialog.tsx
import React from "react";

interface DialogProps {
  name: string;
  text: string;
  image?: string | null;
}

const Dialog: React.FC<DialogProps> = ({ name, text, image }) => {
  return (
    <div className="dialog-box">
      <h4 className="dialog-name text-yellow-300">{name}</h4>
      <p className="dialog-text">{text}</p>
      {image && <img src={`/images/${image}`} alt={`${name} expression`} className="dialog-image" />}
    </div>
  );
};

export default Dialog;
