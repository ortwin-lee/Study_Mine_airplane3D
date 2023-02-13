import { _decorator, AudioClip, AudioSource, Component } from 'cc';
const { ccclass, property } = _decorator;

interface IAudioMap {
    [name: string] : AudioClip;
}

@ccclass('AudioManager')
export class AudioManager extends Component {

    @property([AudioClip])
    public audioList: AudioClip[] = [];

    private _audioDict: IAudioMap = {};
    private _audioSource: AudioSource = null;

    onEnable() {
        for(let i of this.audioList) {
            this._audioDict[i.name] = i;
        }

        this._audioSource = this.getComponent(AudioSource);
    }

    public play(name: string) {
        const audioClip = this._audioDict[name];
        if(audioClip !== undefined) {
            this._audioSource.playOneShot(audioClip);
        }
    }
}


