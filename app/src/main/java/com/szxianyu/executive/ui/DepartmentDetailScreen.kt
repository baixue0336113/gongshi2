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

data class DepartmentItem(
    val department_id: String,
    val department_name: String,
    val headcount: Int,
    val manager: String,
    val total_hours: Int,
    val avg_hours: Float,
    val overtime_hours: Int,
    val rule_status: String,
    val trend: List<Float>
)

@Composable
fun DepartmentDetailScreen() {
    val departments = remember {
        listOf(
            DepartmentItem("dept-01", "学生餐一车间", 115, "张文明", 1220, 8.5f, 45, "warning", listOf(70f, 75f, 72f, 85f)),
            DepartmentItem("dept-02", "学生餐二车间", 124, "王五", 2480, 9.4f, 88, "danger", listOf(75f, 82f, 79f, 88f)),
            DepartmentItem("dept-03", "方便菜加工部", 98, "李建国", 980, 10.2f, 142, "danger", listOf(80f, 95f, 92f, 110f)),
            DepartmentItem("dept-04", "冷链物流仓储", 62, "赵国华", 496, 7.8f, 12, "normal", listOf(50f, 48f, 52f, 50f)),
            DepartmentItem("dept-05", "净菜生产线", 45, "孙大伟", 360, 8.0f, 8, "normal", listOf(40f, 42f, 41f, 43f)),
            DepartmentItem("dept-06", "行政后勤部", 22, "钱丽丽", 176, 7.5f, 0, "normal", listOf(20f, 22f, 20f, 21f))
        )
    }

    var selectedDeptId by remember { mutableStateOf(departments[0].department_id) }
    val activeDept = remember(selectedDeptId) {
        departments.find { it.department_id == selectedDeptId } ?: departments[0]
    }

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
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        "生产组织及班组穿透审计",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Black,
                        color = Slate900
                    )
                    Text(
                        "纵向穿透车间在岗、工时、溢出加班指标，横向多维对比组织能效红线违规。",
                        fontSize = 11.sp,
                        color = Slate400,
                        fontWeight = FontWeight.Medium
                    )
                }
                Surface(
                    color = Orange50,
                    shape = RoundedCornerShape(16.dp),
                    border = BorderStroke(1.dp, Orange200.copy(alpha = 0.5f))
                ) {
                    Text(
                        " 实开工率: 94.2% ",
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        color = Orange600,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp)
                    )
                }
            }
        }

        // 1. Upper Split View: List & Detail Row (Height-bounded for split feel)
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(350.dp),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Left Column: List Pane (2/5 weight)
                Card(
                    modifier = Modifier.weight(1f),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(12.dp),
                    border = BorderStroke(1.dp, Slate200)
                ) {
                    Column(Modifier.padding(14.dp)) {
                        Text(
                            "生产组织及班组穿透清单",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate800,
                            modifier = Modifier.padding(bottom = 10.dp)
                        )
                        
                        LazyColumn(
                            modifier = Modifier.fillMaxSize(),
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            items(departments) { dept ->
                                val isSelected = dept.department_id == selectedDeptId
                                val borderStroke = if (isSelected) BorderStroke(1.2.dp, Orange500) else BorderStroke(1.dp, Slate200)
                                val bg = if (isSelected) Slate50 else Color.White

                                Card(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable { selectedDeptId = dept.department_id },
                                    colors = CardDefaults.cardColors(containerColor = bg),
                                    border = borderStroke,
                                    shape = RoundedCornerShape(8.dp)
                                ) {
                                    Row(
                                        modifier = Modifier.padding(10.dp),
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Row(
                                            modifier = Modifier.weight(1f),
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Surface(
                                                color = if (isSelected) Orange500 else Slate100,
                                                shape = RoundedCornerShape(8.dp),
                                                modifier = Modifier.size(28.dp)
                                            ) {
                                                Box(contentAlignment = Alignment.Center) {
                                                    Icon(
                                                        Icons.Default.Groups,
                                                        contentDescription = null,
                                                        tint = if (isSelected) Color.White else Slate500,
                                                        modifier = Modifier.size(14.dp)
                                                    )
                                                }
                                            }
                                            Spacer(Modifier.width(10.dp))
                                            Column {
                                                Text(
                                                    dept.department_name,
                                                    fontSize = 11.5.sp,
                                                    fontWeight = FontWeight.Bold,
                                                    color = Slate800,
                                                    maxLines = 1,
                                                    overflow = TextOverflow.Ellipsis
                                                )
                                                Text(
                                                    "今日在岗: ${dept.headcount}人",
                                                    fontSize = 9.5.sp,
                                                    color = Slate500,
                                                    fontWeight = FontWeight.Medium
                                                )
                                            }
                                        }

                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            StatusBadge(dept.rule_status)
                                            Spacer(Modifier.width(4.dp))
                                            Icon(
                                                Icons.Default.ChevronRight,
                                                contentDescription = null,
                                                tint = if (isSelected) Slate600 else Slate400,
                                                modifier = Modifier.size(12.dp)
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // Right Column: Detail Pane (3/5 weight)
                Card(
                    modifier = Modifier.weight(1.5f),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(12.dp),
                    border = BorderStroke(1.dp, Slate200)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(16.dp),
                        verticalArrangement = Arrangement.SpaceBetween
                    ) {
                        // Header info
                        Column {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Box(Modifier.size(3.dp, 12.dp).background(Orange500, RoundedCornerShape(1.dp)))
                                    Spacer(Modifier.width(6.dp))
                                    Text(
                                        "${activeDept.department_name} · 经营档案",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 13.sp,
                                        color = Slate900
                                    )
                                }
                                StatusBadge(activeDept.rule_status)
                            }

                            // 4 Core KBIs
                            Spacer(Modifier.height(12.dp))
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                KbiItem("车间班长", activeDept.manager, Icons.Default.User, Modifier.weight(1f))
                                KbiItem("日总工时", "${activeDept.total_hours}h", Icons.Default.Clock, Modifier.weight(1f))
                                KbiItem("人均工时", "${activeDept.avg_hours}h", Icons.Default.Clock, Modifier.weight(1f))
                                KbiItem("溢出加班", "${activeDept.overtime_hours}h", Icons.Default.TrendingUp, Modifier.weight(1f), isDanger = activeDept.overtime_hours > 40)
                            }
                        }

                        // Trend Line Area Chart
                        Column {
                            Text(
                                "近4周日均累计工时走势 (周趋势诊断)",
                                fontSize = 9.5.sp,
                                fontWeight = FontWeight.Bold,
                                color = Slate500,
                                modifier = Modifier.padding(bottom = 6.dp)
                            )
                            CustomAreaChart(
                                points = activeDept.trend.mapIndexed { i, val_ -> ChartPoint("W${i+1}", val_) },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(100.dp),
                                color1 = Emerald500,
                                title1 = "周累计工时 (h)"
                            )
                        }

                        // Warning footer
                        Surface(
                            color = when (activeDept.rule_status) {
                                "danger" -> Color(0xFFFEF2F2)
                                "warning" -> Color(0xFFFFFBEB)
                                else -> Color(0xFFECFDF5)
                            },
                            border = BorderStroke(
                                0.5.dp,
                                when (activeDept.rule_status) {
                                    "danger" -> Rose200
                                    "warning" -> Orange200
                                    else -> Emerald200
                                }
                            ),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(10.dp),
                                verticalAlignment = Alignment.Top
                            ) {
                                Icon(
                                    Icons.Default.AlertTriangle,
                                    contentDescription = null,
                                    tint = when (activeDept.rule_status) {
                                        "danger" -> Rose600
                                        "warning" -> Orange600
                                        else -> Emerald600
                                    },
                                    modifier = Modifier.size(13.dp).padding(top = 1.dp)
                                )
                                Spacer(Modifier.width(6.dp))
                                Text(
                                    text = when (activeDept.rule_status) {
                                        "danger" -> "本组加班溢出严重（达 ${activeDept.overtime_hours} 小时）。请合理安排轮班，防范用工安全和疲劳合规风险。"
                                        "warning" -> "工时稍显偏高，部分外包员工有疲劳现象，需关注排班合理性以规避风险。"
                                        else -> "排班配置符合出餐，各项劳工指标皆在安全警戒线内，状态优秀。"
                                    },
                                    fontSize = 9.5.sp,
                                    fontWeight = FontWeight.Medium,
                                    color = when (activeDept.rule_status) {
                                        "danger" -> Rose700
                                        "warning" -> Orange700
                                        else -> Emerald700
                                    }
                                )
                            }
                        }
                    }
                }
            }
        }

        // 2. Lower Horizontal Comparison Matrix (审计矩阵)
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
                            Text(
                                "横向组织效能对比审计矩阵",
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp,
                                color = Slate900
                            )
                        }
                        Surface(
                            color = Slate100,
                            shape = RoundedCornerShape(4.dp)
                        ) {
                            Text(
                                "横向组织效能对比",
                                fontSize = 8.5.sp,
                                color = Slate500,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }
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
                        Text("车间 / 部门", fontSize = 9.5.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1.5f))
                        Text("总工时 (h)", fontSize = 9.5.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1f), textAlign = TextAlign.Center)
                        Text("在岗人数", fontSize = 9.5.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1f), textAlign = TextAlign.Center)
                        Text("人均工时 (h)", fontSize = 9.5.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1f), textAlign = TextAlign.Center)
                        Text("加班工时", fontSize = 9.5.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1f), textAlign = TextAlign.Center)
                        Text("异常人天 (天)", fontSize = 9.5.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1f), textAlign = TextAlign.Center)
                        Text("合规状态", fontSize = 9.5.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1f), textAlign = TextAlign.End)
                    }

                    Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(Slate200))

                    Column {
                        departments.forEach { dept ->
                            val isSelected = dept.department_id == selectedDeptId
                            val rowBg = if (isSelected) Slate50 else Color.White

                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(rowBg)
                                    .clickable { selectedDeptId = dept.department_id }
                                    .padding(vertical = 10.dp, horizontal = 12.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    dept.department_name,
                                    fontSize = 11.sp,
                                    color = Slate800,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                    modifier = Modifier.weight(1.5f)
                                )
                                Text(
                                    "${dept.total_hours}",
                                    fontSize = 11.sp,
                                    color = Slate600,
                                    fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
                                    modifier = Modifier.weight(1f),
                                    textAlign = TextAlign.Center
                                )
                                Text(
                                    "${dept.headcount}人",
                                    fontSize = 11.sp,
                                    color = Slate600,
                                    fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
                                    modifier = Modifier.weight(1f),
                                    textAlign = TextAlign.Center
                                )
                                Text(
                                    "${dept.avg_hours}",
                                    fontSize = 11.sp,
                                    color = Slate600,
                                    fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
                                    modifier = Modifier.weight(1f),
                                    textAlign = TextAlign.Center
                                )
                                Text(
                                    "${dept.overtime_hours}h",
                                    fontSize = 11.sp,
                                    color = if (dept.overtime_hours > 40) Rose600 else Slate600,
                                    fontWeight = FontWeight.Bold,
                                    fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
                                    modifier = Modifier.weight(1f),
                                    textAlign = TextAlign.Center
                                )
                                Text(
                                    "${Math.round(dept.overtime_hours / 40.0) ?: 1}",
                                    fontSize = 11.sp,
                                    color = if (dept.overtime_hours > 40) Orange600 else Slate600,
                                    fontWeight = FontWeight.Bold,
                                    fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
                                    modifier = Modifier.weight(1f),
                                    textAlign = TextAlign.Center
                                )
                                Box(
                                    modifier = Modifier.weight(1f),
                                    contentAlignment = Alignment.CenterEnd
                                ) {
                                    StatusBadge(dept.rule_status)
                                }
                            }
                            Box(modifier = Modifier.fillMaxWidth().height(0.5.dp).background(Slate100))
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun StatusBadge(status: String) {
    val (label, bg, color) = when (status) {
        "danger" -> Triple("🚨 危险过载", Color(0xFFFEF2F2), Rose600)
        "warning" -> Triple("⚠️ 异常核预", Color(0xFFFFFBEB), Orange600)
        else -> Triple("✓ 运行正常", Color(0xFFECFDF5), Emerald600)
    }

    Surface(
        color = bg,
        shape = RoundedCornerShape(4.dp),
        border = BorderStroke(0.5.dp, color.copy(alpha = 0.3f))
    ) {
        Text(
            text = label,
            fontSize = 8.5.sp,
            fontWeight = FontWeight.Bold,
            color = color,
            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
        )
    }
}

@Composable
fun KbiItem(
    label: String,
    value: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    modifier: Modifier = Modifier,
    isDanger: Boolean = false
) {
    Surface(
        color = Slate50,
        shape = RoundedCornerShape(8.dp),
        border = BorderStroke(0.5.dp, Slate200),
        modifier = modifier
    ) {
        Column(
            modifier = Modifier.padding(8.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(label, fontSize = 8.5.sp, color = Slate500, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(4.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    icon,
                    contentDescription = null,
                    tint = if (isDanger) Rose500 else Slate400,
                    modifier = Modifier.size(11.dp)
                )
                Spacer(Modifier.width(4.dp))
                Text(
                    text = value,
                    fontSize = 11.5.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (isDanger) Rose600 else Slate800,
                    fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                )
            }
        }
    }
}
