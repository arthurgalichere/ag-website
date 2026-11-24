# Data dictionary: financial-stock-market.json

File: https://arthurgalichere.com/assets/data/economics/us/financial-stock-market.json (generated 2026-11-24T22:39:54+00:00 UTC). Missing values are JSON null. Dates are the first day of the period (quarter, month or year). When a series exists in several versions, one row covers them, with a placeholder in the path: {filter} = hp, hamilton or cf (the filter). First and last dates marked (varies) differ across those versions.

## Series

| path | meaning | units | transformation | first | last | n |
|---|---|---|---|---|---|---|
| indicators.sp_price_real.observations.value | Real stock prices | Percent deviation from trend | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.sp_price_nominal.observations.value | S&P 500 stock price index (nominal) | Index | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.sp_dividends_real.observations.value | Real dividends | Percent deviation from trend | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.sp_dividends_nominal.observations.value | S&P 500 dividends (12 months, nominal) | Index units, 12-month total | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.sp_earnings_real.observations.value | Real earnings | Percent deviation from trend | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.sp_earnings_nominal.observations.value | S&P 500 earnings (12 months, nominal) | Index units, 12-month total | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.sp_pd.observations.value | Price–dividend ratio | Percent deviation from trend | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.sp_dp.observations.value | Dividend–price ratio | Percent (12-month dividends over price) | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.sp_pe.observations.value | Price–earnings ratio (12-month earnings) | Ratio | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.sp_cape.observations.value | CAPE | Percent deviation from trend | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.g_price_real.observations.value | Growth rate of real stock prices | Percent per quarter | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.g_dividends_real.observations.value | Growth rate of real dividends | Percent per quarter | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.g_earnings_real.observations.value | Growth rate of real earnings | Percent per quarter | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.g_pd.observations.value | Growth rate of the price–dividend ratio | Percent per quarter | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.g_dp.observations.value | Growth rate of the dividend–price ratio | Percent per quarter | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.sp_return_real.observations.value | Real total return | Percent per quarter | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.sp_capital_gain_real.observations.value | Real capital gain | Percent per quarter | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.sp_return_nominal.observations.value | Nominal total return | Percent per quarter | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.sp_capital_gain_nominal.observations.value | Nominal capital gain | Percent per quarter | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.div_nipa_nominal.observations.value | Corporate dividends (NIPA, nominal) | Billions of dollars, seasonally adjusted annual rate | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.div_nipa_real.observations.value | Real corporate dividends (NIPA) | Billions of 2017 dollars, seasonally adjusted annual rate, deflated by the GDP price index (2017 = 100) | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.div_nipa_nominal_pc.observations.value | Corporate dividends per capita (NIPA, nominal) | Dollars per person, annual rate | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.div_nipa_real_pc.observations.value | Real corporate dividends per capita (NIPA) | 2017 dollars per person, annual rate, deflated by the GDP price index (2017 = 100) | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.g_div_nipa_real.observations.value | Growth rate of real corporate dividends | Percent per quarter | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.g_div_nipa_real_pc.observations.value | Growth rate of real corporate dividends per capita | Percent per quarter | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.div_nipa_gdp.observations.value | Corporate dividends as a share of GDP (NIPA) | Percent of GDP | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.sp_excess_return.observations.value | Excess return over Treasury bills | Percentage points per quarter | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.g_gdp.observations.value | Growth rate of real GDP | Percent per quarter | level as published | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.y | Output (real GDP) | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.sp_price_real | Real stock prices | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.sp_dividends_real | Real dividends | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.sp_earnings_real | Real earnings | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.sp_pd | Price–dividend ratio | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.sp_cape | CAPE | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |

## Other blocks (statistics, tables, settings)

Values shown for the first version when a block repeats (placeholders as above).

| path | content |
|---|---|
| dashboard | str: financial-stock-market |
| title | str: Stock Market |
| country | values: code = US, name = United States |
| generated_at_utc | str: 2026-11-24T22:39:54+00:00 |
| recessions | recession dates (peak, trough) used to shade the charts |
| indicators.sp_price_real.estimates | list:  |
| indicators.sp_price_nominal.estimates | list:  |
| indicators.sp_dividends_real.estimates | list:  |
| indicators.sp_dividends_nominal.estimates | list:  |
| indicators.sp_earnings_real.estimates | list:  |
| indicators.sp_earnings_nominal.estimates | list:  |
| indicators.sp_pd.estimates | list:  |
| indicators.sp_dp.estimates | list:  |
| indicators.sp_pe.estimates | list:  |
| indicators.sp_cape.estimates | list:  |
| indicators.g_price_real.estimates | list:  |
| indicators.g_dividends_real.estimates | list:  |
| indicators.g_earnings_real.estimates | list:  |
| indicators.g_pd.estimates | list:  |
| indicators.g_dp.estimates | list:  |
| indicators.sp_return_real.estimates | list:  |
| indicators.sp_capital_gain_real.estimates | list:  |
| indicators.sp_return_nominal.estimates | list:  |
| indicators.sp_capital_gain_nominal.estimates | list:  |
| indicators.div_nipa_nominal.estimates | list:  |
| indicators.div_nipa_real.estimates | list:  |
| indicators.div_nipa_nominal_pc.estimates | list:  |
| indicators.div_nipa_real_pc.estimates | list:  |
| indicators.g_div_nipa_real.estimates | list:  |
| indicators.g_div_nipa_real_pc.estimates | list:  |
| indicators.div_nipa_gdp.estimates | list:  |
| indicators.sp_excess_return.estimates | list:  |
| indicators.g_gdp.estimates | list:  |
| cycles.keys | list: sp_price_real, sp_dividends_real, sp_earnings_real, sp_pd, sp_cape |
| cycles.variables.y | values: label = Output (real GDP), transform = log, units = Percent deviation from trend, source = U.S. Bureau of Economic Analysis (GDPC1) via FRED (Federal Reserve Bank of St. Louis) |
| cycles.variables.sp_price_real | values: label = Real stock prices, transform = log, units = Percent deviation from trend, source = Robert J. Shiller, shillerdata.com (S&P Composite; from 1957 the S&P 500); GDP price index (GDPDEF) via FRED (Federal Reserve Bank of St. Louis); author's calculation, indicator = sp_price_real |
| cycles.variables.sp_dividends_real | values: label = Real dividends, transform = log, units = Percent deviation from trend, source = Robert J. Shiller, shillerdata.com (S&P Composite; from 1957 the S&P 500); GDP price index (GDPDEF) via FRED (Federal Reserve Bank of St. Louis); author's calculation, indicator = sp_dividends_real |
| cycles.variables.sp_earnings_real | values: label = Real earnings, transform = log, units = Percent deviation from trend, source = Robert J. Shiller, shillerdata.com (S&P Composite; from 1957 the S&P 500); GDP price index (GDPDEF) via FRED (Federal Reserve Bank of St. Louis); author's calculation, indicator = sp_earnings_real |
| cycles.variables.sp_pd | values: label = Price–dividend ratio, transform = log, units = Percent deviation from trend, source = Robert J. Shiller, shillerdata.com (S&P Composite; from 1957 the S&P 500); author's calculation, indicator = sp_pd |
| cycles.variables.sp_cape | values: label = CAPE, transform = log, units = Percent deviation from trend, source = Robert J. Shiller, shillerdata.com (S&P Composite; from 1957 the S&P 500); author's calculation, indicator = sp_cape |
| cycles.methods.{filter} | values: h = 8, p = 4 |
| cycles.methods.cf_band_quarters | list: 6, 32 |
| cycles.methods.lags | list: -4, -3, -2, -1, 0, 1, 2, 3, 4 |
| tables.{filter}.stats | table of 6 rows; fields: key, sd, rel_sd, ar1, corr_y, start, end, n |
| tables.{filter}.cross | table of 5 rows; fields: key, values, peak_lag, peak_value |
| growth.keys | list: g_price_real, g_dividends_real, g_earnings_real, g_div_nipa_real, g_div_nipa_real_pc, g_pd, g_dp, sp_return_real, sp_capital_gain_real, sp_excess_return |
| growth.variables.y | values: label = Output (real GDP), units = Percent per quarter, source = U.S. Bureau of Economic Analysis (GDPC1) via FRED (Federal Reserve Bank of St. Louis) |
| growth.variables.g_price_real | values: label = Real stock prices, units = Percent per quarter, source = Robert J. Shiller, shillerdata.com (S&P Composite; from 1957 the S&P 500); GDP price index (GDPDEF) via FRED (Federal Reserve Bank of St. Louis); author's calculation |
| growth.variables.g_dividends_real | values: label = Real dividends (S&P 500, per share), units = Percent per quarter, source = Robert J. Shiller, shillerdata.com (S&P Composite; from 1957 the S&P 500); GDP price index (GDPDEF) via FRED (Federal Reserve Bank of St. Louis); author's calculation |
| growth.variables.g_earnings_real | values: label = Real earnings, units = Percent per quarter, source = Robert J. Shiller, shillerdata.com (S&P Composite; from 1957 the S&P 500); GDP price index (GDPDEF) via FRED (Federal Reserve Bank of St. Louis); author's calculation |
| growth.variables.g_div_nipa_real | values: label = Real corporate dividends (NIPA), units = Percent per quarter, source = U.S. Bureau of Economic Analysis, net corporate dividends (DIVIDEND) and GDP price index (GDPDEF) via FRED (Federal Reserve Bank of St. Louis); author's calculation |
| growth.variables.g_div_nipa_real_pc | values: label = Real corporate dividends per capita (NIPA), units = Percent per quarter, source = U.S. Bureau of Economic Analysis, net corporate dividends (DIVIDEND), GDP price index (GDPDEF) and population (B230RC0Q173SBEA) via FRED (Federal Reserve Bank of St. Louis); author's calculation |
| growth.variables.g_pd | values: label = Price–dividend ratio, units = Percent per quarter, source = Robert J. Shiller, shillerdata.com (S&P Composite; from 1957 the S&P 500); author's calculation |
| growth.variables.g_dp | values: label = Dividend–price ratio, units = Percent per quarter, source = Robert J. Shiller, shillerdata.com (S&P Composite; from 1957 the S&P 500); author's calculation |
| growth.variables.sp_return_real | values: label = Real total return, units = Percent per quarter, source = Robert J. Shiller, shillerdata.com (S&P Composite; from 1957 the S&P 500); GDP price index (GDPDEF) via FRED (Federal Reserve Bank of St. Louis); author's calculation |
| growth.variables.sp_capital_gain_real | values: label = Real capital gain, units = Percent per quarter, source = Robert J. Shiller, shillerdata.com (S&P Composite; from 1957 the S&P 500); GDP price index (GDPDEF) via FRED (Federal Reserve Bank of St. Louis); author's calculation |
| growth.variables.sp_excess_return | values: label = Excess return over bills, units = Percentage points per quarter, source = Robert J. Shiller, shillerdata.com (S&P Composite; from 1957 the S&P 500); author's calculation; 3-month Treasury bill rate (TB3MS) via FRED (Federal Reserve Bank of St. Louis) |
| growth.stats | table of 11 rows; fields: key, sd, rel_sd, ar1, corr_y, start, end, n |
| growth.means | values: y = 0.7782, g_price_real = 1.218, g_dividends_real = 0.6145, g_earnings_real = 0.7767, g_div_nipa_real = 1.063, g_div_nipa_real_pc = 0.794, g_pd = 0.6038, g_dp = -0.6038, sp_return_real = 2.173, sp_capital_gain_real = 1.401, sp_excess_return = 1.961 |
| growth_table.periods | values: latest = Latest quarter, latest_quarter = 2026 Q3, recent = Last 10 years, recent_range = the 40 quarters ending in each series' latest quarter (to 2026 Q3), full = 1947–2026, full_range = 1947 Q1–2026 Q3 |
| growth_table.rows | table of 9 rows; fields: component, kind, nominal_latest, nominal_recent, nominal_full, nominal_last, real_latest, real_recent, real_full, real_last |
| filter_start | str: 1947-01-01 |
| downloads | values: quarterly_csv = downloads/economics/us/us-financial-stock-market-quarterly.csv, cycles_csv = downloads/economics/us/us-financial-stock-market-cycles.csv, mat = downloads/economics/us/us-financial-stock-market.mat |
