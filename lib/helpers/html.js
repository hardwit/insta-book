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

<body style="padding: 0; width: 100%">
  <img style="height:auto;width100%;object-fit: cover;" src="${imageUrl}">
  <div style="display: flex;justify-content: space-between;align-items: center;margin: 0 70px">
    <div style="margin-top: 40px">
      <div style="text-align: left;color: black;font-style: italic; font-size: 28px">
          ${date}
      </div>
      <div style="text-align: left;color: black;font-style: italic; font-size: 28px">
          ${location}
      </div>
    </div>
    <div style="margin-top:-50px;text-align: right;color: black;font-style: italic; font-size: 28px;">
      like ${likeCount}
    </div>
  </div>
  <div class="with-emoji" style="text-align: left;color: black;font-size: 24px;margin: 50px 70px">
     ${caption || ''}
  </div>
  <div>Страница: ${page}</div>




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
