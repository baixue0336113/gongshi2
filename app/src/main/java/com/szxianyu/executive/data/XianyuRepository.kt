package com.szxianyu.executive.data

import com.szxianyu.executive.data.api.XianyuApiService
import com.szxianyu.executive.ui.MatrixCellData
import com.szxianyu.executive.ui.MatrixRowData
import androidx.compose.ui.graphics.Color
import com.szxianyu.executive.ui.theme.*

class XianyuRepository(private val apiService: XianyuApiService) {

    fun getMockMatrixData(title: String): List<MatrixRowData> {
        val rows = listOf(
            "洗消一组", "洗消二组", "切配加工部", "分餐流水线", "物流装车部", 
            "面点间", "粗加工车间", "仓库组", "保洁组", "行政部"
        )
        return rows.mapIndexed { index, name ->
            val daily = (1..31).associate { day ->
                val dayStr = day.toString()
                val value = (80..160).random()
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
