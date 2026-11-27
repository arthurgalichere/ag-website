# Data dictionary: nk-model.json

File: https://arthurgalichere.com/assets/data/economics/us/nk-model.json (generated 2026-11-27T16:12:09+00:00 UTC). Missing values are JSON null. Dates are the first day of the period (quarter, month or year). When a series exists in several versions, one row covers them, with a placeholder in the path: . First and last dates marked (varies) differ across those versions.

## Series

| path | meaning | units | transformation | first | last | n |
|---|---|---|---|---|---|---|
| series.y_hp |  |  |  | 1954-07-01 | 2026-07-01 | 289 |
| series.yh_hp |  |  |  | 1954-07-01 | 2026-07-01 | 289 |
| series.infl_hp |  |  |  | 1954-07-01 | 2026-07-01 | 289 |
| series.ff_hp |  |  |  | 1954-07-01 | 2026-07-01 | 289 |
| series.infl |  |  |  | 1954-07-01 | 2026-07-01 | 289 |
| series.ff |  |  |  | 1954-07-01 | 2026-07-01 | 289 |

## Other blocks (statistics, tables, settings)

Values shown for the first version when a block repeats (placeholders as above).

| path | content |
|---|---|
| dashboard | str: nk-model |
| country | values: code = US, name = United States |
| generated_at_utc | str: 2026-11-27T16:12:09+00:00 |
| data_generated_at_utc | str: 2026-11-24T16:53:35+00:00 |
| recessions | recession dates (peak, trough) used to shade the charts |
| means | values: infl = 3.1723, ff = 4.5939 |
| calibration.rho | values: a = 0.7382997074163256, th = 0.8158590912648485, z = 0.8764921419410383, nu = 0.0 |
| calibration.sd | values: a = 0.7522296623553304, th = 5.914145755832261, z = 1.7531847272490004, nu = 3.1934880537489927 |
| calibration.pricing | str: calvo |
| calibration.measure | str: demeaned |
| calibration.sample | list: 1954-07-01, 2026-07-01 |
| sources | values: y_hp = U.S. Bureau of Economic Analysis via FRED; population: BEA (B230RC0Q173SBEA); author's calculation, infl = U.S. Bureau of Economic Analysis (GDPDEF) via FRED; author's calculation, ff = Board of Governors of the Federal Reserve System via FRED, yh_hp = U.S. Bureau of Labor Statistics  … |
