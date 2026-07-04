package com.szxianyu.executive.ui

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
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

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MatrixBase(
    title: String,
    days: List<String>,
    rows: List<MatrixRowData>,
    selectedMonth: String,
    kbiSummary: List<Triple<String, String, Color>> = emptyList(),
    onMonthChange: (String) -> Unit
) {
    var keyword by remember { mutableStateOf("") }
    var selectedDept by remember { mutableStateOf("全部部门") }
    
    // Student Meal Cost Filter States
    var studentMealEmployeeType by remember { mutableStateOf("all") }
    var studentMealCostType by remember { mutableStateOf("all") }

    val horizontalScrollState = rememberScrollState()

    // Extract departments list dynamically
    val departments = remember(rows) {
        listOf("全部部门") + rows.map { it.name.trim() }.distinct().sorted()
    }

    // Process and Filter Rows based on input search/dropdowns
    val filteredRows = remember(rows, keyword, selectedDept, studentMealCostType) {
        rows.filter { r ->
            val matchesDept = selectedDept == "全部部门" || r.name.trim() == selectedDept
            val matchesKeyword = keyword.isEmpty() || r.name.lowercase().contains(keyword.lowercase())
            matchesDept && matchesKeyword
        }.map { r ->
            // If cost type filter is applied in student meal cost, adjust values mockingly
            if (studentMealCostType != "all" && title.contains("学生餐")) {
                val factor = when (studentMealCostType) {
                    "normal" -> 0.7f
                    "overtime" -> 0.2f
                    "fallback" -> 0.1f
                    else -> 1.0f
                }
                r.copy(
                    total = (r.total.replace(",", "").toFloatOrNull() ?: 0f * factor).toInt().toString(),
                    daily = r.daily.mapValues { (_, cell) ->
                        cell.copy(
                            value = (cell.value.replace(",", "").toFloatOrNull() ?: 0f * factor).toInt().toString()
                        )
                    }
                )
            } else {
                r
            }
        }
    }

    // Interactive drilldown dialogue state
    var selectedDrilldownCell by remember { mutableStateOf<DrilldownCellInfo?>(null) }

    // Dynamic metrics calculation for the 4 KBI Cards
    val kbiCards = remember(filteredRows, selectedMonth, title) {
        val count = filteredRows.size
        val totalSum = filteredRows.sumOf { it.total.replace(",", "").toDoubleOrNull() ?: 0.0 }
        val avgVal = if (count > 0) totalSum / count else 0.0

        val formattedTotal = if (title.contains("工时")) {
            "${String.format("%,.0f", totalSum)} h"
        } else {
            "¥${String.format("%,.0f", totalSum)}"
        }

        val formattedAvg = if (title.contains("工时")) {
            "${String.format("%.1f", avgVal)} h/部"
        } else {
            "¥${String.format("%,.0f", avgVal)}"
        }

        listOf(
            KbiCardItem("核算周期", selectedMonth, Icons.Default.CalendarToday, Orange500 to Color(0xFFFFF7ED)),
            KbiCardItem("核算对象数", "$count 个", Icons.Default.FilterList, Blue500 to Color(0xFFEFF6FF)),
            KbiCardItem(if (title.contains("工时")) "累计核定工时" else "核定总额", formattedTotal, Icons.Default.Paid, Emerald500 to Color(0xFFECFDF5)),
            KbiCardItem(if (title.contains("工时")) "平均工时" else "平均成本/对象", formattedAvg, Icons.Default.TrendingUp, Color(0xFF8B5CF6) to Color(0xFFF5F3FF))
        )
    }

    // Dynamic Trend Chart Points
    val trendChartPoints = remember(days, filteredRows) {
        days.map { day ->
            var sum = 0f
            filteredRows.forEach { row ->
                val cell = row.daily[day]
                if (cell != null) {
                    sum += cell.value.replace(",", "").toFloatOrNull() ?: 0f
                }
            }
            ChartPoint(
                label = day.split("-").last() + "日",
                value1 = sum
            )
        }
    }

    // Dynamic Pie Chart Slices
    val pieChartSlices = remember(filteredRows) {
        val colors = listOf(Orange500, Blue500, Emerald500, Color(0xFF8B5CF6), Color(0xFFEC4899), Color(0xFF14B8A6), Color(0xFFEAB308), Color(0xFF6366F1))
        filteredRows.mapIndexed { idx, row ->
            val totalVal = row.total.replace(",", "").toFloatOrNull() ?: 0f
            PieSlice(
                name = row.name.replace("  └ ", "").trim(),
                value = totalVal,
                color = colors[idx % colors.size]
            )
        }.filter { it.value > 0f }
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate50),
        verticalArrangement = Arrangement.spacedBy(14.dp),
        contentPadding = PaddingValues(bottom = 32.dp)
    ) {
        // 1. Month, Search, and Dropdown Filters Card
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(12.dp),
                border = BorderStroke(1.dp, Slate200)
            ) {
                Column(Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Month Selector with navigation icons
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                            IconButton(
                                onClick = { onMonthChange(shiftMonth(selectedMonth, -1)) },
                                modifier = Modifier.size(30.dp)
                            ) {
                                Icon(Icons.Default.ChevronLeft, contentDescription = "上月", tint = Slate600, modifier = Modifier.size(16.dp))
                            }
                            Text(
                                text = selectedMonth,
                                fontWeight = FontWeight.Black,
                                fontSize = 13.sp,
                                color = Slate800,
                                fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                            )
                            IconButton(
                                onClick = { onMonthChange(shiftMonth(selectedMonth, 1)) },
                                modifier = Modifier.size(30.dp)
                            ) {
                                Icon(Icons.Default.ChevronRight, contentDescription = "下月", tint = Slate600, modifier = Modifier.size(16.dp))
                            }
                        }

                        // Search box
                        if (!title.contains("学生餐")) {
                            OutlinedTextField(
                                value = keyword,
                                onValueChange = { keyword = it },
                                placeholder = { Text("搜索车间班组...", fontSize = 10.sp, color = Slate400) },
                                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = Slate400, modifier = Modifier.size(12.dp)) },
                                textStyle = androidx.compose.ui.text.TextStyle(fontSize = 10.sp),
                                singleLine = true,
                                modifier = Modifier
                                    .width(180.dp)
                                    .height(36.dp),
                                colors = TextFieldDefaults.outlinedTextFieldColors(
                                    containerColor = Slate50,
                                    focusedBorderColor = Orange500,
                                    unfocusedBorderColor = Slate200
                                )
                            )
                        }
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Department Selector Dropdown
                        if (!title.contains("学生餐")) {
                            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                                Text("部门:", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate500)
                                Spacer(Modifier.width(6.dp))
                                var deptExpanded by remember { mutableStateOf(false) }
                                Box(Modifier.weight(1f)) {
                                    Surface(
                                        modifier = Modifier
                                            .height(34.dp)
                                            .fillMaxWidth()
                                            .clickable { deptExpanded = true },
                                        border = BorderStroke(1.dp, Slate200),
                                        shape = RoundedCornerShape(6.dp),
                                        color = Slate50
                                    ) {
                                        Row(
                                            modifier = Modifier.padding(horizontal = 8.dp),
                                            verticalAlignment = Alignment.CenterVertically,
                                            horizontalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            Text(selectedDept, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate800, maxLines = 1, overflow = TextOverflow.Ellipsis)
                                            Icon(Icons.Default.ArrowDropDown, contentDescription = null, tint = Slate500, modifier = Modifier.size(14.dp))
                                        }
                                    }
                                    DropdownMenu(expanded = deptExpanded, onDismissRequest = { deptExpanded = false }) {
                                        departments.forEach { dept ->
                                            DropdownMenuItem(text = { Text(dept, fontSize = 10.sp) }, onClick = { selectedDept = dept; deptExpanded = false })
                                        }
                                    }
                                }
                            }
                        }

                        // Specific Filters for Student Meal Cost Screen
                        if (title.contains("学生餐")) {
                            // Employee Type
                            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                                Text("员工:", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate500)
                                Spacer(Modifier.width(4.dp))
                                var empTypeExpanded by remember { mutableStateOf(false) }
                                Box(Modifier.weight(1f)) {
                                    Surface(
                                        modifier = Modifier
                                            .height(34.dp)
                                            .fillMaxWidth()
                                            .clickable { empTypeExpanded = true },
                                        border = BorderStroke(1.dp, Slate200),
                                        shape = RoundedCornerShape(6.dp),
                                        color = Slate50
                                    ) {
                                        Row(
                                            modifier = Modifier.padding(horizontal = 8.dp),
                                            verticalAlignment = Alignment.CenterVertically,
                                            horizontalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            val label = when (studentMealEmployeeType) {
                                                "all" -> "全部"
                                                "own" -> "自有员工"
                                                "hourly" -> "小时工"
                                                else -> "职员"
                                            }
                                            Text(label, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate800)
                                            Icon(Icons.Default.ArrowDropDown, contentDescription = null, tint = Slate500, modifier = Modifier.size(14.dp))
                                        }
                                    }
                                    DropdownMenu(expanded = empTypeExpanded, onDismissRequest = { empTypeExpanded = false }) {
                                        listOf("all" to "全部", "own" to "自有员工", "hourly" to "小时工", "staff" to "职员").forEach { (v, l) ->
                                            DropdownMenuItem(text = { Text(l, fontSize = 10.sp) }, onClick = { studentMealEmployeeType = v; empTypeExpanded = false })
                                        }
                                    }
                                }
                            }

                            // Cost Type Selector
                            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                                Text("成本:", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate500)
                                Spacer(Modifier.width(4.dp))
                                var costTypeExpanded by remember { mutableStateOf(false) }
                                Box(Modifier.weight(1f)) {
                                    Surface(
                                        modifier = Modifier
                                            .height(34.dp)
                                            .fillMaxWidth()
                                            .clickable { costTypeExpanded = true },
                                        border = BorderStroke(1.dp, Slate200),
                                        shape = RoundedCornerShape(6.dp),
                                        color = Slate50
                                    ) {
                                        Row(
                                            modifier = Modifier.padding(horizontal = 8.dp),
                                            verticalAlignment = Alignment.CenterVertically,
                                            horizontalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            val label = when (studentMealCostType) {
                                                "all" -> "全部人工成本"
                                                "normal" -> "正常工时成本"
                                                "overtime" -> "加班/周末成本"
                                                else -> "兜底小时工成本"
                                            }
                                            Text(label, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate800)
                                            Icon(Icons.Default.ArrowDropDown, contentDescription = null, tint = Slate500, modifier = Modifier.size(14.dp))
                                        }
                                    }
                                    DropdownMenu(expanded = costTypeExpanded, onDismissRequest = { costTypeExpanded = false }) {
                                        listOf("all" to "全部人工成本", "normal" to "正常工时成本", "overtime" to "加班/周末成本", "fallback" to "兜底小时工成本").forEach { (v, l) ->
                                            DropdownMenuItem(text = { Text(l, fontSize = 10.sp) }, onClick = { studentMealCostType = v; costTypeExpanded = false })
                                        }
                                    }
                                }
                            }
                        }

                        // Search action button
                        Button(
                            onClick = {},
                            colors = ButtonDefaults.buttonColors(containerColor = Orange500),
                            shape = RoundedCornerShape(6.dp),
                            contentPadding = PaddingValues(horizontal = 14.dp),
                            modifier = Modifier.height(34.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                Icon(Icons.Default.Search, contentDescription = null, tint = Color.White, modifier = Modifier.size(12.dp))
                                Text("搜索", color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        }

        // 2. 4 KBI Summary Cards Row
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                kbiCards.forEach { c ->
                    Card(
                        modifier = Modifier.weight(1f),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        border = BorderStroke(1.dp, Slate200),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(10.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(c.label, fontSize = 8.5.sp, color = Slate400, fontWeight = FontWeight.Bold)
                                Spacer(Modifier.height(2.dp))
                                Text(c.value, fontSize = 12.sp, fontWeight = FontWeight.Black, color = Slate800, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace)
                            }
                            Surface(
                                color = c.colors.second,
                                shape = RoundedCornerShape(6.dp),
                                modifier = Modifier.size(24.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Icon(c.icon, contentDescription = null, tint = c.colors.first, modifier = Modifier.size(12.dp))
                                }
                            }
                        }
                    }
                }
            }
        }

        // 3. Trends & Structure Proportion charts split
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(180.dp),
                horizontalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Left Panel: Daily Trend Area Chart
                Card(
                    modifier = Modifier.weight(1.3f),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = BorderStroke(1.dp, Slate200),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(Modifier.padding(12.dp)) {
                        Text(
                            if (title.contains("成本")) "每日归集核算成本趋势" else "每日核准生产工时走势",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate700
                        )
                        Spacer(Modifier.height(8.dp))
                        CustomAreaChart(
                            points = trendChartPoints,
                            modifier = Modifier.fillMaxSize(),
                            color1 = if (title.contains("全口径")) Orange500 else Blue500,
                            title1 = if (title.contains("成本")) "日常汇总 (¥)" else "核准工时 (h)"
                        )
                    }
                }

                // Right Panel: Pie Chart Structure Proportions
                Card(
                    modifier = Modifier.weight(1f),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = BorderStroke(1.dp, Slate200),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(Modifier.padding(12.dp)) {
                        Text("部门/细分口径占比统计", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate700)
                        Spacer(Modifier.height(6.dp))
                        CustomPieChart(
                            slices = pieChartSlices,
                            modifier = Modifier.fillMaxSize()
                        )
                    }
                }
            }
        }

        // 4. Matrix Table with Heatmap & Colour legends
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = BorderStroke(1.dp, Slate200),
                shape = RoundedCornerShape(12.dp)
            ) {
                Column {
                    // Title and Legend Header
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Slate50)
                            .padding(horizontal = 12.dp, vertical = 10.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            if (title.contains("学生餐")) "学生餐人工成本矩阵 (双排高密·点击穿透)" else "$title 数据矩阵 (横向滑动)",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Black,
                            color = Slate800
                        )

                        // Visual color level legend
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("色阶:", fontSize = 8.5.sp, color = Slate400, fontWeight = FontWeight.Bold)
                            val legendColors = if (title.contains("工时")) {
                                listOf(
                                    "正常" to Color(0xFFD1FAE5),
                                    "偏高" to Color(0xFFFEF3C7),
                                    "超负荷" to Color(0xFFFEE2E2)
                                )
                            } else {
                                listOf(
                                    "低" to Color(0xFFEFF6FF),
                                    "中" to Color(0xFFE0E7FF),
                                    "高" to Color(0xFFF3E8FF)
                                )
                            }
                            legendColors.forEach { (label, bg) ->
                                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(2.dp)) {
                                    Box(
                                        modifier = Modifier
                                            .size(6.dp)
                                            .background(bg, RoundedCornerShape(1.dp))
                                    )
                                    Text(label, fontSize = 8.sp, color = Slate500, fontWeight = FontWeight.Medium)
                                }
                            }
                        }
                    }

                    Box(Modifier.fillMaxWidth().height(1.dp).background(Slate200))

                    // Horizontal Scrollable Matrix View Layout
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .horizontalScroll(horizontalScrollState)
                    ) {
                        Column {
                            // Table Row Header
                            Row(modifier = Modifier.background(Slate50)) {
                                Box(
                                    Modifier
                                        .width(140.dp)
                                        .padding(vertical = 10.dp, horizontal = 12.dp)
                                ) {
                                    Text("核算部门 / 项目", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500)
                                }
                                Box(
                                    Modifier
                                        .width(70.dp)
                                        .padding(vertical = 10.dp, horizontal = 12.dp),
                                    contentAlignment = Alignment.CenterEnd
                                ) {
                                    Text("月度累计", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500)
                                }
                                days.forEach { day ->
                                    val dateNum = day.split("-").last()
                                    Box(
                                        Modifier
                                            .width(52.dp)
                                            .padding(vertical = 10.dp),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text("${dateNum}日", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500)
                                    }
                                }
                            }

                            Box(Modifier.fillMaxWidth().height(1.dp).background(Slate200))

                            // Table Rows Data List
                            filteredRows.forEach { row ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .border(0.2.dp, Slate100),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    // Department Column
                                    Box(
                                        Modifier
                                            .width(140.dp)
                                            .padding(vertical = 8.dp, horizontal = 12.dp)
                                    ) {
                                        Text(
                                            row.name,
                                            fontSize = 10.5.sp,
                                            fontWeight = if (row.isHeader) FontWeight.Bold else FontWeight.Normal,
                                            color = Slate800,
                                            maxLines = 1,
                                            overflow = TextOverflow.Ellipsis
                                        )
                                    }

                                    // Row Grand Total Column
                                    Box(
                                        Modifier
                                            .width(70.dp)
                                            .padding(vertical = 8.dp, horizontal = 12.dp),
                                        contentAlignment = Alignment.CenterEnd
                                    ) {
                                        val sumVal = row.total.replace(",", "").toDoubleOrNull() ?: 0.0
                                        Text(
                                            text = if (title.contains("工时")) "${sumVal.toInt()}h" else "¥${String.format("%,.0f", sumVal)}",
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = Slate800,
                                            fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                                        )
                                    }

                                    // Daily Columns
                                    days.forEach { day ->
                                        val cell = row.daily[day]
                                        val cellVal = cell?.value?.replace(",", "")?.toFloatOrNull() ?: 0f

                                        // Heatmap color logic matching web frontend specs
                                        val cellBg = when {
                                            cellVal == 0f -> Color.Transparent
                                            title.contains("工时") -> {
                                                when {
                                                    cellVal < 4f -> Color(0xFFECFDF5) // normal/low
                                                    cellVal <= 8f -> Color(0xFFD1FAE5) // standard
                                                    cellVal <= 10f -> Color(0xFFFEF3C7) // warnings
                                                    else -> Color(0xFFFEE2E2) // overloads
                                                }
                                            }
                                            title.contains("学生餐") -> {
                                                when {
                                                    cellVal < 150f -> Color(0xFFEFF6FF)
                                                    cellVal <= 300f -> Color(0xFFDBEAFE)
                                                    cellVal <= 500f -> Color(0xFFC7D2FE)
                                                    else -> Color(0xFFF3E8FF)
                                                }
                                            }
                                            else -> { // Total cost matrix colors
                                                when {
                                                    cellVal < 500f -> Color(0xFFEFF6FF)
                                                    cellVal <= 1500f -> Color(0xFFDBEAFE)
                                                    cellVal <= 3000f -> Color(0xFFC7D2FE)
                                                    else -> Color(0xFFF3E8FF)
                                                }
                                            }
                                        }

                                        val textAccent = when {
                                            cellVal == 0f -> Slate300
                                            title.contains("工时") -> {
                                                when {
                                                    cellVal <= 8f -> Emerald700
                                                    cellVal <= 10f -> Orange600
                                                    else -> Rose600
                                                }
                                            }
                                            title.contains("学生餐") -> {
                                                when {
                                                    cellVal <= 300f -> Blue700
                                                    cellVal <= 500f -> Color(0xFF4F46E5)
                                                    else -> Color(0xFF7C3AED)
                                                }
                                            }
                                            else -> {
                                                when {
                                                    cellVal <= 1500f -> Blue700
                                                    cellVal <= 3000f -> Color(0xFF4F46E5)
                                                    else -> Color(0xFF7C3AED)
                                                }
                                            }
                                        }

                                        Box(
                                            modifier = Modifier
                                                .width(52.dp)
                                                .height(44.dp)
                                                .background(cellBg)
                                                .border(0.3.dp, Slate100)
                                                .clickable(enabled = cellVal > 0f) {
                                                    // Trigger drilldown popup dialog
                                                    selectedDrilldownCell = DrilldownCellInfo(
                                                        deptName = row.name,
                                                        date = day,
                                                        value = cellVal,
                                                        subValue = cell?.subValue ?: ""
                                                    )
                                                },
                                            contentAlignment = Alignment.Center
                                        ) {
                                            if (cellVal > 0f) {
                                                Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
                                                    Text(
                                                        if (title.contains("工时")) "${cellVal.toInt()}h" else "¥${cellVal.toInt()}",
                                                        fontSize = 9.5.sp,
                                                        color = textAccent,
                                                        fontWeight = FontWeight.Bold,
                                                        fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                                                    )
                                                    // High-density secondary line
                                                    val subLabel = if (title.contains("工时")) {
                                                        "${(cellVal / 8.0f).toInt() + 1}人"
                                                    } else {
                                                        "${(cellVal / 45.0f).toInt() + 1}h"
                                                    }
                                                    Text(subLabel, fontSize = 7.sp, color = textAccent.copy(alpha = 0.6f))
                                                }
                                            } else {
                                                Text("-", fontSize = 10.sp, color = Slate300)
                                            }
                                        }
                                    }
                                }
                            }

                            // 5. Daily Summary bottom row calculating totals dynamically
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(Slate100.copy(alpha = 0.5f))
                                    .border(0.5.dp, Slate200),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(
                                    Modifier
                                        .width(140.dp)
                                        .padding(vertical = 10.dp, horizontal = 12.dp)
                                ) {
                                    Text("每日累计汇总", fontSize = 9.5.sp, fontWeight = FontWeight.Black, color = Slate800)
                                }

                                // Sum of row totals
                                val grandTotal = filteredRows.sumOf { it.total.replace(",", "").toDoubleOrNull() ?: 0.0 }
                                Box(
                                    Modifier
                                        .width(70.dp)
                                        .padding(vertical = 10.dp, horizontal = 12.dp),
                                    contentAlignment = Alignment.CenterEnd
                                ) {
                                    Text(
                                        text = if (title.contains("工时")) "${grandTotal.toInt()}h" else "¥${String.format("%,.0f", grandTotal)}",
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Black,
                                        color = Slate800,
                                        fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                                    )
                                }

                                // Calculate daily sums
                                days.forEach { day ->
                                    val dailySum = filteredRows.sumOf { r ->
                                        r.daily[day]?.value?.replace(",", "")?.toDoubleOrNull() ?: 0.0
                                    }
                                    Box(
                                        Modifier
                                            .width(52.dp)
                                            .height(44.dp),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        if (dailySum > 0.0) {
                                            Text(
                                                text = if (title.contains("工时")) "${dailySum.toInt()}h" else "¥${dailySum.toInt()}",
                                                fontSize = 9.sp,
                                                fontWeight = FontWeight.ExtraBold,
                                                color = Slate800,
                                                fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                                            )
                                        } else {
                                            Text("-", fontSize = 9.sp, color = Slate400)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Modal popup dialogue for Cell Drilldown
    selectedDrilldownCell?.let { info ->
        Dialog(onDismissRequest = { selectedDrilldownCell = null }) {
            Surface(
                shape = RoundedCornerShape(12.dp),
                color = Color.White,
                tonalElevation = 6.dp,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    // Header
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            Icon(Icons.Default.Analytics, contentDescription = null, tint = Orange500, modifier = Modifier.size(16.dp))
                            Text(
                                "成本与工时核算穿透",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Black,
                                color = Slate800
                            )
                        }
                        IconButton(onClick = { selectedDrilldownCell = null }, modifier = Modifier.size(24.dp)) {
                            Icon(Icons.Default.Close, contentDescription = "关闭", tint = Slate400, modifier = Modifier.size(16.dp))
                        }
                    }

                    // Target details
                    Surface(
                        color = Slate50,
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(Modifier.padding(10.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            Text("工作部门: ${info.deptName}", fontSize = 10.5.sp, fontWeight = FontWeight.Bold, color = Slate800)
                            Text("日期: ${info.date}", fontSize = 10.sp, color = Slate500, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace)
                        }
                    }

                    // Quick micro KBI boxes inside Dialog
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        val baseVal = info.value
                        val labels = if (title.contains("工时")) {
                            listOf(
                                Triple("核定工时", "${baseVal.toInt()} h", Blue500),
                                Triple("折算成本", "¥${(baseVal * 32f).toInt()}", Emerald500),
                                Triple("人员规模", "${(baseVal / 8f).toInt() + 1} 人", Color(0xFF8B5CF6))
                            )
                        } else {
                            listOf(
                                Triple("人工成本", "¥${baseVal.toInt()}", Rose500),
                                Triple("总工时", "${(baseVal / 32f).toInt() + 1} h", Blue500),
                                Triple("均工时成本", "¥32.5/h", Orange500)
                            )
                        }

                        labels.forEach { (lbl, v, clr) ->
                            Surface(
                                color = clr.copy(alpha = 0.05f),
                                shape = RoundedCornerShape(6.dp),
                                border = BorderStroke(0.5.dp, clr.copy(alpha = 0.15f)),
                                modifier = Modifier.weight(1f)
                            ) {
                                Column(Modifier.padding(8.dp)) {
                                    Text(lbl, fontSize = 8.sp, color = Slate500, fontWeight = FontWeight.Bold)
                                    Spacer(Modifier.height(2.dp))
                                    Text(v, fontSize = 11.sp, fontWeight = FontWeight.Black, color = clr, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace)
                                }
                            }
                        }
                    }

                    // Drilldown employee table
                    Text("日出勤人员劳务构成 (明细穿透)", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate700)
                    Surface(
                        border = BorderStroke(1.dp, Slate200),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(Slate50)
                                    .padding(8.dp),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text("姓名", fontSize = 8.5.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1f))
                                Text("人员类型", fontSize = 8.5.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1f), textAlign = TextAlign.Center)
                                Text("核准工时", fontSize = 8.5.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1f), textAlign = TextAlign.Center)
                                Text("累计分摊", fontSize = 8.5.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1f), textAlign = TextAlign.End)
                            }
                            Box(Modifier.fillMaxWidth().height(1.dp).background(Slate200))
                            
                            val mockEmployees = listOf(
                                Triple("李强", "小时工", 8.0f),
                                Triple("王明", "自有员工", 8.0f),
                                Triple("张军", "第三方派遣", 4.0f)
                            )
                            mockEmployees.forEach { (name, type, hrs) ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(8.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(name, fontSize = 9.5.sp, fontWeight = FontWeight.Bold, color = Slate800, modifier = Modifier.weight(1f))
                                    Text(type, fontSize = 9.sp, color = Slate600, modifier = Modifier.weight(1f), textAlign = TextAlign.Center)
                                    Text("${hrs}h", fontSize = 9.5.sp, color = Slate600, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace, modifier = Modifier.weight(1f), textAlign = TextAlign.Center)
                                    Text("¥${(hrs * 32).toInt()}", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Orange600, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace, modifier = Modifier.weight(1f), textAlign = TextAlign.End)
                                }
                                Box(Modifier.fillMaxWidth().height(0.5.dp).background(Slate100))
                            }
                        }
                    }
                }
            }
        }
    }
}

data class KbiCardItem(
    val label: String,
    val value: String,
    val icon: androidx.compose.ui.graphics.vector.ImageVector,
    val colors: Pair<Color, Color>
)

data class DrilldownCellInfo(
    val deptName: String,
    val date: String,
    val value: Float,
    val subValue: String
)

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
