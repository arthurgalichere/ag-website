# Data dictionary: financial-debt-leverage.json

File: https://arthurgalichere.com/assets/data/economics/us/financial-debt-leverage.json (generated 2026-11-24T22:39:54+00:00 UTC). Missing values are JSON null. Dates are the first day of the period (quarter, month or year). When a series exists in several versions, one row covers them, with a placeholder in the path: {filter} = hp, hamilton or cf (the filter). First and last dates marked (varies) differ across those versions.

## Series

| path | meaning | units | transformation | first | last | n |
|---|---|---|---|---|---|---|
| indicators.debt_real_total.observations.value | Nonfinancial sectors | Percent deviation from trend | level as published | 1950-01-01 | 2026-04-01 | 306 |
| indicators.debt_real_households.observations.value | Households | Percent deviation from trend | level as published | 1950-01-01 | 2026-04-01 | 306 |
| indicators.debt_real_business.observations.value | Nonfinancial business | Percent deviation from trend | level as published | 1950-01-01 | 2026-04-01 | 306 |
| indicators.debt_real_corporate.observations.value | Nonfinancial corporations | Percent deviation from trend | level as published | 1950-01-01 | 2026-04-01 | 306 |
| indicators.debt_real_government.observations.value | Government | Percent deviation from trend | level as published | 1950-01-01 | 2026-04-01 | 306 |
| indicators.debt_real_federal.observations.value | Real federal government debt | Billions of 2017 dollars (deflated by the GDP price index) | level as published | 1950-01-01 | 2026-04-01 | 306 |
| indicators.debt_real_statelocal.observations.value | Real state and local government debt | Billions of 2017 dollars (deflated by the GDP price index) | level as published | 1950-01-01 | 2026-04-01 | 306 |
| indicators.debt_gdp_all.observations.value | Debt of all sectors, including the financial sector and the rest of the world, to GDP | Percent of GDP | level as published | 1950-01-01 | 2026-04-01 | 306 |
| indicators.debt_gdp_total.observations.value | Nonfinancial debt to GDP | Percentage points | level as published | 1950-01-01 | 2026-04-01 | 306 |
| indicators.debt_gdp_households.observations.value | Household debt to GDP | Percent of GDP | level as published | 1950-01-01 | 2026-04-01 | 306 |
| indicators.debt_gdp_business.observations.value | Nonfinancial business debt to GDP | Percent of GDP | level as published | 1950-01-01 | 2026-04-01 | 306 |
| indicators.debt_gdp_corporate.observations.value | Nonfinancial corporate debt to GDP | Percent of GDP | level as published | 1950-01-01 | 2026-04-01 | 306 |
| indicators.debt_gdp_government.observations.value | Government debt to GDP | Percent of GDP | level as published | 1950-01-01 | 2026-04-01 | 306 |
| indicators.debt_gdp_federal.observations.value | Federal government debt to GDP | Percent of GDP | level as published | 1950-01-01 | 2026-04-01 | 306 |
| indicators.corp_debt_networth.observations.value | Nonfinancial corporate debt as a percentage of net worth (historical cost) | Percent | level as published | 1950-01-01 | 2026-04-01 | 306 |
| indicators.corp_debt_equity.observations.value | Corporate debt to market value of equities | Percentage points | level as published | 1950-01-01 | 2026-04-01 | 306 |
| indicators.corp_assets_real.observations.value | Real total assets of nonfinancial corporations | Billions of 2017 dollars (deflated by the GDP price index) | level as published | 1950-01-01 | 2026-04-01 | 306 |
| indicators.corp_liabilities_real.observations.value | Real total liabilities of nonfinancial corporations | Billions of 2017 dollars (deflated by the GDP price index) | level as published | 1950-01-01 | 2026-04-01 | 306 |
| indicators.corp_networth_real.observations.value | Real net worth of nonfinancial corporations (market value) | Billions of 2017 dollars (deflated by the GDP price index) | level as published | 1950-01-01 | 2026-04-01 | 306 |
| indicators.corp_debt_assets.observations.value | Corporate debt to total assets | Percentage points | level as published | 1950-01-01 | 2026-04-01 | 306 |
| indicators.corp_debt_networth_mv.observations.value | Corporate debt to net worth (market value) | Percentage points | level as published | 1950-01-01 | 2026-04-01 | 306 |
| indicators.corp_q.observations.value | Tobin's q | Percent deviation from trend | level as published | 1950-01-01 | 2026-04-01 | 306 |
| indicators.bis_credit_private.observations.value | Private credit to GDP (BIS) | Percentage points | level as published | 1950-01-01 | 2026-01-01 | 305 |
| indicators.bis_credit_households.observations.value | Credit to households, all lenders | Percent of GDP | level as published | 1950-01-01 | 2026-01-01 | 305 |
| indicators.bis_credit_nfc.observations.value | Credit to nonfinancial corporations, all lenders | Percent of GDP | level as published | 1950-01-01 | 2026-01-01 | 305 |
| indicators.bis_credit_trend.observations.value | One-sided HP trend (λ = 400,000) | Percent of GDP | level as published | 1957-07-01 | 2026-01-01 | 275 |
| indicators.bis_credit_gap.observations.value | Credit-to-GDP gap | Percentage points of GDP | level as published | 1957-07-01 | 2026-01-01 | 275 |
| cycles.{filter}.y | Output (real GDP) | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.debt_real_total | Nonfinancial sectors | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-04-01 | 306 |
| cycles.{filter}.debt_real_households | Households | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-04-01 | 306 |
| cycles.{filter}.debt_real_business | Nonfinancial business | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-04-01 | 306 |
| cycles.{filter}.debt_real_corporate | Nonfinancial corporations | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-04-01 | 306 |
| cycles.{filter}.debt_real_government | Government | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-04-01 | 306 |
| cycles.{filter}.debt_gdp_total | Nonfinancial debt to GDP | Percentage points | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1950-01-01 | 2026-04-01 | 306 |
| cycles.{filter}.corp_debt_assets | Corporate debt to total assets | Percentage points | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1950-01-01 | 2026-04-01 | 306 |
| cycles.{filter}.corp_debt_networth_mv | Corporate debt to net worth (market value) | Percentage points | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1950-01-01 | 2026-04-01 | 306 |
| cycles.{filter}.corp_debt_equity | Corporate debt to market value of equities | Percentage points | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1950-01-01 | 2026-04-01 | 306 |
| cycles.{filter}.corp_q | Tobin's q | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-04-01 | 306 |
| cycles.{filter}.bis_credit_private | Private credit to GDP (BIS) | Percentage points | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1950-01-01 (varies) | 2026-01-01 | 303–305 |

## Other blocks (statistics, tables, settings)

Values shown for the first version when a block repeats (placeholders as above).

| path | content |
|---|---|
| dashboard | str: financial-debt-leverage |
| title | str: Debt and Leverage |
| country | values: code = US, name = United States |
| generated_at_utc | str: 2026-11-24T22:39:54+00:00 |
| recessions | recession dates (peak, trough) used to shade the charts |
| indicators.debt_real_total.estimates | table of 6 rows; fields: series_id, date, value, method, reason |
| indicators.debt_real_households.estimates | table of 6 rows; fields: series_id, date, value, method, reason |
| indicators.debt_real_business.estimates | table of 6 rows; fields: series_id, date, value, method, reason |
| indicators.debt_real_corporate.estimates | table of 6 rows; fields: series_id, date, value, method, reason |
| indicators.debt_real_government.estimates | table of 12 rows; fields: series_id, date, value, method, reason |
| indicators.debt_real_federal.estimates | table of 6 rows; fields: series_id, date, value, method, reason |
| indicators.debt_real_statelocal.estimates | table of 6 rows; fields: series_id, date, value, method, reason |
| indicators.debt_gdp_all.estimates | table of 6 rows; fields: series_id, date, value, method, reason |
| indicators.debt_gdp_total.estimates | table of 6 rows; fields: series_id, date, value, method, reason |
| indicators.debt_gdp_households.estimates | table of 6 rows; fields: series_id, date, value, method, reason |
| indicators.debt_gdp_business.estimates | table of 6 rows; fields: series_id, date, value, method, reason |
| indicators.debt_gdp_corporate.estimates | table of 6 rows; fields: series_id, date, value, method, reason |
| indicators.debt_gdp_government.estimates | table of 12 rows; fields: series_id, date, value, method, reason |
| indicators.debt_gdp_federal.estimates | table of 6 rows; fields: series_id, date, value, method, reason |
| indicators.corp_debt_networth.estimates | table of 6 rows; fields: series_id, date, value, method, reason |
| indicators.corp_debt_equity.estimates | table of 6 rows; fields: series_id, date, value, method, reason |
| indicators.corp_assets_real.estimates | table of 6 rows; fields: series_id, date, value, method, reason |
| indicators.corp_liabilities_real.estimates | table of 6 rows; fields: series_id, date, value, method, reason |
| indicators.corp_networth_real.estimates | table of 6 rows; fields: series_id, date, value, method, reason |
| indicators.corp_debt_assets.estimates | table of 12 rows; fields: series_id, date, value, method, reason |
| indicators.corp_debt_networth_mv.estimates | table of 6 rows; fields: series_id, date, value, method, reason |
| indicators.corp_q.estimates | table of 12 rows; fields: series_id, date, value, method, reason |
| indicators.bis_credit_private.estimates | list:  |
| indicators.bis_credit_households.estimates | list:  |
| indicators.bis_credit_nfc.estimates | list:  |
| indicators.bis_credit_trend.estimates | list:  |
| indicators.bis_credit_gap.estimates | list:  |
| cycles.keys | list: debt_real_total, debt_real_households, debt_real_business, debt_real_corporate, debt_real_government, debt_gdp_total, corp_debt_assets, corp_debt_networth_mv, corp_debt_equity, corp_q, bis_credit_private |
| cycles.variables.y | values: label = Output (real GDP), transform = log, units = Percent deviation from trend, source = U.S. Bureau of Economic Analysis (GDPC1) via FRED (Federal Reserve Bank of St. Louis) |
| cycles.variables.debt_real_total | values: label = Nonfinancial sectors, transform = log, units = Percent deviation from trend, source = Board of Governors of the Federal Reserve System, Financial Accounts of the United States (Z.1) (TCMDODNS) via FRED (Federal Reserve Bank of St. Louis); U.S. Bureau of Economic Analysis (GDPDEF) via … |
| cycles.variables.debt_real_households | values: label = Households, transform = log, units = Percent deviation from trend, source = Board of Governors of the Federal Reserve System, Financial Accounts of the United States (Z.1) (CMDEBT) via FRED (Federal Reserve Bank of St. Louis); U.S. Bureau of Economic Analysis (GDPDEF) via FRED (Feder … |
| cycles.variables.debt_real_business | values: label = Nonfinancial business, transform = log, units = Percent deviation from trend, source = Board of Governors of the Federal Reserve System, Financial Accounts of the United States (Z.1) (TBSDODNS) via FRED (Federal Reserve Bank of St. Louis); U.S. Bureau of Economic Analysis (GDPDEF) vi … |
| cycles.variables.debt_real_corporate | values: label = Nonfinancial corporations, transform = log, units = Percent deviation from trend, source = Board of Governors of the Federal Reserve System, Financial Accounts of the United States (Z.1) (BCNSDODNS) via FRED (Federal Reserve Bank of St. Louis); U.S. Bureau of Economic Analysis (GDPDE … |
| cycles.variables.debt_real_government | values: label = Government, transform = log, units = Percent deviation from trend, source = Board of Governors of the Federal Reserve System, Financial Accounts of the United States (Z.1) (FGSDODNS) via FRED (Federal Reserve Bank of St. Louis); Board of Governors of the Federal Reserve System, Finan … |
| cycles.variables.debt_gdp_total | values: label = Nonfinancial debt to GDP, transform = level, units = Percentage points, source = Board of Governors of the Federal Reserve System, Financial Accounts of the United States (Z.1) (TCMDODNS) via FRED (Federal Reserve Bank of St. Louis); U.S. Bureau of Economic Analysis (GDP) via FRED (F … |
| cycles.variables.corp_debt_assets | values: label = Corporate debt to total assets, transform = level, units = Percentage points, source = Board of Governors of the Federal Reserve System, Financial Accounts of the United States (Z.1) (BCNSDODNS, TABSNNCB) via FRED (Federal Reserve Bank of St. Louis); author's calculation, indicator = … |
| cycles.variables.corp_debt_networth_mv | values: label = Corporate debt to net worth (market value), transform = level, units = Percentage points, source = Board of Governors of the Federal Reserve System, Financial Accounts of the United States (Z.1) (NCBCMDPNWMV) via FRED (Federal Reserve Bank of St. Louis), indicator = corp_debt_networt … |
| cycles.variables.corp_debt_equity | values: label = Corporate debt to market value of equities, transform = level, units = Percentage points, source = Board of Governors of the Federal Reserve System, Financial Accounts of the United States (Z.1) (NCBCMDPMVCE) via FRED (Federal Reserve Bank of St. Louis), indicator = corp_debt_equity |
| cycles.variables.corp_q | values: label = Tobin's q, transform = log, units = Percent deviation from trend, source = Board of Governors of the Federal Reserve System, Financial Accounts of the United States (Z.1) (NCBCMDPNWMV, NCBCMDPMVCE) via FRED (Federal Reserve Bank of St. Louis); author's calculation, indicator = corp_q |
| cycles.variables.bis_credit_private | values: label = Private credit to GDP (BIS), transform = level, units = Percentage points, source = Bank for International Settlements (QUSPAM770A) via FRED (Federal Reserve Bank of St. Louis), indicator = bis_credit_private |
| cycles.methods.{filter} | values: h = 8, p = 4 |
| cycles.methods.cf_band_quarters | list: 6, 32 |
| cycles.methods.lags | list: -4, -3, -2, -1, 0, 1, 2, 3, 4 |
| tables.{filter}.stats | table of 12 rows; fields: key, sd, rel_sd, ar1, corr_y, start, end, n |
| tables.{filter}.cross | table of 11 rows; fields: key, values, peak_lag, peak_value |
| downloads | values: quarterly_csv = downloads/economics/us/us-financial-debt-leverage-quarterly.csv, cycles_csv = downloads/economics/us/us-financial-debt-leverage-cycles.csv, mat = downloads/economics/us/us-financial-debt-leverage.mat |
