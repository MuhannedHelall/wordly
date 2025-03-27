import { useEffect, useState, useRef } from "react";

function App() {
  const [randomWord, setRandomWord] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(""));
  const [guessedWord, setGuessedWord] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentRow, setCurrentRow] = useState(0);

  const handlePressRef = useRef();

  const getRandomWord = async () => {
    const response = await fetch(
      "https://api.allorigins.win/get?url=https://api.frontendexpert.io/api/fe/wordle-words"
    );
    const result = await response.json();
    const data = await JSON.parse(result?.contents);
    setRandomWord(data[Math.floor(Math.random() * data.length)]);
  };

  handlePressRef.current = (e) => {
    if (isGameOver) return;

    if (e.key === "Enter" && guessedWord.length === 5) {
      setGuesses((prevGuesses) => {
        const newGuesses = [...prevGuesses];
        newGuesses[currentRow] = guessedWord;
        return newGuesses;
      });

      if (guessedWord === randomWord) {
        setCurrentRow((prev) => prev + 1);
        setGuessedWord("");
        setIsGameOver(true);
        alert("Congratulations, you won!");
      } else if (currentRow < 5) {
        setCurrentRow((prev) => prev + 1);
        setGuessedWord("");
      } else {
        setIsGameOver(true);
        alert("you lost, try again!");
      }
    } else if (e.key.match(/^[a-zA-Z]$/)) {
      setGuessedWord((prev) =>
        prev.length < 5 ? prev + e.key.toUpperCase() : prev
      );
    } else if (e.key === "Backspace") {
      setGuessedWord((prev) => prev.slice(0, -1));
    }
  };

  useEffect(() => {
    getRandomWord();

    const handleKeyDown = (e) => handlePressRef.current(e);

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const playAgain = () => {
    setIsGameOver(false);
    setGuesses(Array(6).fill(""));
    setGuessedWord("");
    setCurrentRow(0);
    getRandomWord();
  };

  return (
    <>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mx-auto">
        <p className="text-justify">
          Try to guess the word, you only got 6 tries!
        </p>
        {guesses.map((guess, i) => (
          <Line
            key={i}
            guess={i === currentRow ? guessedWord : guess}
            randomWord={randomWord}
            isSubmitted={i < currentRow} // ✅ Only show colors for submitted rows
          />
        ))}
      </div>
      {isGameOver && (
        <button
          type="button"
          className="bg-blue-500 rounded-xl px-4 py-2 my-4 flex justify-center mx-auto"
          onClick={playAgain}
        >
          Try Again
        </button>
      )}
    </>
  );
}

export default App;

// Line Component
function Line({ guess, randomWord, isSubmitted }) {
  return (
    <div className={`flex gap-x-2 mt-2 `}>
      {[...Array(5)].map((_, j) => (
        <div
          key={j}
          className={`w-14 h-14 border flex items-center justify-center text-3xl uppercase rounded-xl ${
            isSubmitted && guess[j] === randomWord[j]
              ? "bg-green-600"
              : isSubmitted && randomWord.includes(guess[j])
              ? "bg-amber-400"
              : isSubmitted && !randomWord.includes(guess[j])
              ? "bg-gray-800"
              : ""
          }`}
        >
          {guess[j] || ""}
        </div>
      ))}
    </div>
  );
}
