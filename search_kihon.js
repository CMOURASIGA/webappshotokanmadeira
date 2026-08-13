async function search(query) {
  const q = encodeURIComponent(query + ' "ULTIMATE KARATE"');
  const res = await fetch(`https://www.youtube.com/results?search_query=${q}`);
  const html = await res.text();
  const match = html.match(/{"videoRenderer":{"videoId":"([^"]+)".*?"title":{"runs":\[{"text":"([^"]+)"}\]}/);
  if (match) {
    console.log(query + ' => ' + match[1] + ' : ' + match[2]);
  } else {
    console.log(query + ' => NOT FOUND');
  }
}

async function run() {
  await search('Zenkutsu Dachi');
  await search('Kokutsu Dachi');
  await search('Kiba Dachi');
  await search('Oi Zuki');
  await search('Gyaku Zuki');
  await search('Age Uke');
  await search('Soto Uke');
  await search('Mae Geri');
  await search('Mawashi Geri');
}
run();
