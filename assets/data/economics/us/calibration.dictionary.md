# Data dictionary: calibration.json

File: https://arthurgalichere.com/assets/data/economics/us/calibration.json (generated 2026-11-24T16:55:48+00:00 UTC). Missing values are JSON null. Dates are the first day of the period (quarter, month or year). When a series exists in several versions, one row covers them, with a placeholder in the path: . First and last dates marked (varies) differ across those versions.

## Series

| path | meaning | units | transformation | first | last | n |
|---|---|---|---|---|---|---|

## Other blocks (statistics, tables, settings)

Values shown for the first version when a block repeats (placeholders as above).

| path | content |
|---|---|
| dashboard | str: calibration |
| country | values: code = US, name = United States |
| generated_at_utc | str: 2026-11-24T16:55:48+00:00 |
| data_generated_at_utc | str: 2026-11-24T16:53:35+00:00 |
| models | table of 5 rows; fields: id, name, url |
| parameters | table of 26 rows; fields: id, group, symbol, name, models, digits, source, value, unit_code, freq |
| targets | table of 41 rows; fields: id, group, name, symbol, unit, models, definition, source, sample, digits, note, value |
| implied.gx | table of 12 rows; fields: id, symbol, name, formula, value, inputs, digits, unit_code, freq, used_by |
| implied.gy | table of 12 rows; fields: id, symbol, name, formula, value, inputs, digits, unit_code, freq, used_by |
| growth_bases.gx | values: label = g_X (trend of TFP), annual = 1.625509799, text = the trend growth of labour-augmenting technology in the RBC models (measured TFP, Hicks-neutral; the default run of The Canonical RBC Model) |
| growth_bases.gy | values: label = Per-capita output growth, annual = 1.998102346, text = the average growth of real GDP per person, 1950 Q2–2026 Q3 |
| implied_default | str: gx |
| model_values.stock | values: d_y = 0.126, pd_annual = 14.21, dp_annual = 7.038, return_annual = 8.691 |
| model_values.rbc | values: hours = 0.2, k_y_annual = 1.783292, i_y = 0.207317, c_y = 0.792683, r_annual = 8.692021 |
