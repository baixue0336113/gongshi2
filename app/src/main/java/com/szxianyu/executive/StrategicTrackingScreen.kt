package com.szxianyu.executive

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
fun StrategicTrackingScreen() {
    // KBI Data
    val kbis = listOf(
        StrategicKbi("疲劳用工风险综合指数", "42.5", "-8.4% (上周 46.4)", "综合疲劳评估分值", "warning"),
        StrategicKbi("劳务外包红线控制状态", "合规安全", "派遣比 20.4% / 红线 22%", "外包人员合规阈值", "success"),
        StrategicKbi("跨厂区顶岗合规审计率", "100%", "本月无越级顶岗违规", "人员顶岗行为审计", "success")
    )

    // 14 Days Trend Data (Line chart points)
    val trendPoints = listOf(
        ChartPoint("24日", 91.2f, 48f),
        ChartPoint("25日", 92.5f, 45f),
        ChartPoint("26日", 93.1f, 30f),
        ChartPoint("27日", 94.0f, 28f),
        ChartPoint("28日", 93.8f, 43f),
        ChartPoint("29日", 94.5f, 42f),
        ChartPoint("30日", 95.2f, 38f)
    )

    // Focus departments violation indices (Bar chart points)
    val violationBars = listOf(
        BarPoint("方便菜部", 85f),
        BarPoint("学生餐二", 62f),
        BarPoint("冷链配送", 48f),
        BarPoint("学生餐一", 24f),
        BarPoint("净菜生产", 15f)
    )

    // Emergency interventions
    val interventions = listOf(
        InterventionTask("排查：方便菜加工部超时疲劳风险偏高", "王志刚", "高", "超限"),
        InterventionTask("核实：学生餐二车间周末代班漏打卡异常", "徐丽", "中", "警示"),
        InterventionTask("长途疲劳：行车时间超出4小时未修", "赵刚", "中", "警示")
    )

    // Key personnel and anomaly tracking list
    val trackingList = listOf(
        TrackingRow("张强 (学生餐一车间)", "超时疲劳与过度用工", "处理中", "王志刚"),
        TrackingRow("刘开山 (学生餐二车间)", "疑似打卡时间段重叠", "已闭环", "徐丽"),
        TrackingRow("李建国 (学生餐一车间)", "连续无审批加班工作", "处理中", "王志刚")
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
                        "战略合规管理与安全追踪",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Black,
                        color = Slate900
                    )
                    Text(
                        "对派遣用工比例红线、跨区域顶岗越级审批以及车间工伤与超时等合规任务进行跟踪与追踪闭环。",
                        fontSize = 11.sp,
                        color = Slate400,
                        fontWeight = FontWeight.Medium
                    )
                }
                Surface(
                    color = Emerald50,
                    shape = RoundedCornerShape(16.dp),
                    border = BorderStroke(1.dp, Emerald200.copy(alpha = 0.5f))
                ) {
                    Text(
                        " 安全运营天数: 412 天 ",
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        color = Emerald600,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp)
                    )
                }
            }
        }

        // 1. KBI status grid (3 items)
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                kbis.forEach { kbi ->
                    val toneColor = when (kbi.tone) {
                        "success" -> Emerald500
                        "warning" -> Orange500
                        else -> Rose500
                    }
                    val toneBg = when (kbi.tone) {
                        "success" -> Emerald50
                        "warning" -> Orange50
                        else -> Rose50
                    }

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
                                    color = toneBg,
                                    shape = RoundedCornerShape(6.dp)
                                ) {
                                    Box(Modifier.size(16.dp), contentAlignment = Alignment.Center) {
                                        Icon(
                                            Icons.Default.Target,
                                            contentDescription = null,
                                            tint = toneColor,
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
                            Text(kbi.trend, fontSize = 8.5.sp, color = toneColor, fontWeight = FontWeight.Bold)
                            Spacer(Modifier.height(1.dp))
                            Text(kbi.desc, fontSize = 8.sp, color = Slate400, fontWeight = FontWeight.Medium)
                        }
                    }
                }
            }
        }

        // 2. Compliance rate trend Area Chart (近14天)
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
                            Box(Modifier.size(3.dp, 12.dp).background(Blue500, RoundedCornerShape(1.dp)))
                            Spacer(Modifier.width(6.dp))
                            Text("合规指数趋势与安全风险等级 (近 14 天监控)", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Slate900)
                        }
                        Surface(
                            color = Slate100,
                            shape = RoundedCornerShape(4.dp)
                        ) {
                            Text("系统核心指数追踪", fontSize = 8.sp, color = Slate500, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                        }
                    }

                    Spacer(Modifier.height(16.dp))

                    CustomAreaChart(
                        points = trendPoints,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(160.dp),
                        color1 = Blue500,
                        color2 = Rose500,
                        title1 = "安全合规率 (%)",
                        title2 = "生产线预警风险指数"
                    )
                }
            }
        }

        // 3. Double Row: Intervention Tasks & Focus Department Redline Violations Ranking
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Left Column: Emergency Intervention Tasks
                Card(
                    modifier = Modifier.weight(1.2f),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(12.dp),
                    border = BorderStroke(1.dp, Slate200)
                ) {
                    Column(Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(Modifier.size(3.dp, 12.dp).background(Rose500, RoundedCornerShape(1.dp)))
                            Spacer(Modifier.width(6.dp))
                            Text("需紧急干预的审计任务", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Slate900)
                        }

                        Spacer(Modifier.height(16.dp))

                        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                            interventions.forEach { task ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .background(Slate50, RoundedCornerShape(8.dp))
                                        .border(0.5.dp, Slate200, RoundedCornerShape(8.dp))
                                        .padding(12.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Row(
                                        modifier = Modifier.weight(1f),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .size(8.dp)
                                                .background(
                                                    color = if (task.severity == "高") Rose500 else Orange500,
                                                    shape = CircleShape
                                                )
                                        )
                                        Spacer(Modifier.width(10.dp))
                                        Column {
                                            Text(task.title, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Slate800, maxLines = 1, overflow = TextOverflow.Ellipsis)
                                            Spacer(Modifier.height(2.dp))
                                            Text("主责督办人: ${task.owner}", fontSize = 9.sp, color = Slate400, fontWeight = FontWeight.Medium)
                                        }
                                    }

                                    Surface(
                                        color = if (task.severity == "高") Rose50 else Orange50,
                                        shape = RoundedCornerShape(4.dp),
                                        modifier = Modifier.padding(start = 8.dp)
                                    ) {
                                        Text(
                                            text = task.label,
                                            fontSize = 9.sp,
                                            color = if (task.severity == "高") Rose600 else Orange600,
                                            fontWeight = FontWeight.Bold,
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                        )
                                    }
                                }
                            }
                        }
                    }
                }

                // Right Column: Focus Department Redline Violation Indices
                Card(
                    modifier = Modifier.weight(1f),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(12.dp),
                    border = BorderStroke(1.dp, Slate200)
                ) {
                    Column(Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(Modifier.size(3.dp, 12.dp).background(Blue500, RoundedCornerShape(1.dp)))
                            Spacer(Modifier.width(6.dp))
                            Text("重点部门规则触达排行 (违规加权指数)", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Slate900)
                        }

                        Spacer(Modifier.height(16.dp))

                        CustomBarChart(
                            bars = violationBars,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(130.dp),
                            barColor = Blue500
                        )

                        Spacer(Modifier.height(8.dp))
                        Text(
                            text = "* 注：规则违规加权指数代表触犯超时用工、顶岗脱岗等合规控制红线的频数与危害度计分之和。",
                            fontSize = 8.sp,
                            color = Slate400,
                            fontWeight = FontWeight.Medium,
                            textAlign = TextAlign.Center,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            }
        }

        // 4. Focus Personnel Anomaly tracking table
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
                            Box(Modifier.size(3.dp, 12.dp).background(Blue500, RoundedCornerShape(1.dp)))
                            Spacer(Modifier.width(6.dp))
                            Text("重点人员与异常事项追踪列表", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Slate900)
                        }
                        Text("高风险台账闭环管理", fontSize = 8.sp, color = Slate400, fontWeight = FontWeight.Bold)
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
                        Text("追踪对象 (所属车间)", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1.5f))
                        Text("关联异常事项", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1.5f))
                        Text("当前审计阶段", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1f), textAlign = TextAlign.Center)
                        Text("跟进督办责任人", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1f), textAlign = TextAlign.End)
                    }

                    Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(Slate200))

                    Column {
                        trackingList.forEach { row ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 10.dp, horizontal = 12.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(row.target, fontSize = 10.sp, color = Slate800, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1.5f))
                                Text(row.issue, fontSize = 10.sp, color = Slate600, fontWeight = FontWeight.Medium, modifier = Modifier.weight(1.5f))

                                Box(
                                    modifier = Modifier.weight(1f),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Surface(
                                        color = if (row.stage == "已闭环") Emerald50 else Blue50,
                                        shape = RoundedCornerShape(4.dp)
                                    ) {
                                        Text(
                                            text = row.stage,
                                            fontSize = 8.5.sp,
                                            color = if (row.stage == "已闭环") Emerald600 else Blue600,
                                            fontWeight = FontWeight.Bold,
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                        )
                                    }
                                }

                                Text(
                                    text = row.handler,
                                    fontSize = 10.sp,
                                    color = Slate500,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.weight(1f),
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

// --- Data Models for Strategic Tracking Screen ---

data class StrategicKbi(
    val label: String,
    val value: String,
    val trend: String,
    val desc: String,
    val tone: String
)

data class InterventionTask(
    val title: String,
    val owner: String,
    val severity: String,
    val label: String
)

data class TrackingRow(
    val target: String,
    val issue: String,
    val stage: String,
    val handler: String
)
