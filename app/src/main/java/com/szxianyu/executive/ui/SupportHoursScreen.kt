package com.szxianyu.executive.ui

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import com.szxianyu.executive.ui.theme.*

data class SupportLedgerRecord(
    val date: String,
    val employeeName: String,
    val sourceDept: String,
    val targetDept: String,
    val period: String,
    val hours: Float,
    val cost: Float,
    val status: String
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SupportHoursScreen() {
    val initialRecords = remember {
        listOf(
            SupportLedgerRecord("2026-07-01", "李刚", "学生餐一车间", "学生餐二车间", "08:30-17:30", 8.0f, 240f, "已过审"),
            SupportLedgerRecord("2026-07-01", "陈林", "方便菜加工部", "学生餐二车间", "13:00-17:00", 4.0f, 140f, "已过审"),
            SupportLedgerRecord("2026-07-02", "王磊", "净菜生产线", "学生餐一车间", "08:30-17:30", 8.0f, 260f, "已过审"),
            SupportLedgerRecord("2026-07-02", "赵海", "学生餐二车间", "冷链物流仓储", "09:00-18:00", 8.0f, 240f, "已过审"),
            SupportLedgerRecord("2026-07-03", "张杰", "学生餐一车间", "方便菜加工部", "08:30-17:30", 8.0f, 240f, "已过审"),
            SupportLedgerRecord("2026-07-03", "李娜", "冷链物流仓储", "学生餐一车间", "17:30-21:30", 4.0f, 150f, "审核中"),
            SupportLedgerRecord("2026-07-04", "刘洋", "净菜生产线", "学生餐二车间", "08:30-12:30", 4.0f, 130f, "已过审")
        )
    }

    var filterMode by remember { mutableStateOf("month") }
    var startDate by remember { mutableStateOf("2026-07-01") }
    var endDate by remember { mutableStateOf("2026-07-04") }
    var dispatchDept by remember { mutableStateOf("全部") }
    var supportDept by remember { mutableStateOf("全部") }

    val dispatchDepts = remember { listOf("全部", "学生餐一车间", "学生餐二车间", "方便菜加工部", "冷链物流仓储", "净菜生产线") }
    val supportDepts = remember { listOf("全部", "学生餐一车间", "学生餐二车间", "方便菜加工部", "冷链物流仓储", "净菜生产线") }

    // Filtered Records logic
    val filteredRecords = remember(startDate, endDate, dispatchDept, supportDept) {
        initialRecords.filter { r ->
            val matchesDispatch = dispatchDept == "全部" || r.sourceDept == dispatchDept
            val matchesSupport = supportDept == "全部" || r.targetDept == supportDept
            // Simplify date matches for mockup
            val matchesDate = r.date >= startDate && r.date <= endDate
            matchesDispatch && matchesSupport && matchesDate
        }
    }

    // Calculate KBI indicators
    val totalHours = filteredRecords.sumOf { it.hours.toDouble() }.toFloat()
    val totalCost = filteredRecords.sumOf { it.cost.toDouble() }.toFloat()
    val totalPersonTimes = filteredRecords.size
    val uniqueTargetDepts = filteredRecords.map { it.targetDept }.distinct().size
    val avgHours = if (totalPersonTimes > 0) totalHours / totalPersonTimes else 0f

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate50)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 32.dp)
    ) {
        // Page Header
        item {
            Column {
                Text(
                    "跨部门/车间支援工时审计",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Black,
                    color = Slate900
                )
                Text(
                    "监控跨组织用工支援动态，考核被支援部门劳务分摊及工时效益。",
                    fontSize = 11.sp,
                    color = Slate400,
                    fontWeight = FontWeight.Medium
                )
            }
        }

        // 1. Filter Control Bar Card
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = BorderStroke(1.dp, Slate200),
                shape = RoundedCornerShape(12.dp)
            ) {
                Column(Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Quick filter buttons
                        Surface(
                            color = Slate100,
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.padding(end = 8.dp)
                        ) {
                            Row(modifier = Modifier.padding(2.dp)) {
                                listOf("today" to "今日", "week" to "本周", "month" to "本月").forEach { (mode, label) ->
                                    val isSelected = filterMode == mode
                                    Surface(
                                        color = if (isSelected) Color.White else Color.Transparent,
                                        shape = RoundedCornerShape(6.dp),
                                        modifier = Modifier
                                            .clickable {
                                                filterMode = mode
                                                if (mode == "today") {
                                                    startDate = "2026-07-04"; endDate = "2026-07-04"
                                                } else if (mode == "week") {
                                                    startDate = "2026-07-01"; endDate = "2026-07-04"
                                                } else {
                                                    startDate = "2026-07-01"; endDate = "2026-07-31"
                                                }
                                            }
                                    ) {
                                        Text(
                                            label,
                                            fontSize = 9.5.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = if (isSelected) Orange600 else Slate500,
                                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 5.dp)
                                        )
                                    }
                                }
                            }
                        }

                        // Date Pickers mock inputs
                        Text("起止日期:", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate500)
                        OutlinedTextField(
                            value = startDate,
                            onValueChange = { startDate = it },
                            textStyle = androidx.compose.ui.text.TextStyle(fontSize = 10.sp, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace),
                            singleLine = true,
                            modifier = Modifier
                                .width(90.dp)
                                .height(36.dp),
                            colors = TextFieldDefaults.outlinedTextFieldColors(containerColor = Slate50)
                        )
                        Text("至", fontSize = 10.sp, color = Slate400)
                        OutlinedTextField(
                            value = endDate,
                            onValueChange = { endDate = it },
                            textStyle = androidx.compose.ui.text.TextStyle(fontSize = 10.sp, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace),
                            singleLine = true,
                            modifier = Modifier
                                .width(90.dp)
                                .height(36.dp),
                            colors = TextFieldDefaults.outlinedTextFieldColors(containerColor = Slate50)
                        )
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Dispatch Dept Dropdown
                        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                            Text("派出部门:", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate500)
                            Spacer(Modifier.width(6.dp))
                            var dispatchExpanded by remember { mutableStateOf(false) }
                            Box {
                                Surface(
                                    modifier = Modifier
                                        .height(36.dp)
                                        .fillMaxWidth()
                                        .clickable { dispatchExpanded = true },
                                    border = BorderStroke(1.dp, Slate200),
                                    shape = RoundedCornerShape(6.dp),
                                    color = Slate50
                                ) {
                                    Row(
                                        modifier = Modifier.padding(horizontal = 8.dp),
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Text(dispatchDept, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate800)
                                        Icon(Icons.Default.ArrowDropDown, contentDescription = null, tint = Slate500, modifier = Modifier.size(14.dp))
                                    }
                                }
                                DropdownMenu(expanded = dispatchExpanded, onDismissRequest = { dispatchExpanded = false }) {
                                    dispatchDepts.forEach { dept ->
                                        DropdownMenuItem(text = { Text(dept, fontSize = 10.sp) }, onClick = { dispatchDept = dept; dispatchExpanded = false })
                                    }
                                }
                            }
                        }

                        // Support Dept Dropdown
                        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                            Text("支援部门:", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate500)
                            Spacer(Modifier.width(6.dp))
                            var supportExpanded by remember { mutableStateOf(false) }
                            Box {
                                Surface(
                                    modifier = Modifier
                                        .height(36.dp)
                                        .fillMaxWidth()
                                        .clickable { supportExpanded = true },
                                    border = BorderStroke(1.dp, Slate200),
                                    shape = RoundedCornerShape(6.dp),
                                    color = Slate50
                                ) {
                                    Row(
                                        modifier = Modifier.padding(horizontal = 8.dp),
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Text(supportDept, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate800)
                                        Icon(Icons.Default.ArrowDropDown, contentDescription = null, tint = Slate500, modifier = Modifier.size(14.dp))
                                    }
                                }
                                DropdownMenu(expanded = supportExpanded, onDismissRequest = { supportExpanded = false }) {
                                    supportDepts.forEach { dept ->
                                        DropdownMenuItem(text = { Text(dept, fontSize = 10.sp) }, onClick = { supportDept = dept; supportExpanded = false })
                                    }
                                }
                            }
                        }

                        // Search Action
                        Button(
                            onClick = {},
                            colors = ButtonDefaults.buttonColors(containerColor = Orange500),
                            shape = RoundedCornerShape(6.dp),
                            contentPadding = PaddingValues(horizontal = 14.dp),
                            modifier = Modifier.height(36.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                Icon(Icons.Default.Search, contentDescription = null, tint = Color.White, modifier = Modifier.size(12.dp))
                                Text("查询", color = Color.White, fontSize = 10.5.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        }

        // 2. 5 KBI Cards Row
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                val kbis = listOf(
                    Triple("总支援工时", "${totalHours}h", Blue500 to Color(0xFFEFF6FF)),
                    Triple("支援总成本", "¥${totalCost.toInt()}", Rose500 to Color(0xFFFEF2F2)),
                    Triple("支援总人次", "${totalPersonTimes}人次", Emerald500 to Color(0xFFECFDF5)),
                    Triple("涉及支援部门", "${uniqueTargetDepts}个", Color(0xFF8B5CF6) to Color(0xFFF5F3FF)),
                    Triple("人均支援工时", "${String.format("%.1f", avgHours)}h", Orange500 to Color(0xFFFFFBEB))
                )

                kbis.forEach { (label, val_, colors) ->
                    val (tint, bg) = colors
                    Card(
                        modifier = Modifier.weight(1f),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        border = BorderStroke(1.dp, Slate200)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(10.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(label, fontSize = 8.5.sp, color = Slate400, fontWeight = FontWeight.Bold)
                                Spacer(Modifier.height(4.dp))
                                Text(val_, fontSize = 12.sp, fontWeight = FontWeight.Black, color = Slate800, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace)
                            }
                            Surface(
                                color = bg,
                                shape = RoundedCornerShape(6.dp),
                                modifier = Modifier.size(24.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Icon(
                                        imageVector = if (label.contains("工时")) Icons.Default.Clock
                                        else if (label.contains("成本")) Icons.Default.TrendingUp
                                        else if (label.contains("人次")) Icons.Default.Users
                                        else if (label.contains("部门")) Icons.Default.Business
                                        else Icons.Default.Analytics,
                                        contentDescription = null,
                                        tint = tint,
                                        modifier = Modifier.size(12.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // 3. 3 Custom Charts Row
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(180.dp),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Chart 1: Top 10 Supported Departments
                val rankData = remember(filteredRecords) {
                    filteredRecords.groupBy { it.targetDept }
                        .map { (dept, list) -> dept to list.sumOf { it.hours.toDouble() }.toFloat() }
                        .sortedByDescending { it.second }
                }
                val maxRankHours = rankData.firstOrNull()?.second?.coerceAtLeast(1f) ?: 1f

                Card(
                    modifier = Modifier.weight(1f),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = BorderStroke(1.dp, Slate200)
                ) {
                    Column(Modifier.padding(10.dp)) {
                        Text("被支援部门排行 TOP10 (工时排名)", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate700)
                        Spacer(Modifier.height(10.dp))
                        if (rankData.isEmpty()) {
                            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                                Text("无部门排行数据", fontSize = 8.5.sp, color = Slate400)
                            }
                        } else {
                            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                rankData.take(4).forEach { (dept, hours) ->
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(dept, fontSize = 8.sp, color = Slate500, modifier = Modifier.width(65.dp), maxLines = 1, overflow = TextOverflow.Ellipsis)
                                        Spacer(Modifier.width(4.dp))
                                        Box(
                                            modifier = Modifier
                                                .weight(1f)
                                                .height(8.dp)
                                                .background(Slate100, RoundedCornerShape(4.dp))
                                        ) {
                                            Box(
                                                modifier = Modifier
                                                    .fillMaxWidth(hours / maxRankHours)
                                                    .fillMaxHeight()
                                                    .background(Blue500, RoundedCornerShape(4.dp))
                                            )
                                        }
                                        Spacer(Modifier.width(6.dp))
                                        Text("${hours.toInt()}h", fontSize = 8.sp, fontWeight = FontWeight.Bold, color = Slate700, modifier = Modifier.width(22.dp))
                                    }
                                }
                            }
                        }
                    }
                }

                // Chart 2: Daily Trend Area Chart
                val trendPoints = remember(filteredRecords) {
                    filteredRecords.groupBy { it.date }
                        .map { (date, list) ->
                            val dateLabel = date.split("-").last() + "日"
                            ChartPoint(dateLabel, list.sumOf { it.hours.toDouble() }.toFloat())
                        }.sortedBy { it.label }
                }

                Card(
                    modifier = Modifier.weight(1f),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = BorderStroke(1.dp, Slate200)
                ) {
                    Column(Modifier.padding(10.dp)) {
                        Text("每日支援趋势 (面积图)", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate700)
                        Spacer(Modifier.height(10.dp))
                        if (trendPoints.isEmpty()) {
                            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                                Text("无每日支援数据", fontSize = 8.5.sp, color = Slate400)
                            }
                        } else {
                            CustomAreaChart(
                                points = trendPoints,
                                modifier = Modifier.fillMaxSize(),
                                color1 = Blue500,
                                title1 = "支援工时 (h)"
                            )
                        }
                    }
                }

                // Chart 3: Dispatch Pie Chart (派出占比)
                val pieSlices = remember(filteredRecords) {
                    val colors = listOf(Blue500, Emerald500, Orange500, Color(0xFF8B5CF6), Color(0xFFEC4899), Color(0xFF14B8A6))
                    filteredRecords.groupBy { it.sourceDept }
                        .mapIndexed { idx, (dept, list) ->
                            PieSlice(dept, list.sumOf { it.hours.toDouble() }.toFloat(), colors[idx % colors.size])
                        }
                }

                Card(
                    modifier = Modifier.weight(1f),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = BorderStroke(1.dp, Slate200)
                ) {
                    Column(Modifier.padding(10.dp)) {
                        Text("派出部门占比 (饼图)", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate700)
                        Spacer(Modifier.height(10.dp))
                        if (pieSlices.isEmpty()) {
                            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                                Text("无派出占比数据", fontSize = 8.5.sp, color = Slate400)
                            }
                        } else {
                            CustomPieChart(
                                slices = pieSlices,
                                modifier = Modifier.fillMaxSize()
                            )
                        }
                    }
                }
            }
        }

        // 4. Detailed Ledger Table
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = BorderStroke(1.dp, Slate200)
            ) {
                Column {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Slate50)
                            .padding(horizontal = 12.dp, vertical = 10.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("支援明细台账", fontSize = 11.sp, fontWeight = FontWeight.Black, color = Slate800)
                        Text(
                            "导出 Excel",
                            fontSize = 9.5.sp,
                            fontWeight = FontWeight.Bold,
                            color = Blue600,
                            modifier = Modifier.clickable {}
                        )
                    }

                    Box(Modifier.fillMaxWidth().height(1.dp).background(Slate200))

                    // Table Header
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Slate50)
                            .padding(vertical = 8.dp, horizontal = 12.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("支援日期", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1f))
                        Text("员工信息", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1f), textAlign = TextAlign.Center)
                        Text("派出部门", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1.5f), textAlign = TextAlign.Center)
                        Text("支援部门", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1.5f), textAlign = TextAlign.Center)
                        Text("时段", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1.2f), textAlign = TextAlign.Center)
                        Text("支援工时", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1f), textAlign = TextAlign.End)
                        Text("折算成本", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1.1f), textAlign = TextAlign.End)
                        Text("状态", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1f), textAlign = TextAlign.End)
                    }

                    Box(Modifier.fillMaxWidth().height(1.dp).background(Slate200))

                    // Table rows
                    Column {
                        filteredRecords.forEach { record ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 10.dp, horizontal = 12.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(record.date, fontSize = 9.5.sp, color = Slate500, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace, modifier = Modifier.weight(1f))
                                Text(record.employeeName, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate800, modifier = Modifier.weight(1f), textAlign = TextAlign.Center)
                                Text(record.sourceDept, fontSize = 10.sp, color = Slate600, modifier = Modifier.weight(1.5f), textAlign = TextAlign.Center)
                                Text(record.targetDept, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Orange600, modifier = Modifier.weight(1.5f), textAlign = TextAlign.Center)
                                Text(record.period, fontSize = 9.5.sp, color = Slate500, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace, modifier = Modifier.weight(1.2f), textAlign = TextAlign.Center)
                                Text("${record.hours}h", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate800, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace, modifier = Modifier.weight(1f), textAlign = TextAlign.End)
                                Text("¥${record.cost.toInt()}", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Rose600, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace, modifier = Modifier.weight(1.1f), textAlign = TextAlign.End)
                                
                                val badgeColor = if (record.status == "已过审") Emerald600 else Orange600
                                val badgeBg = if (record.status == "已过审") Emerald50 else Orange50
                                Box(modifier = Modifier.weight(1f), contentAlignment = Alignment.CenterEnd) {
                                    Surface(
                                        color = badgeBg,
                                        shape = RoundedCornerShape(4.dp),
                                        border = BorderStroke(0.5.dp, badgeColor.copy(alpha = 0.3f))
                                    ) {
                                        Text(" ${record.status} ", fontSize = 8.sp, fontWeight = FontWeight.Bold, color = badgeColor, modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp))
                                    }
                                }
                            }
                            Box(Modifier.fillMaxWidth().height(0.5.dp).background(Slate100))
                        }
                    }
                }
            }
        }
    }
}
