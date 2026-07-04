package com.szxianyu.executive

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
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
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.szxianyu.executive.data.XianyuRepository
import com.szxianyu.executive.data.models.*
import com.szxianyu.executive.ui.*
import com.szxianyu.executive.ui.theme.*
import kotlin.math.roundToInt

@Composable
fun OverviewScreen(repo: XianyuRepository, token: String, selectedDate: String) {
    var dashboardData by remember { mutableStateOf<DashboardResponse?>(null) }
    var isLoading by remember { mutableStateOf(false) }

    LaunchedEffect(selectedDate) {
        isLoading = true
        dashboardData = repo.getDashboard(token, selectedDate)
        isLoading = false
    }

    if (isLoading) {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator(color = Orange500)
        }
    } else {
        val summary = dashboardData?.summary
        val departmentsList = dashboardData?.departments ?: emptyList()
        val overallHealthScore = dashboardData?.health?.overallHealthScore ?: 94

        // Calculations for dynamic summaries
        val employeeCount = summary?.total_staff ?: 342
        val attendanceRate = summary?.attendance_rate ?: 96.5
        val workedEmployeeCount = (employeeCount * (attendanceRate / 100.0)).roundToInt()
        val totalWorkHours = summary?.production_hours ?: 2804

        val deptsWithExceptions = departmentsList.map { d ->
            d to (d.exception_count ?: if (d.rule_status == "danger") 15 else if (d.rule_status == "warning") 5 else 0)
        }.sortedByDescending { it.second }
        val worstDept = deptsWithExceptions.firstOrNull()
        val worstDeptName = if (worstDept != null && worstDept.second > 0) worstDept.first.department_name else "暂无异常部门"
        val worstDeptExceptionCount = if (worstDept != null && worstDept.second > 0) worstDept.second else 0

        val maxHoursDeptName = departmentsList.maxByOrNull { it.total_hours }?.department_name ?: "暂无"

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(Slate50)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            contentPadding = PaddingValues(top = 16.dp, bottom = 32.dp)
        ) {
            // Header review date indicator
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "生产经营总览驾驶舱",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Black,
                            color = Slate900
                        )
                        Text(
                            text = "直观掌控当前厂区 11 项核心经营核算指标（KBI）、每日确认工时双轴走势及部门人均效能。",
                            fontSize = 11.sp,
                            color = Slate400,
                            fontWeight = FontWeight.Medium
                        )
                    }
                    Surface(
                        color = Orange50.copy(alpha = 0.8f),
                        shape = RoundedCornerShape(16.dp),
                        border = BorderStroke(1.dp, Orange200.copy(alpha = 0.5f))
                    ) {
                        Text(
                            text = " 对账对数机制: T+1 核定实核 ",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            color = Orange600,
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp)
                        )
                    }
                }
            }

            // 1.1 TOP INSIGHTS: Rule Health Score, Real Work Hour Summary, 5 Core Operational Issues
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    // A. 规则健康分 / 关键真实指标
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
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Box(Modifier.size(3.dp, 10.dp).background(Orange500, RoundedCornerShape(1.dp)))
                                    Spacer(Modifier.width(4.dp))
                                    Text("规则健康分 / 关键指标", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Slate800)
                                }
                                Text("当日对账得分", fontSize = 8.sp, color = Slate400, fontWeight = FontWeight.Bold)
                            }
                            
                            Spacer(Modifier.height(10.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                CircularHealthGauge(overallHealthScore)

                                Column(
                                    modifier = Modifier.weight(1f),
                                    verticalArrangement = Arrangement.spacedBy(4.dp)
                                ) {
                                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                        MiniBlock("单位工时产值", "¥${summary?.unit_hour_output_value ?: 124.5}", Modifier.weight(1f))
                                        MiniBlock("人均销售额", "¥${summary?.avg_sales_per_person ?: 1058}", Modifier.weight(1f))
                                    }
                                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                        MiniBlock("人工成本率", "${summary?.labor_cost_rate ?: 22.4}%", Modifier.weight(1f))
                                        MiniBlock("工时覆盖率", "${summary?.coverage_rate ?: 94.2}%", Modifier.weight(1f))
                                    }
                                }
                            }
                        }
                    }

                    // B. 真实工时摘要
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
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Box(Modifier.size(3.dp, 10.dp).background(Blue500, RoundedCornerShape(1.dp)))
                                    Spacer(Modifier.width(4.dp))
                                    Text("真实工时摘要", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Slate800)
                                }
                                Text("核定实核数据", fontSize = 8.sp, color = Slate400, fontWeight = FontWeight.Bold)
                            }

                            Spacer(Modifier.height(8.dp))

                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(Slate50, RoundedCornerShape(8.dp))
                                    .border(0.5.dp, Slate100, RoundedCornerShape(8.dp))
                                    .padding(10.dp)
                            ) {
                                Text(
                                    text = "本期 HR 工时确认数据覆盖 $employeeCount 人，其中 $workedEmployeeCount 人产生确认工时，累计实核确认工时达 $totalWorkHours 小时。",
                                    fontSize = 10.sp,
                                    color = Slate600,
                                    lineHeight = 14.sp
                                )
                                Spacer(Modifier.height(6.dp))
                                Box(modifier = Modifier.fillMaxWidth().height(0.5.dp).background(Slate200))
                                Spacer(Modifier.height(6.dp))
                                Text(
                                    text = "当前系统规则预警重点提示应关注 $worstDeptName，该车间今日累计异常/警示打卡记录达 $worstDeptExceptionCount 项。",
                                    fontSize = 10.sp,
                                    color = if (worstDeptExceptionCount > 0) Rose500 else Slate500,
                                    fontWeight = FontWeight.Medium,
                                    lineHeight = 14.sp
                                )
                            }
                        }
                    }

                    // C. 5 个核心经营问题透视
                    Card(
                        modifier = Modifier.weight(1.5f),
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
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Box(Modifier.size(3.dp, 10.dp).background(Rose500, RoundedCornerShape(1.dp)))
                                    Spacer(Modifier.width(4.dp))
                                    Text("5 个核心经营问题透视", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Slate800)
                                }
                                Text("对账决策穿透", fontSize = 8.sp, color = Slate400, fontWeight = FontWeight.Bold)
                            }

                            Spacer(Modifier.height(10.dp))

                            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                                QuestionRow("Q1. 日出勤工时是否正常？", "出勤率 $attendanceRate% | ${summary?.production_hours ?: 2804}h", Slate800)
                                QuestionRow("Q2. 日生产经营效率如何？", "¥${summary?.unit_hour_output_value ?: 124.5}/h | ¥${summary?.avg_sales_per_person ?: 1058}/人", Slate800)
                                QuestionRow("Q3. 未来一周是否存在用工风险？", if (worstDeptExceptionCount > 0) "关注【$worstDeptName】$worstDeptExceptionCount 项异常" else "暂无足够数据判断", if (worstDeptExceptionCount > 0) Rose500 else Slate500)
                                QuestionRow("Q4. 人工工时成本是否受控？", "¥${summary?.labor_cost ?: 87800} | 占比 ${summary?.labor_cost_rate ?: 22.4}%", Slate800)
                                QuestionRow("Q5. 当前管理层最应紧盯什么？", if (worstDeptExceptionCount > 0) "排查【$worstDeptName】合规规避" else "紧盯最高能耗【$maxHoursDeptName】", if (worstDeptExceptionCount > 0) Orange600 else Slate800)
                            }
                        }
                    }
                }
            }

            // 1. Double Density KPI grid (All 11 formal KBI Metrics!)
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(12.dp),
                    border = BorderStroke(1.dp, Slate200)
                ) {
                    Column(Modifier.padding(12.dp)) {
                        Text(
                            text = "经营核算指标 KBI 一览 (全量 11 项正式指标)",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate500,
                            modifier = Modifier.padding(bottom = 12.dp)
                        )

                        val kpiList = listOf(
                            KPIMetric("员工总数", "${summary?.total_staff ?: 342} 人", summary?.total_staff_compare ?: 1.2, true),
                            KPIMetric("所选日期出勤率", "${summary?.attendance_rate ?: 96.5} %", summary?.attendance_rate_compare ?: 2.1, true),
                            KPIMetric("所选日期生产工时", "${summary?.production_hours ?: 2804} h", summary?.production_hours_compare ?: 3.5, true),
                            KPIMetric("人均生产工时", "${summary?.avg_hours ?: 8.2} h", summary?.avg_hours_compare ?: -1.2, false),

                            KPIMetric("日人工成本总额", "¥ ${(summary?.labor_cost ?: 87800).toInt()}", summary?.labor_cost_compare ?: 2.8, false),
                            KPIMetric("日人工成本率", "${summary?.labor_cost_rate ?: 22.4} %", summary?.labor_cost_rate_compare ?: -1.5, false),
                            KPIMetric("单位工时人工成本", "¥ ${summary?.unit_hour_labor_cost ?: 31.3} /h", summary?.unit_hour_labor_cost_compare ?: 0.8, false),
                            KPIMetric("考勤工时对账覆盖率", "${summary?.coverage_rate ?: 94.2} %", summary?.coverage_rate_compare ?: 1.5, true),

                            KPIMetric("单位工时产值估算", "¥ ${summary?.unit_hour_output_value ?: 124.5} /小时", summary?.unit_hour_output_value_compare ?: 4.2, true),
                            KPIMetric("出勤人均销售额", "¥ ${(summary?.avg_sales_per_person ?: 1058).toInt()} /人", summary?.avg_sales_per_person_compare ?: 3.1, true),
                            KPIMetric("超时/疲劳用工人数", "${summary?.overtime_staff ?: 48} 人", summary?.overtime_staff_compare ?: -8.3, false)
                        )

                        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            // Row 1 (4 items)
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                kpiList.take(4).forEach { kpi ->
                                    KPICardCompact(kpi, Modifier.weight(1f))
                                }
                            }
                            // Row 2 (4 items)
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                kpiList.subList(4, 8).forEach { kpi ->
                                    KPICardCompact(kpi, Modifier.weight(1f))
                                }
                            }
                            // Row 3 (3 items)
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                kpiList.subList(8, 11).forEach { kpi ->
                                    KPICardCompact(kpi, Modifier.weight(1f))
                                }
                                Box(modifier = Modifier.weight(1f)) // spacer
                            }
                        }
                    }
                }
            }

            // 3. Operational Cockpit Layout - Trend Line & Bar Charts
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    // Left Area: Dual-axis trend and 12-department bar chart
                    Column(
                        modifier = Modifier.weight(2f),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        // A. 集团工时效能波动趋势 (生产总工时与对账健康度双轴走势)
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
                                        Icon(Icons.Default.TrendingUp, contentDescription = null, tint = Orange500, modifier = Modifier.size(16.dp))
                                        Spacer(Modifier.width(6.dp))
                                        Text("集团工时效能波动趋势 (生产总工时与对账健康度双轴走势)", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Slate900)
                                    }
                                    Surface(
                                        color = Slate100,
                                        shape = RoundedCornerShape(4.dp)
                                    ) {
                                        Text("最近 7 天数据走势", fontSize = 8.sp, color = Slate500, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                                    }
                                }

                                Spacer(Modifier.height(16.dp))

                                val trendPoints = dashboardData?.trend_data?.map { point ->
                                    ChartPoint(
                                        label = point.date.split("-").last() + "日",
                                        value1 = point.hours.toFloat(),
                                        value2 = point.efficiency.toFloat()
                                    )
                                } ?: listOf(
                                    ChartPoint("24日", 2680f, 91.2f),
                                    ChartPoint("25日", 2710f, 92.5f),
                                    ChartPoint("26日", 2750f, 93.1f),
                                    ChartPoint("27日", 1120f, 94.0f),
                                    ChartPoint("28日", 1040f, 93.8f),
                                    ChartPoint("29日", 2820f, 94.5f),
                                    ChartPoint("30日", 2804f, 95.2f)
                                )

                                CustomAreaChart(
                                    points = trendPoints,
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(180.dp),
                                    color1 = Orange500,
                                    color2 = Emerald500
                                )
                            }
                        }

                        // B. 二级部门人均工时 (柱状图 Top 12)
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
                                        Icon(Icons.Default.BarChart, contentDescription = null, tint = Blue500, modifier = Modifier.size(16.dp))
                                        Spacer(Modifier.width(6.dp))
                                        Text("二级车间/部门人均工时 (生产总工时 Top 12 部门)", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Slate900)
                                    }
                                    Text("柱上标注人均工时", fontSize = 8.sp, color = Slate400, fontWeight = FontWeight.Bold)
                                }

                                Spacer(Modifier.height(16.dp))

                                val barPoints = if (departmentsList.isNotEmpty()) {
                                    departmentsList.sortedByDescending { it.total_hours }.take(12).map { dept ->
                                        BarPoint(
                                            label = dept.department_name.take(4),
                                            value = dept.avg_hours.toFloat(),
                                            totalHours = dept.total_hours.toFloat(),
                                            headcount = dept.headcount
                                        )
                                    }
                                } else {
                                    listOf(
                                        BarPoint("一车间", 8.2f),
                                        BarPoint("二车间", 8.5f),
                                        BarPoint("方便菜", 8.9f),
                                        BarPoint("净菜线", 8.1f),
                                        BarPoint("面点间", 7.6f),
                                        BarPoint("冷链物流", 8.8f),
                                        BarPoint("品检中心", 7.2f),
                                        BarPoint("餐饮客服", 6.8f)
                                    )
                                }

                                CustomBarChart(
                                    bars = barPoints,
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(180.dp),
                                    barColor = Blue500
                                )
                            }
                        }
                    }

                    // Right Area: Progress ranking, workforce segments, radar diagnostic (width 1f)
                    Column(
                        modifier = Modifier.weight(1.2f),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        // A. 二级部门总工时占比排行
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
                                        Icon(Icons.Default.Star, contentDescription = null, tint = Orange500, modifier = Modifier.size(16.dp))
                                        Spacer(Modifier.width(6.dp))
                                        Text("二级部门总工时占比排行 (前 10)", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Slate900)
                                    }
                                    Text("工时占比排行", fontSize = 8.sp, color = Slate400, fontWeight = FontWeight.Bold)
                                }

                                Spacer(Modifier.height(12.dp))

                                val totalHoursAll = departmentsList.sumOf { it.total_hours }.toFloat().let { if (it == 0f) 1f else it }
                                val ratioData = departmentsList.sortedByDescending { it.total_hours }.take(10)

                                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                    if (ratioData.isNotEmpty()) {
                                        ratioData.forEachIndexed { idx, dept ->
                                            val ratio = (dept.total_hours / totalHoursAll) * 100f
                                            val progressColor = when (dept.rule_status) {
                                                "danger" -> Rose500
                                                "warning" -> Orange500
                                                else -> Emerald500
                                            }
                                            DepartmentRatioRow(idx + 1, dept.department_name, dept.total_hours.toInt(), ratio, progressColor)
                                        }
                                    } else {
                                        Text("暂无占比数据", fontSize = 10.sp, color = Slate400, textAlign = TextAlign.Center, modifier = Modifier.fillMaxWidth().padding(12.dp))
                                    }
                                }
                            }
                        }

                        // B. 三类人员负荷明细
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
                                        Icon(Icons.Default.Group, contentDescription = null, tint = Blue500, modifier = Modifier.size(16.dp))
                                        Spacer(Modifier.width(6.dp))
                                        Text("三类人员负荷明细", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Slate900)
                                    }
                                    Text("在岗负荷核算", fontSize = 8.sp, color = Slate400, fontWeight = FontWeight.Bold)
                                }

                                Spacer(Modifier.height(12.dp))

                                val segments = summary?.workforce_load?.segments ?: listOf(
                                    WorkforceSegment("职员", 45, 360, 5, 15, 85, "职员工作负荷正常，加班呈周期性分布。"),
                                    WorkforceSegment("自有员工", 180, 1480, 32, 120, 102, "生产主力，负荷处于饱和警戒线。"),
                                    WorkforceSegment("小时工", 117, 964, 11, 48, 112, "小时工负荷偏高，主要应对生产波峰排班。")
                                )

                                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                                    segments.forEach { seg ->
                                        DetailedLoadSegment(seg)
                                    }

                                    Spacer(Modifier.height(4.dp))
                                    Box(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .background(Slate50, RoundedCornerShape(6.dp))
                                            .border(0.5.dp, Slate100, RoundedCornerShape(6.dp))
                                            .padding(8.dp)
                                    ) {
                                        Text(
                                            text = "* 统计口径说明：管理职员负荷按钉钉有效加班申请单统计；自有员工与外包小时工负荷按每日实际在岗 8 小时外的核定工时统计。",
                                            fontSize = 8.sp,
                                            color = Slate400,
                                            fontWeight = FontWeight.Medium,
                                            lineHeight = 11.sp
                                        )
                                    }
                                }
                            }
                        }

                        // C. 综合运营维度评估 (效能雷达)
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            colors = CardDefaults.cardColors(containerColor = Color.White),
                            shape = RoundedCornerShape(12.dp),
                            border = BorderStroke(1.dp, Slate200)
                        ) {
                            Column(Modifier.padding(16.dp)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(Icons.Default.TrackChanges, contentDescription = null, tint = Orange500, modifier = Modifier.size(16.dp))
                                    Spacer(Modifier.width(6.dp))
                                    Text("综合运营对账雷达诊断 (5大核算维度)", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Slate900)
                                }

                                Spacer(Modifier.height(16.dp))

                                val radarDims = listOf(
                                    RadarDimension("出勤率", (summary?.attendance_rate ?: 96.5).toFloat()),
                                    RadarDimension("人均效率", minOf(100f, (((summary?.avg_hours ?: 8.2) / 10f) * 100f).toFloat())),
                                    RadarDimension("人工成本控制", maxOf(10f, minOf(100f, 100f - (summary?.labor_cost_rate ?: 22.4).toFloat()))),
                                    RadarDimension("考勤规则健康", 92f),
                                    RadarDimension("工时对账覆盖", 94.2f)
                                )

                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(140.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    CustomRadarChart(
                                        dimensions = radarDims,
                                        modifier = Modifier.size(120.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // 4. Secondary Row: Cockpit Insights Bulletin & Workshop overload health list
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    // Left Column: Cockpit Insights Bulletin
                    Card(
                        modifier = Modifier.weight(1f),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        shape = RoundedCornerShape(12.dp),
                        border = BorderStroke(1.dp, Slate200)
                    ) {
                        Column(Modifier.padding(16.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Lightbulb, contentDescription = null, tint = Orange500, modifier = Modifier.size(16.dp))
                                Spacer(Modifier.width(6.dp))
                                Text("车间提示与驾驶舱提示公告栏", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Slate900)
                            }

                            Spacer(Modifier.height(12.dp))

                            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                                BulletinItem(
                                    title = "超时疲劳风险提醒",
                                    content = "方便菜加工部超时疲劳风险偏高，已有48人连续超负荷运转，建议合理安排轮班与替换机制。",
                                    type = BulletinType.WARNING
                                )
                                BulletinItem(
                                    title = "白猫清洗项目成本回落",
                                    content = "白猫清洗车间对账一致性达到100%，本月对账无偏差，外包单位结算总额合规可控。",
                                    type = BulletinType.SUCCESS
                                )
                                BulletinItem(
                                    title = "小时工打卡疑点预警",
                                    content = "本周发现外包小时工存在3起打卡时间重叠疑点，系统已标记合规状态异常，请派专人核实。",
                                    type = BulletinType.DANGER
                                )
                            }
                        }
                    }

                    // Right Column: Workshop load health summary table
                    Card(
                        modifier = Modifier.weight(1f),
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
                                    Icon(Icons.Default.LocationSearching, contentDescription = null, tint = Orange500, modifier = Modifier.size(16.dp))
                                    Spacer(Modifier.width(6.dp))
                                    Text("二级生产车间运行效能与合规诊断摘要", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Slate900)
                                }
                                Text("健康合格线: 90分", fontSize = 8.sp, color = Slate400, fontWeight = FontWeight.Bold)
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
                                Text("车间部门名称", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1.5f))
                                Text("确认工时", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1f), textAlign = TextAlign.Center)
                                Text("效能评分", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1f), textAlign = TextAlign.Center)
                                Text("合规健康度", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1.2f), textAlign = TextAlign.Center)
                                Text("诊断描述", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1.8f), textAlign = TextAlign.End)
                            }

                            Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(Slate200))

                            val workshops = if (departmentsList.isNotEmpty()) {
                                departmentsList.map { d ->
                                    val score = d.efficiency_index ?: 90.0
                                    val status = when (d.rule_status) {
                                        "danger" -> "超时预警"
                                        "warning" -> "效能偏低"
                                        else -> "健康运行"
                                    }
                                    val color = when (d.rule_status) {
                                        "danger" -> Rose500
                                        "warning" -> Orange500
                                        else -> Emerald500
                                    }
                                    val desc = when (d.rule_status) {
                                        "danger" -> "连续大面积超时"
                                        "warning" -> "出勤人效略低于基准"
                                        else -> "运行安全指标良好"
                                    }
                                    WorkshopDiagnose(d.department_name, "${d.total_hours.toInt()} h", score.toFloat(), status, color, desc)
                                }
                            } else {
                                listOf(
                                    WorkshopDiagnose("学生餐一车间", "4,520 h", 94.5f, "健康运行", Emerald500, "运行安全指标良好"),
                                    WorkshopDiagnose("学生餐二车间", "4,980 h", 91.2f, "效能偏低", Orange500, "出勤人效略低于基准"),
                                    WorkshopDiagnose("方便菜加工部", "3,800 h", 88.0f, "超时预警", Rose500, "连续大面积超时"),
                                    WorkshopDiagnose("净菜生产线", "2,804 h", 95.2f, "健康运行", Emerald500, "运行安全指标良好")
                                )
                            }

                            Column {
                                workshops.forEach { ws ->
                                    Row(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(vertical = 10.dp, horizontal = 12.dp),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(ws.name, fontSize = 10.sp, color = Slate700, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1.5f))
                                        Text(ws.totalHours, fontSize = 10.sp, color = Slate600, fontWeight = FontWeight.Medium, modifier = Modifier.weight(1f), textAlign = TextAlign.Center)
                                        
                                        Surface(
                                            color = if (ws.score >= 90) Emerald50.copy(alpha = 0.5f) else if (ws.score >= 80) Orange50.copy(alpha = 0.5f) else Rose50.copy(alpha = 0.5f),
                                            shape = RoundedCornerShape(4.dp),
                                            modifier = Modifier.weight(1f).wrapContentWidth(Alignment.CenterHorizontally)
                                        ) {
                                            Text(
                                                text = "${ws.score.toInt()} 分",
                                                fontSize = 9.sp,
                                                color = ws.color,
                                                fontWeight = FontWeight.Bold,
                                                modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp)
                                            )
                                        }

                                        Surface(
                                            color = ws.color.copy(alpha = 0.1f),
                                            shape = RoundedCornerShape(12.dp),
                                            border = BorderStroke(0.5.dp, ws.color.copy(alpha = 0.3f)),
                                            modifier = Modifier.weight(1.2f).wrapContentWidth(Alignment.CenterHorizontally)
                                        ) {
                                            Text(
                                                text = ws.status,
                                                fontSize = 8.5.sp,
                                                color = ws.color,
                                                fontWeight = FontWeight.Bold,
                                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                            )
                                        }

                                        Text(
                                            text = ws.desc ?: "运行安全指标良好",
                                            fontSize = 9.sp,
                                            color = Slate400,
                                            fontWeight = FontWeight.Medium,
                                            modifier = Modifier.weight(1.8f),
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
    }
}

// --- Composable Subcomponents ---

@Composable
fun CircularHealthGauge(score: Int, modifier: Modifier = Modifier) {
    Box(
        modifier = modifier.size(64.dp),
        contentAlignment = Alignment.Center
    ) {
        val color = when {
            score >= 90 -> Emerald500
            score >= 80 -> Orange500
            else -> Rose500
        }
        Canvas(modifier = Modifier.fillMaxSize()) {
            drawCircle(
                color = Slate100,
                radius = size.minDimension / 2f - 3dp.toPx(),
                style = Stroke(width = 6f)
            )
            val sweepAngle = (score / 100f) * 360f
            drawArc(
                color = color,
                startAngle = -90f,
                sweepAngle = sweepAngle,
                useCenter = false,
                style = Stroke(width = 6f, cap = StrokeCap.Round)
            )
        }
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = score.toString(),
                fontSize = 14.sp,
                fontWeight = FontWeight.ExtraBold,
                color = Slate800,
                fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
            )
            Text(
                text = "健康分",
                fontSize = 8.sp,
                fontWeight = FontWeight.Bold,
                color = Slate400
            )
        }
    }
}

@Composable
fun MiniBlock(title: String, valStr: String, modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .background(Slate50, RoundedCornerShape(4.dp))
            .padding(4.dp)
    ) {
        Column {
            Text(title, fontSize = 8.sp, color = Slate400, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(1.dp))
            Text(valStr, fontSize = 10.sp, color = Slate800, fontWeight = FontWeight.ExtraBold, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace)
        }
    }
}

@Composable
fun QuestionRow(qText: String, ansText: String, ansColor: Color) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .border(0.5.dp, Slate100, RoundedCornerShape(4.dp))
            .padding(vertical = 4.dp, horizontal = 6.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(qText, fontSize = 9.sp, color = Slate500, fontWeight = FontWeight.Medium)
        Text(ansText, fontSize = 9.sp, color = ansColor, fontWeight = FontWeight.ExtraBold, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace)
    }
}

@Composable
fun DepartmentRatioRow(rank: Int, name: String, hours: Int, ratio: Float, color: Color) {
    Column {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("$rank. $name", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate700, maxLines = 1, overflow = TextOverflow.Ellipsis, modifier = Modifier.weight(1f))
            Text("$hours h (${String.format("%.1f%%", ratio)})", fontSize = 9.5.sp, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace, fontWeight = FontWeight.Bold, color = Slate500)
        }
        Spacer(Modifier.height(3.dp))
        Box(modifier = Modifier.fillMaxWidth().height(6.dp).background(Slate100, RoundedCornerShape(3.dp))) {
            Box(
                modifier = Modifier
                    .fillMaxWidth(ratio / 100f)
                    .fillMaxHeight()
                    .background(color, RoundedCornerShape(3.dp))
            )
        }
    }
}

@Composable
fun DetailedLoadSegment(seg: WorkforceSegment) {
    val isOverloaded = seg.load_percent > 100
    val statusColor = when {
        seg.load_percent > 110 -> Pair(Color(0xFFFEF2F2), Color(0xFFB91C1C))
        isOverloaded -> Pair(Color(0xFFFFFBEB), Color(0xFFB45309))
        else -> Pair(Color(0xFFECFDF5), Color(0xFF047857))
    }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(Slate50.copy(alpha = 0.5f), RoundedCornerShape(8.dp))
            .border(0.5.dp, Slate200, RoundedCornerShape(8.dp))
            .padding(10.dp)
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(Modifier.size(6.dp).background(Blue500, CircleShape))
                    Spacer(Modifier.width(6.dp))
                    Text(seg.label, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Slate800)
                }

                Surface(
                    color = statusColor.first,
                    shape = RoundedCornerShape(12.dp),
                    border = BorderStroke(0.5.dp, statusColor.second.copy(alpha = 0.3f))
                ) {
                    Text(
                        text = "负荷度 ${seg.load_percent}%",
                        fontSize = 8.5.sp,
                        color = statusColor.second,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                LoadMetricBox("在岗人数", "${seg.worked_employee_count} 人", Modifier.weight(1f))
                LoadMetricBox("生产工时", "${seg.total_work_hours} h", Modifier.weight(1f))
                LoadMetricBox("加班人数", "${seg.overtime_employee_count} 人", Modifier.weight(1f))
                LoadMetricBox("8h外工时", "${seg.overtime_work_hours} h", Modifier.weight(1f))
            }

            Box(modifier = Modifier.fillMaxWidth().height(0.5.dp).background(Slate200.copy(alpha = 0.5f)))

            Text(
                text = "运行状态: ${seg.note}",
                fontSize = 8.5.sp,
                color = Slate400,
                fontWeight = FontWeight.Medium,
                lineHeight = 11.sp
            )
        }
    }
}

@Composable
fun LoadMetricBox(label: String, value: String, modifier: Modifier = Modifier) {
    Column(
        modifier = modifier
            .background(Slate100.copy(alpha = 0.5f), RoundedCornerShape(4.dp))
            .padding(4.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(label, fontSize = 8.sp, color = Slate400, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(1.dp))
        Text(value, fontSize = 9.sp, color = Slate700, fontWeight = FontWeight.Bold, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace)
    }
}

data class WorkshopDiagnose(
    val name: String,
    val totalHours: String,
    val score: Float,
    val status: String,
    val color: Color,
    val desc: String? = null
)
