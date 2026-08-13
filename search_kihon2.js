async function search(query) {
  const q = encodeURIComponent(query + ' "ULTIMATE KARATE"');
  const res = await fetch(`https://www.youtube.com/results?search_query=${q}`);
  const html = await res.text();
  const match = html.match(/{"videoRenderer":{"videoId":"([^"]+)".*?"title":{"runs":\[{"text":"([^"]+)"}\]/);
  if (match && match[2] !== 'Intro') {
    console.log(query + ' => ' + match[1] + ' : ' + match[2]);
  } else {
    // Try a simpler regex to grab the video title from the aria-label
    const match2 = html.match(/"title":{"accessibility":{"accessibilityData":{"label":"([^"]+)"}}/);
    const idMatch = html.match(/{"videoRenderer":{"videoId":"([^"]+)"/);
    if (match2 && idMatch) {
        console.log(query + ' => ' + idMatch[1] + ' : ' + match2[1].split(' by ')[0]);
    } else {
        console.log(query + ' => NOT FOUND');
    }
  }
}

async function run() {
  await search('Zenkutsu Dachi');
  await search('Oi Zuki');
  await search('Age Uke');
  await search('Mae Geri');
}
run();
