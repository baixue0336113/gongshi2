package com.szxianyu.executive

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.szxianyu.executive.ui.*
import com.szxianyu.executive.ui.theme.*

@Composable
fun EfficiencyScreen() {
    // KPI Data matching Web mainKPIs
    val mainKPIs = listOf(
        EfficiencyKbi("人均毛利 (月度)", "¥15,480", "+12.4%", "总毛利 / 总实开工人数", true),
        EfficiencyKbi("支撑成本率", "18.2%", "-3.5%", "支持部门总成本 / 业务部门总毛利", false),
        EfficiencyKbi("薪资毛利比", "2.15", "+5.2%", "业务总毛利 / 业务总薪金总额", true)
    )

    // Trend points
    val trendPoints = listOf(
        ChartPoint("24日", 12400f, 19.5f),
        ChartPoint("25日", 13500f, 19.2f),
        ChartPoint("26日", 14200f, 18.8f),
        ChartPoint("27日", 13100f, 18.5f),
        ChartPoint("28日", 11800f, 18.2f),
        ChartPoint("29日", 14900f, 18.1f),
        ChartPoint("30日", 15480f, 18.2f)
    )

    // Business department ranking bars
    val rankingBars = listOf(
        BarPoint("方便菜部", 82f),
        BarPoint("学生餐二", 75f),
        BarPoint("学生餐一", 68f),
        BarPoint("物流配送", 54f),
        BarPoint("净菜生产", 42f)
    )

    // Support department rows
    val supportRows = listOf(
        SupportRowItem("物流配送中心", 125000, 680000, 18.3f, "1:5.44"),
        SupportRowItem("冷链仓储部", 84000, 390000, 21.5f, "1:4.64"),
        SupportRowItem("质量控制处", 42000, 250000, 16.8f, "1:5.95")
    )

    // Functional department rows
    val functionalRows = listOf(
        FunctionalRowItem("人力资源与排班组", 85, 4, 112f),
        FunctionalRowItem("行政后勤支持组", 72, 3, 95f),
        FunctionalRowItem("财务与结算处", 90, 5, 125f)
    )

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate50)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 32.dp)
    ) {
        // Page Title & Header
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        "生产经营效率与支撑分析",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Black,
                        color = Slate900
                    )
                    Text(
                        "追踪二级业务车间薪资毛利效能，量化职能支持部门负荷比与单位支撑价值。",
                        fontSize = 11.sp,
                        color = Slate400,
                        fontWeight = FontWeight.Medium
                    )
                }
                Surface(
                    color = Blue50,
                    shape = RoundedCornerShape(16.dp),
                    border = BorderStroke(1.dp, Blue200.copy(alpha = 0.5f))
                ) {
                    Text(
                        " 经营等级: A- 卓越 ",
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        color = Blue600,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp)
                    )
                }
            }
        }

        // 1. Efficiency KBIs Grid
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                mainKPIs.forEachIndexed { idx, kbi ->
                    Card(
                        modifier = Modifier.weight(1f),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        shape = RoundedCornerShape(12.dp),
                        border = BorderStroke(1.dp, Slate200)
                    ) {
                        Column(Modifier.padding(14.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(kbi.label, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate400)
                                Surface(
                                    color = when (idx) {
                                        0 -> Emerald50
                                        1 -> Blue50
                                        else -> Orange50
                                    },
                                    shape = RoundedCornerShape(6.dp)
                                ) {
                                    Box(Modifier.size(16.dp), contentAlignment = Alignment.Center) {
                                        Icon(
                                            imageVector = when (idx) {
                                                0 -> Icons.Default.AttachMoney
                                                1 -> Icons.Default.CheckCircle
                                                else -> Icons.Default.TrendingUp
                                            },
                                            contentDescription = null,
                                            tint = when (idx) {
                                                0 -> Emerald500
                                                1 -> Blue500
                                                else -> Orange500
                                            },
                                            modifier = Modifier.size(10.dp)
                                        )
                                    }
                                }
                            }
                            Spacer(Modifier.height(8.dp))
                            Text(
                                text = kbi.value,
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Black,
                                color = Slate800,
                                fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                            )
                            Spacer(Modifier.height(2.dp))
                            Text(
                                text = "${kbi.compare} 同比",
                                fontSize = 8.5.sp,
                                color = if (kbi.isPositive) Emerald600 else Rose600,
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(Modifier.height(4.dp))
                            Text(
                                text = "公式: " + kbi.formula,
                                fontSize = 7.5.sp,
                                color = Slate400,
                                fontWeight = FontWeight.Medium,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                        }
                    }
                }
            }
        }

        // 2. Middle Row: Trend Chart and Department Ranking Bar Chart
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Left Column: Trend Area Chart
                Card(
                    modifier = Modifier.weight(1.2f),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(12.dp),
                    border = BorderStroke(1.dp, Slate200)
                ) {
                    Column(Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(Modifier.size(3.dp, 12.dp).background(Orange500, RoundedCornerShape(1.dp)))
                            Spacer(Modifier.width(6.dp))
                            Text("经营效率趋势 (人均毛利与支撑成本率)", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Slate900)
                        }

                        Spacer(Modifier.height(16.dp))

                        CustomAreaChart(
                            points = trendPoints,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(160.dp),
                            color1 = Emerald500,
                            color2 = Orange500,
                            title1 = "人均毛利 (¥)",
                            title2 = "支撑成本率 (%)"
                        )
                    }
                }

                // Right Column: Bar Chart Ranking
                Card(
                    modifier = Modifier.weight(1f),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(12.dp),
                    border = BorderStroke(1.dp, Slate200)
                ) {
                    Column(Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(Modifier.size(3.dp, 12.dp).background(Orange500, RoundedCornerShape(1.dp)))
                            Spacer(Modifier.width(6.dp))
                            Text("业务部门薪资毛利效率排名 (比值)", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Slate900)
                        }

                        Spacer(Modifier.height(16.dp))

                        CustomBarChart(
                            bars = rankingBars,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(160.dp),
                            barColor = Orange500
                        )
                    }
                }
            }
        }

        // 3. Support Department Efficiency Contrast Table
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
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
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(Modifier.size(3.dp, 12.dp).background(Orange500, RoundedCornerShape(1.dp)))
                            Spacer(Modifier.width(6.dp))
                            Text("支持与职能部门负荷及效能对比表", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Slate900)
                        }
                        Text("全厂支持及行政审计", fontSize = 8.sp, color = Slate400, fontWeight = FontWeight.Bold)
                    }

                    Spacer(Modifier.height(12.dp))

                    // Table Header
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Slate50, RoundedCornerShape(4.dp))
                            .padding(vertical = 8.dp, horizontal = 12.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("职能 / 支持部门", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1.5f))
                        Text("支撑人工成本", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1.2f), textAlign = TextAlign.Center)
                        Text("关联业务价值 / 负荷得分", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(2f))
                        Text("时效比 / 编制人员", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1.2f), textAlign = TextAlign.Center)
                        Text("单位支撑值 / 满载负荷", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1.2f), textAlign = TextAlign.End)
                    }

                    Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(Slate200))

                    // Render Support Rows (Financial tracking)
                    supportRows.forEach { row ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 10.dp, horizontal = 12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(row.name, fontSize = 10.sp, color = Slate800, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1.5f))
                            Text("¥${row.cost}", fontSize = 10.sp, color = Slate600, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace, modifier = Modifier.weight(1.2f), textAlign = TextAlign.Center)
                            Text("¥${row.value}", fontSize = 10.sp, color = Emerald600, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace, modifier = Modifier.weight(2f))
                            Text("${row.ratio}%", fontSize = 10.sp, color = Orange600, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1.2f), textAlign = TextAlign.Center)
                            Text(row.unitSupport, fontSize = 10.sp, color = Slate800, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace, modifier = Modifier.weight(1.2f), textAlign = TextAlign.End)
                        }
                        Box(modifier = Modifier.fillMaxWidth().height(0.5.dp).background(Slate100))
                    }

                    // Render Functional Rows (Administrative workload tracking)
                    functionalRows.forEach { row ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Color(0xFFFAFBFD))
                                .padding(vertical = 10.dp, horizontal = 12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("${row.name} (职能)", fontSize = 10.sp, color = Slate500, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1.5f))
                            Text("-", fontSize = 10.sp, color = Slate400, modifier = Modifier.weight(1.2f), textAlign = TextAlign.Center)
                            Text("考核得分: ${row.score}分", fontSize = 10.sp, color = Slate500, fontWeight = FontWeight.Medium, modifier = Modifier.weight(2f))
                            Text("编制人员: ${row.staff}人", fontSize = 10.sp, color = Slate500, fontWeight = FontWeight.Medium, modifier = Modifier.weight(1.2f), textAlign = TextAlign.Center)
                            Text("${row.loadRatio}% 负荷", fontSize = 10.sp, color = Slate700, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1.2f), textAlign = TextAlign.End)
                        }
                        Box(modifier = Modifier.fillMaxWidth().height(0.5.dp).background(Slate100))
                    }

                    Spacer(Modifier.height(8.dp))
                    Text(
                        text = "* 支撑人工成本通过实际考勤分配计入支持部门；单位支撑值代表每 1 元支撑人工成本拉动的关联生产车间总毛利比。",
                        fontSize = 8.sp,
                        color = Slate400,
                        fontWeight = FontWeight.Medium,
                        modifier = Modifier.padding(horizontal = 12.dp)
                    )
                }
            }
        }
    }
}

// --- Helper Data Classes ---

data class EfficiencyKbi(
    val label: String,
    val value: String,
    val compare: String,
    val formula: String,
    val isPositive: Boolean
)

data class SupportRowItem(
    val name: String,
    val cost: Int,
    val value: Int,
    val ratio: Float,
    val unitSupport: String
)

data class FunctionalRowItem(
    val name: String,
    val score: Int,
    val staff: Int,
    val loadRatio: Float
)
