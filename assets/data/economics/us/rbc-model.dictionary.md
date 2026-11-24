# Data dictionary: rbc-model.json

File: https://arthurgalichere.com/assets/data/economics/us/rbc-model.json (generated 2026-11-20T16:12:55+00:00 UTC). Missing values are JSON null. Dates are the first day of the period (quarter, month or year). When a series exists in several versions, one row covers them, with a placeholder in the path: {form} = hicks or harrod (Hicks- or Harrod-neutral technology); {tfp} = the TFP measure (e.g. measured; adjusted = utilization-adjusted, Fernald); {kind} = kr (run driven by linear-trend shocks, then HP filtered, as King and Rebelo) or hp (run driven by HP-filtered shocks). First and last dates marked (varies) differ across those versions.

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
| model.data.y | Output: Data: HP cycle (λ 1600) per capita, percent deviation from trend (r: real rate, percentage points a year). | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| model.data.c | Consumption: Data: HP cycle (λ 1600) per capita, percent deviation from trend (r: real rate, percentage points a year). | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| model.data.i | Investment: Data: HP cycle (λ 1600) per capita, percent deviation from trend (r: real rate, percentage points a year). | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| model.data.h | Hours worked: Data: HP cycle (λ 1600) per capita, percent deviation from trend (r: real rate, percentage points a year). | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| model.data.k | Capital: Data: HP cycle (λ 1600) per capita, percent deviation from trend (r: real rate, percentage points a year). | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| model.data.yh | Labour productivity: Data: HP cycle (λ 1600) per capita, percent deviation from trend (r: real rate, percentage points a year). | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| model.data.w | Real wage: Data: HP cycle (λ 1600) per capita, percent deviation from trend (r: real rate, percentage points a year). | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| model.data.r | Real interest rate: Data: HP cycle (λ 1600) per capita, percent deviation from trend (r: real rate, percentage points a year). | Percentage points (annual rate) |  | 1950-01-01 | 2026-04-01 | 306 |
| model.data_total.y | Output: Data: HP cycle (λ 1600), totals, percent deviation from trend. | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| model.data_total.c | Consumption: Data: HP cycle (λ 1600), totals, percent deviation from trend. | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| model.data_total.i | Investment: Data: HP cycle (λ 1600), totals, percent deviation from trend. | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| model.data_total.h | Hours worked: Data: HP cycle (λ 1600), totals, percent deviation from trend. | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| model.data_total.k | Capital: Data: HP cycle (λ 1600), totals, percent deviation from trend. | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| model.data_total.yh | Labour productivity: Data: HP cycle (λ 1600), totals, percent deviation from trend. | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| model.data_total.w | Real wage: Data: HP cycle (λ 1600), totals, percent deviation from trend. | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| model.data_total.r | Real interest rate: Data: HP cycle (λ 1600), totals, percent deviation from trend. | Percentage points (annual rate) |  | 1950-01-01 | 2026-04-01 | 306 |
| model.runs.{form}.{tfp}.irf.y | Output: Impulse response to a 1 percent technology shock; index 0 is the quarter of the shock; percent deviation (r: percentage points a year). | Percent deviation from trend |  | index 0 | index 79 | 80 |
| model.runs.{form}.{tfp}.irf.c | Consumption: Impulse response to a 1 percent technology shock; index 0 is the quarter of the shock; percent deviation (r: percentage points a year). | Percent deviation from trend |  | index 0 | index 79 | 80 |
| model.runs.{form}.{tfp}.irf.i | Investment: Impulse response to a 1 percent technology shock; index 0 is the quarter of the shock; percent deviation (r: percentage points a year). | Percent deviation from trend |  | index 0 | index 79 | 80 |
| model.runs.{form}.{tfp}.irf.h | Hours worked: Impulse response to a 1 percent technology shock; index 0 is the quarter of the shock; percent deviation (r: percentage points a year). | Percent deviation from trend |  | index 0 | index 79 | 80 |
| model.runs.{form}.{tfp}.irf.k | Capital: Impulse response to a 1 percent technology shock; index 0 is the quarter of the shock; percent deviation (r: percentage points a year). | Percent deviation from trend |  | index 0 | index 79 | 80 |
| model.runs.{form}.{tfp}.irf.w | Real wage: Impulse response to a 1 percent technology shock; index 0 is the quarter of the shock; percent deviation (r: percentage points a year). | Percent deviation from trend |  | index 0 | index 79 | 80 |
| model.runs.{form}.{tfp}.irf.r | Real interest rate: Impulse response to a 1 percent technology shock; index 0 is the quarter of the shock; percent deviation (r: percentage points a year). | Percentage points (annual rate) |  | index 0 | index 79 | 80 |
| model.runs.{form}.{tfp}.irf.a | Technology: Impulse response to a 1 percent technology shock; index 0 is the quarter of the shock; percent deviation (r: percentage points a year). | Percent deviation from trend |  | index 0 | index 79 | 80 |
| model.runs.{form}.{tfp}.series.{kind}.y | Output: Model simulation, percent deviation from trend (r: percentage points a year); kr: driven by the measured shocks (linear-trend deviations), then HP filtered (λ 1600), as King and Rebelo; hp: driven by shocks of HP-filtered TFP. | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| model.runs.{form}.{tfp}.series.{kind}.c | Consumption: Model simulation, percent deviation from trend (r: percentage points a year); kr: driven by the measured shocks (linear-trend deviations), then HP filtered (λ 1600), as King and Rebelo; hp: driven by shocks of HP-filtered TFP. | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| model.runs.{form}.{tfp}.series.{kind}.i | Investment: Model simulation, percent deviation from trend (r: percentage points a year); kr: driven by the measured shocks (linear-trend deviations), then HP filtered (λ 1600), as King and Rebelo; hp: driven by shocks of HP-filtered TFP. | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| model.runs.{form}.{tfp}.series.{kind}.h | Hours worked: Model simulation, percent deviation from trend (r: percentage points a year); kr: driven by the measured shocks (linear-trend deviations), then HP filtered (λ 1600), as King and Rebelo; hp: driven by shocks of HP-filtered TFP. | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| model.runs.{form}.{tfp}.series.{kind}.k | Capital: Model simulation, percent deviation from trend (r: percentage points a year); kr: driven by the measured shocks (linear-trend deviations), then HP filtered (λ 1600), as King and Rebelo; hp: driven by shocks of HP-filtered TFP. | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| model.runs.{form}.{tfp}.series.{kind}.yh | Labour productivity: Model simulation, percent deviation from trend (r: percentage points a year); kr: driven by the measured shocks (linear-trend deviations), then HP filtered (λ 1600), as King and Rebelo; hp: driven by shocks of HP-filtered TFP. | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| model.runs.{form}.{tfp}.series.{kind}.w | Real wage: Model simulation, percent deviation from trend (r: percentage points a year); kr: driven by the measured shocks (linear-trend deviations), then HP filtered (λ 1600), as King and Rebelo; hp: driven by shocks of HP-filtered TFP. | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| model.runs.{form}.{tfp}.series.{kind}.r | Real interest rate: Model simulation, percent deviation from trend (r: percentage points a year); kr: driven by the measured shocks (linear-trend deviations), then HP filtered (λ 1600), as King and Rebelo; hp: driven by shocks of HP-filtered TFP. | Percentage points (annual rate) |  | 1950-01-01 | 2026-07-01 | 307 |
| model.runs.{form}.{tfp}.series.{kind}.a | Technology: Model simulation, percent deviation from trend (r: percentage points a year); kr: driven by the measured shocks (linear-trend deviations), then HP filtered (λ 1600), as King and Rebelo; hp: driven by shocks of HP-filtered TFP. | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| model.runs.{form}.{tfp}.data_a | Data counterpart of technology in the run: HP-filtered (λ 1600) log TFP x 100, percent deviation from its HP trend. Not the level of A. |  |  | 1950-01-01 | 2026-07-01 | 307 |

## Other blocks (statistics, tables, settings)

Values shown for the first version when a block repeats (placeholders as above).

| path | content |
|---|---|
| dashboard | str: rbc-model |
| country | values: code = US, name = United States |
| generated_at_utc | str: 2026-11-20T16:12:55+00:00 |
| recessions | recession dates (peak, trough) used to shade the charts |
| technology.{form}.series.{tfp}.hp_compare | values: corr = 1.0, sd_model = 1.215, sd_data = 1.215 |
| technology.{form}.series.{tfp}.hp_shortcut | values: corr_interior = 1.0, corr_first = 0.999, corr_last = 0.998, sd = 0.855, ar1 = 0.083, edge_quarters = 12 |
| technology.{form}.series.{tfp}.estimation | list: 1947-01-01, 2026-07-01 |
| model.calibration | values: beta = 0.982709, alpha = 0.333333, delta = 0.025, xi = 3.364102, eta = 1.0, sigma = 1.0 |
| model.calibration_targets.return_annual | values: value = 8.692, sample = 1950 Q1–2026 Q3, source = financial-stock-market.json (sp_return_real) |
| model.variables | table of 9 rows; fields: key, label, units |
| model.shock_types | values: kr = Linear-trend shocks, model HP-filtered, hp = HP-filtered shocks |
| model.runs.{form}.{tfp}.initial.{kind} | values: a = -14.956, k = 9.925 |
| model.runs.{form}.{tfp}.steady_state | values: hours = 0.2, k_y_annual = 1.783, i_y = 0.207, c_y = 0.793, r_annual = 8.692 |
| model.runs.{form}.{tfp}.eigenvalues | list: 0.9284, 0.9761, 1.096 |
| model.runs.{form}.{tfp}.policy | values: c_a = 0.5871, c_k = 0.5267 |
| model.runs.{form}.{tfp}.stats.data | table of 9 rows; fields: key, sd, rel_sd, ar1, corr_y |
| model.runs.{form}.{tfp}.stats.{kind} | table of 9 rows; fields: key, sd, rel_sd, ar1, corr_y, corr_data |
| model.runs.{form}.{tfp}.stats_total.data | table of 9 rows; fields: key, sd, rel_sd, ar1, corr_y |
| model.runs.{form}.{tfp}.stats_total.{kind} | table of 9 rows; fields: key, sd, rel_sd, ar1, corr_y, corr_data |
| model.runs.{form}.{tfp}.agreement | values: y = 0.9999, c = 0.9912, i = 0.9988, h = 0.9973, k = 0.953, yh = 0.9959, w = 0.9959, r = 0.9954, a = 1.0 |
| downloads | values: simulations_csv = downloads/economics/us/us-rbc-model-simulations.csv, simulations_mat = downloads/economics/us/us-rbc-model-simulations.mat, shocks_csv = downloads/economics/us/us-rbc-technology-shocks.csv, shocks_mat = downloads/economics/us/us-rbc-technology-shocks.mat, hp_shocks_csv = do … |
