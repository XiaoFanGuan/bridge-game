class Sound{
    static play(file){
        const sound = document.querySelector('#sound')
        sound.innerHTML = '<audio controls="controls" id="audio_player" style="display:none;"> <source src="' + file + '" > </audio><embed id="MPlayer_Alert" src="/sounds/'+file+'.mp3" loop="false" width="0px" height="0px" /></embed>';
    }
}

export default Sound