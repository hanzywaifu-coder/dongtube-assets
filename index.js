// dongtube-assets - Simple entry point
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
}

const dataDir = path.join(__dirname, 'data');

module.exports = {
  font: new AssetManager(path.join(dataDir, 'fonts')),
  image: new AssetManager(path.join(dataDir, 'images')),
};
