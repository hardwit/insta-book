const generateHTML = ({ imageUrl, date, location, likeCount, capture }) => `
<html>
<head>
  <meta charset="utf-8" content="text/html;"/>
  <title>HTML5</title>
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
  <div style="text-align: left;color: black;font-size: 24px;margin: 50px 70px">
     ${capture || ''}
  </div>
</body>
</html>
`

export { generateHTML }
