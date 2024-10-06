// app/components/CharacterCard.tsx
import React from "react";

interface CharacterProps {
  id: string;
  name: string;
  image: string;
  role: string;
}

const CharacterCard: React.FC<CharacterProps> = ({ id, name, image, role }) => {
  return (
    <div className="character-card" key={id}>
      <img src={image} alt={name} className="character-image" />
      <div className="character-info">
        <h3 className="character-name">{name}</h3>
        <p className="character-role">{role}</p>
      </div>
    </div>
  );
};

export default CharacterCard;
