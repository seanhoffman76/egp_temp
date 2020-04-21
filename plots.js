function buildPlot() {
    var json = "life_gdp.json";

    d3.json(json).then(function(data){
        var gdp = []
        var life = []
        var country = []
        data.forEach(function(jsonData){
            gdp.push(jsonData.total_gdp)
            life.push(jsonData.life_exp)
            country.push(jsonData.country)
        });
        // var gdp = data.total_gdp;
        // console.log(data)
        // var life = data.life_exp;

        var trace1 = {
            type: "scatter",
            mode: "markers",
            text: country,
            x: life,
            y: gdp
        };

        var data = [trace1];

        var layout = {
            title: "2017 GDP vs Life Expectancy by Country",
            xaxis: { title: "Life Expectancy" },
            yaxis: { title: "Total GDP" }
        };

        Plotly.newPlot("plot", data, layout);
    });
}
buildPlot();
