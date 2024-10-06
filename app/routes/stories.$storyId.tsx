import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getStory, updateStory } from "~/models/story.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const creatorId = await requireUserId(request);
  invariant(params.storyId, "storyId not found");

  const story = await getStory({ id: params.storyId, creatorId });
  invariant(story, "Story not found");
  return json({ story });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const updatedScenes = [];
  for (let i = 0; formData.has(`scene-${i}-id`); i++) {
    const scene = {
      id: formData.get(`scene-${i}-id`),
      type: formData.get(`scene-${i}-type`),
      background: formData.get(`scene-${i}-background`),
      characters: [],
      dialogues: [],
      quiz: [],
    };

    // Handle characters
    for (let j = 0; formData.has(`scene-${i}-character-${j}-id`); j++) {
      const character = {
        id: formData.get(`scene-${i}-character-${j}-id`),
        name: formData.get(`scene-${i}-character-${j}-name`),
        image: formData.get(`scene-${i}-character-${j}-image`),
        role: formData.get(`scene-${i}-character-${j}-role`),
      };
      scene.characters.push(character);
    }

    // Handle dialogues
    for (let j = 0; formData.has(`scene-${i}-dialogue-${j}-id`); j++) {
      const dialogue = {
        id: formData.get(`scene-${i}-dialogue-${j}-id`),
        name: formData.get(`scene-${i}-dialogue-${j}-name`),
        text: formData.get(`scene-${i}-dialogue-${j}-text`),
        image: formData.get(`scene-${i}-dialogue-${j}-image`),
      };
      scene.dialogues.push(dialogue);
    }

    // Handle quiz questions
    for (let j = 0; formData.has(`scene-${i}-quiz-${j}-id`); j++) {
      const quiz = {
        id: formData.get(`scene-${i}-quiz-${j}-id`),
        questions: [],
      };

      for (let k = 0; formData.has(`scene-${i}-quiz-${j}-question-${k}-id`); k++) {
        const question = {
          id: formData.get(`scene-${i}-quiz-${j}-question-${k}-id`),
          question: formData.get(`scene-${i}-quiz-${j}-question-${k}-text`),
          options: [
            formData.get(`scene-${i}-quiz-${j}-question-${k}-option-0`),
            formData.get(`scene-${i}-quiz-${j}-question-${k}-option-1`),
            formData.get(`scene-${i}-quiz-${j}-question-${k}-option-2`),
            formData.get(`scene-${i}-quiz-${j}-question-${k}-option-3`),
          ],
          correctAnswer: formData.get(`scene-${i}-quiz-${j}-correctAnswer`),
        };
        quiz.questions.push(question);
      }

      scene.quiz.push(quiz);
    }

    updatedScenes.push(scene);
  }

  const updatedStory = {
    id: params.storyId,
    title: formData.get("title"),
    scenes: updatedScenes,
  };

  await updateStory(updatedStory);
  return redirect(`/stories/${params.storyId}`);
};

export default function EditStoryPage() {
  const { story } = useLoaderData<typeof loader>();
  console.log(story);
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Edit Story</h2>
      <Form method="post">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            defaultValue={story.title}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Ensure that story.scenes exists */}
        {(story.scenes ?? []).map((scene, sceneIndex) => (
          <div key={scene.id} className="mb-4 border rounded-md p-4">
            <h3 className="text-lg font-semibold">Scene {sceneIndex + 1}</h3>
            <input type="hidden" name={`scene-${sceneIndex}-id`} value={scene.id} />

            <label htmlFor={`scene-${sceneIndex}-type`} className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <input
              type="text"
              name={`scene-${sceneIndex}-type`}
              id={`scene-${sceneIndex}-type`}
              defaultValue={scene.type}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />

            <label htmlFor={`scene-${sceneIndex}-background`} className="block text-sm font-medium text-gray-700">
              Background
            </label>
            <input
              type="text"
              name={`scene-${sceneIndex}-background`}
              id={`scene-${sceneIndex}-background`}
              defaultValue={scene.background}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />

            {/* Characters */}
            {(scene.characters ?? []).map((character, charIndex) => (
              <div key={character.id} className="mt-4 border rounded-md p-2">
                <h4 className="font-semibold">Character {charIndex + 1}</h4>
                <input type="hidden" name={`scene-${sceneIndex}-character-${charIndex}-id`} value={character.id} />
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name={`scene-${sceneIndex}-character-${charIndex}-name`}
                  defaultValue={character.name}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="text"
                  name={`scene-${sceneIndex}-character-${charIndex}-image`}
                  defaultValue={character.image}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  name={`scene-${sceneIndex}-character-${charIndex}-role`}
                  defaultValue={character.role}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            ))}

            {/* Dialogues */}
            {(scene.dialogues ?? []).map((dialogue, dialogIndex) => (
              <div key={dialogue.id} className="mt-4 border rounded-md p-2">
                <h4 className="font-semibold">Dialogue {dialogIndex + 1}</h4>
                <input type="hidden" name={`scene-${sceneIndex}-dialogue-${dialogIndex}-id`} value={dialogue.id} />
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name={`scene-${sceneIndex}-dialogue-${dialogIndex}-name`}
                  defaultValue={dialogue.name}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
                <label className="block text-sm font-medium text-gray-700">Text</label>
                <textarea
                  name={`scene-${sceneIndex}-dialogue-${dialogIndex}-text`}
                  defaultValue={dialogue.text}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="text"
                  name={`scene-${sceneIndex}-dialogue-${dialogIndex}-image`}
                  defaultValue={dialogue.image}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            ))}

            {/* Quiz Questions */}
            {(scene.quiz ?? []).map((quiz, quizIndex) => (
              <div key={quiz.id} className="mt-4 border rounded-md p-2">
                <h4 className="font-semibold">Quiz {quizIndex + 1}</h4>
                <input type="hidden" name={`scene-${sceneIndex}-quiz-${quizIndex}-id`} value={quiz.id} />
                {(quiz.questions ?? []).map((question, questionIndex) => (
                  <div key={question.id} className="mt-2">
                    <h5 className="font-semibold">Question {questionIndex + 1}</h5>
                    <input
                      type="hidden"
                      name={`scene-${sceneIndex}-quiz-${quizIndex}-question-${questionIndex}-id`}
                      value={question.id}
                    />
                    <label className="block text-sm font-medium text-gray-700">Question</label>
                    <input
                      type="text"
                      name={`scene-${sceneIndex}-quiz-${quizIndex}-question-${questionIndex}-text`}
                      defaultValue={question.question}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                    <label className="block text-sm font-medium text-gray-700">Options</label>
                    {question.options.map((option, optionIndex) => (
                      <input
                        key={optionIndex}
                        type="text"
                        name={`scene-${sceneIndex}-quiz-${quizIndex}-question-${questionIndex}-option-${optionIndex}`}
                        defaultValue={option}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                    ))}
                    <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
                    <input
                      type="text"
                      name={`scene-${sceneIndex}-quiz-${quizIndex}-correctAnswer`}
                      defaultValue={question.correctAnswer}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}

        <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
          Save Story
        </button>
      </Form>
    </div>
  );
}
