import { Audio } from "expo-av";

const soundObjects = {};

class AudioPlayer {
  static async initializeAudio() {}

  static load(library) {
    // console.log(`preload sounds : ${Object.keys(library).join(", ")}`);
    const promisedSoundObjects = [];

    for (const name in library) {
      const sound = library[name];
      soundObjects[name] = new Audio.Sound();
      promisedSoundObjects.push(soundObjects[name].loadAsync(sound));
    }
    return promisedSoundObjects;
  }

  static async playSound(name) {
    try {
      if (soundObjects[name]) {
        soundObjects[name].replayAsync({ volume: 0.5 });
      }
    } catch (error) {
      console.warn(error);
    }
  }

  static async stopSound() {
    Object.entries(soundObjects).forEach(([key, soundObject]) => {
      soundObject.stopAsync();
    });
  }
}

export default AudioPlayer;
