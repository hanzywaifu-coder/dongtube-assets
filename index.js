/*
 * Dongtube Assets — Entry Point
 * Developer: 6283143961588
 * Channel: https://whatsapp.com/channel/0029Vb91qeW17Emm4TVqu53KJ
 */
const fs = require('fs');
const path = require('path');

class AssetManager {
  constructor(dir) {
    this.loaded = false;
    this.data = {};
    this.dir = dir;
  }
  load() {
    if (this.loaded) return;
    const files = fs.readdirSync(this.dir);
    for (const file of files) {
      const name = file.split('.').shift().toUpperCase();
      this.data[name] = path.join(this.dir, file);
    }
    this.loaded = true;
  }
  get(name) {
    this.load();
    const key = (name || '').toUpperCase();
    return this.data[key] || null;
  }
  path(name) { return this.get(name); }
}

const dataDir = path.join(__dirname, 'data');

module.exports = {
  font: new AssetManager(path.join(dataDir, 'fonts')),
  image: new AssetManager(path.join(dataDir, 'images')),
  canvas: require('./canvas'),
};
