package com.szxianyu.executive.ui

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
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

// Data Models for Cost Center
data class CostCenterKbi(
    val label: String,
    val value: String,
    val compare: String,
    val isPositive: Boolean,
    val desc: String,
    val formula: String,
    val highlight: Boolean = false
)

data class CostStructureItem(
    val name: String,
    val value: Float,
    val percentage: Float,
    val displayValue: String,
    val color: Color
)

data class CostAlertItem(
    val department: String,
    val message: String,
    val value: String
)

data class CostDepartmentRow(
    val id: String,
    val name: String,
    val hours: Int,
    val costPerHour: Float,
    val costShare: Float,
    val laborCost: Float,
    val risk: String // "low" | "medium" | "high"
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CostCenterScreen() {
    val mainKPIs = remember {
        listOf(
            CostCenterKbi(
                label = "本月人工总成本",
                value = "¥1,143,800",
                compare = "+12.4%",
                isPositive = false, // Increase in cost is negative
                desc = "比上月增加 ¥126,200",
                formula = "人工总成本 = 正班工资 + 加班工人工资 + 社保公积金 + 劳务派遣佣金",
                highlight = true
            ),
            CostCenterKbi(
                label = "平均人工成本率",
                value = "24.8%",
                compare = "-1.2%",
                isPositive = true, // Decrease in rate is positive
                desc = "工时效能提升拉低整体成本率",
                formula = "人工成本率 = 人工总成本 / 同期营业收入 * 100%",
                highlight = false
            )
        )
    }

    val trendPoints = remember {
        listOf(
            ChartPoint("1月", 850f, 25.5f),
            ChartPoint("2月", 920f, 26.2f),
            ChartPoint("3月", 890f, 24.8f),
            ChartPoint("4月", 980f, 25.1f),
            ChartPoint("5月", 1050f, 25.4f),
            ChartPoint("6月", 1143f, 24.8f)
        )
    }

    val structureItems = remember {
        listOf(
            CostStructureItem("正班基本工资", 624500f, 54.6f, "¥624,500", Blue500),
            CostStructureItem("加班补贴总额", 248000f, 21.7f, "¥248,000", Orange500),
            CostStructureItem("第三方劳务佣金", 182400f, 15.9f, "¥182,400", Emerald500),
            CostStructureItem("福利社保公积金", 88900f, 7.8f, "¥88,900", Color(0xFF8B5CF6))
        )
    }

    val alerts = remember {
        listOf(
            CostAlertItem("方便菜加工部", "加班溢出导致时薪成本虚高", "¥142,400"),
            CostAlertItem("学生餐二车间", "小时工异常打卡漏签风险", "¥88,000")
        )
    }

    val departmentRows = remember {
        listOf(
            CostDepartmentRow("cc-01", "学生餐一车间", 1220, 48.5f, 32.4f, 324500f, "medium"),
            CostDepartmentRow("cc-02", "学生餐二车间", 2480, 52.2f, 41.2f, 412800f, "high"),
            CostDepartmentRow("cc-03", "方便菜加工部", 980, 60.5f, 15.6f, 128400f, "high"),
            CostDepartmentRow("cc-04", "冷链物流仓储", 496, 42.0f, 6.2f, 62100f, "low"),
            CostDepartmentRow("cc-05", "净菜生产线", 360, 40.0f, 4.6f, 16000f, "low")
        )
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate50)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 32.dp)
    ) {
        // Page Title
        item {
            Column {
                Text(
                    "部门成本中心分析",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Black,
                    color = Slate900
                )
                Text(
                    "穿透财务人工成本核算，洞察各级经营组织劳务成本构成与超支异动红线。",
                    fontSize = 11.sp,
                    color = Slate400,
                    fontWeight = FontWeight.Medium
                )
            }
        }

        // 1. Two Main KBIs
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                mainKPIs.forEach { kbi ->
                    val cardBg = if (kbi.highlight) Orange50.copy(alpha = 0.2f) else Color.White
                    val borderStroke = if (kbi.highlight) BorderStroke(1.dp, Orange200) else BorderStroke(1.dp, Slate200)

                    Card(
                        modifier = Modifier.weight(1f),
                        colors = CardDefaults.cardColors(containerColor = cardBg),
                        border = borderStroke,
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                    Text(kbi.label, fontSize = 10.sp, color = Slate400, fontWeight = FontWeight.Bold)
                                    Icon(Icons.Default.Info, contentDescription = null, tint = Slate300, modifier = Modifier.size(11.dp))
                                }
                                Spacer(Modifier.height(4.dp))
                                Text(
                                    kbi.value,
                                    fontSize = 24.sp,
                                    fontWeight = FontWeight.Black,
                                    color = if (kbi.highlight) Orange600 else Slate800,
                                    fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                                )
                                Spacer(Modifier.height(4.dp))
                                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                    val badgeBg = if (kbi.isPositive) Emerald50 else Rose50
                                    val badgeColor = if (kbi.isPositive) Emerald600 else Rose600
                                    Surface(
                                        color = badgeBg,
                                        shape = RoundedCornerShape(4.dp),
                                        border = BorderStroke(0.5.dp, badgeColor.copy(alpha = 0.3f))
                                    ) {
                                        Text(
                                            " ${kbi.compare} 同比 ",
                                            fontSize = 8.5.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = badgeColor,
                                            modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp)
                                        )
                                    }
                                    Text(kbi.desc, fontSize = 9.5.sp, color = Slate400, fontWeight = FontWeight.Medium)
                                }
                            }

                            Surface(
                                color = if (kbi.highlight) Orange500 else Slate100,
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier.size(44.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Icon(
                                        if (kbi.label.contains("成本率")) Icons.Default.TrendingUp else Icons.Default.Paid,
                                        contentDescription = null,
                                        tint = if (kbi.highlight) Color.White else Slate600,
                                        modifier = Modifier.size(20.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // 2. Trend & Structure Split Row
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(280.dp),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Left Panel: Trend Chart
                Card(
                    modifier = Modifier.weight(1.4f),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = BorderStroke(1.dp, Slate200),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(Modifier.padding(14.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(Modifier.size(3.dp, 12.dp).background(Orange500, RoundedCornerShape(1.dp)))
                            Spacer(Modifier.width(6.dp))
                            Text("人工成本与成本率月度趋势", fontSize = 11.sp, fontWeight = FontWeight.Black, color = Slate800)
                        }
                        Spacer(Modifier.height(14.dp))
                        CustomAreaChart(
                            points = trendPoints,
                            modifier = Modifier.fillMaxSize(),
                            color1 = Blue500,
                            title1 = "人工总成本 (万)"
                        )
                    }
                }

                // Right Panel: Structure Pie Chart
                Card(
                    modifier = Modifier.weight(1f),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = BorderStroke(1.dp, Slate200),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(Modifier.padding(14.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(Modifier.size(3.dp, 12.dp).background(Orange500, RoundedCornerShape(1.dp)))
                            Spacer(Modifier.width(6.dp))
                            Text("人工成本构成分析", fontSize = 11.sp, fontWeight = FontWeight.Black, color = Slate800)
                        }
                        
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .weight(1.2f)
                        ) {
                            CustomPieChart(
                                slices = structureItems.map { PieSlice(it.name, it.value, it.color) },
                                modifier = Modifier.fillMaxSize()
                            )
                        }

                        // Compact legends grid
                        Column(
                            verticalArrangement = Arrangement.spacedBy(6.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                structureItems.take(2).forEach { item ->
                                    CostLegendItem(item, Modifier.weight(1f))
                                }
                            }
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                structureItems.drop(2).forEach { item ->
                                    CostLegendItem(item, Modifier.weight(1f))
                                }
                            }
                        }
                    }
                }
            }
        }

        // 3. Cost Alerts Box
        item {
            Surface(
                color = Color(0xFFFEF2F2),
                border = BorderStroke(1.dp, Rose200),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(Modifier.padding(14.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Error, contentDescription = null, tint = Rose500, modifier = Modifier.size(14.dp))
                        Spacer(Modifier.width(6.dp))
                        Text("成本预警与异常洞察", fontSize = 11.sp, fontWeight = FontWeight.Black, color = Rose800)
                    }

                    Spacer(Modifier.height(8.dp))

                    Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        alerts.forEach { alert ->
                            Surface(
                                color = Color.White.copy(alpha = 0.8f),
                                border = BorderStroke(1.dp, Rose100),
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Row(
                                    modifier = Modifier.padding(10.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Column {
                                        Text(alert.department, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate800)
                                        Text(alert.message, fontSize = 9.sp, color = Rose600, fontWeight = FontWeight.Medium)
                                    }
                                    Text(
                                        alert.value,
                                        fontSize = 11.5.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Rose700,
                                        fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // 4. Department cost table
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = BorderStroke(1.dp, Slate200),
                shape = RoundedCornerShape(12.dp)
            ) {
                Column {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Slate50)
                            .padding(12.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("部门成本明细列表", fontSize = 11.sp, fontWeight = FontWeight.Black, color = Slate800)
                        Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Clock, contentDescription = null, tint = Slate400, modifier = Modifier.size(11.dp))
                                Spacer(Modifier.width(4.dp))
                                Text("总工时: 5,536h", fontSize = 10.sp, color = Slate500, fontWeight = FontWeight.Bold, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace)
                            }
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Paid, contentDescription = null, tint = Orange500, modifier = Modifier.size(11.dp))
                                Spacer(Modifier.width(4.dp))
                                Text("总成本: ¥1,143,800", fontSize = 10.sp, color = Orange600, fontWeight = FontWeight.Black, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace)
                            }
                        }
                    }

                    Box(Modifier.fillMaxWidth().height(1.dp).background(Slate200))

                    // Table headers
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Slate50)
                            .padding(vertical = 8.dp, horizontal = 12.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("核算部门 / 车间", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1.5f))
                        Text("核准工时 (h)", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1f), textAlign = TextAlign.End)
                        Text("单位工时成本", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1.1f), textAlign = TextAlign.End)
                        Text("成本占比", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1.4f), textAlign = TextAlign.Center)
                        Text("人工总成本 (元)", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1.3f), textAlign = TextAlign.End)
                        Text("风险状态", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1f), textAlign = TextAlign.End)
                    }

                    Box(Modifier.fillMaxWidth().height(1.dp).background(Slate200))

                    // Table rows
                    Column {
                        departmentRows.forEach { row ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 10.dp, horizontal = 12.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(row.name, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Slate800, modifier = Modifier.weight(1.5f))
                                Text("${row.hours}", fontSize = 10.sp, color = Slate600, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace, modifier = Modifier.weight(1f), textAlign = TextAlign.End)
                                Text("¥${String.format("%.1f", row.costPerHour)}", fontSize = 10.sp, color = Slate600, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace, modifier = Modifier.weight(1.1f), textAlign = TextAlign.End)
                                
                                // Progress bar for share
                                Row(
                                    modifier = Modifier
                                        .weight(1.4f)
                                        .padding(horizontal = 8.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .weight(1f)
                                            .height(4.dp)
                                            .background(Slate100, CircleShape)
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .fillMaxWidth(row.costShare / 50.0f)
                                                .fillMaxHeight()
                                                .background(Orange500, CircleShape)
                                        )
                                    }
                                    Text("${row.costShare}%", fontSize = 9.sp, color = Slate500, fontWeight = FontWeight.Bold, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace, modifier = Modifier.width(30.dp))
                                }

                                Text("¥${row.laborCost.toInt()}", fontSize = 10.sp, fontWeight = FontWeight.Black, color = Slate800, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace, modifier = Modifier.weight(1.3f), textAlign = TextAlign.End)

                                val (statusText, badgeBg, badgeColor) = when (row.risk) {
                                    "high" -> Triple("高风险", Color(0xFFFEF2F2), Rose600)
                                    "medium" -> Triple("中风险", Color(0xFFFFFBEB), Orange600)
                                    else -> Triple("正常", Color(0xFFECFDF5), Emerald600)
                                }
                                Box(modifier = Modifier.weight(1f), contentAlignment = Alignment.CenterEnd) {
                                    Surface(
                                        color = badgeBg,
                                        shape = RoundedCornerShape(4.dp),
                                        border = BorderStroke(0.5.dp, badgeColor.copy(alpha = 0.3f))
                                    ) {
                                        Text(" $statusText ", fontSize = 8.sp, fontWeight = FontWeight.Bold, color = badgeColor, modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp))
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

@Composable
fun CostLegendItem(item: CostStructureItem, modifier: Modifier = Modifier) {
    Column(modifier = modifier, verticalArrangement = Arrangement.spacedBy(2.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                Modifier
                    .size(6.dp)
                    .background(item.color, CircleShape)
            )
            Spacer(Modifier.width(4.dp))
            Text(item.name, fontSize = 8.5.sp, fontWeight = FontWeight.Bold, color = Slate500, maxLines = 1, overflow = TextOverflow.Ellipsis)
        }
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(item.displayValue, fontSize = 9.5.sp, fontWeight = FontWeight.Bold, color = Slate800, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace)
            Text("${item.percentage}%", fontSize = 8.5.sp, color = Slate400, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace)
        }
    }
}

// Data Models for Position Cost
data class PositionKbi(
    val label: String,
    val value: String,
    val change: String,
    val isPositive: Boolean
)

data class PositionCostRank(
    val position: String,
    val cost: Float
)

data class PositionConcentration(
    val name: String,
    val value: Float,
    val percentage: Float,
    val color: Color
)

data class PositionAnalysisRow(
    val position: String,
    val department: String,
    val headcount: Int,
    val avgCost: Float,
    val unitHourCost: Float,
    val totalCost: Float
)

@Composable
fun PositionCostScreen() {
    val kpis = remember {
        listOf(
            PositionKbi("核心结算岗位总数", "12个", "+2.4%", true),
            PositionKbi("岗位编制总人数", "466人", "+4.8%", false), // Headcount increase is negative for cost, positive for capacity
            PositionKbi("岗位平均时薪", "¥48.5", "+3.2%", false)
        )
    }

    val costRankings = remember {
        listOf(
            PositionCostRank("主厨", 324500f),
            PositionCostRank("洗消员", 248000f),
            PositionCostRank("配送司机", 182400f),
            PositionCostRank("分餐员", 128400f),
            PositionCostRank("切配员", 88900f)
        )
    }

    val concentrations = remember {
        listOf(
            PositionConcentration("主厨", 324500f, 33.3f, Blue500),
            PositionConcentration("洗消员", 248000f, 25.5f, Emerald500),
            PositionConcentration("配送司机", 182400f, 18.7f, Orange500),
            PositionConcentration("分餐员", 128400f, 13.2f, Color(0xFF8B5CF6)),
            PositionConcentration("其他", 88900f, 9.3f, Slate400)
        )
    }

    val analysisRows = remember {
        listOf(
            PositionAnalysisRow("主厨", "学生餐一/二车间", 45, 7211f, 35.5f, 324500f),
            PositionAnalysisRow("洗消员", "后勤清洗组", 120, 2066f, 22.0f, 248000f),
            PositionAnalysisRow("配送司机", "冷链物流仓储", 35, 5211f, 30.5f, 182400f),
            PositionAnalysisRow("分餐员", "学生餐配送一部", 150, 856f, 18.5f, 128400f),
            PositionAnalysisRow("切配员", "初加工车间", 116, 766f, 18.0f, 88900f)
        )
    }

    val COLORS = listOf(Blue500, Emerald500, Orange500, Color(0xFF8B5CF6), Slate400)

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate50)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 32.dp)
    ) {
        // Page Title
        item {
            Column {
                Text(
                    "职位工时成本穿透",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Black,
                    color = Slate900
                )
                Text(
                    "穿透班组级、工序级核心职位的月度人工耗费，指导人员定岗定编与定薪定效。",
                    fontSize = 11.sp,
                    color = Slate400,
                    fontWeight = FontWeight.Medium
                )
            }
        }

        // 1. 3 KBIs Cards Row
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                kpis.forEachIndexed { i, kbi ->
                    Card(
                        modifier = Modifier.weight(1f),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        border = BorderStroke(1.dp, Slate200),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(kbi.label, fontSize = 8.5.sp, color = Slate400, fontWeight = FontWeight.Bold)
                                Spacer(Modifier.height(4.dp))
                                Text(
                                    kbi.value,
                                    fontSize = 18.sp,
                                    fontWeight = FontWeight.Black,
                                    color = Slate800,
                                    fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                                )
                                Spacer(Modifier.height(4.dp))
                                val badgeColor = if (kbi.isPositive) Emerald600 else Rose600
                                Text(
                                    "${kbi.change} 同比",
                                    fontSize = 8.5.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = badgeColor
                                )
                            }

                            Surface(
                                color = Slate50,
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.size(28.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Icon(
                                        imageVector = if (i == 0) Icons.Default.Award
                                        else if (i == 1) Icons.Default.Groups
                                        else Icons.Default.TrendingUp,
                                        contentDescription = null,
                                        tint = if (i == 0) Blue600 else if (i == 1) Emerald600 else Color(0xFF8B5CF6),
                                        modifier = Modifier.size(14.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // 2. Ranking and Concentration Split Row
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(280.dp),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Left Panel: Horizontal Cost Ranking
                Card(
                    modifier = Modifier.weight(1.1f),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = BorderStroke(1.dp, Slate200),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(Modifier.padding(14.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(Modifier.size(3.dp, 12.dp).background(Orange500, RoundedCornerShape(1.dp)))
                            Spacer(Modifier.width(6.dp))
                            Text("各职位累计成本排名", fontSize = 11.sp, fontWeight = FontWeight.Black, color = Slate800)
                        }
                        
                        Spacer(Modifier.height(16.dp))

                        // Render beautiful ranking bars
                        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                            costRankings.forEachIndexed { idx, item ->
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(item.position, fontSize = 9.5.sp, fontWeight = FontWeight.Bold, color = Slate700, modifier = Modifier.width(55.dp))
                                    Box(
                                        modifier = Modifier
                                            .weight(1f)
                                            .height(12.dp)
                                            .background(Slate50, RoundedCornerShape(6.dp))
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .fillMaxWidth(item.cost / 324500f)
                                                .fillMaxHeight()
                                                .background(COLORS[idx % COLORS.size], RoundedCornerShape(6.dp))
                                        )
                                    }
                                    Spacer(Modifier.width(8.dp))
                                    Text("¥${item.cost.toInt()}", fontSize = 9.5.sp, fontWeight = FontWeight.Bold, color = Slate800, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace, modifier = Modifier.width(55.dp))
                                }
                            }
                        }
                    }
                }

                // Right Panel: Concentration analysis
                Card(
                    modifier = Modifier.weight(1.1f),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = BorderStroke(1.dp, Slate200),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(Modifier.padding(14.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(Modifier.size(3.dp, 12.dp).background(Orange500, RoundedCornerShape(1.dp)))
                            Spacer(Modifier.width(6.dp))
                            Text("岗位成本集中度分析", fontSize = 11.sp, fontWeight = FontWeight.Black, color = Slate800)
                        }

                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .weight(1f)
                        ) {
                            CustomPieChart(
                                slices = concentrations.map { PieSlice(it.name, it.value, it.color) },
                                modifier = Modifier.fillMaxSize()
                            )
                        }

                        // Concentration Ratio Bar
                        Column(
                            verticalArrangement = Arrangement.spacedBy(6.dp),
                            modifier = Modifier.padding(top = 8.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text("TOP 5 岗位成本占比", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500)
                                Text("90.7%", fontSize = 10.sp, fontWeight = FontWeight.Black, color = Orange600, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace)
                            }
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(4.dp)
                                    .background(Slate100, CircleShape)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth(0.907f)
                                        .fillMaxHeight()
                                        .background(Orange500, CircleShape)
                                )
                            }

                            // Horizontal micro legends
                            Row(
                                modifier = Modifier.fillMaxWidth().padding(top = 4.dp),
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                concentrations.forEachIndexed { i, c ->
                                    Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                                        Box(Modifier.size(5.dp).background(COLORS[i % COLORS.size], CircleShape))
                                        Spacer(Modifier.width(3.dp))
                                        Text("${c.name} ${c.percentage}%", fontSize = 7.sp, color = Slate500, fontWeight = FontWeight.Medium, maxLines = 1, overflow = TextOverflow.Ellipsis)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // 3. Position cost analysis table
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = BorderStroke(1.dp, Slate200),
                shape = RoundedCornerShape(12.dp)
            ) {
                Column {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Slate50)
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("职位成本明细分析表", fontSize = 11.sp, fontWeight = FontWeight.Black, color = Slate800)
                    }

                    Box(Modifier.fillMaxWidth().height(1.dp).background(Slate200))

                    // Table headers
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Slate50)
                            .padding(vertical = 8.dp, horizontal = 12.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("核心职位", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1f))
                        Text("归属部门", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1.5f), textAlign = TextAlign.Center)
                        Text("编制人数", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1f), textAlign = TextAlign.End)
                        Text("月人均成本", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1.2f), textAlign = TextAlign.End)
                        Text("单位工时成本", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1.2f), textAlign = TextAlign.End)
                        Text("总成本 (元)", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1.3f), textAlign = TextAlign.End)
                    }

                    Box(Modifier.fillMaxWidth().height(1.dp).background(Slate200))

                    // Table rows
                    Column {
                        analysisRows.forEach { row ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 10.dp, horizontal = 12.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(row.position, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Slate800, modifier = Modifier.weight(1f))
                                Text(row.department, fontSize = 10.sp, color = Slate500, modifier = Modifier.weight(1.5f), textAlign = TextAlign.Center, maxLines = 1, overflow = TextOverflow.Ellipsis)
                                Text("${row.headcount}", fontSize = 10.sp, color = Slate600, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace, modifier = Modifier.weight(1f), textAlign = TextAlign.End)
                                Text("¥${row.avgCost.toInt()}", fontSize = 10.sp, color = Slate600, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace, modifier = Modifier.weight(1.2f), textAlign = TextAlign.End)
                                Text("¥${String.format("%.1f", row.unitHourCost)}", fontSize = 10.sp, color = Slate600, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace, modifier = Modifier.weight(1.2f), textAlign = TextAlign.End)
                                Text("¥${row.totalCost.toInt()}", fontSize = 10.sp, fontWeight = FontWeight.Black, color = Slate800, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace, modifier = Modifier.weight(1.3f), textAlign = TextAlign.End)
                            }
                            Box(Modifier.fillMaxWidth().height(0.5.dp).background(Slate100))
                        }
                    }
                }
            }
        }
    }
}
