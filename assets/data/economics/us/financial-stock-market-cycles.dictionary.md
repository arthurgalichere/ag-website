# Data dictionary: financial-stock-market-cycles.json

File: https://arthurgalichere.com/assets/data/economics/us/financial-stock-market-cycles.json (generated 2026-11-24T22:39:54+00:00 UTC). Missing values are JSON null. Dates are the first day of the period (quarter, month or year). When a series exists in several versions, one row covers them, with a placeholder in the path: {filter} = hp, hamilton or cf (the filter). First and last dates marked (varies) differ across those versions.

## Series

| path | meaning | units | transformation | first | last | n |
|---|---|---|---|---|---|---|
| cycles.real.{filter}.sp_price | Stock prices (S&P 500) | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.real.{filter}.sp_div | Dividends (S&P 500, per share) | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.real.{filter}.sp_earn | Earnings (S&P 500, per share) | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.real.{filter}.div | Corporate dividends (NIPA) | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.real.{filter}.div_pc |  |  | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.real.{filter}.sp_pd | Price–dividend ratio | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.real.{filter}.sp_cape | CAPE | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.real.{filter}.y | Output (real GDP) | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.real.{filter}.y_pc |  |  | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.nominal.{filter}.sp_price | Stock prices (S&P 500) | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.nominal.{filter}.sp_div | Dividends (S&P 500, per share) | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.nominal.{filter}.sp_earn | Earnings (S&P 500, per share) | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.nominal.{filter}.div | Corporate dividends (NIPA) | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.nominal.{filter}.div_pc |  |  | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.nominal.{filter}.sp_pd | Price–dividend ratio | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.nominal.{filter}.sp_cape | CAPE | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.nominal.{filter}.y | Output (real GDP) | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.nominal.{filter}.y_pc |  |  | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |

## Other blocks (statistics, tables, settings)

Values shown for the first version when a block repeats (placeholders as above).

| path | content |
|---|---|
| dashboard | str: stock-market-cycles |
| country | values: code = US, name = United States |
| generated_at_utc | str: 2026-11-24T22:39:54+00:00 |
| data_generated_at_utc | str: 2026-11-24T16:53:35+00:00 |
| recessions | recession dates (peak, trough) used to shade the charts |
| sample | values: start = 1950-01-01, end = 2026-07-01 |
| filter_start | str: 1947-01-01 |
| methods.hp_lambda | float: 1600.0 |
| methods.{filter} | values: h = 8, p = 4 |
| methods.cf_band_quarters | list: 6, 32 |
| methods.lags | list: -4, -3, -2, -1, 0, 1, 2, 3, 4 |
| variables.y | values: label = Output (real GDP), transform = log, units = Percent deviation from trend, per_capita = True, source = U.S. Bureau of Economic Analysis via FRED, source_pc = U.S. Bureau of Economic Analysis via FRED; population: BEA (B230RC0Q173SBEA); author's calculation, label_nominal = Output (nom … |
| variables.c | values: label = Consumption, transform = log, units = Percent deviation from trend, per_capita = True, source = U.S. Bureau of Economic Analysis via FRED, source_pc = U.S. Bureau of Economic Analysis via FRED; population: BEA (B230RC0Q173SBEA); author's calculation, label_nominal = Consumption (nomi … |
| variables.i | values: label = Investment, transform = log, units = Percent deviation from trend, per_capita = True, source = U.S. Bureau of Economic Analysis via FRED, source_pc = U.S. Bureau of Economic Analysis via FRED; population: BEA (B230RC0Q173SBEA); author's calculation, label_nominal = Investment (nomina … |
| variables.g | values: label = Government spending, transform = log, units = Percent deviation from trend, per_capita = True, source = U.S. Bureau of Economic Analysis via FRED, source_pc = U.S. Bureau of Economic Analysis via FRED; population: BEA (B230RC0Q173SBEA); author's calculation, label_nominal = Governmen … |
| variables.x | values: label = Exports, transform = log, units = Percent deviation from trend, per_capita = True, source = U.S. Bureau of Economic Analysis via FRED, source_pc = U.S. Bureau of Economic Analysis via FRED; population: BEA (B230RC0Q173SBEA); author's calculation, label_nominal = Exports (nominal), so … |
| variables.m | values: label = Imports, transform = log, units = Percent deviation from trend, per_capita = True, source = U.S. Bureau of Economic Analysis via FRED, source_pc = U.S. Bureau of Economic Analysis via FRED; population: BEA (B230RC0Q173SBEA); author's calculation, label_nominal = Imports (nominal), so … |
| variables.c_dur | values: label = Durable goods, transform = log, units = Percent deviation from trend, per_capita = True, source = U.S. Bureau of Economic Analysis via FRED; before 2007, author's calculation from BEA quantity indexes (BEA chained-dollar formula), source_pc = U.S. Bureau of Economic Analysis via FRED … |
| variables.c_nondur | values: label = Nondurable goods, transform = log, units = Percent deviation from trend, per_capita = True, source = U.S. Bureau of Economic Analysis via FRED; before 2007, author's calculation from BEA quantity indexes (BEA chained-dollar formula), source_pc = U.S. Bureau of Economic Analysis via F … |
| variables.c_serv | values: label = Services, transform = log, units = Percent deviation from trend, per_capita = True, source = U.S. Bureau of Economic Analysis via FRED; before 2007, author's calculation from BEA quantity indexes (BEA chained-dollar formula), source_pc = U.S. Bureau of Economic Analysis via FRED; bef … |
| variables.i_nonres | values: label = Nonresidential fixed investment, transform = log, units = Percent deviation from trend, per_capita = True, source = U.S. Bureau of Economic Analysis via FRED; before 2007, author's calculation from BEA quantity indexes (BEA chained-dollar formula), source_pc = U.S. Bureau of Economic … |
| variables.i_res | values: label = Residential fixed investment, transform = log, units = Percent deviation from trend, per_capita = True, source = U.S. Bureau of Economic Analysis via FRED; before 2007, author's calculation from BEA quantity indexes (BEA chained-dollar formula), source_pc = U.S. Bureau of Economic An … |
| variables.k | values: label = Capital services, transform = log, units = Percent deviation from trend, per_capita = True, source = John Fernald, Federal Reserve Bank of San Francisco (quarterly TFP data, capital input dk); author's calculation (level index), source_pc = John Fernald, Federal Reserve Bank of San F … |
| variables.h | values: label = Hours worked, transform = log, units = Percent deviation from trend, per_capita = True, source = U.S. Bureau of Labor Statistics via FRED, source_pc = U.S. Bureau of Labor Statistics (HOANBS, CNP16OV) via FRED; author's calculation |
| variables.w | values: label = Real hourly compensation, transform = log, units = Percent deviation from trend, per_capita = False, source = U.S. Bureau of Labor Statistics via FRED, source_pc = None, label_nominal = Nominal hourly compensation, source_nominal = U.S. Bureau of Labor Statistics (COMPNFB) via FRED ( … |
| variables.yh | values: label = Labour productivity, transform = log, units = Percent deviation from trend, per_capita = False, source = U.S. Bureau of Labor Statistics via FRED, source_pc = None, label_nominal = Labour productivity (nominal output per hour), source_nominal = U.S. Bureau of Labor Statistics (OPHNFB … |
| variables.tfp | values: label = TFP (measured), transform = log, units = Percent deviation from trend, per_capita = False, source = John Fernald, Federal Reserve Bank of San Francisco (quarterly TFP); author's calculation (level index), source_pc = None |
| variables.tfp_util | values: label = TFP (utilization-adjusted), transform = log, units = Percent deviation from trend, per_capita = False, source = John Fernald, Federal Reserve Bank of San Francisco (quarterly TFP); author's calculation (level index), source_pc = None |
| variables.u_gap | values: label = Unemployment gap (% deviation from NROU), transform = gap, units = Percent deviation from the natural rate, per_capita = False, source = U.S. Bureau of Labor Statistics (UNRATE) and Congressional Budget Office (NROU) via FRED; author's calculation, source_pc = None |
| variables.u | values: label = Filtered unemployment rate, transform = log, units = Percent deviation from trend, per_capita = False, source = U.S. Bureau of Labor Statistics via FRED, source_pc = None |
| variables.lfpr | values: label = Participation rate, transform = level, units = Percentage points, per_capita = False, source = U.S. Bureau of Labor Statistics via FRED, source_pc = None |
| variables.infl | values: label = Inflation (GDP deflator), transform = level, units = Percentage points, per_capita = False, source = U.S. Bureau of Economic Analysis (GDPDEF) via FRED; author's calculation, source_pc = None |
| variables.infl_cpi | values: label = Inflation (CPI), transform = level, units = Percentage points, per_capita = False, source = U.S. Bureau of Labor Statistics (CPIAUCSL, quarterly average) via FRED; author's calculation, source_pc = None |
| variables.ff | values: label = Federal funds rate, transform = level, units = Percentage points, per_capita = False, source = Board of Governors of the Federal Reserve System via FRED, source_pc = None |
| variables.tb | values: label = 3-month Treasury bill rate, transform = level, units = Percentage points, per_capita = False, source = Board of Governors of the Federal Reserve System via FRED, source_pc = None |
| variables.rff | values: label = Real federal funds rate, transform = level, units = Percentage points, per_capita = False, source = Federal Reserve (FEDFUNDS) and BEA (GDPDEF) via FRED; author's calculation, source_pc = None |
| variables.rtb | values: label = Real Treasury bill rate, transform = level, units = Percentage points, per_capita = False, source = Federal Reserve (TB3MS) and BEA (GDPDEF) via FRED; author's calculation, source_pc = None |
| variables.sp_price | values: label = Stock prices (S&P 500), transform = log, units = Percent deviation from trend, per_capita = False, source = Robert J. Shiller, shillerdata.com (S&P Composite; from 1957 the S&P 500); GDP price index (GDPDEF) via FRED (Federal Reserve Bank of St. Louis); author's calculation, source_p … |
| variables.sp_div | values: label = Dividends (S&P 500, per share), transform = log, units = Percent deviation from trend, per_capita = False, source = Robert J. Shiller, shillerdata.com (S&P Composite; from 1957 the S&P 500); GDP price index (GDPDEF) via FRED (Federal Reserve Bank of St. Louis); author's calculation,  … |
| variables.sp_earn | values: label = Earnings (S&P 500, per share), transform = log, units = Percent deviation from trend, per_capita = False, source = Robert J. Shiller, shillerdata.com (S&P Composite; from 1957 the S&P 500); GDP price index (GDPDEF) via FRED (Federal Reserve Bank of St. Louis); author's calculation, s … |
| variables.div | values: label = Corporate dividends (NIPA), transform = log, units = Percent deviation from trend, per_capita = True, source = U.S. Bureau of Economic Analysis, net corporate dividends (DIVIDEND) and GDP price index (GDPDEF) via FRED (Federal Reserve Bank of St. Louis); author's calculation, source_ … |
| variables.sp_pd | values: label = Price–dividend ratio, transform = log, units = Percent deviation from trend, per_capita = False, source = Robert J. Shiller, shillerdata.com (S&P Composite; from 1957 the S&P 500); author's calculation, source_pc = None, source_nominal = Robert J. Shiller, shillerdata.com (S&P Compos … |
| variables.sp_cape | values: label = CAPE, transform = log, units = Percent deviation from trend, per_capita = False, source = Robert J. Shiller, shillerdata.com (S&P Composite; from 1957 the S&P 500); author's calculation, source_pc = None, source_nominal = Robert J. Shiller, shillerdata.com (S&P Composite; from 1957 t … |
| stock_keys | list: sp_price, sp_div, sp_earn, div, sp_pd, sp_cape |
| tables.real.total.{filter}.summary | table of 7 rows; fields: key, sd, rel_sd, ar1, corr_y, start, end, n |
| tables.real.total.{filter}.cross | table of 6 rows; fields: key, values, peak_lag, peak_value |
| tables.real.pc.{filter}.summary | table of 7 rows; fields: key, sd, rel_sd, ar1, corr_y, start, end, n |
| tables.real.pc.{filter}.cross | table of 6 rows; fields: key, values, peak_lag, peak_value |
| tables.nominal.total.{filter}.summary | table of 7 rows; fields: key, sd, rel_sd, ar1, corr_y, start, end, n |
| tables.nominal.total.{filter}.cross | table of 6 rows; fields: key, values, peak_lag, peak_value |
| tables.nominal.pc.{filter}.summary | table of 7 rows; fields: key, sd, rel_sd, ar1, corr_y, start, end, n |
| tables.nominal.pc.{filter}.cross | table of 6 rows; fields: key, values, peak_lag, peak_value |
| downloads | values: clean_csv = downloads/economics/us/us-financial-stock-market-cycles.csv, clean_mat = downloads/economics/us/us-financial-stock-market-cycles.mat |
