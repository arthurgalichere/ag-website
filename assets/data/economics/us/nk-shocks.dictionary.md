# Data dictionary: nk-shocks.json

File: https://arthurgalichere.com/assets/data/economics/us/nk-shocks.json (generated 2026-11-21T11:28:24+00:00 UTC). Missing values are JSON null. Dates are the first day of the period (quarter, month or year). When a series exists in several versions, one row covers them, with a placeholder in the path: . First and last dates marked (varies) differ across those versions.

## Series

| path | meaning | units | transformation | first | last | n |
|---|---|---|---|---|---|---|
| series.a | Technology |  |  | 1954-07-01 | 2026-07-01 | 289 |
| series.th | Labour preference |  |  | 1954-07-01 | 2026-07-01 | 289 |
| series.z | Demand |  |  | 1954-07-01 | 2026-07-01 | 289 |
| series.nu | Monetary policy |  |  | 1954-07-01 | 2026-07-01 | 289 |
| series.e_a |  |  |  | 1954-10-01 | 2026-07-01 | 288 |
| series.e_th |  |  |  | 1954-10-01 | 2026-07-01 | 288 |
| series.e_z |  |  |  | 1954-10-01 | 2026-07-01 | 288 |
| series.e_nu |  |  |  | 1954-10-01 | 2026-07-01 | 288 |
| series.yh_hp |  |  |  | 1954-07-01 | 2026-07-01 | 289 |
| series.tfp_util_hp |  |  |  | 1954-07-01 | 2026-07-01 | 289 |

## Other blocks (statistics, tables, settings)

Values shown for the first version when a block repeats (placeholders as above).

| path | content |
|---|---|
| dashboard | str: nk-shocks |
| country | values: code = US, name = United States |
| generated_at_utc | str: 2026-11-21T11:28:24+00:00 |
| data_generated_at_utc | str: 2026-11-20T16:12:55+00:00 |
| recessions | recession dates (peak, trough) used to shade the charts |
| structural | values: beta = 0.99, sigma = 1.0, eta = 5.0, eps = 11.0, omega = 75.0, xi = 0.7, phi_pi = 1.5, phi_y = 0.125 |
| notes_rho | values: a = 0.9, th = 0.9, z = 0.5, nu = 0.0 |
| labels | values: a = Technology, th = Labour preference, z = Demand, nu = Monetary policy |
| identification.rho | values: a = 0.9, th = 0.9, z = 0.5, nu = 0.0 |
| identification.columns.a | list: 0.9781204522155552, -0.1584618362474998, -0.2404276978443053 |
| identification.columns.th | list: -0.16302007536925922, 0.026410306041249963, 0.04007128297405087 |
| identification.columns.z | list: 0.22849570964562152, 0.3571901814714865, 0.5643472359129326 |
| identification.columns.nu | list: -0.43306112348428605, -0.34187082405345215, 0.43306112348428605 |
| identification.ratio | list: -5.999999999999999, -6.000000000000001, -6.000000000000002 |
| identification.det_three | float: -1.0606165741262893e-17 |
| fixed_point.path | table of 8 rows; fields: iteration, a, th, z, nu |
| fixed_point.rho | values: a = 0.7382997074163256, th = 0.8158590912648485, z = 0.8764921419410383, nu = 0.0 |
| fixed_point.iterations | int: 7 |
| matrix.rows | list: y, yh, pi, R |
| matrix.columns | list: a, th, z, nu |
| properties.a | values: sd_state = 1.1129500632300422, rho = 0.7382997074163256, rho_se = 0.0399088441899764, rho_used = 0.7382997074163256, rho_notes = 0.9, sd_innov = 0.7522296623553304, skew = 0.33882573380163533, ex_kurt = 2.27378942503137, jb_p = 2.1442658427342037e-15, innov_ar1 = 0.06814879296096035, mean_in … |
| properties.th | values: sd_state = 10.319234384701906, rho = 0.8158590912786743, rho_se = 0.03383254819335539, rho_used = 0.8158590912648485, rho_notes = 0.9, sd_innov = 5.914145755832261, skew = 6.6449124639211785, ex_kurt = 79.94961164840585, jb_p = 0.0, innov_ar1 = 0.10141520859985204, mean_innov_rec = 6.6469745 … |
| properties.z | values: sd_state = 3.720211589651847, rho = 0.876492141825362, rho_se = 0.02781982772070066, rho_used = 0.8764921419410383, rho_notes = 0.5, sd_innov = 1.7531847272490004, skew = -0.7674430975834181, ex_kurt = 12.727079507879298, jb_p = 0.0, innov_ar1 = 0.08809496285760006, mean_innov_rec = -2.41003 … |
| properties.nu | values: sd_state = 3.1880514424965174, rho = 0.7814879564292895, rho_se = 0.03689747446177723, rho_used = 0.0, rho_notes = 0.0, sd_innov = 3.1934880537489927, skew = -0.7489265717931586, ex_kurt = 1.5940244450260108, jb_p = 3.4100889717291694e-13, innov_ar1 = 0.7815809959013773, mean_innov_rec = -0. … |
| correlations.threshold | float: 0.11785113019775793 |
| correlations.n | int: 288 |
| technology_check | values: n = 289, start = 1954-07-01, end = 2026-07-01, corr = 0.46047766467528745, sd_yh = 1.1129500632300422, sd_tfp = 0.9323856546077431, ar1_yh = 0.7382997074163256, ar1_tfp = 0.6630023818674462, corr_y_yh = 0.2380877318112611, corr_y_tfp = -0.12856207826200491 |
| robustness | table of 7 rows; fields: label, converged, n, rho, nu_ar1, sd_innov, corr |
| zlb.rate | float: 0.25 |
| zlb.mean_nu | float: -2.9604522543738505 |
| romer | table of 10 rows; fields: label, quarter, sign, in_sample |
| calibration.rho | values: a = 0.7382997074163256, th = 0.8158590912648485, z = 0.8764921419410383, nu = 0.0 |
| calibration.sd | values: a = 0.7522296623553304, th = 5.914145755832261, z = 1.7531847272490004, nu = 3.1934880537489927 |
| calibration.pricing | str: calvo |
| calibration.measure | str: demeaned |
| calibration.sample | list: 1954-07-01, 2026-07-01 |
| sources | values: y_hp = U.S. Bureau of Economic Analysis via FRED; population: BEA (B230RC0Q173SBEA); author's calculation, infl = U.S. Bureau of Economic Analysis (GDPDEF) via FRED; author's calculation, ff = Board of Governors of the Federal Reserve System via FRED, yh_hp = U.S. Bureau of Labor Statistics  … |
| downloads | values: csv = /downloads/economics/us/us-nk-shocks.csv, mat = /downloads/economics/us/us-nk-shocks.mat |
