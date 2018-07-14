const generateHTML = ({ imageUrl, date, location, likeCount, caption, page }) => `
<html>
<head>
  <meta charset="utf-8" content="text/html;"/>
  <title>HTML5</title>
  <style>
  @font-face {
    font-family: 'ProximaNova';
    src: url(http://185.195.26.110:8080/ProximaNova-Regular.ttf) format("truetype"); 
   }
   @font-face {
    font-family: 'Arial';
    src: url(http://185.195.26.110:8080/arial_italic.ttf) format("truetype"); 
   }
    .emoji {
      width: 1.1em;
      height: 1.1em;
      padding: 0 0 0 0;
      vertical-align: -0.15em;
    }
  </style>
</head>

<body>
<div style="width: 100%;height: 93%;overflow: hidden; padding-top: 40px;padding-bottom: 10px;">
    <div style="text-align: center">    
    <img style="max-height:900px;max-width:830px;object-fit:cover" src="${imageUrl}"> 
    </div>
  
  <div style="display: flex;justify-content: space-between;margin: 30px 70px 0">
      <div style="font-family: 'Arial';text-align: left;color: black;font-style: italic; float:left;font-size: 28px">
          10 июля 2018
      </div>
    <div style="margin-top:0px;text-align: right;color: black;font-style: italic; font-size: 28px;">
      <span>
        <img style="font-family: 'Arial';position:relative;top: 6px" src="http://185.195.26.110:8080/images/heart.jpg" alt="">
      </span>
        ${likeCount}
    </div>
  </div>
  <div style="font-family: 'Arial';margin: 0px 70px 0;text-align: left;color: black;font-style: italic; font-size: 28px">
          ${location}
      </div>
  <div class="with-emoji" style="font-family: 'ProximaNova';text-align: left;color: black;font-size: 24px;margin: 50px 70px;min-height: 162px">
     ${caption || ''}
  </div>
 </div>
<div style="text-align: center;width: 100%;font-size: 28px">${page}</div>




  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
  <script src="http://185.195.26.110:8080/emoji.js"></script>
  <script>
  $(function(){
    $('.with-emoji').Emoji({
      path:  'http://185.195.26.110:8080/images/apple72/',
	    class: 'emoji',
      ext:   'png'
    });
  });
  </script>
</body>
</html>
`

export { generateHTML }
