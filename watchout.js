    var width = 700,
        height = 450,
        radius = 10;

    var nEnemies = 30;

    var highScore = 0,
        score = 0;

    d3.select("#high-score").text(highScore);
    d3.select("#score").text(score);

    var updateScore = function() {
      d3.select("#score").text(score);
    }

    var updateHighScore = function() {
      if (score > highScore) {
        highScore = score;
      }
      d3.select("#high-score").text(highScore);
    }

    var svg = d3.select(".container").append("svg")
        .attr("width", width)
        .attr("height", height);

    var playerData = [{x:width/2, y:height/2}];
    var data = d3.range(nEnemies);

    var drag = d3.behavior.drag()
        .on("drag", function(d,i) {
            d.x += d3.event.dx
            d.y += d3.event.dy
            d3.select(this).attr("cx", d.x)
            d3.select(this).attr("cy", d.y)
        });

    var checkCollision = function(enemy){
      var player = d3.select(".player")
      var xDiff = enemy.attr("cx") - player.attr("cx")
      var yDiff = enemy.attr("cy") - player.attr("cy")
      var distance = Math.sqrt(Math.pow(xDiff,2) + Math.pow(yDiff,2))

      if(distance<radius*2){
        updateHighScore();
        score = 0;
        updateScore();
       }
    };

    svg.append('filter')
      .attr('id', 'shuriken')
      .attr('width', '100%')
      .attr('height', '100%')
      .append('feImage')
      .attr('xlink:href', 'shuriken-icon.png')

    svg.append('filter')
      .attr('id', 'ninja')
      .attr('width', '100%')
      .attr('height', '100%')
      .append('feImage')
      .attr('xlink:href', 'ninja.png')

    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr('class', 'enemy')
      .attr("r", radius)
      .attr('filter', 'url(#shuriken)')

    svg.selectAll(".enemy")
      .attr("cx", function(){return Math.random()* ((width-radius*2) - (radius*2))  + (radius*2);})
      .attr("cy", function(){return Math.random()* ((height-radius*2) - (radius*2))  + (radius*2);})

    svg.append("circle")
      .data(playerData)
      .attr({"class": "player", "cx": width/2, "cy": height/2, "r": radius})
      .attr('filter', 'url(#ninja)')
      .call(drag);

    setInterval(function() {
      svg.selectAll(".enemy")
         .transition()
           .duration(900)
           .ease("cubic-in-out")
           .attr("cx", function(){return Math.random()*((width-radius*2) - (radius*2))  + (radius*2);})
           .attr("cy", function(){return Math.random()*((height-radius*2) - (radius*2))  + (radius*2);})
           .tween("custom", function(d,i){
              var enemy = d3.select(this);
              return function(t) {
                checkCollision(enemy)
              }
           })
    }, 1000);

    setTimeout(function() { setInterval(function() { score++; updateScore(); }, 50); }, 1000);

