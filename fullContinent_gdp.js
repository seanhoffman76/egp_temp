const pg = require('pg');
const fs = require('fs')
const cs = 'postgres://postgres:postgres@localhost:5432/gdp_db';
const client = new pg.Client(cs);
client.connect();
client.query("select year, country, c.continent_code, c.two_letter_cc, c.three_letter_cc, total_gdp, rank From (SELECT year, country, total_gdp, country_code, RANK() OVER (PARTITION BY year ORDER BY total_gdp DESC) AS rank FROM gdp) AS gdp_win left join continent_codes c on (gdp_win.country_code = c.three_letter_cc) WHERE gdp_win.rank <= 30;").then(res => {
    const data = res.rows;
    fs.writeFileSync('bar_race.json', JSON.stringify(data))
}).finally(() => client.end());