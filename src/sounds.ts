const clickButtonAudio = new Audio("/clickButton.mp3");
clickButtonAudio.preload = "auto";

const clickCommandAudio = new Audio("/clickCommand.mp3");
clickCommandAudio.preload = "auto";

const runCommandAudio = new Audio("/runCommand.mp3");
runCommandAudio.preload = "auto";

const clearStageAudio = new Audio("/clearStage.mp3");
clearStageAudio.preload = "auto";

const moveMazeAudio = new Audio("/moveMaze.mp3");
moveMazeAudio.preload = "auto";

export function clickButtonSound() {
  clickButtonAudio.currentTime = 0;
  clickButtonAudio.play();
}

export function clickCommandSound() {
  clickCommandAudio.currentTime = 0;
  clickCommandAudio.play();
}

export function runCommandSound() {
  runCommandAudio.currentTime = 0;
  runCommandAudio.play();
}

export function clearStageSound() {
  clearStageAudio.currentTime = 0;
  clearStageAudio.play();
}

export function moveMazeSound() {
  moveMazeAudio.currentTime = 0;
  moveMazeAudio.play();
}

export function stopSound() {
  clickButtonAudio.pause();
  clickCommandAudio.pause();
  runCommandAudio.pause();
  clearStageAudio.pause();
  moveMazeAudio.pause();
}
