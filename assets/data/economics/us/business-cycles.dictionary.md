# Data dictionary: business-cycles.json

File: https://arthurgalichere.com/assets/data/economics/us/business-cycles.json (generated 2026-11-20T16:12:55+00:00 UTC). Missing values are JSON null. Dates are the first day of the period (quarter, month or year). When a series exists in several versions, one row covers them, with a placeholder in the path: {filter} = hp, hamilton or cf (the filter). First and last dates marked (varies) differ across those versions.

## Series

| path | meaning | units | transformation | first | last | n |
|---|---|---|---|---|---|---|
| cycles.{filter}.y | Output (real GDP) | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.y_pc |  |  | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.c | Consumption | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.c_pc |  |  | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.i | Investment | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.i_pc |  |  | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.g | Government spending | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.g_pc |  |  | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.x | Exports | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.x_pc |  |  | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.m | Imports | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.m_pc |  |  | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.c_dur | Durable goods | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.c_dur_pc |  |  | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.c_nondur | Nondurable goods | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.c_nondur_pc |  |  | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.c_serv | Services | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.c_serv_pc |  |  | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.i_nonres | Nonresidential fixed investment | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.i_nonres_pc |  |  | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.i_res | Residential fixed investment | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.i_res_pc |  |  | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.k | Capital services | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.k_pc |  |  | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.h | Hours worked | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.h_pc |  |  | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1950-01-01 (varies) | 2026-07-01 | 304–307 |
| cycles.{filter}.w | Real hourly compensation | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.yh | Labour productivity | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.tfp | TFP (measured) | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.tfp_util | TFP (utilization-adjusted) | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.u_gap | Unemployment gap (% deviation from NROU) | Percent deviation from the natural rate | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.u | Filtered unemployment rate | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 (varies) | 2026-07-01 | 304–307 |
| cycles.{filter}.lfpr | Participation rate | Percentage points | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1950-01-01 (varies) | 2026-07-01 | 304–307 |
| cycles.{filter}.infl | Inflation (GDP deflator) | Percentage points | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.infl_cpi | Inflation (CPI) | Percentage points | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.ff | Federal funds rate | Percentage points | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1954-07-01 (varies) | 2026-07-01 | 278–289 |
| cycles.{filter}.tb | 3-month Treasury bill rate | Percentage points | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.rff | Real federal funds rate | Percentage points | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1954-07-01 (varies) | 2026-04-01 | 277–288 |
| cycles.{filter}.rtb | Real Treasury bill rate | Percentage points | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1950-01-01 | 2026-04-01 | 306 |

## Other blocks (statistics, tables, settings)

Values shown for the first version when a block repeats (placeholders as above).

| path | content |
|---|---|
| dashboard | str: business-cycles |
| country | values: code = US, name = United States |
| generated_at_utc | str: 2026-11-20T16:12:55+00:00 |
| recessions | recession dates (peak, trough) used to shade the charts |
| sample | values: start = 1950-01-01, end = 2026-07-01 |
| methods.hp_lambda | float: 1600.0 |
| methods.{filter} | values: h = 8, p = 4 |
| methods.cf_band_quarters | list: 6, 32 |
| methods.lags | list: -4, -3, -2, -1, 0, 1, 2, 3, 4 |
| variables.y | values: label = Output (real GDP), transform = log, units = Percent deviation from trend, per_capita = True, source = U.S. Bureau of Economic Analysis via FRED, source_pc = U.S. Bureau of Economic Analysis via FRED; population: BEA (B230RC0Q173SBEA); author's calculation |
| variables.c | values: label = Consumption, transform = log, units = Percent deviation from trend, per_capita = True, source = U.S. Bureau of Economic Analysis via FRED, source_pc = U.S. Bureau of Economic Analysis via FRED; population: BEA (B230RC0Q173SBEA); author's calculation |
| variables.i | values: label = Investment, transform = log, units = Percent deviation from trend, per_capita = True, source = U.S. Bureau of Economic Analysis via FRED, source_pc = U.S. Bureau of Economic Analysis via FRED; population: BEA (B230RC0Q173SBEA); author's calculation |
| variables.g | values: label = Government spending, transform = log, units = Percent deviation from trend, per_capita = True, source = U.S. Bureau of Economic Analysis via FRED, source_pc = U.S. Bureau of Economic Analysis via FRED; population: BEA (B230RC0Q173SBEA); author's calculation |
| variables.x | values: label = Exports, transform = log, units = Percent deviation from trend, per_capita = True, source = U.S. Bureau of Economic Analysis via FRED, source_pc = U.S. Bureau of Economic Analysis via FRED; population: BEA (B230RC0Q173SBEA); author's calculation |
| variables.m | values: label = Imports, transform = log, units = Percent deviation from trend, per_capita = True, source = U.S. Bureau of Economic Analysis via FRED, source_pc = U.S. Bureau of Economic Analysis via FRED; population: BEA (B230RC0Q173SBEA); author's calculation |
| variables.c_dur | values: label = Durable goods, transform = log, units = Percent deviation from trend, per_capita = True, source = U.S. Bureau of Economic Analysis via FRED; before 2007, author's calculation from BEA quantity indexes (BEA chained-dollar formula), source_pc = U.S. Bureau of Economic Analysis via FRED … |
| variables.c_nondur | values: label = Nondurable goods, transform = log, units = Percent deviation from trend, per_capita = True, source = U.S. Bureau of Economic Analysis via FRED; before 2007, author's calculation from BEA quantity indexes (BEA chained-dollar formula), source_pc = U.S. Bureau of Economic Analysis via F … |
| variables.c_serv | values: label = Services, transform = log, units = Percent deviation from trend, per_capita = True, source = U.S. Bureau of Economic Analysis via FRED; before 2007, author's calculation from BEA quantity indexes (BEA chained-dollar formula), source_pc = U.S. Bureau of Economic Analysis via FRED; bef … |
| variables.i_nonres | values: label = Nonresidential fixed investment, transform = log, units = Percent deviation from trend, per_capita = True, source = U.S. Bureau of Economic Analysis via FRED; before 2007, author's calculation from BEA quantity indexes (BEA chained-dollar formula), source_pc = U.S. Bureau of Economic … |
| variables.i_res | values: label = Residential fixed investment, transform = log, units = Percent deviation from trend, per_capita = True, source = U.S. Bureau of Economic Analysis via FRED; before 2007, author's calculation from BEA quantity indexes (BEA chained-dollar formula), source_pc = U.S. Bureau of Economic An … |
| variables.k | values: label = Capital services, transform = log, units = Percent deviation from trend, per_capita = True, source = John Fernald, Federal Reserve Bank of San Francisco (quarterly TFP data, capital input dk); author's calculation (level index), source_pc = John Fernald, Federal Reserve Bank of San F … |
| variables.h | values: label = Hours worked, transform = log, units = Percent deviation from trend, per_capita = True, source = U.S. Bureau of Labor Statistics via FRED, source_pc = U.S. Bureau of Labor Statistics (HOANBS, CNP16OV) via FRED; author's calculation |
| variables.w | values: label = Real hourly compensation, transform = log, units = Percent deviation from trend, per_capita = False, source = U.S. Bureau of Labor Statistics via FRED, source_pc = None |
| variables.yh | values: label = Labour productivity, transform = log, units = Percent deviation from trend, per_capita = False, source = U.S. Bureau of Labor Statistics via FRED, source_pc = None |
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
| tables.total.{filter}.sections.national | table of 6 rows; fields: key, sd, rel_sd, ar1, corr_y, start, end, n |
| tables.total.{filter}.sections.consumption | table of 4 rows; fields: key, sd, rel_sd, ar1, corr_y, start, end, n, rel_sd_agg, corr_agg |
| tables.total.{filter}.sections.investment | table of 3 rows; fields: key, sd, rel_sd, ar1, corr_y, start, end, n, rel_sd_agg, corr_agg |
| tables.total.{filter}.summary | table of 21 rows; fields: key, sd, rel_sd, ar1, corr_y, start, end, n |
| tables.total.{filter}.cross | table of 21 rows; fields: key, values, peak_lag, peak_value |
| tables.pc.{filter}.sections.national | table of 6 rows; fields: key, sd, rel_sd, ar1, corr_y, start, end, n |
| tables.pc.{filter}.sections.consumption | table of 4 rows; fields: key, sd, rel_sd, ar1, corr_y, start, end, n, rel_sd_agg, corr_agg |
| tables.pc.{filter}.sections.investment | table of 3 rows; fields: key, sd, rel_sd, ar1, corr_y, start, end, n, rel_sd_agg, corr_agg |
| tables.pc.{filter}.summary | table of 21 rows; fields: key, sd, rel_sd, ar1, corr_y, start, end, n |
| tables.pc.{filter}.cross | table of 21 rows; fields: key, values, peak_lag, peak_value |
| downloads | values: clean_csv = downloads/economics/us/us-business-cycles-clean.csv, clean_mat = downloads/economics/us/us-business-cycles-clean.mat |
