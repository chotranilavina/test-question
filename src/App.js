import React, { useEffect, useRef, useState } from 'react';
import './App.css';

const questions = [
  { q: "When's your actual birthdate?", options: ["19th Sept 1996", "19th Sept 1997", "19th Sept 1995"], correct: 2 },
  { q: "Favorite trip together?", options: ["Goa", "Spiti", "Our Next Trip"], correct: 2 },
  { q: "My Favourite Show?", options: ["Bojack Horseman", "Game of Thrones", "The Office"], correct: 0 }
];
const noMessages = [
  "No",
  "Are you sure?",
  "You're breaking my heart Yash 💔",
  "Don't be so cold 😢",
  "How can you be so cruel?",
  "Yash, please no",
  "Last chance 😭"
];

const bgImages = [
  "/photos/1.jpg",
  "/photos/2.jpg",
  "/photos/3.jpg",
  "/photos/4.jpg",
  "/photos/5.jpg",
  "/photos/6.jpg",
  "/photos/7.jpg",
  "/photos/8.jpg",
  "/photos/9.jpg",
  "/photos/f1.jpg",
  "/photos/f2.jpg",
  "/photos/f3.jpg",
  "/photos/f4.jpg",
];


const noGifs = [
  "/photos/image1.gif",
  "/photos/image2.gif",
  "/photos/image3.gif",
  "/photos/image4.gif",
  "/photos/image5.gif",
  "/photos/image6.gif",
  "/photos/image8.gif"
];

const polaroidPhotos = [
  { src: "/photos/2.jpg", msg: "Vashi Social 2023" },
  { src: "/photos/1.jpg", msg: "Pune 2023" },
  { src: "/photos/3.jpg", msg: "Butterfly beach Goa 2023" },
  { src: "/photos/4.jpg", msg: "Mayan Beach Club Goa 2023" },
  { src: "/photos/5.jpg", msg: "Spiti 2024" },
  { src: "/photos/6.jpg", msg: "Spiti 2024" },
  { src: "/photos/9.jpg", msg: "Uway Vadodara 2024" },
  { src: "/photos/7.jpg", msg: "Coldplay Ahmedabad 2025" },
  { src: "/photos/8.jpg", msg: "Uway Vadodara 2025" }
];


const filmPhotos = [
  "/photos/f1.jpg",
  "/photos/f2.jpg",
  "/photos/f3.jpg",
  "/photos/f4.jpg",
];

const colors = [
    { front: 'red', back: 'darkred' }, { front: 'pink', back: 'deeppink' },
    { front: 'purple', back: 'darkpurple' }, { front: 'orange', back: 'darkorange' }
];
function App() {
  const [step, setStep] = useState('valentine');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [noClicks, setNoClicks] = useState(0);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const confettiRef = useRef([]);
  const [page, setPage] = useState("main");
  const [cinematic, setCinematic] = useState(false);
  const musicRef = useRef(null);
  const filmRef = useRef(null);
  const [feedback, setFeedback] = useState("");
  const [showCorrect, setShowCorrect] = useState(null);
  const [bgIndex, setBgIndex] = useState(0);
  const noBtnRef = useRef(null);


  // Fixed confetti effect - no useCallback inside useEffect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let confetti = confettiRef.current;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initConfetti = () => {
      confetti = [];
      for (let i = 0; i < 200; i++) {
        confetti.push({
          color: colors[Math.floor(Math.random() * colors.length)],
          dimensions: { x: Math.random() * 10 + 10, y: Math.random() * 20 + 10 },
          position: { x: Math.random() * canvas.width, y: canvas.height - 1 },
          rotation: Math.random() * 2 * Math.PI,
          scale: { x: 1, y: 1 },
          velocity: { x: Math.random() * 50 - 25, y: Math.random() * -50 }
        });
      }
      confettiRef.current = confetti;
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confetti = confetti.filter((confetto) => {
        const width = confetto.dimensions.x * confetto.scale.x;
        const height = confetto.dimensions.y * confetto.scale.y;

        ctx.save();
        ctx.translate(confetto.position.x, confetto.position.y);
        ctx.rotate(confetto.rotation);

        confetto.velocity.y += 0.5;
        confetto.velocity.x *= 0.975;
        confetto.position.x += confetto.velocity.x;
        confetto.position.y += confetto.velocity.y;
        confetto.scale.y = Math.cos(confetto.position.y * 0.1);

        ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;
        ctx.fillRect(-width / 2, -height / 2, width, height);
        ctx.restore();

        return confetto.position.y < canvas.height;
      });

      confettiRef.current = confetti;
      animationRef.current = requestAnimationFrame(render);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    initConfetti();
    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (page === "film" && filmRef.current) {
      let pos = 0;
      const id = setInterval(() => {
        filmRef.current.scrollTop += 1;
        pos++;
        if (pos > 1000) clearInterval(id);
      }, 20);

      return () => clearInterval(id);
    }
  }, [page]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex(prev => (prev + 1) % bgImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const move = (e) => {
      if (
        noClicks >= noMessages.length - 1 &&
        noBtnRef.current
      ) {
        const btn = noBtnRef.current;
        const rect = btn.getBoundingClientRect();

        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          const moveX = (Math.random() - 0.5) * 300;
          const moveY = (Math.random() - 0.5) * 300;

          btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
      }
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [noClicks]);



  const triggerConfetti = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confettiRef.current = [];
    }
  };

  const createHearts = () => {
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.innerHTML = '💕';
        heart.className = 'heart';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
        const heartsContainer = document.getElementById('hearts');
        if (heartsContainer) {
          heartsContainer.appendChild(heart);
          setTimeout(() => heart.remove(), 5000);
        }
      }, i * 100);
    }
  };

  const handleYes = () => {
    setCinematic(true);
    triggerConfetti();
    createHearts();
    musicRef.current?.play();


    setTimeout(() => {
      setCinematic(false);
      setStep("quiz");
    }, 4000);
  };


  const handleNo = () => {
    setNoClicks(prev => prev + 1);
  };

  const selectAnswer = (optIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optIndex;
    setAnswers(newAnswers);

    if (optIndex === questions[currentQuestion].correct) {
      setFeedback("Correct answer! ❤️");
      setShowCorrect(true);
    } else {
      setFeedback("Wrong answer 😜");
      setShowCorrect(false);
    }
  };


  const nextQuestion = () => {
    setFeedback("");
    setShowCorrect(null);
    let newScore = score;
    if (answers[currentQuestion] === questions[currentQuestion].correct) {
      newScore++;
    }
    setScore(newScore);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('quizResult');
      triggerConfetti();
      createHearts();
    }
  };

  const openLetter = () => {
    setPage("letter");
    triggerConfetti();
    createHearts();
  };

  const restart = () => {
    setStep('valentine');
    setCurrentQuestion(0);
    setAnswers([]);
    setScore(0);
    setNoClicks(0);
    triggerConfetti();
  };

  return (

    <div className="App">
    <div
      className="bg-slideshow"
      style={{ backgroundImage: `url(${bgImages[bgIndex]})` }}
    />

      <canvas ref={canvasRef} className="confetti-canvas" />
      <div id="hearts" className="hearts" />
      <audio ref={musicRef} loop>
        <source src="/music/love.mp3" type="audio/mpeg" />
      </audio>
      {cinematic && (
        <div className="cinematic-screen">
          <h1>Yayy! He said YES ❤️</h1>
          <p> You get to be my valentine Yash. I love you and I am so proud of you!</p>
          <img
            src="/photos/image7.gif"
            alt="love"
            className="cinematic-gif"
          />
        </div>

      )}


      {page === "main" && (
        <>
          {step === 'valentine' && (
            <section className="section">
            <h1>Yash Shukla</h1>
              <h1>Will you be my Valentine? 💕</h1>

              <div className="valentine-buttons">
                <button
                  className={`btn yes ${noClicks > 0 ? 'grow' : ''}`}
                  onClick={handleYes}
                >
                  Yes ❤️
                </button>
                <button className="btn no" onClick={handleNo} ref={noBtnRef}>
                  {noMessages[Math.min(noClicks, noMessages.length - 1)]}
                </button>
              </div>
              <div className="valentine-buttons">
                              <img
                                src={noGifs[Math.min(noClicks, noGifs.length - 1)]}
                                alt="love"
                                className="cinematic-gif"
                              />
                                        </div>
            </section>
          )}
          {feedback && (
            <p className={`feedback ${showCorrect ? "good" : "bad"}`}>
              {feedback}
            </p>
          )}

          {step === 'quiz' && (
            <section className="section">
              <h2>Quick Quiz? 😊</h2>
              <div className="quiz-question">
                <p>{questions[currentQuestion].q}</p>

                <div className="quiz-options">
                  {questions[currentQuestion].options.map((opt, idx) => (
                    <button
                      key={idx}
                      className="quiz-option-btn"
                      onClick={() => selectAnswer(idx)}
                      disabled={answers[currentQuestion] !== undefined}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="btn"
                onClick={nextQuestion}
                disabled={answers[currentQuestion] === undefined}
              >
                Next
              </button>
            </section>
          )}

          {step === 'quizResult' && (
            <section className="section">
              <h2>Quiz Complete ❤️</h2>

              <p>
                Looks like we need to do a more extensive quiz next time
              </p>
              <p>
              we are together and please watch Bojack with me?
              </p>
               <p>
               and maybe take another trip together? 😉
               </p>

              <p>Your score: {score} / {questions.length}</p>
              <img
                          src="/photos/image10.gif"
                          alt="love"
                          className="cinematic-gif"
                        />
                        <div>
              <button
                className="btn"
                onClick={() => setStep("gift")}
              >
                Continue
              </button>
              </div>
            </section>
          )}

          {step === 'gift' && (
            <section className="section">
              <h2>💝 Few Gifts for You</h2>
               <div>
              <button className="btn" onClick={openLetter}>
                Love Letter 💌
              </button>
              </div>
                <div>
              <button className="btn" onClick={() => setPage("polaroid")}>
                Memory Album 📸
              </button>
              </div>
              <div>
              <button className="btn" onClick={() => setPage("film")}>
                Film Roll 🎞️
              </button>
              </div>
              <div>
              <button className="btn restart" onClick={restart}>
                Play Again?
              </button>
              </div>
            </section>
          )}
        </>
      )}

      {page === "letter" && (
        <section className="section">
          <h2>💌 My Letter</h2>

          <div className="letter revealed">
            Dear Yash,<br /><br />
           I love your car, take me out? Or eat me out? <br />
            Whichever one suits your vibe, down for both. <br />
            P.S. I'm excited to have you come pick me up in your car. <br/><br />
            Forever yours,<br />
            Lavina
          </div>

          <button className="btn" onClick={() => setPage("main")}>
            Back
          </button>
        </section>
      )}

      {page === "polaroid" && (
        <section className="section-polaroid">
          <h2>📸 Our Memories</h2>

          <div className="polaroid-grid">
            {polaroidPhotos.map((photo, i) => (
              <div className="polaroid" key={i}>
                <img src={photo.src} alt="" />
                <p className="polaroid-msg">{photo.msg}</p>
              </div>
            ))}

          </div>

          <button className="btn" onClick={() => setPage("main")}>
            Back
          </button>
        </section>
      )}

      {page === "film" && (
        <section className="section">
          <h2>🎞️ Film Roll</h2>
           <p>You're so cute ;) Wanna meet up for coffee? </p>
          <div className="film-roll" ref={filmRef}>
            <div className="film-track">
              {filmPhotos.map((src, i) => (
                <img key={i} src={src} alt="" />
              ))}
            </div>
          </div>


          <button className="btn" onClick={() => setPage("main")}>
            Back
          </button>
        </section>
      )}
    </div>
  );
}


export default App;
