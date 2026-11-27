# Data dictionary: business-dynamics.json

File: https://arthurgalichere.com/assets/data/economics/us/business-dynamics.json (generated 2026-11-27T16:11:05+00:00 UTC). Missing values are JSON null. Dates are the first day of the period (quarter, month or year). When a series exists in several versions, one row covers them, with a placeholder in the path: . First and last dates marked (varies) differ across those versions.

## Series

| path | meaning | units | transformation | first | last | n |
|---|---|---|---|---|---|---|
| annual.values.firms | Firms | Millions | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.estabs | Establishments | Millions | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.emp | Employment | Millions of jobs (March) | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.firm_size | Average firm size | Employees per firm | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.estab_entry | Establishment entry rate | Percent of establishments | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.estab_exit | Establishment exit rate | Percent of establishments | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.firm_exit | Firm exit rate | Percent of firms alive a year earlier | level as published | 1979-01-01 | 2023-01-01 | 45 |
| annual.values.surv_q | Quarterly firm survival rate (from annual exits) | Percent per quarter | level as published | 1979-01-01 | 2023-01-01 | 45 |
| annual.values.ln_surv_a | Annual firm survival, 100 × ln | Percent (log points) | level as published | 1979-01-01 | 2023-01-01 | 45 |
| annual.values.firm_exit_cur | Firm exit rate (deaths over current firms) | Percent of firms | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.jc | Job creation rate | Percent of employment | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.jd | Job destruction rate | Percent of employment | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.jc_births | Job creation by establishment births | Percent of employment | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.jd_deaths | Job destruction by establishment deaths | Percent of employment | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.net_jc | Net job creation rate | Percent of employment | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.realloc | Job reallocation rate | Percent of employment | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.startups | Startups (firms of age 0) | Thousands | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.startup_rate | Firm startup rate | Percent of firms | level as published | 1979-01-01 | 2023-01-01 | 45 |
| annual.values.startup_emp | Employment share of startups | Percent of employment | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.eps_q | Employment share of startups, per quarter | Percent per quarter | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.startup_rel | Startup size relative to the average firm | Ratio | level as published | 1979-01-01 | 2023-01-01 | 45 |
| annual.values.young_emp | Employment share of young firms (0–5 years) | Percent of employment | level as published | 1983-01-01 | 2023-01-01 | 41 |
| annual.values.net_jc_young | Net job creation, young firms (1–5 years) | Percent of employment | level as published | 1983-01-01 | 2023-01-01 | 41 |
| annual.values.net_jc_mature | Net job creation, mature firms (6 years and over) | Percent of employment | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.emp_small | Employment share, 1–19 employees | Percent of employment | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.firms_small | Share of firms, 1–19 employees | Percent of firms | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.jc_small | Job creation rate, 1–19 employees | Percent of employment | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.jd_small | Job destruction rate, 1–19 employees | Percent of employment | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.net_jc_small | Net job creation rate, 1–19 employees | Percent of employment | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.emp_medium | Employment share, 20–499 employees | Percent of employment | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.firms_medium | Share of firms, 20–499 employees | Percent of firms | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.jc_medium | Job creation rate, 20–499 employees | Percent of employment | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.jd_medium | Job destruction rate, 20–499 employees | Percent of employment | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.net_jc_medium | Net job creation rate, 20–499 employees | Percent of employment | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.emp_large | Employment share, 500 or more employees | Percent of employment | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.firms_large | Share of firms, 500 or more employees | Percent of firms | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.jc_large | Job creation rate, 500 or more employees | Percent of employment | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.jd_large | Job destruction rate, 500 or more employees | Percent of employment | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.net_jc_large | Net job creation rate, 500 or more employees | Percent of employment | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.values.gdp_a | Real GDP | Billions of chained 2017 dollars (average, April–March) | level as published | 1978-01-01 | 2023-01-01 | 46 |
| annual.cycles.firms | Firms | Millions | cycle of 100 × log (percent deviation from trend); HP filter, λ 6.25 (annual data) | 1978-01-01 | 2023-01-01 | 46 |
| annual.cycles.estabs | Establishments | Millions | cycle of 100 × log (percent deviation from trend); HP filter, λ 6.25 (annual data) | 1978-01-01 | 2023-01-01 | 46 |
| annual.cycles.emp | Employment | Millions of jobs (March) | cycle of 100 × log (percent deviation from trend); HP filter, λ 6.25 (annual data) | 1978-01-01 | 2023-01-01 | 46 |
| annual.cycles.startups | Startups (firms of age 0) | Thousands | cycle of 100 × log (percent deviation from trend); HP filter, λ 6.25 (annual data) | 1978-01-01 | 2023-01-01 | 46 |
| annual.cycles.startup_rate | Firm startup rate | Percent of firms | cycle of the level (deviation from trend, in the units shown); HP filter, λ 6.25 (annual data) | 1979-01-01 | 2023-01-01 | 45 |
| annual.cycles.firm_exit | Firm exit rate | Percent of firms alive a year earlier | cycle of the level (deviation from trend, in the units shown); HP filter, λ 6.25 (annual data) | 1979-01-01 | 2023-01-01 | 45 |
| annual.cycles.ln_surv_a | Annual firm survival, 100 × ln | Percent (log points) | cycle of the level (deviation from trend, in the units shown); HP filter, λ 6.25 (annual data) | 1979-01-01 | 2023-01-01 | 45 |
| annual.cycles.estab_entry | Establishment entry rate | Percent of establishments | cycle of the level (deviation from trend, in the units shown); HP filter, λ 6.25 (annual data) | 1978-01-01 | 2023-01-01 | 46 |
| annual.cycles.estab_exit | Establishment exit rate | Percent of establishments | cycle of the level (deviation from trend, in the units shown); HP filter, λ 6.25 (annual data) | 1978-01-01 | 2023-01-01 | 46 |
| annual.cycles.startup_emp | Employment share of startups | Percent of employment | cycle of the level (deviation from trend, in the units shown); HP filter, λ 6.25 (annual data) | 1978-01-01 | 2023-01-01 | 46 |
| annual.cycles.jc | Job creation rate | Percent of employment | cycle of the level (deviation from trend, in the units shown); HP filter, λ 6.25 (annual data) | 1978-01-01 | 2023-01-01 | 46 |
| annual.cycles.jd | Job destruction rate | Percent of employment | cycle of the level (deviation from trend, in the units shown); HP filter, λ 6.25 (annual data) | 1978-01-01 | 2023-01-01 | 46 |
| annual.cycles.net_jc | Net job creation rate | Percent of employment | cycle of the level (deviation from trend, in the units shown); HP filter, λ 6.25 (annual data) | 1978-01-01 | 2023-01-01 | 46 |
| annual.cycles.realloc | Job reallocation rate | Percent of employment | cycle of the level (deviation from trend, in the units shown); HP filter, λ 6.25 (annual data) | 1978-01-01 | 2023-01-01 | 46 |
| annual.cycles.gdp_a | Real GDP | Billions of chained 2017 dollars (average, April–March) | cycle of 100 × log (percent deviation from trend); HP filter, λ 6.25 (annual data) | 1978-01-01 | 2023-01-01 | 46 |
| quarterly.values.gjg | Gross job gains | Percent of employment, per quarter | level as published | 1992-07-01 | 2026-01-01 | 135 |
| quarterly.values.gjg_exp | Gross job gains at expanding establishments | Percent of employment, per quarter | level as published | 1992-07-01 | 2026-01-01 | 135 |
| quarterly.values.gjg_open | Gross job gains at opening establishments | Percent of employment, per quarter | level as published | 1992-07-01 | 2026-01-01 | 135 |
| quarterly.values.gjl | Gross job losses | Percent of employment, per quarter | level as published | 1992-07-01 | 2026-01-01 | 135 |
| quarterly.values.gjl_con | Gross job losses at contracting establishments | Percent of employment, per quarter | level as published | 1992-07-01 | 2026-01-01 | 135 |
| quarterly.values.gjl_close | Gross job losses at closing establishments | Percent of employment, per quarter | level as published | 1992-07-01 | 2026-01-01 | 135 |
| quarterly.values.est_open | Establishment openings | Percent of establishments, per quarter | level as published | 1992-07-01 | 2026-01-01 | 135 |
| quarterly.values.est_close | Establishment closings | Percent of establishments, per quarter | level as published | 1992-07-01 | 2026-01-01 | 135 |
| quarterly.values.est_birth | Establishment births | Percent of establishments, per quarter | level as published | 1993-04-01 | 2026-01-01 | 132 |
| quarterly.values.est_death | Establishment deaths | Percent of establishments, per quarter | level as published | 1992-07-01 | 2025-04-01 | 132 |
| quarterly.values.net_gj | Net job gains | Percent of employment, per quarter | level as published | 1992-07-01 | 2026-01-01 | 135 |
| quarterly.values.realloc_q | Job reallocation (gains + losses) | Percent of employment, per quarter | level as published | 1992-07-01 | 2026-01-01 | 135 |
| quarterly.values.gdp_q | Real GDP | Billions of chained 2017 dollars | level as published | 1992-07-01 | 2026-01-01 | 135 |
| quarterly.values.est_surv | Quarterly establishment survival rate (BED) | Percent per quarter | level as published | 1992-07-01 | 2025-04-01 | 132 |
| quarterly.cycles.gjg | Gross job gains | Percent of employment, per quarter | cycle of the level (deviation from trend, in the units shown); HP filter, λ 1600 | 1992-07-01 | 2026-01-01 | 135 |
| quarterly.cycles.gjl | Gross job losses | Percent of employment, per quarter | cycle of the level (deviation from trend, in the units shown); HP filter, λ 1600 | 1992-07-01 | 2026-01-01 | 135 |
| quarterly.cycles.net_gj | Net job gains | Percent of employment, per quarter | cycle of the level (deviation from trend, in the units shown); HP filter, λ 1600 | 1992-07-01 | 2026-01-01 | 135 |
| quarterly.cycles.gjg_open | Gross job gains at opening establishments | Percent of employment, per quarter | cycle of the level (deviation from trend, in the units shown); HP filter, λ 1600 | 1992-07-01 | 2026-01-01 | 135 |
| quarterly.cycles.gjl_close | Gross job losses at closing establishments | Percent of employment, per quarter | cycle of the level (deviation from trend, in the units shown); HP filter, λ 1600 | 1992-07-01 | 2026-01-01 | 135 |
| quarterly.cycles.est_open | Establishment openings | Percent of establishments, per quarter | cycle of the level (deviation from trend, in the units shown); HP filter, λ 1600 | 1992-07-01 | 2026-01-01 | 135 |
| quarterly.cycles.est_close | Establishment closings | Percent of establishments, per quarter | cycle of the level (deviation from trend, in the units shown); HP filter, λ 1600 | 1992-07-01 | 2026-01-01 | 135 |
| quarterly.cycles.est_birth | Establishment births | Percent of establishments, per quarter | cycle of the level (deviation from trend, in the units shown); HP filter, λ 1600 | 1993-04-01 | 2026-01-01 | 132 |
| quarterly.cycles.est_death | Establishment deaths | Percent of establishments, per quarter | cycle of the level (deviation from trend, in the units shown); HP filter, λ 1600 | 1992-07-01 | 2025-04-01 | 132 |
| quarterly.cycles.gdp_q | Real GDP | Billions of chained 2017 dollars | cycle of 100 × log (percent deviation from trend); HP filter, λ 1600 | 1992-07-01 | 2026-01-01 | 135 |

## Other blocks (statistics, tables, settings)

Values shown for the first version when a block repeats (placeholders as above).

| path | content |
|---|---|
| dashboard | str: business-dynamics |
| generated_at_utc | str: 2026-11-27T16:11:05+00:00 |
| country | values: code = US, name = United States |
| recessions | recession dates (peak, trough) used to shade the charts |
| annual.vintage | int: 2023 |
| annual.source_url | str: https://www2.census.gov/programs-surveys/bds/tables/time-series/2023/bds2023.csv |
| annual.from_cache | bool: False |
| annual.stats | table of 17 rows; fields: key, mean, sd, min, min_period, max, max_period, latest, latest_period, mean_10, start, end |
| annual.cycle_stats.lags | list: -2, -1, 0, 1, 2 |
| annual.cycle_stats.rows | table of 14 rows; fields: key, sd, ar1, rel_sd, start, end, n, corr, peak_lag |
| annual.size_table | table of 3 rows; fields: group, label, emp, firms, jc, jd, net_jc, emp_latest, firms_latest |
| quarterly.latest | str: 2026 Q1 |
| quarterly.stats | table of 12 rows; fields: key, mean, sd, min, min_period, max, max_period, latest, latest_period, mean_10, start, end |
| quarterly.cycle_stats.lags | list: -4, -3, -2, -1, 0, 1, 2, 3, 4 |
| quarterly.cycle_stats.rows | table of 9 rows; fields: key, sd, ar1, rel_sd, start, end, n, corr, peak_lag |
| variables.firms | values: label = Firms, units = Millions, transform = log, digits = 3, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release |
| variables.estabs | values: label = Establishments, units = Millions, transform = log, digits = 3, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release |
| variables.emp | values: label = Employment, units = Millions of jobs (March), transform = log, digits = 1, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release |
| variables.firm_size | values: label = Average firm size, units = Employees per firm, transform = log, digits = 1, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release; author's calculation |
| variables.startups | values: label = Startups (firms of age 0), units = Thousands, transform = log, digits = 0, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release; author's calculation |
| variables.startup_rate | values: label = Firm startup rate, units = Percent of firms, transform = level, digits = 2, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release; author's calculation |
| variables.firm_exit | values: label = Firm exit rate, units = Percent of firms alive a year earlier, transform = level, digits = 2, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release; author's calculation |
| variables.surv_q | values: label = Quarterly firm survival rate (from annual exits), units = Percent per quarter, transform = level, digits = 3, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release; author's calculation |
| variables.ln_surv_a | values: label = Annual firm survival, 100 × ln, units = Percent (log points), transform = level, digits = 2, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release; author's calculation |
| variables.firm_exit_cur | values: label = Firm exit rate (deaths over current firms), units = Percent of firms, transform = level, digits = 2, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release; author's calculation |
| variables.est_surv | values: label = Quarterly establishment survival rate (BED), units = Percent per quarter, transform = level, digits = 3, source = U.S. Bureau of Labor Statistics, Business Employment Dynamics; author's calculation |
| variables.estab_entry | values: label = Establishment entry rate, units = Percent of establishments, transform = level, digits = 2, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release |
| variables.estab_exit | values: label = Establishment exit rate, units = Percent of establishments, transform = level, digits = 2, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release |
| variables.startup_emp | values: label = Employment share of startups, units = Percent of employment, transform = level, digits = 2, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release; author's calculation |
| variables.eps_q | values: label = Employment share of startups, per quarter, units = Percent per quarter, transform = level, digits = 3, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release; author's calculation |
| variables.startup_rel | values: label = Startup size relative to the average firm, units = Ratio, transform = level, digits = 3, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release; author's calculation |
| variables.young_emp | values: label = Employment share of young firms (0–5 years), units = Percent of employment, transform = level, digits = 2, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release; author's calculation |
| variables.jc | values: label = Job creation rate, units = Percent of employment, transform = level, digits = 2, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release |
| variables.jd | values: label = Job destruction rate, units = Percent of employment, transform = level, digits = 2, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release |
| variables.jc_births | values: label = Job creation by establishment births, units = Percent of employment, transform = level, digits = 2, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release |
| variables.jd_deaths | values: label = Job destruction by establishment deaths, units = Percent of employment, transform = level, digits = 2, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release |
| variables.net_jc | values: label = Net job creation rate, units = Percent of employment, transform = level, digits = 2, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release |
| variables.realloc | values: label = Job reallocation rate, units = Percent of employment, transform = level, digits = 2, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release |
| variables.net_jc_young | values: label = Net job creation, young firms (1–5 years), units = Percent of employment, transform = level, digits = 2, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release; author's calculation |
| variables.net_jc_mature | values: label = Net job creation, mature firms (6 years and over), units = Percent of employment, transform = level, digits = 2, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release; author's calculation |
| variables.gdp_a | values: label = Real GDP, units = Billions of chained 2017 dollars (average, April–March), transform = log, digits = 0, source = U.S. Bureau of Economic Analysis (GDPC1) via FRED (Federal Reserve Bank of St. Louis); average of the quarters April to March |
| variables.emp_small | values: label = Employment share, 1–19 employees, units = Percent of employment, transform = level, digits = 1, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release; author's calculation |
| variables.firms_small | values: label = Share of firms, 1–19 employees, units = Percent of firms, transform = level, digits = 1, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release; author's calculation |
| variables.jc_small | values: label = Job creation rate, 1–19 employees, units = Percent of employment, transform = level, digits = 2, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release; author's calculation |
| variables.jd_small | values: label = Job destruction rate, 1–19 employees, units = Percent of employment, transform = level, digits = 2, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release; author's calculation |
| variables.net_jc_small | values: label = Net job creation rate, 1–19 employees, units = Percent of employment, transform = level, digits = 2, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release; author's calculation |
| variables.emp_medium | values: label = Employment share, 20–499 employees, units = Percent of employment, transform = level, digits = 1, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release; author's calculation |
| variables.firms_medium | values: label = Share of firms, 20–499 employees, units = Percent of firms, transform = level, digits = 1, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release; author's calculation |
| variables.jc_medium | values: label = Job creation rate, 20–499 employees, units = Percent of employment, transform = level, digits = 2, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release; author's calculation |
| variables.jd_medium | values: label = Job destruction rate, 20–499 employees, units = Percent of employment, transform = level, digits = 2, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release; author's calculation |
| variables.net_jc_medium | values: label = Net job creation rate, 20–499 employees, units = Percent of employment, transform = level, digits = 2, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release; author's calculation |
| variables.emp_large | values: label = Employment share, 500 or more employees, units = Percent of employment, transform = level, digits = 1, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release; author's calculation |
| variables.firms_large | values: label = Share of firms, 500 or more employees, units = Percent of firms, transform = level, digits = 1, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release; author's calculation |
| variables.jc_large | values: label = Job creation rate, 500 or more employees, units = Percent of employment, transform = level, digits = 2, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release; author's calculation |
| variables.jd_large | values: label = Job destruction rate, 500 or more employees, units = Percent of employment, transform = level, digits = 2, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release; author's calculation |
| variables.net_jc_large | values: label = Net job creation rate, 500 or more employees, units = Percent of employment, transform = level, digits = 2, source = U.S. Census Bureau, Business Dynamics Statistics, 2023 release; author's calculation |
| variables.gjg | values: label = Gross job gains, units = Percent of employment, per quarter, transform = level, digits = 2, id = BDS0000000000000000110001RQ5, source = U.S. Bureau of Labor Statistics, Business Employment Dynamics (BDS0000000000000000110001RQ5) |
| variables.gjg_exp | values: label = Gross job gains at expanding establishments, units = Percent of employment, per quarter, transform = level, digits = 2, id = BDS0000000000000000110002RQ5, source = U.S. Bureau of Labor Statistics, Business Employment Dynamics (BDS0000000000000000110002RQ5) |
| variables.gjg_open | values: label = Gross job gains at opening establishments, units = Percent of employment, per quarter, transform = level, digits = 2, id = BDS0000000000000000110003RQ5, source = U.S. Bureau of Labor Statistics, Business Employment Dynamics (BDS0000000000000000110003RQ5) |
| variables.gjl | values: label = Gross job losses, units = Percent of employment, per quarter, transform = level, digits = 2, id = BDS0000000000000000110004RQ5, source = U.S. Bureau of Labor Statistics, Business Employment Dynamics (BDS0000000000000000110004RQ5) |
| variables.gjl_con | values: label = Gross job losses at contracting establishments, units = Percent of employment, per quarter, transform = level, digits = 2, id = BDS0000000000000000110005RQ5, source = U.S. Bureau of Labor Statistics, Business Employment Dynamics (BDS0000000000000000110005RQ5) |
| variables.gjl_close | values: label = Gross job losses at closing establishments, units = Percent of employment, per quarter, transform = level, digits = 2, id = BDS0000000000000000110006RQ5, source = U.S. Bureau of Labor Statistics, Business Employment Dynamics (BDS0000000000000000110006RQ5) |
| variables.est_open | values: label = Establishment openings, units = Percent of establishments, per quarter, transform = level, digits = 2, id = BDS0000000000000000120003RQ5, source = U.S. Bureau of Labor Statistics, Business Employment Dynamics (BDS0000000000000000120003RQ5) |
| variables.est_close | values: label = Establishment closings, units = Percent of establishments, per quarter, transform = level, digits = 2, id = BDS0000000000000000120006RQ5, source = U.S. Bureau of Labor Statistics, Business Employment Dynamics (BDS0000000000000000120006RQ5) |
| variables.est_birth | values: label = Establishment births, units = Percent of establishments, per quarter, transform = level, digits = 2, id = BDS0000000000000000120007RQ5, source = U.S. Bureau of Labor Statistics, Business Employment Dynamics (BDS0000000000000000120007RQ5) |
| variables.est_death | values: label = Establishment deaths, units = Percent of establishments, per quarter, transform = level, digits = 2, id = BDS0000000000000000120008RQ5, source = U.S. Bureau of Labor Statistics, Business Employment Dynamics (BDS0000000000000000120008RQ5) |
| variables.net_gj | values: label = Net job gains, units = Percent of employment, per quarter, transform = level, digits = 2, source = U.S. Bureau of Labor Statistics, Business Employment Dynamics; author's calculation |
| variables.realloc_q | values: label = Job reallocation (gains + losses), units = Percent of employment, per quarter, transform = level, digits = 2, source = U.S. Bureau of Labor Statistics, Business Employment Dynamics; author's calculation |
| variables.gdp_q | values: label = Real GDP, units = Billions of chained 2017 dollars, transform = log, digits = 0, source = U.S. Bureau of Economic Analysis (GDPC1) via FRED (Federal Reserve Bank of St. Louis) |
| calibration | table of 10 rows; fields: key, freq, mean, sample, note, quarterly |
| survival.steady | table of 2 rows; fields: key, label, sample, exit_annual, survival_q, exit_q, note |
| survival.dynamics | table of 4 rows; fields: key, label, freq, units, rho, sigma, rho_annual, sigma_annual, sd_cycle_annual, sample, n, flag |
| entry_value | table of 3 rows; fields: key, data_key, label, symbol, annual, quarterly, subperiods, sample, units, digits, formula, note |
| downloads | values: annual_csv = downloads/economics/us/us-business-dynamics-annual.csv, quarterly_csv = downloads/economics/us/us-business-dynamics-quarterly.csv, mat = downloads/economics/us/us-business-dynamics.mat, survival_csv = downloads/economics/us/us-business-dynamics-survival.csv |
