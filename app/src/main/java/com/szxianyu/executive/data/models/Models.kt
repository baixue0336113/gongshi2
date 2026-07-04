package com.szxianyu.executive.data.models

data class WorkforceSegment(
    val label: String,
    val worked_employee_count: Int,
    val total_work_hours: Int,
    val overtime_employee_count: Int,
    val overtime_work_hours: Int,
    val load_percent: Int,
    val note: String
)

data class WorkforceLoad(
    val segments: List<WorkforceSegment>
)

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
    val unit_hour_labor_cost_compare: Double,
    val overtime_staff: Int? = null,
    val overtime_staff_compare: Double? = null,
    val unit_hour_output_value: Double? = null,
    val unit_hour_output_value_compare: Double? = null,
    val avg_sales_per_person: Double? = null,
    val avg_sales_per_person_compare: Double? = null,
    val coverage_rate: Double? = null,
    val coverage_rate_compare: Double? = null,
    val workforce_load: WorkforceLoad? = null
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

data class TopStaffItem(
    val name: String,
    val job_number: String,
    val hours: Int,
    val risk_score: Int
)

data class DepartmentItem(
    val department_id: String,
    val department_name: String,
    val path_text: String? = null,
    val headcount: Int,
    val total_hours: Double,
    val avg_hours: Double,
    val overtime_hours: Double? = null,
    val labor_cost: Double? = null,
    val efficiency_index: Double? = null,
    val rule_status: String? = null,
    val manager: String? = null,
    val exception_count: Int? = null,
    val top_staff: List<TopStaffItem>? = null
)

data class HealthData(
    val overallHealthScore: Int? = null
)

data class DashboardResponse(
    val review_date: String,
    val summary: SummaryData,
    val trend_data: List<TrendPoint>,
    val work_hour_matrix: MatrixData? = null,
    val cost_matrix: MatrixData? = null,
    val departments: List<DepartmentItem>? = null,
    val health: HealthData? = null
)
