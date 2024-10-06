export const sceneData = [
  {
    id: "scene_1",
    type: "CONVERSATION",
    background:
      "https://images.unsplash.com/photo-1464802686167-b939a6910659?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3RhcnJ5fGVufDB8fDB8fHww",
    characters: [
      {
        id: "char_1",
        name: "Astronomer Ada",
        image:
          "https://png.pngtree.com/png-vector/20230831/ourmid/pngtree-realistic-illustration-of-a-floating-astronaut-illustrated-in-cartoon-style-for-png-image_9227109.png",
        role: "Scientist",
      },
      {
        id: "char_2",
        name: "Robot Rolo",
        image:
          "https://static.vecteezy.com/system/resources/thumbnails/010/265/384/small_2x/cute-happy-3d-robot-png.png",
        role: "Assistant",
      },
    ],
    dialogues: [
      {
        id: "dialogue_1",
        name: "Astronomer Ada",
        text: "Welcome to our observatory, Rolo! Today, we will explore how we can find exoplanets using the radial velocity method.",
        image: null,
      },
      {
        id: "dialogue_2",
        name: "Robot Rolo",
        text: "That sounds exciting! How does this method work?",
        image: null,
      },
      {
        id: "dialogue_3",
        name: "Astronomer Ada",
        text: "Well, when a planet orbits a star, its gravity causes the star to wobble slightly. This wobble creates a change in the star's light due to the Doppler effect.",
        image: null,
      },
      {
        id: "dialogue_4",
        name: "Robot Rolo",
        text: "Ah, like how the sound of an ambulance changes as it moves toward or away from us!",
        image: null,
      },
      {
        id: "dialogue_5",
        name: "Astronomer Ada",
        text: "Exactly! When the star moves towards us, its light shifts to blue, and when it moves away, it shifts to red. This is how we can detect the presence of planets.",
        image: null,
      },
    ],
  },
  {
    id: "scene_2",
    type: "QUIZ",
    background:
      "https://i0.wp.com/astronomicca.com/wp-content/uploads/2022/06/Quiz_3_cover.jpg?fit=2048%2C1536&ssl=1",
    characters: [],
    dialogues: [],
    quiz: [
      {
        id: "quiz_1",
        questions: [
          {
            id: "question_1",
            question: "What does the radial velocity method detect?",
            options: [
              "The color of stars",
              "The wobble of stars due to orbiting planets",
              "The temperature of stars",
              "The distance to stars",
            ],
            correctAnswer: "The wobble of stars due to orbiting planets",
          },
          {
            id: "question_2",
            question: "What is the Doppler effect?",
            options: [
              "A change in sound pitch based on distance",
              "A way to measure star brightness",
              "A method to calculate planet size",
              "A technique to observe planets directly",
            ],
            correctAnswer: "A change in sound pitch based on distance",
          },
          {
            id: "question_3",
            question:
              "When a star moves toward us, its light shifts to which color?",
            options: ["Red", "Blue", "Green", "Yellow"],
            correctAnswer: "Blue",
          },
        ],
      },
    ],
  },
];
