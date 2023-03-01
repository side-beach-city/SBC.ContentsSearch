const playlistId = "PLrPVslFukDQo7l5RCqAZtKDl6tUyMAFWH";

function _getDataToken(token){
  const params = {
    playlistId: playlistId,
  };
  if(token) params["pageToken"] = token;
  const list = YouTube.PlaylistItems.list(["snippet", "status"], params);
  return list.nextPageToken ? list.items.concat(_getDataToken(list.nextPageToken)) : list.items;
}

function getData() {
  const list = _getDataToken();
  const data = [];
  list.forEach((v) => {
    if(v.status.privacyStatus == "public"){
      data.push({
        title: v.snippet.title,
        img: v.snippet.thumbnails.default.url,
        link: `https://www.youtube.com/watch?v=${v.snippet.resourceId.videoId}&list=${v.snippet.playlistId}`,
        description: v.snippet.description,
        date: new Date(v.snippet.publishedAt).toISOString().split("T").shift().replaceAll("-", "/")
      });
      Logger.log(v.snippet.title);
    }
  });
  return data;
}

function testOMGetDataToken(){
  const list = _getDataToken();
  list.forEach(e => {
    Logger.log(e.snippet.title);
  });
  Logger.log("_getDataToken() Finished");
  Logger.log(`Test ${list.length >= 10 ? "OK": "NG"}`);

}

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
