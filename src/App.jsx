import React from "react";
import { useState, useRef, useEffect } from "react";
import questions from "./data/questions";
const pool = ["Janine", "Dennis", "Mandy", "Adrian"];
const getRandomIndex = () => Math.floor(Math.random() * questions.length);
export default function App() {
	const coinSound = useRef(new Audio(`${import.meta.env.BASE_URL}coin.mp3`));
	const failSound = useRef(new Audio(`${import.meta.env.BASE_URL}fail.mp3`));
	const revealSound = useRef(
		new Audio(`${import.meta.env.BASE_URL}reveal.mp3`),
	);
	const victorySound = useRef(
		new Audio(`${import.meta.env.BASE_URL}victory.mp3`),
	);

	const [started, setStarted] = useState(false);
	const [players, setPlayers] = useState([]);
	const [scores, setScores] = useState({});
	const [i, setI] = useState(getRandomIndex());
	const [questionNumber, setQuestionNumber] = useState(1);
	const [reveal, setReveal] = useState(false);
	const [winner, setWinner] = useState("No one got it");
	const [customPlayers, setCustomPlayers] = useState([]);
	const [newPlayerName, setNewPlayerName] = useState("");
	const [removedDefaults, setRemovedDefaults] = useState([]);
	const [gameEnded, setGameEnded] = useState(false);
	const toggle = (p) =>
		setPlayers((x) => (x.includes(p) ? x.filter((a) => a !== p) : [...x, p]));
	const allPlayers = [
		...pool.filter((p) => !removedDefaults.includes(p)),
		...customPlayers,
	];
	const addPlayer = () => {
		if (newPlayerName.trim() && !allPlayers.includes(newPlayerName.trim())) {
			const newName = newPlayerName.trim();
			setCustomPlayers((x) => [...x, newName]);
			setPlayers((x) => [...x, newName]);
			setNewPlayerName("");
		}
	};
	const removePlayer = (p) => {
		if (pool.includes(p)) {
			setRemovedDefaults((x) => [...x, p]);
			setPlayers((x) => x.filter((a) => a !== p));
		} else {
			setCustomPlayers((x) => x.filter((a) => a !== p));
			setPlayers((x) => x.filter((a) => a !== p));
		}
	};
	const start = () => {
		const s = {};
		players.forEach((p) => (s[p] = 0));
		setScores(s);
		setStarted(true);
	};
	const nextQuestion = () => {
		setReveal(false);
		setWinner("No one got it");
		setI((v) => v + 1);
		setQuestionNumber((v) => v + 1);
	};

	useEffect(() => {
		if (!gameEnded) return;

		const highestScore = Math.max(...Object.values(scores));

		const tiedPlayers = Object.values(scores).filter(
			(score) => score === highestScore,
		);

		const isTie = highestScore > 0 && tiedPlayers.length > 1;

		if (highestScore > 0 && !isTie) {
			victorySound.current.currentTime = 0;
			victorySound.current.play();
		}
	}, [gameEnded]);
	
	if (!started)
		return (
			<div className="screen">
				<h1>⚡ THUNDER QUIZ MASTER ⚡</h1>
				<div
					style={{
						fontSize: "20px",
						fontWeight: "bold",
						marginBottom: "15px",
						fontFamily: "'Press Start 2P','Fredoka One',sans-serif",
						textShadow: "2px 2px 0 rgba(0,0,0,0.5)",
					}}
				>
					Select muna ng players
				</div>
				<div
					style={{
						fontSize: "12px",
						marginBottom: "20px",
						color: "#ddd",
						fontFamily: "'Fredoka One',sans-serif",
						maxWidth: "600px",
						margin: "0 auto 20px",
					}}
				>
					💡 Click player name to select • Click × to remove • Enter name below
					to add
				</div>
				<div className="player-setup">
					{allPlayers.map((p) => (
						<button
							key={p}
							type="button"
							className={`player-toggle${players.includes(p) ? " selected" : ""}`}
							onClick={() => toggle(p)}
						>
							{p}
							<span
								style={{ marginLeft: "8px", cursor: "pointer" }}
								onClick={(e) => {
									e.stopPropagation();
									removePlayer(p);
								}}
								title="Remove player"
							>
								×
							</span>
						</button>
					))}
				</div>
				<br />
				<div style={{ marginBottom: "15px" }}>
					<input
						type="text"
						value={newPlayerName}
						onChange={(e) => setNewPlayerName(e.target.value)}
						onKeyPress={(e) => e.key === "Enter" && addPlayer()}
						placeholder="Enter player name"
					/>
					<button
						onClick={addPlayer}
						style={{
							padding: "8px 16px",
							borderRadius: "4px",
							background: "#4CAF50",
							color: "white",
							border: "none",
							cursor: "pointer",
						}}
					>
						Add Player
					</button>
				</div>
				<button onClick={start}>Start Game</button>
			</div>
		);

	if (gameEnded) {
		const highestScore = Math.max(...Object.values(scores));
		const nobodyScored = highestScore === 0;

		const tiedPlayers = Object.entries(scores)
			.filter(([_, score]) => score === highestScore)
			.map(([name]) => name);

		const isTie = !nobodyScored && tiedPlayers.length > 1;

		const winnerName = tiedPlayers[0];

		const losers = nobodyScored
			? players
			: players.filter((p) => !tiedPlayers.includes(p));
		return (
			<div className="screen">
				<div style={{ marginTop: "40px" }}>
					<h1
						style={{
							fontSize: "48px",
							marginBottom: "20px",
							color: "#FFD700",
							textShadow: "4px 4px 0 rgba(0,0,0,0.5)",
						}}
					>
						{nobodyScored ? (
							"Better luck next game!"
						) : isTie ? (
							"🏆 IT'S A TIE! 🏆"
						) : (
							<>
								And the winner is {winnerName} with{" "}
								<span
									style={{
										display: "inline-flex",
										alignItems: "center",
										justifyContent: "center",
										width: "90px",
										height: "90px",
										backgroundColor: "#FFD700",
										border: "6px solid #000",
										borderRadius: "8px",
										boxShadow:
											"inset 0 -6px 0 rgba(0,0,0,0.3), 0 6px 0 rgba(0,0,0,0.6), inset 2px 2px 0 rgba(255,255,255,0.4)",
										fontSize: "56px",
										fontWeight: "bold",
										color: "#000",
										textShadow: "2px 2px 0 rgba(0,0,0,0.2)",
										margin: "0 8px",
										verticalAlign: "middle",
									}}
								>
									{scores[winnerName]}
								</span>{" "}
								{scores[winnerName] === 1 ? "point" : "points"}!
							</>
						)}
					</h1>
					<div
						style={{
							fontSize: "32px",
							marginBottom: "40px",
							color: "#00FF00",
							textShadow: "3px 3px 0 rgba(0,0,0,0.5)",
						}}
					>
						{nobodyScored
							? "Nobody got a single point 😭"
							: isTie
								? tiedPlayers.join(" • ")
								: "Wow, so smart!"}{" "}
					</div>
					{losers.length > 0 && (
						<div
							style={{
								marginBottom: "30px",
								padding: "20px",
								background: "#32005f",
								borderRadius: "10px",
							}}
						>
							<h2
								style={{
									fontSize: "28px",
									marginBottom: "15px",
									color: "#FF1493",
									textShadow: "2px 2px 0 rgba(0,0,0,0.5)",
								}}
							>
								{losers.length === 1 ? "LOSER" : "LOSERS"}
							</h2>

							<div
								style={{
									fontSize: "24px",
									color: "#FF6B6B",
									fontFamily: "'Fredoka One',sans-serif",
								}}
							>
								{losers.map((loser) => (
									<div
										key={loser}
										style={{
											marginBottom: "10px",
											padding: "10px",
											background: "rgba(0,0,0,0.3)",
											borderRadius: "5px",
										}}
									>
										{loser} ({scores[loser]})
									</div>
								))}
							</div>
						</div>
					)}
					<button
						onClick={() => {
							setStarted(false);
							setPlayers([]);
							setScores({});
							setI(getRandomIndex());
							setReveal(false);
							setWinner("No one got it");
							setGameEnded(false);
							setQuestionNumber(1);
						}}
						style={{
							fontSize: "24px",
							padding: "15px 30px",
							background: "linear-gradient(to bottom,#2ecc71,#27ae60)",
							border: "3px solid #1e8449",
						}}
					>
						Start New Game
					</button>
				</div>
			</div>
		);
	}

	const q = questions[i % questions.length];
	return (
		<div className="screen">
			<button
				style={{ position: "absolute", top: "10px", right: "10px" }}
				onClick={() => {
					setGameEnded(true);
				}}
			>
				End Game
			</button>
			<div className="score">
				{Object.entries(scores).map(([n, s]) => (
					<span key={n}>
						{n}: {s} |{" "}
					</span>
				))}
			</div>
			<h2>QUESTION {questionNumber}</h2>
			<div className="q">{q.question}</div>
			{!reveal ? (
				<button
					onClick={() => {
						revealSound.current.currentTime = 0;
						revealSound.current.play();

						setReveal(true);
					}}
				>
					Reveal Answer
				</button>
			) : (
				<>
					<div className="a">{q.answer}</div>
					<div className="player-selector">
						<div style={{ marginBottom: "15px" }}>Who got it right?</div>
						{["No one got it", ...players].map((p) => (
							<button
								key={p}
								onClick={() => setWinner(p)}
								style={{
									background: winner === p ? "#FFD700" : "#888",
									border: winner === p ? "4px solid #FFA500" : "3px solid #333",
									padding: "12px 20px",
									margin: "5px",
									borderRadius: "8px",
									color: winner === p ? "#000" : "#fff",
									fontWeight: "bold",
									cursor: "pointer",
									transition: "all 0.1s",
								}}
							>
								{p}
							</button>
						))}
					</div>
					<br />
					{winner === "No one got it" ? (
						<button
							onClick={() => {
								failSound.current.currentTime = 0;
								failSound.current.play();

								setReveal(false);
								setWinner("No one got it");
								setI((v) => v + 1);
								setQuestionNumber((v) => v + 1);
							}}
						>
							Next Question
						</button>
					) : (
						<button
							onClick={() => {
								coinSound.current.currentTime = 0;
								coinSound.current.play();

								setScores((v) => ({
									...v,
									[winner]: v[winner] + 1,
								}));

								setReveal(false);
								setWinner("No one got it");
								setI((v) => v + 1);
								setQuestionNumber((v) => v + 1);
							}}
						>
							Award Point
						</button>
					)}
				</>
			)}
		</div>
	);
}
