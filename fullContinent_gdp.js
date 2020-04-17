const pg = require('pg');
const fs = require('fs')
const cs = 'postgres://postgres:postgres@localhost:5432/gdp_db';
const client = new pg.Client(cs);
client.connect();
client.query("SELECT year, country AS name, c.continent_code, c.two_letter_cc AS two_cc, c.three_letter_cc AS three_cc, total_gdp/1000000 AS value, CASE WHEN LAG(total_gdp,1) OVER (PARTITION BY country ORDER BY year) > 0 THEN LAG(total_gdp,1) OVER (PARTITION BY country ORDER BY year)/1000000 ELSE total_gdp/1000000 END AS lastValue, rank FROM (SELECT year, country, total_gdp, country_code, RANK() OVER (PARTITION BY year ORDER BY total_gdp DESC) AS rank FROM gdp) AS gdp_win LEFT JOIN continent_codes c on (gdp_win.country_code = c.three_letter_cc) WHERE gdp_win.rank <= 30 AND year >= 1950;").then(res => {
    const data = res.rows;
    fs.writeFileSync('bar_race.json', JSON.stringify(data))
}).finally(() => client.end());