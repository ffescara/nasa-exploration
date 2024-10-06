import React, { useState } from "react";
import { sceneData } from "./datascenes";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import invariant from "tiny-invariant";
import { getStory } from "~/models/story.server";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const creatorId = await requireUserId(request);
  invariant(params.storyId, "storyId not found");

  const story = await getStory({ id: params.storyId, creatorId });
  if (!story) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ story });
};

export default function StoryScene() {
  const data = useLoaderData<typeof loader>();
  
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0); // Track current scene index
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0); // Track dialog index
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // State to store selected quiz option
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current quiz question index
  
  const currentScene = data.story.scenes[currentSceneIndex]; // Ambil current scene
  const isConversationScene = currentScene.type === "CONVERSATION"; // Cek apakah tipe scene adalah CONVERSATION
  const isQuizScene = currentScene.type === "QUIZ";
  const currentDialogue = isConversationScene
    ? currentScene.dialogues?.[currentDialogueIndex]
    : null;

  const currentQuiz = isQuizScene
    ? currentScene.quiz?.[0] // Ambil quiz pertama
    : null;

  const handleNextDialogue = () => {
    if (
      isConversationScene &&
      currentScene.dialogues &&
      currentDialogueIndex < currentScene.dialogues.length - 1
    ) {
      setCurrentDialogueIndex(currentDialogueIndex + 1);
    } else if (currentSceneIndex < data.story.scenes.length - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1);
      setCurrentDialogueIndex(0); // Reset dialogue index untuk scene baru
    } else if (isQuizScene) {
      // Jika berada di scene quiz, reset opsi yang dipilih untuk pertanyaan berikutnya
      setSelectedOption(null);
      setCurrentQuestionIndex(0); // Reset pertanyaan kuis saat berpindah scene
      handleNextDialogue(); // Pindah ke dialog atau scene berikutnya
    }
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option); // Set opsi yang dipilih
  };

  const handleSubmitQuiz = () => {
    console.log("Selected option for question", currentQuestionIndex + 1, ":", selectedOption); // Log hasil submit

    if (currentQuiz?.questions && currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1); // Pindah ke pertanyaan berikutnya
      setSelectedOption(null); // Reset opsi yang dipilih
    } else {
      if (currentSceneIndex < data.story.scenes.length - 1){
        console.log('naikin index scene');
      } else {
        console.log('end');
        
      }
    }
  };

  const renderScene = () => {
    if (isConversationScene) {
      return (
        <>
          <video
          src={currentScene.background}
          autoPlay
          loop
          muted
          className="h-full w-full object-cover"
        />

          {/* Overlay for characters */}
          <div className="absolute bottom-0 flex w-full justify-between p-5">
            {currentScene.characters?.map((character) => (
              <div
                key={character.id}
                className="relative mx-auto mb-[150px] max-w-[150px] rounded-md bg-white p-4 text-center"
              >
                <img src={character.image} alt={character.name} />
                <h3>{character.name}</h3>
                <p>{character.role}</p>
              </div>
            ))}
          </div>

          {/* Dialogue Overlay */}
          <div className="absolute bottom-0 left-0 flex w-full flex-col items-center bg-black bg-opacity-70 p-5 text-center text-white">
            {currentDialogue && (
              <>
                <h4>{currentDialogue.name}</h4>
                <p>{currentDialogue.text}</p>
              </>
            )}
            <button
              onClick={handleNextDialogue}
              className="mt-5 cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        </>
      );
    } else if (isQuizScene) {
      return (
        <>
          <img
            src={currentScene.background}
            alt="background"
            className="h-full w-full object-cover"
          />

          {/* Overlay for characters */}
          <div className="absolute bottom-0 flex w-full justify-between p-5">
            {currentScene.characters?.map((character) => (
              <div
                key={character.id}
                className="relative mx-auto mb-[150px] max-w-[150px] rounded-md bg-white p-4 text-center"
              >
                <img src={character.image} alt={character.name} />
                <h3>{character.name}</h3>
                <p>{character.role}</p>
              </div>
            ))}
          </div>

          {/* Quiz Overlay */}
          <div className="absolute bottom-0 left-0 flex w-full flex-col items-center bg-black bg-opacity-70 p-5 text-center text-white">
            <h3 className="mb-4 text-2xl text-white">Quiz Time!</h3>
            {currentQuiz?.questions && currentQuestionIndex < currentQuiz.questions.length && (
              <div className="mb-4">
                <h4 className="text-white">
                  {currentQuiz.questions[currentQuestionIndex].question}
                </h4>
                <ul className="list-none p-0">
                  {currentQuiz.questions[currentQuestionIndex].options.map(
                    (option) => (
                      <li key={option} className="text-white">
                        <label>
                          <input
                            type="radio"
                            name={`question-${currentQuestionIndex}`}
                            value={option}
                            checked={selectedOption === option}
                            onChange={() => handleOptionSelect(option)} // Set opsi yang dipilih
                            className="mr-2"
                          />
                          {option}
                        </label>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
            <button
              onClick={handleSubmitQuiz} // Menghandle submit quiz
              className="mt-5 cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </>
      );
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {renderScene()}
    </div>
  );
}
