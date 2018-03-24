const NodeID3 = require('node-id3')

module.exports = {
  audio(file) {
    const tags = NodeID3.read(file.path)
    return {
      url: `/${file.path}`,
      filename: file.originalname,
      title: tags.title,
      artist: tags.artist,
      album: tags.album,
      image: tags.image,
      time: tags.time,
      lyrics: tags.unsynchronisedLyrics
    }
  }
}
