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
  await search('Heian Shodan');
  await search('Heian Nidan');
  await search('Heian Sandan');
  await search('Heian Yondan');
  await search('Heian Godan');
  await search('Tekki Shodan');
  await search('Bassai Dai');
  await search('Kanku Dai');
  await search('Empi');
  await search('Jion');
}
run();
