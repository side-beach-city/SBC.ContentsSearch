document.body.onload = (e) => {
  const entry_youtube = [
  ];
  const sbcast = document.querySelector("#contents_sbcast ul");
  const openmic = document.querySelector("#contents_openmic ul");
  const rexp = /SBCast\.\s*(#\d+[^(]+)\(([^)]*)\)?/;
  const rexp2 = /SBCast\.\s*(#\d+)[\s:]+(.*)/;
  entry_casts.forEach(e => {
    let tmpl = document.getElementById("tmpl_sbcast_entry").content.cloneNode(true);
    let m = rexp.exec(e.title);
    if(!m) m = rexp2.exec(e.title);
    tmpl.querySelector("h3").title = `SBCast.${m[1]}${m[2]}`;
    tmpl.querySelector("img").src = e.img;
    tmpl.querySelector("a").href = e.link;
    tmpl.querySelector("a").textContent = `SBCast.${m[1]}`;
    tmpl.querySelector("p").textContent = m[2];
    e.tags.forEach(t => {
      let li = document.createElement("li");
      li.textContent = t;
      tmpl.querySelector("ul").appendChild(li);  
    });
    tmpl.querySelector("span").textContent = e.length;
    sbcast.appendChild(tmpl);
  });
  const ytrexp = /(SBC\.オープンマイク\s#\d+)/;
  entry_youtube.forEach(e => {
    let tmpl = document.getElementById("tmpl_youtube_entry").content.cloneNode(true);
    let m = ytrexp.exec(e.title);
    tmpl.querySelector("h3").title = e.title;
    tmpl.querySelector("img").src = e.img;
    tmpl.querySelector("a").href = e.link;
    tmpl.querySelector("a").textContent = m[1];
    tmpl.querySelector("p").textContent = e.title;
    openmic.appendChild(tmpl); 
  });
}

document.getElementById("text").addEventListener("input", (e) => {
  const text = document.getElementById("text").value;
  filtering(text, document.querySelector("#contents_sbcast ul"));
  filtering(text, document.querySelector("#contents_openmic ul"));
});

document.getElementById("tabs_sbcast").click();

function filtering(word, root){
  const w = word.toLowerCase();
  Array.from(root.children).forEach(n => {
    console.log(n);
    const s = w == "" || n.textContent.toLowerCase().includes(w) ? "" : "none";
    n.style.setProperty("display", s, "important");
  });
}

