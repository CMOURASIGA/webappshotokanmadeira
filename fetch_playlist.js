async function run() {
  const res = await fetch('https://www.youtube.com/playlist?list=PLNJWsfwuRNlglyd8D1Az3o4qbOI5aAG9R');
  const text = await res.text();
  const regex = /"playlistVideoRenderer":\{"videoId":"([^"]+)".*?"title":\{"runs":\[\{"text":"([^"]+)"\}\]/g;
  let match;
  const seen = new Set();
  while ((match = regex.exec(text)) !== null) {
    const videoId = match[1];
    const title = match[2];
    if (!seen.has(videoId)) {
      console.log(`${title} || https://www.youtube.com/embed/${videoId}`);
      seen.add(videoId);
    }
  }
}
run();
