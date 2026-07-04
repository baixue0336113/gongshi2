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

data class DisplayCell(
    val mainText: String,
    val subText: String,
    val numericValue: Float,
    val bg: Color,
    val textAccent: Color
)

fun getDisplayCell(rowName: String, day: String, cell: MatrixCellData?, mockTitle: String, viewMode: String, isWorkMatrix: Boolean = false, studentMealCostType: String = "all"): DisplayCell {
    val rawVal = cell?.value?.replace(",", "")?.toFloatOrNull() ?: 0f
    if (rawVal == 0f && (cell?.cost ?: 0.0) == 0.0 && (cell?.hours ?: 0.0) == 0.0) {
        return DisplayCell("-", "", 0f, Color.Transparent, Slate300)
    }

    var mainText = ""
    var subText = ""
    var numericValue = rawVal
    
    if (mockTitle == "学生餐成本") {
        val cost = when (studentMealCostType) {
            "normal" -> (cell?.regular_hours ?: 0.0) * (cell?.hourly_rate ?: 0.0)
            "overtime" -> (cell?.overtime_hours ?: 0.0) * (cell?.overtime_hourly_rate ?: 0.0)
            "fallback" -> if (cell?.is_fallback_rate == true) (cell.cost ?: rawVal.toDouble()) else 0.0
            else -> cell?.cost ?: rawVal.toDouble()
        }
        val hours = when (studentMealCostType) {
            "normal" -> cell?.regular_hours ?: 0.0
            "overtime" -> cell?.overtime_hours ?: 0.0
            else -> cell?.hours ?: ((cell?.regular_hours ?: 0.0) + (cell?.overtime_hours ?: 0.0))
        }
        val people = cell?.people ?: 0

        if (cost <= 0.0) {
            return DisplayCell("-", "", 0f, Color.Transparent, Slate300)
        }

        mainText = "¥${Math.round(cost)}"
        subText = "${String.format("%.1f", hours)}h / ${people}人"
        numericValue = cost.toFloat()

        val bg = if (cell?.is_fallback_rate == true) {
            Color(0xFFFEF3C7) // bg-amber-50
        } else {
            when {
                cost < 150.0 -> Color(0xFFEFF6FF)  // bg-blue-50
                cost <= 300.0 -> Color(0xFFDBEAFE) // bg-blue-100
                cost <= 500.0 -> Color(0xFFE0E7FF) // bg-indigo-100
                else -> Color(0xFFF3E8FF)          // bg-purple-100
            }
        }

        val textAccent = if (cell?.is_fallback_rate == true) {
            Color(0xFF92400E) // text-amber-900
        } else {
            when {
                cost < 150.0 -> Color(0xFF2563EB)  // text-blue-600
                cost <= 300.0 -> Color(0xFF1E40AF) // text-blue-800
                cost <= 500.0 -> Color(0xFF3730A3) // text-indigo-900
                else -> Color(0xFF6B21A8)          // text-purple-900
            }
        }

        return DisplayCell(mainText, subText, numericValue, bg, textAccent)
    }

    when (mockTitle) {
        "白猫" -> {
            if (viewMode == "清洗件数" || viewMode.isEmpty()) {
                mainText = "${rawVal.toInt()}件"
                val cost = (rawVal * 12).toInt()
                subText = "¥$cost"
                numericValue = rawVal
            } else {
                val cost = (rawVal * 12).toInt()
                mainText = "¥$cost"
                subText = "${rawVal.toInt()}件"
                numericValue = cost.toFloat()
            }
        }
        "校园兼职" -> {
            val hours = rawVal
            val people = (rawVal / 8f).toInt() + 1
            val cost = (rawVal * 25).toInt()
            if (viewMode == "出勤人数" || viewMode.isEmpty()) {
                mainText = "${people}人"
                subText = "${hours.toInt()}h"
                numericValue = people.toFloat()
            } else {
                mainText = "¥$cost"
                subText = "${people}人 / ${hours.toInt()}h"
                numericValue = cost.toFloat()
            }
        }
        "方便菜肴" -> {
            val hours = rawVal
            val cost = (rawVal * 28).toInt()
            val people = (rawVal / 8f).toInt() + 1
            if (viewMode == "加工工时" || viewMode.isEmpty()) {
                mainText = "${hours.toInt()}h"
                subText = "¥$cost / ${people}人"
                numericValue = hours
            } else if (viewMode == "核算成本") {
                mainText = "¥$cost"
                subText = "${hours.toInt()}h / ${people}人"
                numericValue = cost.toFloat()
            } else {
                mainText = "${people}人"
                subText = "${hours.toInt()}h / ¥$cost"
                numericValue = people.toFloat()
            }
        }
        "第三方" -> {
            val hours = rawVal
            val cost = (rawVal * 30).toInt()
            val people = (rawVal / 8f).toInt() + 1
            if (viewMode == "派遣工时" || viewMode.isEmpty()) {
                mainText = "${hours.toInt()}h"
                subText = "¥$cost"
                numericValue = hours
            } else if (viewMode == "派遣费用") {
                mainText = "¥$cost"
                subText = "${hours.toInt()}h / ${people}人"
                numericValue = cost.toFloat()
            } else {
                mainText = "${people}人"
                subText = "${hours.toInt()}h / ¥$cost"
                numericValue = people.toFloat()
            }
        }
        else -> {
            // Default MatrixBase behavior
            if (isWorkMatrix) {
                mainText = "${rawVal.toInt()}h"
                subText = "${(rawVal / 8.0f).toInt() + 1}人"
                numericValue = rawVal
            } else {
                mainText = "¥${rawVal.toInt()}"
                subText = "${(rawVal / 45.0f).toInt() + 1}h"
                numericValue = rawVal
            }
        }
    }

    // Heatmap bg and text accent based on viewMode and title
    val isHoursOrQtyOrPeople = isWorkMatrix || 
        viewMode.contains("工时") || 
        viewMode.contains("件") || 
        viewMode.contains("人") || 
        viewMode.isEmpty()

    val bg = when {
        numericValue == 0f -> Color.Transparent
        isHoursOrQtyOrPeople -> {
            when {
                rawVal < 4f -> Color(0xFFECFDF5)
                rawVal <= 8f -> Color(0xFFD1FAE5)
                rawVal <= 10f -> Color(0xFFFEF3C7)
                else -> Color(0xFFFEE2E2)
            }
        }
        else -> { // Cost view modes
            when {
                numericValue < 500f -> Color(0xFFEFF6FF)
                numericValue <= 1500f -> Color(0xFFDBEAFE)
                numericValue <= 3000f -> Color(0xFFC7D2FE)
                else -> Color(0xFFF3E8FF)
            }
        }
    }

    val textAccent = when {
        numericValue == 0f -> Slate300
        isHoursOrQtyOrPeople -> {
            when {
                rawVal <= 8f -> Emerald700
                rawVal <= 10f -> Orange600
                else -> Rose600
            }
        }
        else -> {
            when {
                numericValue <= 1500f -> Blue700
                numericValue <= 3000f -> Color(0xFF4F46E5)
                else -> Color(0xFF7C3AED)
            }
        }
    }

    return DisplayCell(mainText, subText, numericValue, bg, textAccent)
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MatrixBase(
    title: String,
    days: List<String>,
    rows: List<MatrixRowData>,
    selectedMonth: String,
    kbiSummary: List<Triple<String, String, Color>> = emptyList(),
    mockTitle: String = "",
    onMonthChange: (String) -> Unit
) {
    var keyword by remember { mutableStateOf("") }
    var selectedDept by remember { mutableStateOf("全部部门") }
    
    // Student Meal Cost Filter States
    var studentMealEmployeeType by remember { mutableStateOf("all") }
    var studentMealCostType by remember { mutableStateOf("all") }

    val defaultViewMode = when (mockTitle) {
        "白猫" -> "清洗件数"
        "校园兼职" -> "出勤人数"
        "方便菜肴" -> "加工工时"
        "第三方" -> "派遣工时"
        else -> ""
    }
    var viewMode by remember(mockTitle) { mutableStateOf(defaultViewMode) }

    val horizontalScrollState = rememberScrollState()

    // Extract departments list dynamically
    val departments = remember(rows) {
        listOf("全部部门") + rows.map { it.name.trim() }.distinct().sorted()
    }

    // Process and Filter Rows based on input search/dropdowns
    val filteredRows = remember(rows, keyword, selectedDept, studentMealCostType, mockTitle, viewMode) {
        rows.filter { r ->
            val matchesDept = selectedDept == "全部部门" || r.name.trim() == selectedDept
            val matchesKeyword = keyword.isEmpty() || r.name.lowercase().contains(keyword.lowercase())
            matchesDept && matchesKeyword
        }.map { r ->
            if (mockTitle == "学生餐成本") {
                val updatedDaily = r.daily.mapValues { (day, cell) ->
                    val disp = getDisplayCell(r.name, day, cell, mockTitle, viewMode, false, studentMealCostType)
                    cell.copy(value = disp.numericValue.toString())
                }.filterValues { (it.value.toDoubleOrNull() ?: 0.0) > 0.0 }
                
                val sumCost = updatedDaily.values.sumOf { it.value.toDoubleOrNull() ?: 0.0 }
                r.copy(
                    total = "¥${String.format("%,.0f", sumCost)}",
                    daily = updatedDaily
                )
            } else {
                r
            }
        }.filter { it.daily.isNotEmpty() || mockTitle != "学生餐成本" }
    }

    // Process totals of rows dynamically based on selected viewMode
    val processedRows = remember(filteredRows, viewMode, mockTitle, studentMealCostType) {
        filteredRows.map { r ->
            var calculatedTotal = 0f
            r.daily.forEach { (day, cell) ->
                val disp = getDisplayCell(r.name, day, cell, mockTitle, viewMode, title.contains("工时"), studentMealCostType)
                calculatedTotal += disp.numericValue
            }
            val formattedTotal = if (mockTitle == "学生餐成本" || viewMode.contains("成本") || viewMode.contains("费用") || viewMode.contains("核算")) {
                "¥${String.format("%,.0f", calculatedTotal)}"
            } else if (viewMode.contains("件")) {
                "${calculatedTotal.toInt()}件"
            } else if (viewMode.contains("人")) {
                "${calculatedTotal.toInt()}人"
            } else if (viewMode.contains("工时")) {
                "${calculatedTotal.toInt()}h"
            } else {
                r.total
            }
            r.copy(total = formattedTotal)
        }
    }

    // Interactive drilldown dialogue state
    var selectedDrilldownCell by remember { mutableStateOf<DrilldownCellInfo?>(null) }

    // Dynamic Pie Chart Slices
    val pieChartSlices = remember(processedRows, mockTitle) {
        val colors = listOf(Blue500, Emerald500, Orange500, Color(0xFF8B5CF6), Color(0xFFEC4899), Color(0xFF14B8A6), Color(0xFFEAB308), Color(0xFF6366F1))
        if (mockTitle == "总成本矩阵") {
            val compositionMap = mutableMapOf<String, Float>()
            processedRows.forEach { row ->
                val name = row.name
                val category = when {
                    name.contains("学生餐") -> "学生餐人工成本"
                    name.contains("方便菜") -> "方便菜肴人工成本"
                    name.contains("兼职") -> "校园兼职成本"
                    name.contains("白猫") || name.contains("清洗") -> "白猫清洗成本"
                    name.contains("劳务") || name.contains("派遣") -> "第三方劳务成本"
                    else -> "其他成本"
                }
                val value = row.total.replace("¥", "").replace(",", "").toFloatOrNull() ?: 0f
                compositionMap[category] = (compositionMap[category] ?: 0f) + value
            }
            compositionMap.entries.mapIndexed { idx, (name, value) ->
                PieSlice(
                    name = name,
                    value = value,
                    color = colors[idx % colors.size]
                )
            }.filter { it.value > 0f }
        } else {
            processedRows.mapIndexed { idx, row ->
                val totalVal = row.total.replace("¥", "").replace("件", "").replace("人", "").replace("h", "").replace(",", "").toFloatOrNull() ?: 0f
                PieSlice(
                    name = row.name.replace("  └ ", "").trim(),
                    value = totalVal,
                    color = colors[idx % colors.size]
                )
            }.filter { it.value > 0f }
        }
    }

    // Dynamic metrics calculation for the 4 KBI Cards
    val kbiCards = remember(processedRows, selectedMonth, title, viewMode, mockTitle, pieChartSlices) {
        val count = processedRows.size
        var totalSum = 0.0
        processedRows.forEach { r ->
            val num = r.total.replace("¥", "").replace("件", "").replace("人", "").replace("h", "").replace(",", "").toDoubleOrNull() ?: 0.0
            totalSum += num
        }
        val avgVal = if (count > 0) totalSum / count else 0.0

        val formattedTotal = if (viewMode.contains("成本") || viewMode.contains("费用") || title.contains("成本") || title.contains("学生餐") || mockTitle == "总成本矩阵") {
            "¥${String.format("%,.0f", totalSum)}"
        } else if (viewMode.contains("件")) {
            "${String.format("%,.0f", totalSum)} 件"
        } else if (viewMode.contains("人")) {
            "${String.format("%,.0f", totalSum)} 人"
        } else {
            "${String.format("%,.0f", totalSum)} h"
        }

        val formattedAvg = if (mockTitle == "总成本矩阵") {
            "${pieChartSlices.size} 大类"
        } else if (viewMode.contains("成本") || viewMode.contains("费用") || title.contains("成本") || title.contains("学生餐")) {
            "¥${String.format("%,.0f", avgVal)}"
        } else if (viewMode.contains("件")) {
            "${String.format("%.1f", avgVal)} 件"
        } else if (viewMode.contains("人")) {
            "${String.format("%.1f", avgVal)} 人"
        } else {
            "${String.format("%.1f", avgVal)} h"
        }

        val totalLabel = when {
            viewMode.contains("成本") || viewMode.contains("费用") || mockTitle == "总成本矩阵" -> "核定总成本"
            viewMode.contains("件") -> "累计清洗量"
            viewMode.contains("人") -> "累计出勤人次"
            viewMode.contains("工时") -> "累计总工时"
            title.contains("工时") -> "累计核定工时"
            else -> "核定总额"
        }

        val avgLabel = when {
            mockTitle == "总成本矩阵" -> "成本构成"
            viewMode.contains("成本") || viewMode.contains("费用") -> "平均成本"
            viewMode.contains("件") -> "人均清洗量"
            viewMode.contains("人") -> "日均出勤"
            viewMode.contains("工时") -> "平均工时"
            title.contains("工时") -> "平均工时"
            else -> "平均成本/对象"
        }

        val thirdLabel = if (mockTitle == "总成本矩阵") "成本构成" else "核算对象数"
        val thirdValue = if (mockTitle == "总成本矩阵") "${pieChartSlices.size} 大类" else "$count 个"

        listOf(
            KbiCardItem("核算周期", selectedMonth, Icons.Default.CalendarToday, Orange500 to Color(0xFFFFF7ED)),
            KbiCardItem(if (mockTitle == "总成本矩阵") "当前月份" else "核算对象数", if (mockTitle == "总成本矩阵") "${selectedMonth.split("-").last()}月" else "$count 个", Icons.Default.FilterList, Blue500 to Color(0xFFEFF6FF)),
            KbiCardItem(totalLabel, formattedTotal, Icons.Default.Paid, Emerald500 to Color(0xFFECFDF5)),
            KbiCardItem(avgLabel, formattedAvg, if (mockTitle == "总成本矩阵") Icons.Default.Layers else Icons.Default.TrendingUp, Color(0xFF8B5CF6) to Color(0xFFF5F3FF))
        )
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
                    if (mockTitle.isNotEmpty()) {
                        val modes = when (mockTitle) {
                            "白猫" -> listOf("清洗件数", "结算成本")
                            "校园兼职" -> listOf("出勤人数", "劳务费用")
                            "方便菜肴" -> listOf("加工工时", "核算成本", "出勤人数")
                            "第三方" -> listOf("派遣工时", "派遣费用", "在岗人数")
                            else -> emptyList()
                        }
                        if (modes.isNotEmpty()) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(Slate100, RoundedCornerShape(8.dp))
                                    .padding(3.dp),
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                modes.forEach { mode ->
                                    val isSelected = viewMode == mode
                                    Box(
                                        modifier = Modifier
                                            .weight(1f)
                                            .background(
                                                color = if (isSelected) Color.White else Color.Transparent,
                                                shape = RoundedCornerShape(6.dp)
                                            )
                                            .clickable { viewMode = mode }
                                            .padding(vertical = 6.dp),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = mode,
                                            fontSize = 10.5.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = if (isSelected) Orange600 else Slate600
                                        )
                                    }
                                }
                            }
                        }
                    }

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
                            if (mockTitle == "总成本矩阵") "每日总成本趋势" else if (title.contains("成本")) "每日归集核算成本趋势" else "每日核准生产工时走势",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate700
                        )
                        Spacer(Modifier.height(8.dp))
                        CustomAreaChart(
                            points = trendChartPoints,
                            modifier = Modifier.fillMaxSize(),
                            color1 = Orange500,
                            title1 = if (mockTitle == "总成本矩阵" || title.contains("成本")) "日总成本 (¥)" else "核准工时 (h)"
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
                        Text(
                            if (mockTitle == "总成本矩阵") "成本构成占比" else "部门/细分口径占比统计",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate700
                        )
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
                            if (mockTitle == "总成本矩阵") "总成本日历视图" else if (title.contains("学生餐")) "学生餐人工成本矩阵 (双排高密·点击穿透)" else "$title 数据矩阵 (横向滑动)",
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
                            } else if (mockTitle == "总成本矩阵") {
                                listOf(
                                    "无" to Slate50,
                                    "低" to Color(0xFFEFF6FF),
                                    "中" to Color(0xFFE0E7FF),
                                    "高" to Color(0xFFF3E8FF)
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
                                    Text(
                                        if (mockTitle == "总成本矩阵") "成本分类 / 部门" else "核算部门 / 项目",
                                        fontSize = 9.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Slate500
                                    )
                                }
                                if (mockTitle != "总成本矩阵") {
                                    Box(
                                        Modifier
                                            .width(70.dp)
                                            .padding(vertical = 10.dp, horizontal = 12.dp),
                                        contentAlignment = Alignment.CenterEnd
                                    ) {
                                        Text("月度累计", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500)
                                    }
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
                                if (mockTitle == "总成本矩阵") {
                                    Box(
                                        Modifier
                                            .width(80.dp)
                                            .padding(vertical = 10.dp, horizontal = 12.dp),
                                        contentAlignment = Alignment.CenterEnd
                                    ) {
                                        Text("累计汇总", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500)
                                    }
                                }
                            }

                            Box(Modifier.fillMaxWidth().height(1.dp).background(Slate200))

                            // Table Rows Data List
                            processedRows.forEach { row ->
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

                                    // Row Grand Total Column (Left placement for standard, Right placement for Total Cost Matrix)
                                    if (mockTitle != "总成本矩阵") {
                                        Box(
                                            Modifier
                                                .width(70.dp)
                                                .padding(vertical = 8.dp, horizontal = 12.dp),
                                            contentAlignment = Alignment.CenterEnd
                                        ) {
                                            Text(
                                                text = row.total,
                                                fontSize = 10.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = Slate800,
                                                fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                                            )
                                        }
                                    }

                                    // Daily Columns
                                    days.forEach { day ->
                                        val cell = row.daily[day]
                                        val disp = getDisplayCell(row.name, day, cell, mockTitle, viewMode, title.contains("工时"))

                                        Box(
                                            modifier = Modifier
                                                .width(52.dp)
                                                .height(44.dp)
                                                .background(disp.bg)
                                                .border(0.3.dp, Slate100)
                                                .clickable(enabled = disp.numericValue > 0f) {
                                                    // Trigger drilldown popup dialog
                                                    selectedDrilldownCell = DrilldownCellInfo(
                                                        deptName = row.name,
                                                        date = day,
                                                        value = disp.numericValue,
                                                        subValue = cell?.subValue ?: ""
                                                    )
                                                },
                                            contentAlignment = Alignment.Center
                                        ) {
                                            if (disp.numericValue > 0f) {
                                                Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
                                                    Text(
                                                        disp.mainText,
                                                        fontSize = 9.5.sp,
                                                        color = disp.textAccent,
                                                        fontWeight = FontWeight.Bold,
                                                        fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                                                    )
                                                    if (disp.subText.isNotEmpty()) {
                                                        Text(
                                                            disp.subText,
                                                            fontSize = 7.sp,
                                                            color = disp.textAccent.copy(alpha = 0.6f)
                                                        )
                                                    }
                                                }
                                            } else {
                                                Text("-", fontSize = 10.sp, color = Slate300)
                                            }
                                        }
                                    }

                                    // Row Grand Total Column (Right placement for Total Cost Matrix)
                                    if (mockTitle == "总成本矩阵") {
                                        Box(
                                            Modifier
                                                .width(80.dp)
                                                .padding(vertical = 8.dp, horizontal = 12.dp),
                                            contentAlignment = Alignment.CenterEnd
                                        ) {
                                            Text(
                                                text = row.total,
                                                fontSize = 10.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = Slate800,
                                                fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                                            )
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
                            
                            val rowName = info.deptName
                            val isDepartment = rowName.contains("部门") || rowName.contains("班组") || rowName.contains("科室") || rowName.contains("中心") || rowName.contains("部") || rowName.contains("厂") || rowName.contains("学校") || rowName.contains("客服") || rowName.contains("分类")
                            
                            val mockEmployees = if (!isDepartment && rowName.trim().isNotEmpty() && rowName.trim().length <= 4 && !rowName.contains("└")) {
                                listOf(
                                    Triple(rowName.trim(), "自有员工", info.value)
                                )
                            } else {
                                val cleanDeptName = rowName.replace("  └ ", "").trim()
                                val seed = cleanDeptName.hashCode() + info.date.hashCode()
                                val random = java.util.Random(seed.toLong())
                                val firstNames = listOf("张", "李", "王", "刘", "陈", "杨", "赵", "黄", "周", "吴", "徐", "孙")
                                val lastNames = listOf("伟", "芳", "娜", "秀英", "敏", "静", "丽", "强", "磊", "洋", "艳", "勇", "军", "杰", "超")
                                
                                val totalValue = info.value
                                val peopleCount = when {
                                    totalValue <= 8.0f -> 1
                                    totalValue <= 16.0f -> 2
                                    else -> 3
                                }
                                
                                List(peopleCount) { i ->
                                    val fName = firstNames[random.nextInt(firstNames.size)]
                                    val lName = lastNames[random.nextInt(lastNames.size)]
                                    val empName = fName + lName
                                    val empType = when (random.nextInt(3)) {
                                        0 -> "自有员工"
                                        1 -> "小时工"
                                        else -> "第三方派遣"
                                    }
                                    val hours = if (peopleCount == 1) totalValue else {
                                        if (i == peopleCount - 1) {
                                            totalValue - (8.0f * (peopleCount - 1))
                                        } else {
                                            8.0f
                                        }
                                    }
                                    val finalHours = if (hours <= 0f) 4.0f else hours
                                    Triple(empName, empType, finalHours)
                                }
                            }
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
                                    Text("${hrs.toInt()}h", fontSize = 9.5.sp, color = Slate600, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace, modifier = Modifier.weight(1f), textAlign = TextAlign.Center)
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
    val daily: Map<String, MatrixCellData> = emptyMap(),
    val children: List<com.szxianyu.executive.data.models.MatrixRow>? = null
)

data class MatrixCellData(
    val value: String,
    val subValue: String? = null,
    val isAbnormal: Boolean = false,
    val regular_hours: Double? = null,
    val hourly_rate: Double? = null,
    val overtime_hours: Double? = null,
    val overtime_hourly_rate: Double? = null,
    val is_fallback_rate: Boolean? = null,
    val people: Int? = null,
    val cost: Double? = null,
    val hours: Double? = null
)
