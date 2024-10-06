// app/components/CharacterList.tsx
import React from "react";
import CharacterCard from "./CharacterCard";

interface Character {
  id: string;
  name: string;
  image: string;
  role: string;
}

interface CharacterListProps {
  characters: Character[];
}

const CharacterList: React.FC<CharacterListProps> = ({ characters }) => {
  return (
    <div className="character-list">
      {characters.map((character) => (
        <CharacterCard
          key={character.id}
          id={character.id}
          name={character.name}
          image={character.image}
          role={character.role}
        />
      ))}
    </div>
  );
};

export default CharacterList;
