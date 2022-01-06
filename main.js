let audioDuration = document.querySelector('.player-action__duration');
let playerButton = document.querySelector('.player-button');
let audioCurrentDuration = document.querySelector('.player-action__current-duration');
let audioLine = document.querySelector('.player-action__line');
let audioCurrentLine = document.querySelector('.player-action__current-line');
let audioVolume = document.querySelector('.player-volume input');
let playerAction = document.querySelector('.player-action');
let playerTitle = document.querySelector('.player-data__title');
let playerAuthor = document.querySelector('.player-data__author');

let audioPlayer = document.querySelector('audio');
let playListElement = document.querySelector('.playlist-player');

let responseFromServer = [
	{
		id: 1,
		author: 'pinki',
		title: 'i love minecaft',
		src: 'https://muztrack.net/uploads/music/2020/06/MINECRAFT_BOY_-_YA_lyublyu_maynkraft.mp3'
	},

	{
		id: 2,
		author: 'Morgenshtern',
		title: 'Аристократ',
		src: 'https://mp3uk.net/mp3/files/morgenshtern-aristokrat-mp3.mp3'
	},

	{
		id: 3,
		author: 'kizaru, big baby tape',
		title: 'Million',
		src: 'https://mp3uk.net/mp3/files/big-baby-tape-kizaru-million-mp3.mp3'
	},

	{
		id: 4,
		author: 'Slava Marlow',
		title: 'Миллион дорог',
		src: 'https://mp3uk.net/mp3/files/slava-marlow-slava-marlou-million-dorog-mp3.mp3'
	},
]

function Song(obj) {
	return {
		id: obj.id,
		author: obj.author,
		title: obj.title,
		src:  obj.src,
		isPlaying: false,

		getTemplate() {
			return `
				<div class="playlist-music">
		 			<div class="playlist-data">
		 				<div class="playlist-number">${obj.id}</div>
		 				<div class="playlist__play-pause player-action__play-pause"><img data-id="${obj.id}" width="38px" height="38px" src="https://cdn-icons-png.flaticon.com/512/109/109197.png"></div>
		 			    <div class="playlist-title">${obj.title}</div>
		 			    <div class="playlist-author"> — ${obj.author}</div>
		 			</div>
		 			<div class="playlist-duration">0:00</div>
		 		</div>
			`
		},

		play(button) {
			this.isPlaying = true;
			button.src = 'https://cdn-icons-png.flaticon.com/512/709/709691.png';
			audioPlayer.src = obj.src;
			audioPlayer.play();
		}, 

		pause(button) {
			this.isPlaying = false;
			button.src = 'https://cdn-icons-png.flaticon.com/512/109/109197.png';
			audioPlayer.pause();
		}
	}
}

function PlayList(el, items, name = 'Unkmown') {
	const element = document.querySelector(el);

	const songsList = items.map(item => {
		return new Song(item)
	})

	function updatePlayer(item) {
		playerTitle.innerHTML = item.title;
		playerAuthor.innerHTML = item.author;
	}

	playListElement.addEventListener('click', el => {
		let target = el.target.getAttribute('data-id');
		if (target) {
			songsList.forEach(item => {
				if (item.id === parseInt(target)) {

					updatePlayer(item)

					if (item.isPlaying) {
						item.pause(el.target)
					} else {
						item.play(el.target)
					}
				}
			})
		}
	})

	playListElement.addEventListener('click', el => {
		let target = el.target;

		if (target.tagName === 'H2') {
			renderIt()
		}
	})

	function renderIt() {
		element.innerHTML += `<h2>${name}</h2>`
		songsList.forEach(item => {
			element.innerHTML += item.getTemplate();
		})
	}

	renderIt()

	return {
		playListName: name,
		songsList: songsList,
	}
}

const likedSongs = new PlayList('.playlist-player', responseFromServer, 'Твои любимые')
const popular = new PlayList('.playlist-player', responseFromServer, 'Популярные')




let Player = {
	playSong(button) {
		button.classList.add('play');
		button.src = 'https://cdn-icons-png.flaticon.com/512/709/709691.png';
		audioPlayer.play();
	},

	pauseSong(button) {
		button.classList.remove('play');
		button.src = 'https://cdn-icons-png.flaticon.com/512/109/109197.png';
		audioPlayer.pause();
	},

	changeVolume() {
		let volume = '0.' + audioVolume.value;
		audioPlayer.volume = volume;
	},

	updateDurationLine() {
		let percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
		audioCurrentLine.style.width = `${percent}%`;
		audioCurrentDuration.innerHTML = this.convertIntoMinutes(audioPlayer.currentTime)
	},

	setDuration() {
		audioDuration.innerHTML = this.convertIntoMinutes(audioPlayer.duration)
	},

	changeDurationLine(coordinate) {
		let width = audioLine.clientWidth;
		let coordinateX = coordinate.offsetX;

		audioPlayer.currentTime = (coordinateX / width) * audioPlayer.duration;
	},

	convertIntoMinutes(number) {
		let time = number;
		let hours = Math.floor(time / 60 / 60);
		let min = Math.floor(time / 60) - (hours * 60);
		let sec = Math.floor(time % 60);
		
		return `${min}:${sec.toString().padStart(2, '0')}`
	}
}

playerAction.addEventListener('click', el =>{
	let target = el.target.tagName;
	if (target === 'IMG') {
		let isPlaying = el.target.classList.contains('play')

		if (isPlaying) {
			Player.pauseSong(el.target)
		} else {
			Player.playSong(el.target)
		}
	}
})

audioPlayer.addEventListener('timeupdate', function() {
	Player.updateDurationLine()
})

audioLine.addEventListener('click', Player.changeDurationLine)

audioVolume.addEventListener('input', Player.changeVolume)

audioPlayer.addEventListener('canplay', function() {
	Player.setDuration()
})