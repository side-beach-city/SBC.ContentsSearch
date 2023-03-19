function getYoutubePlaylists(playlistId, token) {
  const params = {
    playlistId: playlistId,
  };
  if(token) params["pageToken"] = token;
  const list = YouTube.PlaylistItems.list(["snippet", "status"], params);
  return list.nextPageToken ? list.items.concat(getYoutubePlaylists(playlistId, list.nextPageToken)) : list.items;
}

function testGetYoutubePlaylists(playlistId) {
  const list = getYoutubePlaylists(COLUMN_PLAYLISTID);
  console.log("getYoutubePlaylists() Finished.")
  console.log(`Test ${list.length > 0 ? "OK" : "NG"}`);
}