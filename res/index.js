document.body.onload = (e) => {
  const sbcast = document.querySelector("#contents_sbcast ul");
  const openmic = document.querySelector("#contents_openmic ul");
  const blog = document.querySelector("#contents_blog ul");
  const rexp = /SBCast\.\s*(#\d+[^(]+)\(([^)]*)\)?/;
  const rexp2 = /SBCast\.\s*(#\d+)[\s:]+(.*)/;
  entry_casts.forEach((e, index) => {
    let tmpl = document.getElementById("tmpl_sbcast_entry").content.cloneNode(true);
    let m = rexp.exec(e.title);
    if(!m) m = rexp2.exec(e.title);
    const id = `SBCast_${index}`;
    tmpl.querySelector("a.contentlink").title = `SBCast.${m[1]}${m[2]}`;
    tmpl.querySelector("img").src = e.img;
    tmpl.querySelector("a.contentlink").href = e.link;
    tmpl.querySelector("a.contentlink").textContent = `SBCast.${m[1]}`;
    tmpl.querySelector(".text > a").textContent = m[2];
    tmpl.querySelector(".text > a").ariaControls = id;
    tmpl.querySelector(".text > a").href = `#${id}`;
    tmpl.querySelector(".text .collapse").id = id;
    tmpl.querySelector(".text .card-body").textContent = e.description;
    e.tags.forEach(t => {
      let li = document.createElement("li");
      li.textContent = t;
      tmpl.querySelector("ul").appendChild(li);  
    });
    tmpl.querySelector("span").textContent = e.length;
    sbcast.appendChild(tmpl);
  });
  const omrexp = /(SBC\.?オープンマイク\s*#\d+)/;
  entry_openmic.forEach((e, index) => {
    let tmpl = document.getElementById("tmpl_openmic_entry").content.cloneNode(true);
    let m = omrexp.exec(e.title);
    const id = `OpenMic_${index}`;
    tmpl.querySelector("a.contentlink").title = e.title;
    tmpl.querySelector("img").src = e.img;
    tmpl.querySelector("a.contentlink").href = e.link;
    tmpl.querySelector("a.contentlink").textContent = m[1];
    tmpl.querySelector(".text > a").textContent = e.title;
    tmpl.querySelector(".text > a").ariaControls = id;
    tmpl.querySelector(".text > a").href = `#${id}`;
    tmpl.querySelector(".text .collapse").id = id;
    tmpl.querySelector(".text .card-body").innerHTML = e.description.replaceAll("\n", "<br>");
    tmpl.querySelector("span").textContent = e.date;
    openmic.appendChild(tmpl); 
  });
  const blogrexp = /^([^\n。]+(?:[\n。]))/;
  entry_blog.forEach(async(e, index) => {
    let tmpl = document.getElementById("tmpl_blog_entry").content.cloneNode(true);
    let m = blogrexp.exec(e.description);
    const id = `Blog_${index}`;
    tmpl.querySelector("a.contentlink").title = e.title;
    tmpl.querySelector("img").src = e.img;
    tmpl.querySelector("a.contentlink").href = e.link;
    tmpl.querySelector("a.contentlink").textContent = e.title;
    tmpl.querySelector(".text > a").textContent = m[1];
    tmpl.querySelector(".text > a").ariaControls = id;
    tmpl.querySelector(".text > a").href = `#${id}`;
    tmpl.querySelector(".text .collapse").id = id;
    tmpl.querySelector(".text .card-body").innerHTML = e.description.replaceAll("\n", "<br>");
    tmpl.querySelector("span").textContent = e.date;
    e.tags.forEach(t => {
      let li = document.createElement("li");
      li.textContent = t;
      tmpl.querySelector("ul").appendChild(li);  
    });
    blog.appendChild(tmpl); 
  });

  document.querySelectorAll(".copytoclip").forEach((e) => {
    e.addEventListener("click", (v) => {
      let media = v.target;
      while(!media.classList.contains("media")){
        media = media.parentNode;
      }
      const title = media.querySelector("a.contentlink").title;
      const link = media.querySelector("a").href;
      let copytext;
      switch(v.target.dataset.type){
        case "plain": copytext = `${title} ${link}`; break;
        case "md": copytext = `[${title}](${link})`; break;
        case "url": copytext = link;break;
      }
      const pre = document.createElement('pre');
      try{
        pre.style.userSelect = 'auto';
        pre.textContent = copytext;
        document.body.appendChild(pre);
        document.getSelection().selectAllChildren(pre);
        navigator.clipboard.writeText(pre.textContent);
      }finally{
        document.body.removeChild(pre);
      }
    });
  });

  document.getElementById("tabs_sbcast").click();
}

document.getElementById("text").addEventListener("input", (e) => {
  const text = document.getElementById("text").value;
  filtering(text, document.querySelector("#contents_sbcast ul"));
  filtering(text, document.querySelector("#contents_openmic ul"));
});

function filtering(word, root){
  const w = word.toLowerCase();
  Array.from(root.children).forEach(n => {
    console.log(n);
    const s = w == "" || n.textContent.toLowerCase().includes(w) ? "" : "none";
    n.style.setProperty("display", s, "important");
  });
}

