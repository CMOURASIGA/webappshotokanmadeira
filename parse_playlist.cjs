const fs = require('fs');
async function run() {
  const res = await fetch('https://www.youtube.com/playlist?list=PLNJWsfwuRNlglyd8D1Az3o4qbOI5aAG9R');
  const text = await res.text();
  const match = text.match(/var ytInitialData = (\{.*?\});<\/script>/);
  if (!match) return console.log("ytInitialData not found");
  
  const data = JSON.parse(match[1]);
  
  // Recursively find playlistVideoRenderer
  function findPlaylistVideos(obj, results = []) {
    if (typeof obj !== 'object' || obj === null) return;
    
    if (obj.playlistVideoRenderer) {
      results.push(obj.playlistVideoRenderer);
    }
    
    for (const key in obj) {
      if (Array.isArray(obj[key])) {
        for (const item of obj[key]) {
          findPlaylistVideos(item, results);
        }
      } else if (typeof obj[key] === 'object') {
        findPlaylistVideos(obj[key], results);
      }
    }
    return results;
  }
  
  const videos = findPlaylistVideos(data);
  videos.forEach(v => {
    let title = "Unknown Title";
    if (v.title && v.title.runs) {
      title = v.title.runs[0].text;
    }
    console.log(`${title} || https://www.youtube.com/embed/${v.videoId}`);
  });
}
run();
