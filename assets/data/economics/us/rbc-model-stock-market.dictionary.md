# Data dictionary: rbc-model-stock-market.json

File: https://arthurgalichere.com/assets/data/economics/us/rbc-model-stock-market.json (generated 2026-11-24T22:42:51+00:00 UTC). Missing values are JSON null. Dates are the first day of the period (quarter, month or year). When a series exists in several versions, one row covers them, with a placeholder in the path: {form} = hicks or harrod (Hicks- or Harrod-neutral technology); {tfp} = the TFP measure (e.g. measured; adjusted = utilization-adjusted, Fernald); {kind} = kr (run driven by linear-trend shocks, then HP filtered, as King and Rebelo) or hp (run driven by HP-filtered shocks). First and last dates marked (varies) differ across those versions.

## Series

| path | meaning | units | transformation | first | last | n |
|---|---|---|---|---|---|---|
| technology.{form}.series.{tfp}.steps.level_index | TFP level, index (reference year = 100). |  |  | 1950-01-01 | 2026-07-01 | 307 |
| technology.{form}.series.{tfp}.steps.log_level | 100 x log TFP. |  |  | 1950-01-01 | 2026-07-01 | 307 |
| technology.{form}.series.{tfp}.steps.trend | Linear trend of 100 x log TFP. |  |  | 1950-01-01 | 2026-07-01 | 307 |
| technology.{form}.series.{tfp}.steps.deviation | 100 x log TFP minus its linear trend (percent). |  |  | 1950-01-01 | 2026-07-01 | 307 |
| technology.{form}.series.{tfp}.steps.model | AR(1) fit of the deviation (one-step model path). |  |  | 1950-01-01 | 2026-07-01 | 307 |
| technology.{form}.series.{tfp}.steps.model_hp | HP cycle (λ 1600) of the model path (model_hp) or of log TFP x 100 (data_hp). |  |  | 1950-01-01 | 2026-07-01 | 307 |
| technology.{form}.series.{tfp}.steps.data_hp | HP cycle (λ 1600) of the model path (model_hp) or of log TFP x 100 (data_hp). |  |  | 1950-01-01 | 2026-07-01 | 307 |
| technology.{form}.series.{tfp}.shock | Measured technology shocks: innovations of the AR(1) of log TFP in deviation from its linear trend, x 100 (percent). |  |  | 1950-01-01 | 2026-07-01 | 307 |
| technology.{form}.series.{tfp}.hp_shock | Technology shocks of HP-filtered log TFP (AR(1) innovations), x 100. |  |  | 1950-01-01 | 2026-07-01 | 307 |
| data.total.y | Output: Data counterparts of the model (HP cycles, percent deviation from trend): totals or per capita; NIPA or S&P dividends. |  |  | 1950-01-01 | 2026-07-01 | 307 |
| data.total.p | Stock price: Data counterparts of the model (HP cycles, percent deviation from trend): totals or per capita; NIPA or S&P dividends. |  |  | 1950-01-01 | 2026-07-01 | 307 |
| data.total.d | Dividends: Data counterparts of the model (HP cycles, percent deviation from trend): totals or per capita; NIPA or S&P dividends. |  |  | 1950-01-01 | 2026-07-01 | 307 |
| data.pc.y | Output: Data counterparts of the model (HP cycles, percent deviation from trend): totals or per capita; NIPA or S&P dividends. |  |  | 1950-01-01 | 2026-07-01 | 307 |
| data.pc.p | Stock price: Data counterparts of the model (HP cycles, percent deviation from trend): totals or per capita; NIPA or S&P dividends. |  |  | 1950-01-01 | 2026-07-01 | 307 |
| data.pc.d | Dividends: Data counterparts of the model (HP cycles, percent deviation from trend): totals or per capita; NIPA or S&P dividends. |  |  | 1950-01-01 | 2026-07-01 | 307 |
| data.sp_total.y | Output: Data counterparts of the model (HP cycles, percent deviation from trend): totals or per capita; NIPA or S&P dividends. |  |  | 1950-01-01 | 2026-07-01 | 307 |
| data.sp_total.p | Stock price: Data counterparts of the model (HP cycles, percent deviation from trend): totals or per capita; NIPA or S&P dividends. |  |  | 1950-01-01 | 2026-07-01 | 307 |
| data.sp_total.d | Dividends: Data counterparts of the model (HP cycles, percent deviation from trend): totals or per capita; NIPA or S&P dividends. |  |  | 1950-01-01 | 2026-07-01 | 307 |
| data.sp_pc.y | Output: Data counterparts of the model (HP cycles, percent deviation from trend): totals or per capita; NIPA or S&P dividends. |  |  | 1950-01-01 | 2026-07-01 | 307 |
| data.sp_pc.p | Stock price: Data counterparts of the model (HP cycles, percent deviation from trend): totals or per capita; NIPA or S&P dividends. |  |  | 1950-01-01 | 2026-07-01 | 307 |
| data.sp_pc.d | Dividends: Data counterparts of the model (HP cycles, percent deviation from trend): totals or per capita; NIPA or S&P dividends. |  |  | 1950-01-01 | 2026-07-01 | 307 |
| runs.{form}.{tfp}.series.{kind}.y | Output: Model simulation, percent deviation from trend (r: percentage points a year); kr: driven by the measured shocks (linear-trend deviations), then HP filtered (λ 1600), as King and Rebelo; hp: driven by shocks of HP-filtered TFP. |  |  | 1950-01-01 | 2026-07-01 | 307 |
| runs.{form}.{tfp}.series.{kind}.c | Consumption: Model simulation, percent deviation from trend (r: percentage points a year); kr: driven by the measured shocks (linear-trend deviations), then HP filtered (λ 1600), as King and Rebelo; hp: driven by shocks of HP-filtered TFP. |  |  | 1950-01-01 | 2026-07-01 | 307 |
| runs.{form}.{tfp}.series.{kind}.i | Investment: Model simulation, percent deviation from trend (r: percentage points a year); kr: driven by the measured shocks (linear-trend deviations), then HP filtered (λ 1600), as King and Rebelo; hp: driven by shocks of HP-filtered TFP. |  |  | 1950-01-01 | 2026-07-01 | 307 |
| runs.{form}.{tfp}.series.{kind}.h | Hours worked: Model simulation, percent deviation from trend (r: percentage points a year); kr: driven by the measured shocks (linear-trend deviations), then HP filtered (λ 1600), as King and Rebelo; hp: driven by shocks of HP-filtered TFP. |  |  | 1950-01-01 | 2026-07-01 | 307 |
| runs.{form}.{tfp}.series.{kind}.k | Capital: Model simulation, percent deviation from trend (r: percentage points a year); kr: driven by the measured shocks (linear-trend deviations), then HP filtered (λ 1600), as King and Rebelo; hp: driven by shocks of HP-filtered TFP. |  |  | 1950-01-01 | 2026-07-01 | 307 |
| runs.{form}.{tfp}.series.{kind}.p | Stock price: Model simulation, percent deviation from trend (r: percentage points a year); kr: driven by the measured shocks (linear-trend deviations), then HP filtered (λ 1600), as King and Rebelo; hp: driven by shocks of HP-filtered TFP. |  |  | 1950-01-01 | 2026-07-01 | 307 |
| runs.{form}.{tfp}.series.{kind}.d | Dividends: Model simulation, percent deviation from trend (r: percentage points a year); kr: driven by the measured shocks (linear-trend deviations), then HP filtered (λ 1600), as King and Rebelo; hp: driven by shocks of HP-filtered TFP. |  |  | 1950-01-01 | 2026-07-01 | 307 |
| runs.{form}.{tfp}.irf.y | Output: Impulse response to a 1 percent technology shock; index 0 is the quarter of the shock; percent deviation (r: percentage points a year). |  |  | index 0 | index 79 | 80 |
| runs.{form}.{tfp}.irf.c | Consumption: Impulse response to a 1 percent technology shock; index 0 is the quarter of the shock; percent deviation (r: percentage points a year). |  |  | index 0 | index 79 | 80 |
| runs.{form}.{tfp}.irf.i | Investment: Impulse response to a 1 percent technology shock; index 0 is the quarter of the shock; percent deviation (r: percentage points a year). |  |  | index 0 | index 79 | 80 |
| runs.{form}.{tfp}.irf.h | Hours worked: Impulse response to a 1 percent technology shock; index 0 is the quarter of the shock; percent deviation (r: percentage points a year). |  |  | index 0 | index 79 | 80 |
| runs.{form}.{tfp}.irf.k | Capital: Impulse response to a 1 percent technology shock; index 0 is the quarter of the shock; percent deviation (r: percentage points a year). |  |  | index 0 | index 79 | 80 |
| runs.{form}.{tfp}.irf.a | Technology: Impulse response to a 1 percent technology shock; index 0 is the quarter of the shock; percent deviation (r: percentage points a year). |  |  | index 0 | index 79 | 80 |
| runs.{form}.{tfp}.irf.p | Stock price: Impulse response to a 1 percent technology shock; index 0 is the quarter of the shock; percent deviation (r: percentage points a year). |  |  | index 0 | index 79 | 80 |
| runs.{form}.{tfp}.irf.d | Dividends: Impulse response to a 1 percent technology shock; index 0 is the quarter of the shock; percent deviation (r: percentage points a year). |  |  | index 0 | index 79 | 80 |

## Other blocks (statistics, tables, settings)

Values shown for the first version when a block repeats (placeholders as above).

| path | content |
|---|---|
| dashboard | str: rbc-model-stock-market |
| country | values: code = US, name = United States |
| generated_at_utc | str: 2026-11-24T22:42:51+00:00 |
| canonical_generated_at_utc | str: 2026-11-24T16:53:35+00:00 |
| recessions | recession dates (peak, trough) used to shade the charts |
| technology.{form}.series.{tfp}.hp_compare | values: corr = 1.0, sd_model = 1.215, sd_data = 1.215 |
| technology.{form}.series.{tfp}.hp_shortcut | values: corr_interior = 1.0, corr_first = 0.999, corr_last = 0.998, sd = 0.855, ar1 = 0.083, edge_quarters = 12 |
| technology.{form}.series.{tfp}.estimation | list: 1947-01-01, 2026-07-01 |
| calibration | values: beta = 0.9827094467, alpha = 0.3333333333, delta = 0.025, xi = 3.3641013957, eta = 1.0, sigma = 1.0 |
| shock_types | values: kr = Linear-trend shocks, model HP-filtered, hp = HP-filtered shocks |
| labels | values: y = Output, c = Consumption, i = Investment, h = Hours worked, k = Capital, p = Stock price, d = Dividends, a = Technology |
| data_sources.y | values: total = U.S. Bureau of Economic Analysis (GDPC1) via FRED (Federal Reserve Bank of St. Louis), pc = U.S. Bureau of Economic Analysis (GDPC1, population B230RC0Q173SBEA) via FRED (Federal Reserve Bank of St. Louis), sp_total = U.S. Bureau of Economic Analysis (GDPC1) via FRED (Federal Reserve … |
| data_sources.p | values: total = Robert J. Shiller, shillerdata.com (S&P Composite; from 1957 the S&P 500); GDP price index (GDPDEF) via FRED (Federal Reserve Bank of St. Louis); author's calculation, pc = Robert J. Shiller, shillerdata.com (S&P Composite; from 1957 the S&P 500); GDP price index (GDPDEF) via FRED (F … |
| data_sources.d | values: total = U.S. Bureau of Economic Analysis, net corporate dividends (DIVIDEND) and GDP price index (GDPDEF) via FRED (Federal Reserve Bank of St. Louis); author's calculation, pc = U.S. Bureau of Economic Analysis, net corporate dividends (DIVIDEND), GDP price index (GDPDEF) and population (B2 … |
| data_means | values: pd_annual = 40.14, dp_annual = 3.054 |
| runs.{form}.{tfp}.steady_state | values: hours = 0.2, k_y_annual = 1.783, i_y = 0.207, c_y = 0.793, d_y = 0.126, p_y_annual = 1.791, pd_annual = 14.21, dp_annual = 7.038, return_annual = 8.692, coef_d_y = 2.645, coef_d_i = 1.645, coef_p_k = 0.9711, coef_p_i = 0.0289 |
| runs.{form}.{tfp}.stats.total.data | table of 3 rows; fields: key, sd, rel_sd, ar1, corr_y |
| runs.{form}.{tfp}.stats.total.kr | table of 3 rows; fields: key, sd, rel_sd, ar1, corr_y, corr_data |
| runs.{form}.{tfp}.stats.total.{filter} | table of 3 rows; fields: key, sd, rel_sd, ar1, corr_y, corr_data |
| runs.{form}.{tfp}.stats.pc.data | table of 3 rows; fields: key, sd, rel_sd, ar1, corr_y |
| runs.{form}.{tfp}.stats.pc.kr | table of 3 rows; fields: key, sd, rel_sd, ar1, corr_y, corr_data |
| runs.{form}.{tfp}.stats.pc.{filter} | table of 3 rows; fields: key, sd, rel_sd, ar1, corr_y, corr_data |
| runs.{form}.{tfp}.stats.sp_total.data | table of 3 rows; fields: key, sd, rel_sd, ar1, corr_y |
| runs.{form}.{tfp}.stats.sp_total.kr | table of 3 rows; fields: key, sd, rel_sd, ar1, corr_y, corr_data |
| runs.{form}.{tfp}.stats.sp_total.{filter} | table of 3 rows; fields: key, sd, rel_sd, ar1, corr_y, corr_data |
| runs.{form}.{tfp}.stats.sp_pc.data | table of 3 rows; fields: key, sd, rel_sd, ar1, corr_y |
| runs.{form}.{tfp}.stats.sp_pc.kr | table of 3 rows; fields: key, sd, rel_sd, ar1, corr_y, corr_data |
| runs.{form}.{tfp}.stats.sp_pc.{filter} | table of 3 rows; fields: key, sd, rel_sd, ar1, corr_y, corr_data |
| downloads | values: csv = downloads/economics/us/us-rbc-stock-market.csv, mat = downloads/economics/us/us-rbc-stock-market.mat |
