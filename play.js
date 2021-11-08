const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();


if (audioContext.state === 'suspended') {
  audioContext.resume();
}

const audio = document.querySelector('audio');
const track = audioContext.createMediaElementSource(audio);
track.connect(audioContext.destination);

const musicContainer = document.getElementById('music-container');
const play = document.getElementById('play');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const title = document.getElementById('title');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');

const trackSelectors = [...document.getElementsByClassName('track')];
const trackList = trackSelectors.map(each => each.value);
let currentSong = 'new-wave-kit';

trackSelectors.map(each => {
  each.addEventListener('click', (e) => {
    audio.src = `/assets/audio/${e.target.value}.ogg`;
    currentSong = e.target.value;
    title.innerText = each.textContent;
    playSong();
    trackSelectors.map(track => {
      track.className = 'track';
    });
    each.className = 'track selected';
  })
})

play.addEventListener('click', (e) => {
  if (e.target.innerText === 'Play') {
    playSong();
  } else {
    pauseSong();
  }
});

prev.addEventListener('click', prevSong);
next.addEventListener('click', nextSong);
progressContainer.addEventListener('click', setProgress);

function playSong() {
    musicContainer.classList.add('play');
    play.innerText = 'Pause';
    audio.play();
}

function pauseSong() {
  musicContainer.classList.remove('play');
  play.innerText = 'Play';
  audio.pause();
}

function prevSong() {
  let index = trackList.findIndex(elem => elem === currentSong);
  let prevSong = trackList[index-1];
  
  if (prevSong) {
    audio.src = `/assets/audio/${prevSong}.ogg`;
    currentSong = prevSong;
    title.innerText = trackSelectors[index-1].textContent;
    trackSelectors[index].classList.remove('selected');
    trackSelectors[index-1].classList.add('selected');

    play.innerText = 'Pause';
    audio.play();
  }
}

function nextSong() {
  let index = trackList.findIndex(elem => elem === currentSong);
  let nextSong = trackList[index+1];
  
  if (nextSong) {
    audio.src = `/assets/audio/${nextSong}.ogg`;
    currentSong = nextSong;
    title.innerText = trackSelectors[index+1].textContent;
    trackSelectors[index].classList.remove('selected');
    trackSelectors[index+1].classList.add('selected');
    play.innerText = 'Pause';
    audio.play();
  }
}

function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;

  const progressPerc = (currentTime / duration) * 100;
  progress.style.width = `${progressPerc}%`;
}

function setProgress(e) {
  const width = this.clientWidth;
  const click = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (click/width) * duration;
}

audio.addEventListener('ended', () => {
  nextSong();
}, false);

audio.addEventListener('timeupdate', updateProgress);

