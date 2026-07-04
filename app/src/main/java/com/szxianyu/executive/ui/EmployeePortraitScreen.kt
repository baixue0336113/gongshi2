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

data class PunchRecord(
    val date: String,
    val clockIn: String,
    val clockOut: String,
    val status: String
)

data class ApplicationRecord(
    val type: String,
    val hours: Float,
    val start: String,
    val end: String,
    val status: String
)

val defaultApplications = listOf(
    ApplicationRecord("加班", 3.0f, "17:30", "20:30", "已审批"),
    ApplicationRecord("调休", 8.0f, "08:30", "17:30", "已审批")
)

data class AdjustmentRecord(
    val beforeHours: Float,
    val afterHours: Float,
    val reason: String,
    val operator: String
)

data class EmployeeItem(
    val id: String,
    val name: String,
    val jobNumber: String,
    val department: String,
    val riskLevel: String, // "low" | "medium" | "high"
    val employeeType: String, // "自有员工" | "小时工" | "第三方派遣"
    val attendanceRate: Float,
    val avgHours: Float,
    val totalHours: Float,
    val punchRecords: List<PunchRecord>,
    val applications: List<ApplicationRecord> = defaultApplications,
    val adjustments: List<AdjustmentRecord> = emptyList(),
    val dailyHours: List<Float>
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EmployeePortraitScreen() {
    val employees = remember {
        listOf(
            EmployeeItem(
                id = "emp-01",
                name = "张明",
                jobNumber = "XY-00101",
                department = "学生餐二车间",
                riskLevel = "medium",
                employeeType = "自有员工",
                attendanceRate = 98.2f,
                avgHours = 8.5f,
                totalHours = 178.5f,
                punchRecords = listOf(
                    PunchRecord("07-01", "08:28", "17:35", "正常"),
                    PunchRecord("07-02", "08:30", "20:35", "加班"),
                    PunchRecord("07-03", "08:25", "17:32", "正常"),
                    PunchRecord("07-04", "08:29", "17:30", "正常")
                ),
                adjustments = listOf(
                    AdjustmentRecord(8.0f, 11.0f, "漏打卡补签", "系统管理员")
                ),
                dailyHours = listOf(8.5f, 11f, 8.2f, 8f, 8.5f, 0f, 0f)
            ),
            EmployeeItem(
                id = "emp-02",
                name = "王芳",
                jobNumber = "XY-00213",
                department = "学生餐一车间",
                riskLevel = "high",
                employeeType = "小时工",
                attendanceRate = 100f,
                avgHours = 11.2f,
                totalHours = 246.4f,
                punchRecords = listOf(
                    PunchRecord("07-01", "08:00", "22:00", "严重加班"),
                    PunchRecord("07-02", "08:10", "21:30", "加班"),
                    PunchRecord("07-03", "08:05", "22:00", "严重加班"),
                    PunchRecord("07-04", "08:00", "21:45", "严重加班")
                ),
                dailyHours = listOf(14f, 12.5f, 13.5f, 13.8f, 11f, 10f, 8f)
            ),
            EmployeeItem(
                id = "emp-03",
                name = "李强",
                jobNumber = "XY-00305",
                department = "方便菜加工部",
                riskLevel = "low",
                employeeType = "第三方派遣",
                attendanceRate = 94.5f,
                avgHours = 7.8f,
                totalHours = 156.0f,
                punchRecords = listOf(
                    PunchRecord("07-01", "08:35", "17:31", "正常"),
                    PunchRecord("07-02", "08:31", "17:30", "正常"),
                    PunchRecord("07-03", "08:40", "17:35", "正常"),
                    PunchRecord("07-04", "08:28", "17:30", "正常")
                ),
                dailyHours = listOf(8f, 8f, 7.8f, 8f, 8f, 0f, 0f)
            ),
            EmployeeItem(
                id = "emp-04",
                name = "赵丽",
                jobNumber = "XY-00452",
                department = "冷链物流仓储",
                riskLevel = "low",
                employeeType = "自有员工",
                attendanceRate = 96.0f,
                avgHours = 8.0f,
                totalHours = 160.0f,
                punchRecords = listOf(
                    PunchRecord("07-01", "08:25", "17:30", "正常"),
                    PunchRecord("07-02", "08:26", "17:31", "正常"),
                    PunchRecord("07-03", "08:28", "17:30", "正常"),
                    PunchRecord("07-04", "08:29", "17:32", "正常")
                ),
                dailyHours = listOf(8f, 8f, 8.1f, 8f, 8f, 0f, 0f)
            ),
            EmployeeItem(
                id = "emp-05",
                name = "陈刚",
                jobNumber = "XY-00518",
                department = "净菜生产线",
                riskLevel = "medium",
                employeeType = "小时工",
                attendanceRate = 95.0f,
                avgHours = 9.2f,
                totalHours = 184.0f,
                punchRecords = listOf(
                    PunchRecord("07-01", "08:20", "19:30", "加班"),
                    PunchRecord("07-02", "08:25", "18:30", "正常"),
                    PunchRecord("07-03", "08:21", "19:00", "加班"),
                    PunchRecord("07-04", "08:22", "17:30", "正常")
                ),
                dailyHours = listOf(11.2f, 10f, 10.5f, 8f, 8f, 0f, 0f)
            )
        )
    }

    var searchQuery by remember { mutableStateOf("") }
    var selectedDept by remember { mutableStateOf("全部部门") }

    val departments = remember {
        listOf("全部部门") + employees.map { it.department }.distinct()
    }

    var selectedEmpId by remember { mutableStateOf(employees[0].id) }

    val filteredEmployees = remember(searchQuery, selectedDept) {
        employees.filter { emp ->
            val matchesSearch = emp.name.contains(searchQuery) || emp.jobNumber.lowercase().contains(searchQuery.lowercase())
            val matchesDept = selectedDept == "全部部门" || emp.department == selectedDept
            matchesSearch && matchesDept
        }
    }

    val activeEmp = remember(selectedEmpId, filteredEmployees) {
        filteredEmployees.find { it.id == selectedEmpId } ?: filteredEmployees.firstOrNull() ?: employees[0]
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate50)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // 1. Search and Department Filter Row
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            border = BorderStroke(1.dp, Slate200),
            shape = RoundedCornerShape(12.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(12.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(
                    modifier = Modifier.weight(1f),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Search Bar
                    OutlinedTextField(
                        value = searchQuery,
                        onValueChange = { searchQuery = it },
                        placeholder = { Text("搜索员工姓名或工号...", fontSize = 11.sp, color = Slate400) },
                        leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = Slate400, modifier = Modifier.size(14.dp)) },
                        colors = TextFieldDefaults.outlinedTextFieldColors(
                            focusedBorderColor = Orange500,
                            unfocusedBorderColor = Slate200,
                            containerColor = Slate50
                        ),
                        singleLine = true,
                        modifier = Modifier
                            .width(200.dp)
                            .height(44.dp)
                    )

                    // Department Filter dropdown simulated using standard styling
                    var dropDownExpanded by remember { mutableStateOf(false) }
                    Box {
                        Surface(
                            modifier = Modifier
                                .height(44.dp)
                                .clickable { dropDownExpanded = true },
                            border = BorderStroke(1.dp, Slate200),
                            shape = RoundedCornerShape(8.dp),
                            color = Slate50
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 12.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Icon(Icons.Default.FilterList, contentDescription = null, tint = Slate400, modifier = Modifier.size(12.dp))
                                Text(selectedDept, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Slate700)
                                Icon(Icons.Default.ArrowDropDown, contentDescription = null, tint = Slate500, modifier = Modifier.size(14.dp))
                            }
                        }

                        DropdownMenu(
                            expanded = dropDownExpanded,
                            onDismissRequest = { dropDownExpanded = false }
                        ) {
                            departments.forEach { dept ->
                                DropdownMenuItem(
                                    text = { Text(dept, fontSize = 11.sp, fontWeight = FontWeight.Bold) },
                                    onClick = {
                                        selectedDept = dept
                                        dropDownExpanded = false
                                    }
                                )
                            }
                        }
                    }
                }

                Surface(
                    color = Slate100,
                    shape = RoundedCornerShape(6.dp)
                ) {
                    Text(
                        " 共查询到 ${filteredEmployees.size} 名员工 ",
                        fontSize = 9.5.sp,
                        fontWeight = FontWeight.Bold,
                        color = Slate500,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                    )
                }
            }
        }

        // 2. Master-Detail Layout Panel (Split)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Left Pane: Employee List (1/4 Width)
            Card(
                modifier = Modifier
                    .width(220.dp)
                    .fillMaxHeight(),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(12.dp),
                border = BorderStroke(1.dp, Slate200)
            ) {
                Column(Modifier.padding(12.dp)) {
                    Text(
                        "员工列表",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Black,
                        color = Slate800,
                        modifier = Modifier.padding(bottom = 8.dp)
                    )

                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(filteredEmployees) { emp ->
                            val isSelected = emp.id == activeEmp.id
                            val borderStroke = if (isSelected) BorderStroke(1.2.dp, Orange500) else BorderStroke(1.dp, Slate100)
                            val bg = if (isSelected) Orange50.copy(alpha = 0.5f) else Color.White

                            Card(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable { selectedEmpId = emp.id },
                                colors = CardDefaults.cardColors(containerColor = bg),
                                border = borderStroke,
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Row(
                                    modifier = Modifier.padding(8.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Surface(
                                        color = if (isSelected) Orange500 else Slate100,
                                        shape = CircleShape,
                                        modifier = Modifier.size(28.dp)
                                    ) {
                                        Box(contentAlignment = Alignment.Center) {
                                            Text(
                                                emp.name.take(1),
                                                fontSize = 11.sp,
                                                fontWeight = FontWeight.Black,
                                                color = if (isSelected) Color.White else Slate600
                                            )
                                        }
                                    }
                                    Spacer(Modifier.width(8.dp))
                                    Column {
                                        Text(
                                            emp.name,
                                            fontSize = 11.5.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = if (isSelected) Orange700 else Slate800
                                        )
                                        Text(
                                            emp.jobNumber,
                                            fontSize = 9.sp,
                                            color = Slate400,
                                            fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Right Pane: Detailed Profile Dashboard (3/4 Width)
            Card(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight(),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(12.dp),
                border = BorderStroke(1.dp, Slate200)
            ) {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    // Profile Header Block
                    item {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Slate50, RoundedCornerShape(12.dp))
                                .padding(16.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Surface(
                                    color = Orange500,
                                    shape = RoundedCornerShape(10.dp),
                                    modifier = Modifier.size(48.dp)
                                ) {
                                    Box(contentAlignment = Alignment.Center) {
                                        Text(
                                            activeEmp.name.take(1),
                                            color = Color.White,
                                            fontSize = 20.sp,
                                            fontWeight = FontWeight.Black
                                        )
                                    }
                                }
                                Spacer(Modifier.width(16.dp))
                                Column {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text(
                                            activeEmp.name,
                                            fontSize = 16.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = Slate900
                                        )
                                        Spacer(Modifier.width(8.dp))
                                        EmployeeRiskBadge(activeEmp.riskLevel)
                                    }
                                    Spacer(Modifier.height(4.dp))
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                                    ) {
                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            Icon(Icons.Default.User, contentDescription = null, tint = Slate400, modifier = Modifier.size(11.dp))
                                            Spacer(Modifier.width(4.dp))
                                            Text(activeEmp.jobNumber, fontSize = 10.sp, color = Slate500, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace)
                                        }
                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            Icon(Icons.Default.MapPin, contentDescription = null, tint = Slate400, modifier = Modifier.size(11.dp))
                                            Spacer(Modifier.width(4.dp))
                                            Text(activeEmp.department, fontSize = 10.sp, color = Slate500)
                                        }
                                    }
                                }
                            }

                            Column(horizontalAlignment = Alignment.End) {
                                Text("考勤属性", fontSize = 8.5.sp, color = Slate400, fontWeight = FontWeight.Bold)
                                Spacer(Modifier.height(4.dp))
                                Surface(
                                    color = Color.White,
                                    border = BorderStroke(1.dp, Slate200),
                                    shape = RoundedCornerShape(6.dp)
                                ) {
                                    Text(
                                        " ${activeEmp.employeeType} ",
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Slate700,
                                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                                    )
                                }
                            }
                        }
                    }

                    // Content Split: Left (工时/打卡/工时段条) and Right (7天趋势/异常记录)
                    item {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(16.dp)
                        ) {
                            // Column 1
                            Column(modifier = Modifier.weight(1.1f), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                                // 1. 工时核定
                                Column {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Box(Modifier.size(3.dp, 10.dp).background(Orange500, RoundedCornerShape(1.dp)))
                                        Spacer(Modifier.width(6.dp))
                                        Text("工时核定 (当月)", fontSize = 11.sp, fontWeight = FontWeight.Black, color = Slate800)
                                    }
                                    Spacer(Modifier.height(8.dp))
                                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                        MiniKbiCard("最终核定工时", "${activeEmp.totalHours}h", Slate900, Modifier.weight(1f))
                                        MiniKbiCard("人均工时 (基准)", "${activeEmp.avgHours}h", Emerald600, Modifier.weight(1f))
                                        MiniKbiCard("出勤率", "${activeEmp.attendanceRate}%", Rose600, Modifier.weight(1f))
                                    }
                                }

                                // 2. 最新打卡流水及时间段条
                                Column {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Box(Modifier.size(3.dp, 10.dp).background(Orange500, RoundedCornerShape(1.dp)))
                                        Spacer(Modifier.width(6.dp))
                                        Text("最新打卡流水及工时段", fontSize = 11.sp, fontWeight = FontWeight.Black, color = Slate800)
                                    }
                                    Spacer(Modifier.height(8.dp))

                                    // Table
                                    Surface(
                                        color = Color.White,
                                        border = BorderStroke(1.dp, Slate200),
                                        shape = RoundedCornerShape(8.dp)
                                    ) {
                                        Column {
                                            Row(
                                                modifier = Modifier
                                                    .fillMaxWidth()
                                                    .background(Slate50)
                                                    .padding(vertical = 6.dp, horizontal = 10.dp),
                                                horizontalArrangement = Arrangement.SpaceBetween
                                            ) {
                                                Text("日期", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1f))
                                                Text("上班打卡", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1.2f), textAlign = TextAlign.Center)
                                                Text("下班打卡", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1.2f), textAlign = TextAlign.Center)
                                                Text("状态", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Slate500, modifier = Modifier.weight(1.1f), textAlign = TextAlign.End)
                                            }
                                            Box(Modifier.fillMaxWidth().height(1.dp).background(Slate200))
                                            
                                            activeEmp.punchRecords.forEach { record ->
                                                Row(
                                                    modifier = Modifier
                                                        .fillMaxWidth()
                                                        .padding(vertical = 6.dp, horizontal = 10.dp),
                                                    horizontalArrangement = Arrangement.SpaceBetween,
                                                    verticalAlignment = Alignment.CenterVertically
                                                ) {
                                                    Text(record.date, fontSize = 9.5.sp, color = Slate500, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace, modifier = Modifier.weight(1f))
                                                    Text(record.clockIn, fontSize = 9.5.sp, color = Slate700, fontWeight = FontWeight.Bold, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace, modifier = Modifier.weight(1.2f), textAlign = TextAlign.Center)
                                                    Text(record.clockOut, fontSize = 9.5.sp, color = Slate700, fontWeight = FontWeight.Bold, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace, modifier = Modifier.weight(1.2f), textAlign = TextAlign.Center)
                                                    
                                                    val badgeColor = if (record.status == "正常") Emerald600 else Rose600
                                                    val badgeBg = if (record.status == "正常") Emerald50 else Rose50
                                                    Box(modifier = Modifier.weight(1.1f), contentAlignment = Alignment.CenterEnd) {
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

                                    Spacer(Modifier.height(8.dp))
                                    // Custom visual hourly strip bar
                                    Row(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .height(20.dp)
                                            .background(Slate100, RoundedCornerShape(4.dp)),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .weight(8f)
                                                .fillMaxHeight()
                                                .background(Emerald500, RoundedCornerShape(topStart = 4.dp, bottomStart = 4.dp)),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Text("正班工时: 8.0h", fontSize = 8.sp, color = Color.White, fontWeight = FontWeight.Bold)
                                        }
                                        Box(
                                            modifier = Modifier
                                                .weight(3f)
                                                .fillMaxHeight()
                                                .background(Rose500, RoundedCornerShape(topEnd = 4.dp, bottomEnd = 4.dp)),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Text("加班: 3.0h", fontSize = 8.sp, color = Color.White, fontWeight = FontWeight.Bold)
                                        }
                                    }
                                    Row(
                                        modifier = Modifier.fillMaxWidth().padding(horizontal = 2.dp, vertical = 2.dp),
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Text("打卡开始 (上工): 08:30", fontSize = 8.sp, color = Slate400, fontWeight = FontWeight.Bold)
                                        Text("打卡结束 (下工): 20:35", fontSize = 8.sp, color = Slate400, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }

                            // Column 2
                            Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                                // 1. 7天工时柱状图
                                Column {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Box(Modifier.size(3.dp, 10.dp).background(Orange500, RoundedCornerShape(1.dp)))
                                        Spacer(Modifier.width(6.dp))
                                        Text("最近7天工时趋势 (柱状图)", fontSize = 11.sp, fontWeight = FontWeight.Black, color = Slate800)
                                    }
                                    Spacer(Modifier.height(8.dp))
                                    Card(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .height(115.dp),
                                        colors = CardDefaults.cardColors(containerColor = Slate50),
                                        border = BorderStroke(1.dp, Slate200)
                                    ) {
                                        Box(Modifier.padding(12.dp)) {
                                            Row(
                                                modifier = Modifier.fillMaxSize(),
                                                horizontalArrangement = Arrangement.SpaceEvenly,
                                                verticalAlignment = Alignment.Bottom
                                            ) {
                                                activeEmp.dailyHours.forEachIndexed { idx, h ->
                                                    val barColor = if (h > 11f) Rose500 else if (h > 8f) Orange500 else Emerald500
                                                    Column(
                                                        horizontalAlignment = Alignment.CenterHorizontally,
                                                        verticalArrangement = Arrangement.Bottom,
                                                        modifier = Modifier.fillMaxHeight()
                                                    ) {
                                                        Text("${h}h", fontSize = 7.5.sp, fontWeight = FontWeight.Bold, color = Slate600)
                                                        Spacer(Modifier.height(3.dp))
                                                        // Bar height proportional
                                                        Box(
                                                            modifier = Modifier
                                                                .width(18.dp)
                                                                .height((h * 5.5).dp)
                                                                .background(barColor, RoundedCornerShape(topStart = 3.dp, topEnd = 3.dp))
                                                        )
                                                        Spacer(Modifier.height(4.dp))
                                                        Text("Day ${idx + 1}", fontSize = 8.sp, color = Slate400, fontWeight = FontWeight.Bold)
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                                // 2. 本月异常与流程记录
                                Column {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Box(Modifier.size(3.dp, 10.dp).background(Orange500, RoundedCornerShape(1.dp)))
                                        Spacer(Modifier.width(6.dp))
                                        Text("本月异常与流程记录", fontSize = 11.sp, fontWeight = FontWeight.Black, color = Slate800)
                                    }
                                    Spacer(Modifier.height(8.dp))

                                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                        activeEmp.applications.forEach { app ->
                                            Surface(
                                                color = Color.White,
                                                border = BorderStroke(1.dp, Slate200),
                                                shape = RoundedCornerShape(8.dp)
                                            ) {
                                                Row(
                                                    modifier = Modifier
                                                        .fillMaxWidth()
                                                        .padding(8.dp),
                                                    verticalAlignment = Alignment.CenterVertically,
                                                    horizontalArrangement = Arrangement.SpaceBetween
                                                ) {
                                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                                        Surface(
                                                            color = if (app.type == "加班") Rose50 else Blue50,
                                                            shape = RoundedCornerShape(6.dp),
                                                            modifier = Modifier.size(24.dp)
                                                        ) {
                                                            Box(contentAlignment = Alignment.Center) {
                                                                Icon(
                                                                    if (app.type == "加班") Icons.Default.Clock else Icons.Default.CalendarToday,
                                                                    contentDescription = null,
                                                                    tint = if (app.type == "加班") Rose500 else Blue500,
                                                                    modifier = Modifier.size(11.dp)
                                                                )
                                                            }
                                                        }
                                                        Spacer(Modifier.width(8.dp))
                                                        Column {
                                                            Text("${app.type}申请 (${app.hours}h)", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate800)
                                                            Text("${app.start} ~ ${app.end}", fontSize = 8.5.sp, color = Slate400, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace)
                                                        }
                                                    }
                                                    Surface(
                                                        color = Emerald50,
                                                        shape = RoundedCornerShape(4.dp),
                                                        border = BorderStroke(0.5.dp, Emerald600.copy(alpha = 0.3f))
                                                    ) {
                                                        Text(" ${app.status} ", fontSize = 8.sp, fontWeight = FontWeight.Bold, color = Emerald600, modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp))
                                                    }
                                                }
                                            }
                                        }

                                        activeEmp.adjustments.forEach { adj ->
                                            Surface(
                                                color = Color(0xFFFEF3C7).copy(alpha = 0.2f),
                                                border = BorderStroke(0.5.dp, Color(0xFFF59E0B).copy(alpha = 0.4f)),
                                                shape = RoundedCornerShape(8.dp)
                                            ) {
                                                Row(
                                                    modifier = Modifier
                                                        .fillMaxWidth()
                                                        .padding(8.dp),
                                                    verticalAlignment = Alignment.CenterVertically,
                                                    horizontalArrangement = Arrangement.SpaceBetween
                                                ) {
                                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                                        Surface(
                                                            color = Color(0xFFFEF3C7),
                                                            shape = RoundedCornerShape(6.dp),
                                                            modifier = Modifier.size(24.dp)
                                                        ) {
                                                            Box(contentAlignment = Alignment.Center) {
                                                                Icon(
                                                                    Icons.Default.SyncAlt,
                                                                    contentDescription = null,
                                                                    tint = Color(0xFFD97706),
                                                                    modifier = Modifier.size(11.dp)
                                                                )
                                                            }
                                                        }
                                                        Spacer(Modifier.width(8.dp))
                                                        Column {
                                                            Text("系统考勤调整", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate800)
                                                            Text("${adj.beforeHours}h ➔ ${adj.afterHours}h (${adj.reason})", fontSize = 8.5.sp, color = Slate600)
                                                        }
                                                    }
                                                    Text(adj.operator, fontSize = 8.sp, fontWeight = FontWeight.Bold, color = Color(0xFFD97706))
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
        }
    }
}

@Composable
fun EmployeeRiskBadge(level: String) {
    val (label, bg, color) = when (level) {
        "high" -> Triple("高风险", Color(0xFFFEF2F2), Rose600)
        "medium" -> Triple("中风险", Color(0xFFFFFBEB), Orange600)
        else -> Triple("低风险", Color(0xFFECFDF5), Emerald600)
    }

    Surface(
        color = bg,
        shape = RoundedCornerShape(4.dp),
        border = BorderStroke(0.5.dp, color.copy(alpha = 0.3f))
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(3.dp)
        ) {
            Icon(
                if (level == "high" || level == "medium") Icons.Default.Warning else Icons.Default.CheckCircle,
                contentDescription = null,
                tint = color,
                modifier = Modifier.size(10.dp)
            )
            Text(label, fontSize = 8.5.sp, fontWeight = FontWeight.Bold, color = color)
        }
    }
}

@Composable
fun MiniKbiCard(label: String, value: String, valueColor: Color, modifier: Modifier = Modifier) {
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
            Text(label, fontSize = 8.sp, color = Slate500, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(3.dp))
            Text(
                value,
                fontSize = 12.sp,
                fontWeight = FontWeight.Black,
                color = valueColor,
                fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
            )
        }
    }
}
