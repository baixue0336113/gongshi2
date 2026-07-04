package com.szxianyu.executive

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
fun RiskControlScreen() {
    // KBI Data
    val kbis = listOf(
        RiskKbi("风险综合评分", "82 分", "高危警戒线: 80", Rose500, Color(0xFFFEF2F2)),
        RiskKbi("高风险项", "3 个", "涉及 1 个车间", Rose500, Color(0xFFFEF2F2)),
        RiskKbi("中风险项", "4 个", "涉及 2 个车间", Orange500, Color(0xFFFFFBEB)),
        RiskKbi("待闭环预警", "12 项", "均已下发排查单", Blue500, Color(0xFFEFF6FF))
    )

    // Heatmap data points for ScatterChart (x: average_hours, y: score)
    val scatterPoints = listOf(
        ScatterPoint(8.0f, 15f, "学生餐一车间", Emerald500),
        ScatterPoint(10.0f, 85f, "方便菜加工部", Rose500),
        ScatterPoint(7.78f, 12f, "学生餐一车间", Emerald500),
        ScatterPoint(10.28f, 88f, "方便菜加工部", Rose500),
        ScatterPoint(9.0f, 55f, "学生餐二车间", Orange500),
        ScatterPoint(10.78f, 92f, "方便菜加工部", Rose500),
        ScatterPoint(8.2f, 22f, "冷链物流仓储", Emerald500),
        ScatterPoint(7.5f, 10f, "净菜生产线", Emerald500)
    )

    // Worsening TOP3
    val worseningTop = listOf(
        WorseningItem("方便菜加工部", "连续超时疲劳作业", "+45.2%"),
        WorseningItem("学生餐二车间", "代班漏打卡异常", "+28.5%"),
        WorseningItem("校园餐饮客服组", "跨班次换岗频繁", "+12.4%")
    )

    // Abnormal Hours Trend (7 Days Area Chart)
    val trendPoints = listOf(
        ChartPoint("24日", 45f, 102f),
        ChartPoint("25日", 52f, 110f),
        ChartPoint("26日", 48f, 105f),
        ChartPoint("27日", 15f, 60f),
        ChartPoint("28日", 10f, 40f),
        ChartPoint("29日", 55f, 110f),
        ChartPoint("30日", 62f, 115f)
    )

    // Detailed warnings list
    val alertsDetail = listOf(
        AlertDetailRow("超时作业疲劳风险", "方便菜加工部", "日人均工时连续5天突破10.5h", "高", "待处理", "10:30"),
        AlertDetailRow("无审批打卡异常", "方便菜加工部", "32名小时工打卡无计划排班比对", "中", "待处理", "09:15"),
        AlertDetailRow("漏刷卡及代签率", "学生餐二车间", "考勤代打卡疑似度升高，核验未通过", "中", "待处理", "08:45"),
        AlertDetailRow("连续排班无休", "学生餐二车间", "部分班组人员连续工作满12天未休息", "中", "待处理", "08:12"),
        AlertDetailRow("健康证效期预警", "方便菜加工部", "2名库房包装员工健康证即将到期", "低", "待处理", "07:30")
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
                        "智能风险管控与异常预警",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Black,
                        color = Slate900
                    )
                    Text(
                        "基于用工规则引擎实时监控疲劳作业、异常打卡与资质合规性等潜在合规风险。",
                        fontSize = 11.sp,
                        color = Slate400,
                        fontWeight = FontWeight.Medium
                    )
                }
                Surface(
                    color = Rose50,
                    shape = RoundedCornerShape(16.dp),
                    border = BorderStroke(1.dp, Rose200.copy(alpha = 0.5f))
                ) {
                    Text(
                        " 风险状态: 橙色警告 ",
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        color = Rose600,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp)
                    )
                }
            }
        }

        // 1. Risk KBI Cards Grid
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                kbis.forEach { kbi ->
                    Card(
                        modifier = Modifier.weight(1f),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        shape = RoundedCornerShape(12.dp),
                        border = BorderStroke(1.dp, Slate200)
                    ) {
                        Column(Modifier.padding(12.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(kbi.title, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate400)
                                Surface(
                                    color = kbi.bg,
                                    shape = RoundedCornerShape(6.dp)
                                ) {
                                    Box(Modifier.size(16.dp), contentAlignment = Alignment.Center) {
                                        Icon(
                                            Icons.Default.Shield,
                                            contentDescription = null,
                                            tint = kbi.color,
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
                            Text(kbi.desc, fontSize = 8.5.sp, color = Slate400, fontWeight = FontWeight.Medium)
                        }
                    }
                }
            }
        }

        // 2. Middle Row: Heatmap Scatter Chart & Deterioration Top 3
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Left Column: Department Compliance Risk Quadrant Scatter Plot
                Card(
                    modifier = Modifier.weight(1.5f),
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
                                Box(Modifier.size(3.dp, 12.dp).background(Rose500, RoundedCornerShape(1.dp)))
                                Spacer(Modifier.width(6.dp))
                                Text("部门合规风险热力分布 (工时 vs 风险分)", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Slate900)
                            }
                            Text("四象限决策网格", fontSize = 8.sp, color = Slate400, fontWeight = FontWeight.Bold)
                        }

                        Spacer(Modifier.height(16.dp))

                        CustomScatterChart(
                            points = scatterPoints,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(180.dp)
                        )

                        Spacer(Modifier.height(8.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("⬅ 偏低工作负荷（7h）", fontSize = 8.sp, color = Slate400, fontWeight = FontWeight.Bold)
                            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                                LegendDot("高危区", Rose500)
                                LegendDot("警示区", Orange500)
                                LegendDot("健康区", Emerald500)
                            }
                            Text("偏高过度用工（11h）➔", fontSize = 8.sp, color = Slate400, fontWeight = FontWeight.Bold)
                        }
                    }
                }

                // Right Column: Today's Risk Deterioration TOP 3
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
                            Text("今日风险恶化 TOP 3 车间", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Slate900)
                        }

                        Spacer(Modifier.height(16.dp))

                        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                            worseningTop.forEachIndexed { idx, item ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .background(Slate50, RoundedCornerShape(8.dp))
                                        .border(0.5.dp, Slate200, RoundedCornerShape(8.dp))
                                        .padding(12.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Surface(
                                            color = if (idx == 0) Rose50 else Orange50,
                                            shape = CircleShape
                                        ) {
                                            Box(Modifier.size(24.dp), contentAlignment = Alignment.Center) {
                                                Text(
                                                    text = (idx + 1).toString(),
                                                    fontSize = 11.sp,
                                                    fontWeight = FontWeight.Bold,
                                                    color = if (idx == 0) Rose600 else Orange600
                                                )
                                            }
                                        }
                                        Spacer(Modifier.width(10.dp))
                                        Column {
                                            Text(item.name, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Slate800)
                                            Spacer(Modifier.height(2.dp))
                                            Text(item.factor, fontSize = 9.sp, color = Slate500, fontWeight = FontWeight.Medium)
                                        }
                                    }

                                    Column(horizontalAlignment = Alignment.End) {
                                        Text(
                                            text = item.rate,
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.ExtraBold,
                                            color = if (idx == 0) Rose600 else Orange600,
                                            fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                                        )
                                        Text("较昨日", fontSize = 7.5.sp, color = Slate400, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // 3. Abnormal Work Hours Trend Line Chart
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
                            Box(Modifier.size(3.dp, 12.dp).background(Rose500, RoundedCornerShape(1.dp)))
                            Spacer(Modifier.width(6.dp))
                            Text("全厂异常工时趋势 (近 7 天对账监控)", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Slate900)
                        }
                        Surface(
                            color = Slate100,
                            shape = RoundedCornerShape(4.dp)
                        ) {
                            Text("每日实存异常工时数", fontSize = 8.sp, color = Slate500, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                        }
                    }

                    Spacer(Modifier.height(16.dp))

                    CustomAreaChart(
                        points = trendPoints,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(160.dp),
                        color1 = Rose500,
                        color2 = Blue500,
                        title1 = "每日疑似异常工时数 (h)",
                        title2 = "全厂核定参考工时 (h)"
                    )
                }
            }
        }

        // 4. Detailed Risks Log Table
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
                            Box(Modifier.size(3.dp, 12.dp).background(Rose500, RoundedCornerShape(1.dp)))
                            Spacer(Modifier.width(6.dp))
                            Text("风险预警明细列表", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Slate900)
                        }
                        Text("全量异常台账明细", fontSize = 8.sp, color = Slate400, fontWeight = FontWeight.Bold)
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
                        Text("风险类型", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1.5f))
                        Text("涉及部门", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1.2f), textAlign = TextAlign.Center)
                        Text("风险描述", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(2.5f))
                        Text("严重度", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(0.8f), textAlign = TextAlign.Center)
                        Text("状态", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(0.8f), textAlign = TextAlign.Center)
                        Text("发现时间", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(0.8f), textAlign = TextAlign.End)
                    }

                    Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(Slate200))

                    Column {
                        alertsDetail.forEach { row ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 10.dp, horizontal = 12.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(row.type, fontSize = 10.sp, color = Slate800, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1.5f))
                                Text(row.dept, fontSize = 10.sp, color = Slate600, fontWeight = FontWeight.Medium, modifier = Modifier.weight(1.2f), textAlign = TextAlign.Center)
                                Text(row.desc, fontSize = 10.sp, color = Slate400, fontWeight = FontWeight.Medium, modifier = Modifier.weight(2.5f), maxLines = 1, overflow = TextOverflow.Ellipsis)

                                Surface(
                                    color = when (row.severity) {
                                        "高" -> Rose50
                                        "中" -> Orange50
                                        else -> Blue50
                                    },
                                    shape = RoundedCornerShape(4.dp),
                                    modifier = Modifier.weight(0.8f).wrapContentWidth(Alignment.CenterHorizontally)
                                ) {
                                    Text(
                                        text = row.severity,
                                        fontSize = 8.5.sp,
                                        color = when (row.severity) {
                                            "高" -> Rose600
                                            "中" -> Orange600
                                            else -> Blue600
                                        },
                                        fontWeight = FontWeight.Bold,
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                    )
                                }

                                Surface(
                                    color = Rose500,
                                    shape = RoundedCornerShape(4.dp),
                                    modifier = Modifier.weight(0.8f).wrapContentWidth(Alignment.CenterHorizontally)
                                ) {
                                    Text(
                                        text = row.status,
                                        fontSize = 8.5.sp,
                                        color = Color.White,
                                        fontWeight = FontWeight.Bold,
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                    )
                                }

                                Text(
                                    text = row.time,
                                    fontSize = 9.5.sp,
                                    color = Slate400,
                                    fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.weight(0.8f),
                                    textAlign = TextAlign.End
                                )
                            }
                            Box(modifier = Modifier.fillMaxWidth().height(0.5.dp).background(Slate100))
                        }
                    }
                }
            }
        }
    }
}

// --- Helper Data Classes ---

data class RiskKbi(
    val title: String,
    val value: String,
    val desc: String,
    val color: Color,
    val bg: Color
)

data class WorseningItem(
    val name: String,
    val factor: String,
    val rate: String
)

data class AlertDetailRow(
    val type: String,
    val dept: String,
    val desc: String,
    val severity: String,
    val status: String,
    val time: String
)

@Composable
fun LegendDot(label: String, color: Color) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Box(
            Modifier
                .size(6.dp)
                .background(color, CircleShape))
        Spacer(Modifier.width(4.dp))
        Text(label, fontSize = 8.sp, color = Slate500, fontWeight = FontWeight.Bold)
    }
}
