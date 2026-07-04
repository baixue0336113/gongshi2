package com.szxianyu.executive.data.models

data class SummaryData(
    val total_staff: Int,
    val production_hours: Int,
    val attendance_rate: Double,
    val avg_hours: Double,
    val labor_cost: Double,
    val labor_cost_rate: Double,
    val unit_hour_labor_cost: Double,
    val total_staff_compare: Double,
    val production_hours_compare: Double,
    val attendance_rate_compare: Double,
    val avg_hours_compare: Double,
    val labor_cost_compare: Double,
    val labor_cost_rate_compare: Double,
    val unit_hour_labor_cost_compare: Double
)

data class TrendPoint(
    val date: String,
    val staff: Int,
    val hours: Int,
    val labor_cost: Double,
    val efficiency: Double,
    val overtime: Int
)

data class MatrixDailyData(
    val hours: Double? = null,
    val cost: Double? = null,
    val abnormal: Boolean? = null,
    val attendance: String? = null
)

data class MatrixRow(
    val id: String,
    val name: String,
    val total_hours: Double? = null,
    val total_cost: Double? = null,
    val daily: Map<String, MatrixDailyData> = emptyMap(),
    val children: List<MatrixRow>? = null
)

data class MatrixData(
    val days: List<String>,
    val rows: List<MatrixRow>,
    val summary: Map<String, Any>
)

data class DashboardResponse(
    val review_date: String,
    val summary: SummaryData,
    val trend_data: List<TrendPoint>,
    val work_hour_matrix: MatrixData? = null,
    val cost_matrix: MatrixData? = null
)
