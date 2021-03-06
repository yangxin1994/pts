Pts.namespace( this );

(function() {

  // var sourceCodePath = "https://github.com/williamngan/pts/blob/master/guide/js/examples/";
  var sourceCodePath = "/demo/edit/?name=guide.";

  var blocks = Array.from( document.querySelectorAll("img") ).filter( (f) => {
    var t = f.getAttribute("alt");
    var idx = t.indexOf("js:");
    return idx === 0;
  });

  for (let i=0, len=blocks.length; i<len; i++) {
    createDemoContainer( blocks[i] );
  }

  var demos = {};
  window.registerDemo = function( id, space, startFn, stopFn, isCustom ) {
    demos[id] = { space: space, startCallback: startFn, stopCallback: stopFn, isCustom: isCustom };
  }

  function createDemoContainer( imgElem ) {
    var div = document.createElement("div");
    var divID = imgElem.getAttribute("alt").replace(/js\:/gi, "");

    var link = document.createElement("a");
    link.textContent = "Edit live code ";
    link.classList.add("sourceCodeLink");
    link.setAttribute( "target", "pts_github");
    link.setAttribute( "href", sourceCodePath+divID);
    div.appendChild( link );

    div.setAttribute("class", "demoOverlay");
    div.setAttribute("id", divID );
    imgElem.parentNode.appendChild( div );

    loadDemo( div, divID );

    function startDemo(evt) {
      div.classList.add("active");
      let d = demos[divID];
      if (d && d.space && !d.isCustom ) d.space.replay();
      if (d && d.startCallback) d.startCallback();
    }

    function stopDemo(evt) {
      div.classList.remove("active");
      let d = demos[divID];
      if (d && d.space && !d.isCustom) d.space.stop();
      if (d && d.stopCallback) d.stopCallback();
    }

    div.addEventListener( 'mouseenter', startDemo );
    div.addEventListener( 'touchstart', startDemo );
    div.addEventListener( 'mouseleave', stopDemo );
    div.addEventListener( 'touchend', stopDemo );
  }

  function loadDemo( div, demoID ) {
    var script = document.createElement('script');
    try {
      script.src = "./js/examples/"+demoID+".js";
      script.onload = function () {
          console.log( "loaded " + demoID );
      };
    } catch (e) {
      console.warn( e  );
    }

    document.body.appendChild(script);
  }

  function cap(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function updateCodeLinks() {
    var codes = document.querySelectorAll("a > code");
    for (let i=0, len=codes.length; i<len; i++) {
      let c = codes[i];
      
      if (c.parentNode.getAttribute("href").indexOf("#") === 0 && c.textContent) {
        let link = c.parentNode.getAttribute("href").replace(/#/g, "").split("-");
        let linkAnchor = c.textContent.split(".");
        let ftype = (linkAnchor.length > 1 && linkAnchor[0] === "") ? "accessor" : "function";
        linkAnchor = linkAnchor[linkAnchor.length-1].replace(/[^a-zA-Z0-9._\$]/g, "_");
        c.parentNode.setAttribute( "href", `../docs/?p=${cap(link[0])}_${cap(link[1] || link[0])}#${ftype}_${linkAnchor}` );
        c.parentNode.setAttribute( "target", "ptsdocs");
      }
      // c.parentElement.setAttribute( "target", "_blank" );
    }
  }

  window.addEventListener("load", (evt) => {
    updateCodeLinks();
  });

  
})();

