const playlistId = "PLrPVslFukDQo7l5RCqAZtKDl6tUyMAFWH";

function getData() {
  const list = YouTube.PlaylistItems.list(["snippet", "status"], {
    playlistId: playlistId
  });
  const data = [];
  list.items.forEach((v) => {
    if(v.status.privacyStatus == "public"){
      data.push({
        title: v.snippet.title,
        img: v.snippet.thumbnails.default.url,
        link: `https://www.youtube.com/watch?v=${v.snippet.resourceId.videoId}&list=${v.snippet.playlistId}`,
        description: v.snippet.description,
        date: new Date(v.snippet.publishedAt)
      });
      Logger.log(v.snippet.title);
    }
  });
  return data;
}

function test(){
  const data = getData();
  const ytrexp = /(SBC\.?オープンマイク\s*#\d+)/;
  let success = true;
  data.forEach((e) => {
    console.log(`> ${e.title}`);
    let m = ytrexp.exec(e.title);
    let s = e.title && e.link && e.img && e.description && e.date && m && m.length == 2;
    console.log(s ? "OK": "NG");
    success = s;
  });
  console.log("getData() Finished");
  console.log(`Test ${success ? "OK": "NG"}`);
}
