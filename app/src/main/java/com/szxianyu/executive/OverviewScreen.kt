package com.szxianyu.executive

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowDownward
import androidx.compose.material.icons.filled.ArrowUpward
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.szxianyu.executive.data.XianyuRepository
import com.szxianyu.executive.data.models.DashboardResponse
import com.szxianyu.executive.ui.theme.*

@Composable
fun OverviewScreen(repo: XianyuRepository, token: String) {
    var dashboardData by remember { mutableStateOf<DashboardResponse?>(null) }
    var isLoading by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        isLoading = true
        dashboardData = repo.getDashboard(token, "2026-07-02")
        isLoading = false
    }

    if (isLoading) {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator(color = Orange500)
        }
    } else {
        val summary = dashboardData?.summary
        
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // KPI Summary Cards
            item {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                    KPICard("员工总数", summary?.total_staff?.toString() ?: "342", "+1.2%", true, Modifier.weight(1f))
                    KPICard("生产工时", summary?.production_hours?.toString() ?: "2,804", "+3.5%", true, Modifier.weight(1f))
                    KPICard("出勤率", "${summary?.attendance_rate ?: 96.5}%", "+2.1%", true, Modifier.weight(1f))
                    KPICard("人均工时", summary?.avg_hours?.toString() ?: "8.2", "-1.2%", false, Modifier.weight(1f))
                }
            }
            
            item {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                    KPICard("人工成本", "¥${summary?.labor_cost ?: 87800}", "+2.8%", false, Modifier.weight(1f))
                    KPICard("成本率", "${summary?.labor_cost_rate ?: 22.4}%", "-1.5%", true, Modifier.weight(1f))
                    KPICard("单位工时成本", "¥${summary?.unit_hour_labor_cost ?: 31.3}", "+0.8%", false, Modifier.weight(1f))
                    KPICard("工时覆盖率", "94.2%", "+1.5%", true, Modifier.weight(1f))
                }
            }

            // Section: Department Load
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(Modifier.padding(16.dp)) {
                        Text("核心用工负荷分布", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Spacer(Modifier.height(16.dp))
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                            LoadBar("职员", 360, 45, 85, Modifier.weight(1f))
                            LoadBar("自有员工", 1480, 180, 102, Modifier.weight(1f))
                            LoadBar("小时工", 964, 117, 112, Modifier.weight(1f))
                        }
                    }
                }
            }

            // Section: Real-time Alert
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFFEF2F2)),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFFEE2E2))
                ) {
                    Row(Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                        Surface(color = Color(0xFFEF4444), shape = RoundedCornerShape(4.dp)) {
                            Text("高风险预警", color = Color.White, fontSize = 10.sp, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                        }
                        Spacer(Modifier.width(12.dp))
                        Text("当前有 48 名员工存在超时疲劳风险，主要集中在方便菜加工部。", color = Color(0xFF991B1B), fontSize = 12.sp)
                    }
                }
            }
        }
    }
}

@Composable
fun KPICard(label: String, value: String, compare: String, isPositive: Boolean, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(Modifier.padding(16.dp)) {
            Text(label, color = Slate500, fontSize = 12.sp)
            Spacer(Modifier.height(8.dp))
            Text(value, color = Slate900, fontSize = 20.sp, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(4.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    if (compare.startsWith("+")) Icons.Default.ArrowUpward else Icons.Default.ArrowDownward,
                    contentDescription = null,
                    tint = if (isPositive) Emerald500 else Rose500,
                    modifier = Modifier.size(10.dp)
                )
                Text(
                    compare,
                    color = if (isPositive) Emerald500 else Rose500,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(" 较昨日", color = Slate400, fontSize = 10.sp)
            }
        }
    }
}

@Composable
fun LoadBar(label: String, hours: Int, people: Int, percent: Int, modifier: Modifier = Modifier) {
    Column(modifier) {
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text(label, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
            Text("$percent%", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = if (percent > 100) Rose500 else Slate900)
        }
        Spacer(Modifier.height(8.dp))
        Box(modifier = Modifier.fillMaxWidth().height(8.dp).background(Slate100, RoundedCornerShape(4.dp))) {
            Box(
                modifier = Modifier
                    .fillMaxWidth(minOf(1f, percent / 100f))
                    .fillMaxHeight()
                    .background(if (percent > 100) Rose500 else Blue500, RoundedCornerShape(4.dp))
            )
        }
        Spacer(Modifier.height(8.dp))
        Text("$hours 小时 | $people 人", color = Slate500, fontSize = 10.sp)
    }
}
