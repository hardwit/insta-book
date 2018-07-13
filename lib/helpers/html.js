const generateHTML = ({ imageUrl, date, location, likeCount, caption, page }) => `
<html>
<head>
  <meta charset="utf-8" content="text/html;"/>
  <title>HTML5</title>
  <style>
    .emoji {
      width: 1.1em;
      height: 1.1em;
      padding: 0 0 0 0;
      vertical-align: -0.15em;
    }
  </style>
</head>

<body>
<div style="width: 100%;height: 97%;overflow: hidden">
    <div style="text-align: center">
    
    <img style="max-height:900px;max-width:830px;object-fit:cover" src="https://scontent-arn2-1.cdninstagram.com/vp/ae960435054b74fbd52df4012c965d1e/5BE42345/t51.2885-15/e35/33994926_255916468300361_4483932207617933312_n.jpg?efg=eyJ1cmxnZW4iOiJ1cmxnZW
5fZnJvbV9pZyJ9&se=8&ig_cache_key=MTc5ODA4MjI4NzkyMzI5NzM5Mw%3D%3D.2"> 
    </div>
  
  <div style="display: flex;justify-content: space-between;margin: 30px 70px 0">
      <div style="text-align: left;color: black;font-style: italic; float:left;font-size: 28px">
          data
      </div>
    <div style="margin-top:0px;text-align: right;color: black;font-style: italic; font-size: 28px;">
      <span>
        <img style="position:relative;top: 6px" src="http://185.195.26.110:8080/images/heart.jpg" alt="">
      </span>
        ${likeCount}
    </div>
  </div>
  <div style=" margin: 0px 70px 0;text-align: left;color: black;font-style: italic; font-size: 28px">
          ${location}
      </div>
  <div class="with-emoji" style="text-align: left;color: black;font-size: 24px;margin: 50px 70px;min-height: 162px">
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
