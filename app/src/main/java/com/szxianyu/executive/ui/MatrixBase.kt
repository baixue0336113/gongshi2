package com.szxianyu.executive.ui

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronLeft
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.szxianyu.executive.ui.theme.*

fun shiftMonth(current: String, offset: Int): String {
    val parts = current.split("-")
    if (parts.size != 2) return current
    val year = parts[0].toIntOrNull() ?: 2026
    val month = parts[1].toIntOrNull() ?: 7
    var newMonth = month + offset
    var newYear = year
    if (newMonth < 1) {
        newMonth = 12
        newYear -= 1
    } else if (newMonth > 12) {
        newMonth = 1
        newYear += 1
    }
    return String.format("%d-%02d", newYear, newMonth)
}

@Composable
fun MatrixBase(
    title: String,
    days: List<String>,
    rows: List<MatrixRowData>,
    selectedMonth: String,
    kbiSummary: List<Triple<String, String, Color>> = emptyList(),
    onMonthChange: (String) -> Unit
) {
    val horizontalScrollState = rememberScrollState()

    // Recalculate Trend Chart Points dynamically from rows and days
    val trendChartPoints = remember(days, rows) {
        days.map { day ->
            var sum = 0f
            rows.forEach { row ->
                val cell = row.daily[day]
                if (cell != null) {
                    sum += cell.value.toFloatOrNull() ?: 0f
                }
            }
            ChartPoint(
                label = day.split("-").last() + "日",
                value1 = sum
            )
        }
    }

    // Recalculate Pie Chart Slices dynamically from rows
    val pieChartSlices = remember(rows) {
        val colors = listOf(
            Orange500, Blue500, Emerald500, Color(0xFF8B5CF6), Color(0xFFEC4899),
            Color(0xFF14B8A6), Color(0xFFEAB308), Color(0xFF6366F1)
        )
        rows.mapIndexed { idx, row ->
            val totalVal = row.total.replace(",", "").toFloatOrNull() ?: 0f
            PieSlice(
                name = row.name.replace("  └ ", "").trim(),
                value = totalVal,
                color = colors[idx % colors.size]
            )
        }.filter { it.value > 0f }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate50)
            .padding(16.dp)
    ) {
        // Month Selector & KBI Header
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 12.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            shape = RoundedCornerShape(12.dp),
            border = BorderStroke(1.dp, Slate200)
        ) {
            Column(Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(title, fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Slate900)
                    
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        IconButton(
                            onClick = { onMonthChange(shiftMonth(selectedMonth, -1)) },
                            modifier = Modifier.size(32.dp)
                        ) {
                            Icon(Icons.Default.ChevronLeft, contentDescription = "上个月", tint = Slate600)
                        }
                        Text(
                            text = selectedMonth,
                            fontWeight = FontWeight.ExtraBold,
                            fontSize = 14.sp,
                            color = Slate800,
                            fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                        )
                        IconButton(
                            onClick = { onMonthChange(shiftMonth(selectedMonth, 1)) },
                            modifier = Modifier.size(32.dp)
                        ) {
                            Icon(Icons.Default.ChevronRight, contentDescription = "下个月", tint = Slate600)
                        }
                    }
                }

                if (kbiSummary.isNotEmpty()) {
                    Spacer(Modifier.height(12.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(24.dp)) {
                        kbiSummary.forEach { (label, value, color) ->
                            Column {
                                Text(label, color = Slate500, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                Text(value, color = color, fontSize = 18.sp, fontWeight = FontWeight.Black)
                            }
                        }
                    }
                }
            }
        }

        // 3. Analytical Trends & Proportion Structure Charts (Dynamic & Responsive!)
        if (rows.isNotEmpty()) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 12.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Trend Line
                Card(
                    modifier = Modifier
                        .weight(1.4f)
                        .height(160.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(12.dp),
                    border = BorderStroke(1.dp, Slate200)
                ) {
                    Column(Modifier.padding(12.dp)) {
                        Text("每日数据核定走势图", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Slate700)
                        Spacer(Modifier.height(6.dp))
                        CustomAreaChart(
                            points = trendChartPoints,
                            modifier = Modifier.fillMaxSize(),
                            title1 = if (title.contains("成本")) "日常总成本 (¥)" else "生产工时 (h)"
                        )
                    }
                }

                // Pie Structure Proportion Chart
                Card(
                    modifier = Modifier
                        .weight(1f)
                        .height(160.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(12.dp),
                    border = BorderStroke(1.dp, Slate200)
                ) {
                    Column(Modifier.padding(12.dp)) {
                        Text("二级组织/项目结构占比", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Slate700)
                        Spacer(Modifier.height(6.dp))
                        CustomPieChart(
                            slices = pieChartSlices,
                            modifier = Modifier.fillMaxSize()
                        )
                    }
                }
            }
        }

        // The Matrix Table
        Card(
            modifier = Modifier.weight(1f),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            shape = RoundedCornerShape(12.dp),
            border = BorderStroke(1.dp, Slate200)
        ) {
            Column {
                // Table Header
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Slate50)
                        .horizontalScroll(horizontalScrollState)
                ) {
                    Box(Modifier.width(160.dp).padding(12.dp).background(Slate50)) {
                        Text("部门名称", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Slate600)
                    }
                    Box(Modifier.width(80.dp).padding(12.dp).background(Slate50)) {
                        Text("月度合计", fontWeight = FontWeight.Bold, fontSize = 12.sp, textAlign = TextAlign.Center, color = Slate600)
                    }
                    days.forEach { day ->
                        Box(Modifier.width(44.dp).padding(vertical = 12.dp), contentAlignment = Alignment.Center) {
                            Text(day, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Slate500)
                        }
                    }
                }

                Divider(color = Slate200)

                // Table Rows
                LazyColumn(modifier = Modifier.fillMaxSize()) {
                    items(rows) { row ->
                        MatrixRow(row, horizontalScrollState, days)
                        Divider(color = Slate100)
                    }
                }
            }
        }
    }
}

@Composable
fun MatrixRow(
    row: MatrixRowData,
    scrollState: ScrollState,
    days: List<String>
) {
    Row(modifier = Modifier.fillMaxWidth().horizontalScroll(scrollState)) {
        // Sticky-ish columns (simulated with fixed width in horizontal scroll)
        Box(Modifier.width(160.dp).padding(12.dp)) {
            Text(row.name, fontSize = 12.sp, color = Slate900, fontWeight = if (row.isHeader) FontWeight.Bold else FontWeight.Normal)
        }
        Box(Modifier.width(80.dp).padding(12.dp), contentAlignment = Alignment.Center) {
            Text(row.total, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Slate900)
        }
        
        days.forEach { day ->
            val cell = row.daily[day]
            Box(
                modifier = Modifier
                    .width(44.dp)
                    .height(48.dp)
                    .background(if (cell?.isAbnormal == true) Color(0xFFFEF2F2) else Color.Transparent)
                    .border(0.2.dp, Slate100),
                contentAlignment = Alignment.Center
            ) {
                if (cell != null) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            cell.value,
                            fontSize = 10.sp,
                            color = if (cell.isAbnormal) Rose500 else Slate600,
                            fontWeight = if (cell.isAbnormal) FontWeight.Bold else FontWeight.Normal
                        )
                        if (cell.subValue != null) {
                            Text(cell.subValue, fontSize = 7.sp, color = Slate400)
                        }
                    }
                }
            }
        }
    }
}

data class MatrixRowData(
    val id: String,
    val name: String,
    val total: String,
    val isHeader: Boolean = false,
    val daily: Map<String, MatrixCellData> = emptyMap()
)

data class MatrixCellData(
    val value: String,
    val subValue: String? = null,
    val isAbnormal: Boolean = false
)
