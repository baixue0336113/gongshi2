package com.szxianyu.executive.data

import com.szxianyu.executive.data.api.XianyuApiService
import com.szxianyu.executive.ui.MatrixCellData
import com.szxianyu.executive.ui.MatrixRowData
import androidx.compose.ui.graphics.Color
import com.szxianyu.executive.ui.theme.*

class XianyuRepository(private val apiService: XianyuApiService) {

    // Real API fetching methods
    suspend fun getDashboard(token: String, date: String): DashboardResponse? {
        return try {
            val response = apiService.getDashboard("Bearer $token", date)
            if (response.isSuccessful) response.body() else null
        } catch (e: Exception) {
            null
        }
    }

    suspend fun getWorkMatrix(token: String, month: String): MatrixData? {
        return try {
            val response = apiService.getWorkMatrix("Bearer $token", month)
            // Assuming the API returns MatrixData structure in the Map or directly
            // For now, let's just use the mock if API fails to keep it usable for demo
            if (response.isSuccessful) {
                // Parse response.body() into MatrixData
                // This is a placeholder for real parsing
                null 
            } else null
        } catch (e: Exception) {
            null
        }
    }

    // Helper to convert MatrixData to UI models
    fun convertToUiRows(matrix: MatrixData?, title: String): List<MatrixRowData> {
        if (matrix == null) return getMockMatrixData(title)
        return matrix.rows.map { row ->
            MatrixRowData(
                id = row.id,
                name = row.name,
                total = (row.total_hours ?: row.total_cost ?: 0).toString(),
                daily = row.daily.mapValues { (_, detail) ->
                    MatrixCellData(
                        value = (detail.hours ?: detail.cost ?: 0).toString(),
                        subValue = detail.attendance,
                        isAbnormal = detail.abnormal ?: false
                    )
                }
            )
        }
    }

    fun getMockMatrixData(title: String): List<MatrixRowData> {
        val rows = listOf(
            "洗消一组", "洗消二组", "切配加工部", "分餐流水线", "物流装车部", 
            "面点间", "粗加工车间", "仓库组", "保洁组", "行政部"
        )
        return rows.mapIndexed { index, name ->
            val daily = (1..31).associate { day ->
                val dayStr = day.toString()
                // Use a stable deterministic formula instead of random()
                val value = 100 + (index * 5) + (day % 15)
                dayStr to MatrixCellData(
                    value = value.toString(),
                    subValue = if (title.contains("成本")) "¥${(value * 30)}" else "${(value / 8)}人",
                    isAbnormal = value > 140
                )
            }
            MatrixRowData(
                id = index.toString(),
                name = name,
                total = "${daily.values.sumOf { it.value.toInt() }}",
                daily = daily
            )
        }
    }

    fun getMockKbi(title: String): List<Triple<String, String, Color>> {
        return when {
            title.contains("工时") -> listOf(
                Triple("总工时", "42,840h", Slate900),
                Triple("人均工时", "8.2h", Orange500),
                Triple("异常工时", "240h", Rose500)
            )
            title.contains("成本") -> listOf(
                Triple("总成本", "¥1,248,500", Slate900),
                Triple("人均成本", "¥3,240", Blue500),
                Triple("成本率", "22.4%", Emerald500)
            )
            else -> listOf(
                Triple("汇总指标", "84.2", Slate900),
                Triple("波动率", "1.2%", Emerald500)
            )
        }
    }
}
