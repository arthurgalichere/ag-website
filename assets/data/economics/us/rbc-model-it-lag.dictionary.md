# Data dictionary: rbc-model-it-lag.json

File: https://arthurgalichere.com/assets/data/economics/us/rbc-model-it-lag.json (generated 2026-11-20T16:12:55+00:00 UTC). Missing values are JSON null. Dates are the first day of the period (quarter, month or year). When a series exists in several versions, one row covers them, with a placeholder in the path: {form} = hicks or harrod (Hicks- or Harrod-neutral technology); {tfp} = the TFP measure (e.g. measured; adjusted = utilization-adjusted, Fernald); {kind} = kr (run driven by linear-trend shocks, then HP filtered, as King and Rebelo) or hp (run driven by HP-filtered shocks). First and last dates marked (varies) differ across those versions.

## Series

| path | meaning | units | transformation | first | last | n |
|---|---|---|---|---|---|---|
| runs.{form}.{tfp}.series.{kind}.y | Output: Model simulation, percent deviation from trend (r: percentage points a year); kr: driven by the measured shocks (linear-trend deviations), then HP filtered (λ 1600), as King and Rebelo; hp: driven by shocks of HP-filtered TFP. | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| runs.{form}.{tfp}.series.{kind}.c | Consumption: Model simulation, percent deviation from trend (r: percentage points a year); kr: driven by the measured shocks (linear-trend deviations), then HP filtered (λ 1600), as King and Rebelo; hp: driven by shocks of HP-filtered TFP. | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| runs.{form}.{tfp}.series.{kind}.i | Investment: Model simulation, percent deviation from trend (r: percentage points a year); kr: driven by the measured shocks (linear-trend deviations), then HP filtered (λ 1600), as King and Rebelo; hp: driven by shocks of HP-filtered TFP. | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| runs.{form}.{tfp}.series.{kind}.h | Hours worked: Model simulation, percent deviation from trend (r: percentage points a year); kr: driven by the measured shocks (linear-trend deviations), then HP filtered (λ 1600), as King and Rebelo; hp: driven by shocks of HP-filtered TFP. | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| runs.{form}.{tfp}.series.{kind}.k | Capital: Model simulation, percent deviation from trend (r: percentage points a year); kr: driven by the measured shocks (linear-trend deviations), then HP filtered (λ 1600), as King and Rebelo; hp: driven by shocks of HP-filtered TFP. | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| runs.{form}.{tfp}.series.{kind}.yh | Labour productivity: Model simulation, percent deviation from trend (r: percentage points a year); kr: driven by the measured shocks (linear-trend deviations), then HP filtered (λ 1600), as King and Rebelo; hp: driven by shocks of HP-filtered TFP. | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| runs.{form}.{tfp}.series.{kind}.w | Real wage: Model simulation, percent deviation from trend (r: percentage points a year); kr: driven by the measured shocks (linear-trend deviations), then HP filtered (λ 1600), as King and Rebelo; hp: driven by shocks of HP-filtered TFP. | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| runs.{form}.{tfp}.series.{kind}.r | Real interest rate: Model simulation, percent deviation from trend (r: percentage points a year); kr: driven by the measured shocks (linear-trend deviations), then HP filtered (λ 1600), as King and Rebelo; hp: driven by shocks of HP-filtered TFP. | Percentage points (annual rate) |  | 1950-01-01 | 2026-07-01 | 307 |
| runs.{form}.{tfp}.series.{kind}.a | Technology: Model simulation, percent deviation from trend (r: percentage points a year); kr: driven by the measured shocks (linear-trend deviations), then HP filtered (λ 1600), as King and Rebelo; hp: driven by shocks of HP-filtered TFP. | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| runs.{form}.{tfp}.irf_tfp.y | Output | Percent deviation from trend |  | index 0 | index 79 | 80 |
| runs.{form}.{tfp}.irf_tfp.c | Consumption | Percent deviation from trend |  | index 0 | index 79 | 80 |
| runs.{form}.{tfp}.irf_tfp.i | Investment | Percent deviation from trend |  | index 0 | index 79 | 80 |
| runs.{form}.{tfp}.irf_tfp.h | Hours worked | Percent deviation from trend |  | index 0 | index 79 | 80 |
| runs.{form}.{tfp}.irf_tfp.k | Capital | Percent deviation from trend |  | index 0 | index 79 | 80 |
| runs.{form}.{tfp}.irf_tfp.w | Real wage | Percent deviation from trend |  | index 0 | index 79 | 80 |
| runs.{form}.{tfp}.irf_tfp.r | Real interest rate | Percentage points (annual rate) |  | index 0 | index 79 | 80 |
| runs.{form}.{tfp}.irf_tfp.a | Technology | Percent deviation from trend |  | index 0 | index 79 | 80 |
| runs.{form}.{tfp}.irf_tfp.q |  |  |  | index 0 | index 79 | 80 |
| runs.{form}.{tfp}.irf_phi.y | Output | Percent deviation from trend |  | index 0 | index 79 | 80 |
| runs.{form}.{tfp}.irf_phi.c | Consumption | Percent deviation from trend |  | index 0 | index 79 | 80 |
| runs.{form}.{tfp}.irf_phi.i | Investment | Percent deviation from trend |  | index 0 | index 79 | 80 |
| runs.{form}.{tfp}.irf_phi.h | Hours worked | Percent deviation from trend |  | index 0 | index 79 | 80 |
| runs.{form}.{tfp}.irf_phi.k | Capital | Percent deviation from trend |  | index 0 | index 79 | 80 |
| runs.{form}.{tfp}.irf_phi.w | Real wage | Percent deviation from trend |  | index 0 | index 79 | 80 |
| runs.{form}.{tfp}.irf_phi.r | Real interest rate | Percentage points (annual rate) |  | index 0 | index 79 | 80 |
| runs.{form}.{tfp}.irf_phi.f |  |  |  | index 0 | index 79 | 80 |
| runs.{form}.{tfp}.irf_phi.q |  |  |  | index 0 | index 79 | 80 |
| canonical.{form}.measured.series.{kind}.y | Output | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| canonical.{form}.measured.series.{kind}.c | Consumption | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| canonical.{form}.measured.series.{kind}.i | Investment | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| canonical.{form}.measured.series.{kind}.h | Hours worked | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| canonical.{form}.measured.series.{kind}.k | Capital | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| canonical.{form}.measured.series.{kind}.yh | Labour productivity | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| canonical.{form}.measured.series.{kind}.w | Real wage | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| canonical.{form}.measured.series.{kind}.r | Real interest rate | Percentage points (annual rate) |  | 1950-01-01 | 2026-07-01 | 307 |
| canonical.{form}.measured.series.{kind}.a | Technology | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| canonical.{form}.measured.irf.y | Output | Percent deviation from trend |  | index 0 | index 79 | 80 |
| canonical.{form}.measured.irf.c | Consumption | Percent deviation from trend |  | index 0 | index 79 | 80 |
| canonical.{form}.measured.irf.i | Investment | Percent deviation from trend |  | index 0 | index 79 | 80 |
| canonical.{form}.measured.irf.h | Hours worked | Percent deviation from trend |  | index 0 | index 79 | 80 |
| canonical.{form}.measured.irf.k | Capital | Percent deviation from trend |  | index 0 | index 79 | 80 |
| canonical.{form}.measured.irf.w | Real wage | Percent deviation from trend |  | index 0 | index 79 | 80 |
| canonical.{form}.measured.irf.r | Real interest rate | Percentage points (annual rate) |  | index 0 | index 79 | 80 |
| canonical.{form}.measured.irf.a | Technology | Percent deviation from trend |  | index 0 | index 79 | 80 |
| canonical.{form}.adjusted.series.{kind}.y | Output | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| canonical.{form}.adjusted.series.{kind}.c | Consumption | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| canonical.{form}.adjusted.series.{kind}.i | Investment | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| canonical.{form}.adjusted.series.{kind}.h | Hours worked | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| canonical.{form}.adjusted.series.{kind}.k | Capital | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| canonical.{form}.adjusted.series.{kind}.yh | Labour productivity | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| canonical.{form}.adjusted.series.{kind}.w | Real wage | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| canonical.{form}.adjusted.series.{kind}.r | Real interest rate | Percentage points (annual rate) |  | 1950-01-01 | 2026-07-01 | 307 |
| canonical.{form}.adjusted.series.{kind}.a | Technology | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| canonical.{form}.adjusted.irf.y | Output | Percent deviation from trend |  | index 0 | index 79 | 80 |
| canonical.{form}.adjusted.irf.c | Consumption | Percent deviation from trend |  | index 0 | index 79 | 80 |
| canonical.{form}.adjusted.irf.i | Investment | Percent deviation from trend |  | index 0 | index 79 | 80 |
| canonical.{form}.adjusted.irf.h | Hours worked | Percent deviation from trend |  | index 0 | index 79 | 80 |
| canonical.{form}.adjusted.irf.k | Capital | Percent deviation from trend |  | index 0 | index 79 | 80 |
| canonical.{form}.adjusted.irf.w | Real wage | Percent deviation from trend |  | index 0 | index 79 | 80 |
| canonical.{form}.adjusted.irf.r | Real interest rate | Percentage points (annual rate) |  | index 0 | index 79 | 80 |
| canonical.{form}.adjusted.irf.a | Technology | Percent deviation from trend |  | index 0 | index 79 | 80 |
| data.y | Output | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| data.c | Consumption | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| data.i | Investment | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| data.h | Hours worked | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| data.k | Capital | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| data.yh | Labour productivity | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| data.w | Real wage | Percent deviation from trend |  | 1950-01-01 | 2026-07-01 | 307 |
| data.r | Real interest rate | Percentage points (annual rate) |  | 1950-01-01 | 2026-04-01 | 306 |
| data_total.y | Output | Percent deviation from trend | data, totals | 1950-01-01 | 2026-07-01 | 307 |
| data_total.c | Consumption | Percent deviation from trend | data, totals | 1950-01-01 | 2026-07-01 | 307 |
| data_total.i | Investment | Percent deviation from trend | data, totals | 1950-01-01 | 2026-07-01 | 307 |
| data_total.h | Hours worked | Percent deviation from trend | data, totals | 1950-01-01 | 2026-07-01 | 307 |
| data_total.k | Capital | Percent deviation from trend | data, totals | 1950-01-01 | 2026-07-01 | 307 |
| data_total.yh | Labour productivity | Percent deviation from trend | data, totals | 1950-01-01 | 2026-07-01 | 307 |
| data_total.w | Real wage | Percent deviation from trend | data, totals | 1950-01-01 | 2026-07-01 | 307 |
| data_total.r | Real interest rate | Percentage points (annual rate) | data, totals | 1950-01-01 | 2026-04-01 | 306 |

## Other blocks (statistics, tables, settings)

Values shown for the first version when a block repeats (placeholders as above).

| path | content |
|---|---|
| dashboard | str: rbc-model-it-lag |
| generated_at_utc | str: 2026-11-20T16:12:55+00:00 |
| recessions | recession dates (peak, trough) used to shade the charts |
| calibration | values: beta = 0.982709, alpha = 0.333333, delta = 0.025, xi = 3.364102, eta = 1.0, sigma = 1.0, phi = 0.17, rho_phi = 0.737, sigma_phi = 0.3569 |
| calibration_targets.return_annual | values: value = 8.692, sample = 1950 Q1–2026 Q3, source = financial-stock-market.json (sp_return_real) |
| calibration_targets.hours | float: 0.2 |
| calibration_targets.g_x_default | float: 0.004064 |
| calibration_targets.default_run | str: hicks/measured |
| runs.{form}.{tfp}.steady_state | values: hours = 0.1994, k_y_annual = 1.752, i_y = 0.204, c_y = 0.796, d_y = 0.129, p_y_annual = 1.484, q = 1.018, mpk_annual = 19.028, r_annual = 8.692 |
| runs.{form}.{tfp}.eigenvalues | list: 0.0787, 0.737, 0.9332, 0.9761 |
| runs.{form}.{tfp}.stats.{kind} | table of 9 rows; fields: key, sd, rel_sd, ar1, corr_y, corr_data |
| runs.{form}.{tfp}.stats_total.{kind} | table of 9 rows; fields: key, sd, rel_sd, ar1, corr_y, corr_data |
| technology.{form}.series.{tfp}.estimation | list: 1947-01-01, 2026-07-01 |
| canonical.{form}.measured.stats.data | table of 9 rows; fields: key, sd, rel_sd, ar1, corr_y |
| canonical.{form}.measured.stats.{kind} | table of 9 rows; fields: key, sd, rel_sd, ar1, corr_y, corr_data |
| canonical.{form}.measured.stats_total.data | table of 9 rows; fields: key, sd, rel_sd, ar1, corr_y |
| canonical.{form}.measured.stats_total.{kind} | table of 9 rows; fields: key, sd, rel_sd, ar1, corr_y, corr_data |
| canonical.{form}.measured.steady_state | values: hours = 0.2, k_y_annual = 1.783, i_y = 0.207, c_y = 0.793, r_annual = 8.692 |
| canonical.{form}.measured.eigenvalues | list: 0.9284, 0.9761, 1.096 |
| canonical.{form}.adjusted.stats.data | table of 9 rows; fields: key, sd, rel_sd, ar1, corr_y |
| canonical.{form}.adjusted.stats.{kind} | table of 9 rows; fields: key, sd, rel_sd, ar1, corr_y, corr_data |
| canonical.{form}.adjusted.stats_total.data | table of 9 rows; fields: key, sd, rel_sd, ar1, corr_y |
| canonical.{form}.adjusted.stats_total.{kind} | table of 9 rows; fields: key, sd, rel_sd, ar1, corr_y, corr_data |
| canonical.{form}.adjusted.steady_state | values: hours = 0.2001, k_y_annual = 1.778, i_y = 0.208, c_y = 0.792, r_annual = 8.744 |
| canonical.{form}.adjusted.eigenvalues | list: 0.9283, 0.9784, 1.0962 |
| variables | table of 9 rows; fields: key, label, units |
