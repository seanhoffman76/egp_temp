console.log("i'm here")
  function buildPlot() {
    d3.json("life.json").then(function(data) {

    var hold = {}
    data.forEach(function(temp_data) {
      country = temp_data.country
      life = temp_data["life_exp(years)"]
      year = +temp_data["year"]
      if (year == 2019) {
        if (country in hold) {
          if (life > hold[country]) {
          hold[country] = life 
        }
        } 
        else {
        hold[country] = life
        }
      }
        
    })

  let keys = Object.keys(hold);
// Then sort by using the keys to lookup the values in the original object:
    keys.sort(function(a, b) { return hold[b] - hold[a] });
    keys.forEach(function(h) {
      console.log(h, hold[h])
    });
  var top_ten = keys.slice(0, 10);
  // var startYear = 2010;
  // var endYear = 2019;

  console.log(top_ten);

  
      var trace1 = {
        x: year,
        y: life,
        type: "scatter",
        mode: "lines",
        name: country,
        line: {
          color: "#17BECF"
        }
      };  
      var data = [trace1];
  
      var layout = {
        title: "Life Expectancy",
        xaxis: {
          range: [year == 2010, year ==2019],
          type: "date"
        },
        yaxis: {
          autorange: true,
          range: [25, 90],
          type: "linear"
        }
      };
  
      Plotly.newPlot("lifex", data, layout);
  
    });

}

buildPlot();