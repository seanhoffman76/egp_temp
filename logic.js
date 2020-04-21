console.log("lo",lo)

var sparkles={}
Object.keys(lo[0]["country_code"]).forEach(function(temp){
cc=lo[0]["country_code"][temp]
le=lo[0]["life_exp(years)"][temp]
sparkles[cc]=le
})

var myMap = L.map("map", {
    center: [46.2276, -2.2137],
    zoom: 2
  });
  

  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(myMap);
  console.log("17")
  function test(name){
    cc=name.ISO_A3
    console.log(name,life)
    if(cc in sparkles){
      le=sparkles[cc]
    
    } else{
      le=-1
    }

    console.log("here",le,name.ISO_A3)

if(le>=80){
  return "red"
} 
else if(le>=75){
  return "blue"
}
else if(le>=70){
  return "orange"
}
else if(le>=65){
  return "yellow"
}
else if(le>=60){
  return "purple"
}
else if(le>=55){
  return "green"
}
else if(le>=50){
  return "grey"
}
 }
  

  var link = "countries.geojson";
 
  
  d3.json(link).then (function(lifedata) {
  
    console.log("life",lifedata)
 
    
  
    // Creating a geoJSON layer with data
    L.geoJson(lifedata, {

      style: function(feature) {
        return {
          color: "white",
          fillColor: test(feature.properties),
          fillOpacity: 0.5,
          weight: 1.5
      }}, 
    }).addTo(myMap);
  });



var legend = L.control({ position: "bottomleft" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Life Expecancy</h4>";
  div.innerHTML += '<i style="background: red"></i><span>80+</span><br>';
  div.innerHTML += '<i style="background: blue"></i><span>75-79</span><br>';
  div.innerHTML += '<i style="background: orange"></i><span>70-74</span><br>';
  div.innerHTML += '<i style="background: yellow"></i><span>65-69</span><br>';
  div.innerHTML += '<i style="background: purple"></i><span>60-64</span><br>';  
  div.innerHTML += '<i style="background: green"></i><span>55-59</span><br>';  
  div.innerHTML += '<i style="background: grey"></i><span>0-54</span><br>';  


  return div;
};

legend.addTo(myMap);
